"use client";

import { applySnapshot, LOCAL_CHANGE, readMeta, snapshot, writeMeta } from "./local";
import { mergeState } from "./merge";
import { supabase } from "./supabase";

export type SyncStatus = { state: "idle" | "syncing" | "error"; lastSync: string | null; error?: string };

type Listener = (s: SyncStatus) => void;

// Đồng bộ dữ liệu học tập giữa trình duyệt và tài khoản.
// Mỗi lần đồng bộ: kéo bản trong tài khoản về, gộp với bản trên máy, ghi lại cả hai nơi.
export class SyncEngine {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running: Promise<void> | null = null;
  private again = false;
  private listeners = new Set<Listener>();
  status: SyncStatus = { state: "idle", lastSync: null };

  constructor(private userId: string) {
    this.status.lastSync = readMeta().lastSync;
  }

  start() {
    window.addEventListener(LOCAL_CHANGE, this.onChange);
    window.addEventListener("focus", this.onFocus);
    document.addEventListener("visibilitychange", this.onHide);
    return this.syncNow();
  }

  stop() {
    window.removeEventListener(LOCAL_CHANGE, this.onChange);
    window.removeEventListener("focus", this.onFocus);
    document.removeEventListener("visibilitychange", this.onHide);
    if (this.timer) clearTimeout(this.timer);
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.status);
    return () => this.listeners.delete(fn);
  }

  private set(s: Partial<SyncStatus>) {
    this.status = { ...this.status, ...s };
    this.listeners.forEach((fn) => fn(this.status));
  }

  private onChange = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.syncNow(), 1500);
  };

  private onFocus = () => {
    if (readMeta().dirty.length === 0) this.syncNow();
  };

  private onHide = () => {
    if (document.visibilityState === "hidden" && readMeta().dirty.length > 0) this.syncNow();
  };

  syncNow(): Promise<void> {
    if (this.running) {
      this.again = true;
      return this.running;
    }
    this.running = this.run().finally(() => {
      this.running = null;
      if (this.again) {
        this.again = false;
        this.syncNow();
      }
    });
    return this.running;
  }

  private async run() {
    this.set({ state: "syncing", error: undefined });
    try {
      const db = supabase();
      const { data: row, error } = await db.from("user_state").select("data").eq("user_id", this.userId).maybeSingle();
      if (error) throw error;
      const remote = (row?.data ?? {}) as Record<string, string>;
      const meta = readMeta();
      const firstSync = meta.userId !== this.userId;
      const dirtyAtStart = [...meta.dirty];
      const local = snapshot();
      const merged = mergeState(local, remote, dirtyAtStart, { firstSync });

      // Chỉ ghi lại trình duyệt khi có khác biệt, để không làm giao diện tải lại vô ích
      const changedLocal = Object.keys(merged).some((k) => merged[k] !== local[k]);
      if (changedLocal) applySnapshot(merged);

      const changedRemote = Object.keys(merged).length !== Object.keys(remote).length || Object.keys(merged).some((k) => merged[k] !== remote[k]);
      if (changedRemote) {
        const { error: upErr } = await db.from("user_state").upsert({ user_id: this.userId, data: merged }, { onConflict: "user_id" });
        if (upErr) throw upErr;
      }

      // Giữ lại các khóa người học sửa trong lúc đang đồng bộ
      const now = new Date().toISOString();
      const after = readMeta();
      writeMeta({ userId: this.userId, dirty: after.dirty.filter((k) => !dirtyAtStart.includes(k)), lastSync: now });
      this.set({ state: "idle", lastSync: now });
    } catch (e) {
      this.set({ state: "error", error: e instanceof Error ? e.message : String(e) });
    }
  }
}
