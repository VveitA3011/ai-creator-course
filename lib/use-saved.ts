"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readLocal, REMOTE_APPLIED, writeLocal } from "./local";

// Lưu một giá trị của học viên trên trình duyệt (và đồng bộ lên tài khoản khi đã đăng nhập).
// Lần render đầu dùng giá trị mặc định để khớp với bản dựng tĩnh, sau đó đọc giá trị đã lưu.
export function useSaved<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [val, setVal] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const latest = useRef(val);
  latest.current = val;
  const initialRef = useRef(initial);

  useEffect(() => {
    const load = () => {
      try {
        const raw = readLocal(key);
        setVal(raw ? JSON.parse(raw) : initialRef.current);
      } catch {
        setVal(initialRef.current);
      }
      setReady(true);
    };
    load();
    window.addEventListener(REMOTE_APPLIED, load);
    return () => window.removeEventListener(REMOTE_APPLIED, load);
  }, [key]);

  const save = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(latest.current) : v;
      latest.current = next;
      setVal(next);
      writeLocal(key, JSON.stringify(next));
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
