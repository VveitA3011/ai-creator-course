"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/use-saved";

/* Nút sao chép, tự đổi chữ khi xong */
export function CopyButton({ text, label = "Sao chép", className = "btn btn-ghost btn-sm" }: { text: () => string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 1800);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <button type="button" className={className} onClick={async () => setState((await copyText(text())) ? "ok" : "fail")}>
      <span aria-live="polite">{state === "ok" ? "Đã sao chép" : state === "fail" ? "Không sao chép được" : label}</span>
    </button>
  );
}

/* Nút xóa hai bước, không dùng hộp thoại của trình duyệt */
export function DeleteButton({ onDelete, label = "Xóa" }: { onDelete: () => void; label?: string }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      className={armed ? "btn btn-sm btn-danger" : "btn btn-ghost btn-sm"}
      onClick={() => (armed ? onDelete() : setArmed(true))}
    >
      {armed ? "Bấm lần nữa để xóa" : label}
    </button>
  );
}

/* Chọn, tạo, đổi tên, xóa một tài liệu trong danh sách */
export function DocSwitcher<T extends { id: string; title: string }>({
  docs,
  current,
  onSelect,
  onNew,
  onRename,
  onDelete,
  noun,
}: {
  docs: T[];
  current: T;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  noun: string;
}) {
  return (
    <div className="doc-bar">
      <label className="doc-field">
        <span className="mono">Đang mở</span>
        <select value={current.id} onChange={(e) => onSelect(e.target.value)}>
          {docs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title || `${noun} chưa đặt tên`}
            </option>
          ))}
        </select>
      </label>
      <label className="doc-field grow">
        <span className="mono">Tên {noun}</span>
        <input value={current.title} onChange={(e) => onRename(e.target.value)} placeholder={`Đặt tên ${noun}`} />
      </label>
      <div className="btn-row">
        <button type="button" className="btn btn-sm" onClick={onNew}>
          + {noun} mới
        </button>
        {docs.length > 1 && <DeleteButton onDelete={onDelete} label={`Xóa ${noun} này`} />}
      </div>
    </div>
  );
}

export function SavedNote() {
  return <p className="muted small">Mọi thay đổi tự lưu trên trình duyệt này. Đổi máy hoặc xóa dữ liệu trình duyệt sẽ mất dữ liệu.</p>;
}
