"use client";

import { useSyncExternalStore } from "react";

// Tiến độ lưu trên trình duyệt của học viên. Đợt 3 sẽ đồng bộ lên tài khoản.
const KEY = "aic-progress-v1";
const EVENT = "aic-progress";

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
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
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* trình duyệt chặn lưu trữ: bỏ qua */
      }
      window.dispatchEvent(new Event(EVENT));
    },
  };
}
