"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Lưu một giá trị trên trình duyệt của học viên (localStorage).
// Lần render đầu dùng giá trị mặc định để khớp với bản dựng tĩnh, sau đó đọc giá trị đã lưu.
export function useSaved<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [val, setVal] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const latest = useRef(val);
  latest.current = val;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setVal(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng hoặc trình duyệt chặn lưu trữ: dùng giá trị mặc định */
    }
    setReady(true);
  }, [key]);

  const save = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(latest.current) : v;
      latest.current = next;
      setVal(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
    },
    [key],
  );

  return [val, save, ready];
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Sao chép vào bộ nhớ tạm; trả về false nếu trình duyệt từ chối.
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
