"use client";

import { useSyncExternalStore } from "react";
import { readLocal, REMOTE_APPLIED, writeLocal } from "./local";

// Tiến độ lưu trên trình duyệt của học viên, đồng bộ lên tài khoản khi đã đăng nhập.
const KEY = "aic-progress-v1";
const EVENT = "aic-progress";

function readRaw(): string {
  return readLocal(KEY) ?? "{}";
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  window.addEventListener(REMOTE_APPLIED, cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
    window.removeEventListener(REMOTE_APPLIED, cb);
  };
}

function parse(raw: string): Record<string, number> {
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}");
  const done = parse(raw);
  return {
    done,
    isDone: (id: string) => Boolean(done[id]),
    toggle: (id: string) => {
      const next = { ...parse(readRaw()) };
      if (next[id]) delete next[id];
      else next[id] = Date.now();
      writeLocal(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(EVENT));
    },
  };
}
