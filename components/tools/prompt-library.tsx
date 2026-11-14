"use client";

import { useMemo, useRef, useState } from "react";
import { uid, useSaved } from "@/lib/use-saved";
import { CopyButton, DeleteButton, SavedNote } from "./common";

const cats = ["Nhân vật", "Bối cảnh", "Sản phẩm", "Góc máy", "Ánh sáng", "Chuyển động", "Phong cách"] as const;
type Cat = (typeof cats)[number];
type Item = { id: string; cat: Cat; title: string; text: string; example?: boolean };

// Mẫu lấy từ các bài học, gắn nhãn ví dụ để học viên phân biệt với prompt của mình.
const seed: Item[] = [
  {
    id: "ex-char",
    cat: "Nhân vật",
    title: "Character sheet chính diện",
    text: "Character reference sheet, [tuổi, giới tính, vóc dáng], [khuôn mặt], [kiểu tóc], wearing [trang phục], front view, neutral expression, plain light grey background, soft natural light, realistic photography, consistent character",
    example: true,
  },
  {
    id: "ex-block",
    cat: "Nhân vật",
    title: "Khối nhân vật cố định",
    text: "a 28-year-old woman, oval face, dark brown eyes, small mole under left eye, shoulder-length black hair, cream knit sweater, dark blue jeans",
    example: true,
  },
  {
    id: "ex-env",
    cat: "Bối cảnh",
    title: "Ảnh toàn cảnh bối cảnh",
    text: "[địa điểm], [thời gian], [vật thể chính], [chất liệu và màu], [không khí] mood, wide establishing shot, no people, cinematic lighting, realistic, vertical 9:16 composition",
    example: true,
  },
  {
    id: "ex-product",
    cat: "Sản phẩm",
    title: "Lọ nước hoa trên đá cẩm thạch",
    text: "A glass perfume bottle on black marble, a single drop of water slides down the bottle, dark studio, extreme close-up, slow dolly-in, low-key lighting with warm rim light, cinematic, realistic, vertical 9:16",
    example: true,
  },
  {
    id: "ex-light",
    cat: "Ánh sáng",
    title: "Low-key cao cấp",
    text: "low-key lighting, strong rim light from behind, deep black background, warm amber highlights, high contrast, cinematic color grading",
    example: true,
  },
  {
    id: "ex-cam",
    cat: "Góc máy",
    title: "Tracking ngang tầm mặt đất",
    text: "Tracking shot following the subject from the side, camera at ground level",
    example: true,
  },
  {
    id: "ex-motion",
    cat: "Chuyển động",
    title: "Quay đầu nhẹ",
    text: "She slowly turns her head toward the window and smiles slightly. Her hair moves gently. Static camera.",
    example: true,
  },
  {
    id: "ex-style",
    cat: "Phong cách",
    title: "Khối phong cách hoạt hình 3D",
    text: "3D animated film style, soft rounded shapes, warm cinematic lighting, rich saturated colors, shallow depth of field",
    example: true,
  },
];

const emptyDraft = { cat: "Nhân vật" as Cat, title: "", text: "" };

export function PromptLibrary() {
  const [items, setItems, ready] = useSaved<Item[]>("aic-tool-prompts-v1", seed);
  const [filter, setFilter] = useState<Cat | "all">("all");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => {
    const k = q.trim().toLowerCase();
    return items.filter((it) => (filter === "all" || it.cat === filter) && (!k || `${it.title} ${it.text}`.toLowerCase().includes(k)));
  }, [items, filter, q]);

  const counts = useMemo(() => Object.fromEntries(cats.map((c) => [c, items.filter((i) => i.cat === c).length])), [items]);

  const save = () => {
    if (!draft.text.trim()) {
      setMsg("Hãy nhập nội dung prompt trước khi lưu.");
      return;
    }
    const title = draft.title.trim() || draft.text.trim().slice(0, 40);
    if (editing) {
      setItems((list) => list.map((i) => (i.id === editing ? { ...i, cat: draft.cat, title, text: draft.text.trim(), example: false } : i)));
      setMsg("Đã lưu thay đổi.");
    } else {
      setItems((list) => [{ id: uid(), cat: draft.cat, title, text: draft.text.trim() }, ...list]);
      setMsg("Đã thêm prompt.");
    }
    setDraft({ ...emptyDraft, cat: draft.cat });
    setEditing(null);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "thu-vien-prompt.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error();
      const valid = data.filter((d) => d && typeof d.text === "string" && cats.includes(d.cat));
      const have = new Set(items.map((i) => i.text));
      const fresh = valid.filter((d) => !have.has(d.text)).map((d) => ({ id: uid(), cat: d.cat, title: String(d.title ?? ""), text: d.text }));
      setItems((list) => [...fresh, ...list]);
      setMsg(`Đã nhập ${fresh.length} prompt mới${valid.length - fresh.length ? `, bỏ qua ${valid.length - fresh.length} prompt trùng` : ""}.`);
    } catch {
      setMsg("Tệp không đúng định dạng. Hãy chọn tệp .json được xuất từ thư viện này.");
    }
  };

  return (
    <div className="tool stack" aria-busy={!ready}>
      <section className="tool-panel stack">
        <h2 className="tool-h">{editing ? "Sửa prompt" : "Thêm prompt"}</h2>
        <div className="prompt-form">
          <label className="field">
            <span className="mono">Nhóm</span>
            <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value as Cat })}>
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="field grow">
            <span className="mono">Tên ngắn</span>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Ví dụ: Nhân vật chính, góc 3/4" />
          </label>
          <label className="field full">
            <span className="mono">Prompt</span>
            <textarea rows={3} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
          </label>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-sm" onClick={save}>
            {editing ? "Lưu thay đổi" : "Lưu vào thư viện"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setEditing(null);
                setDraft(emptyDraft);
              }}
            >
              Hủy sửa
            </button>
          )}
          <span className="muted small" role="status">
            {msg}
          </span>
        </div>
      </section>

      <div className="lib-filters">
        <div className="chip-row" role="radiogroup" aria-label="Lọc theo nhóm">
          <button type="button" role="radio" aria-checked={filter === "all"} className={filter === "all" ? "fchip is-on" : "fchip"} onClick={() => setFilter("all")}>
            Tất cả <small>{items.length}</small>
          </button>
          {cats.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={filter === c} className={filter === c ? "fchip is-on" : "fchip"} onClick={() => setFilter(c)}>
              {c} <small>{counts[c]}</small>
            </button>
          ))}
        </div>
        <label className="field lib-search">
          <span className="sr-only">Tìm trong thư viện</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trong thư viện" />
        </label>
      </div>

      {shown.length === 0 ? (
        <div className="tool-panel">
          <p className="muted">Không có prompt nào khớp. Đổi bộ lọc hoặc thêm prompt mới ở trên.</p>
        </div>
      ) : (
        <ul className="prompt-grid">
          {shown.map((it) => (
            <li key={it.id} className="prompt-card">
              <header>
                <span className="pcat">{it.cat}</span>
                {it.example && <span className="pill">Ví dụ</span>}
              </header>
              <h3>{it.title}</h3>
              <pre>{it.text}</pre>
              <div className="btn-row">
                <CopyButton text={() => it.text} className="btn btn-sm" />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setEditing(it.id);
                    setDraft({ cat: it.cat, title: it.title, text: it.text });
                    setMsg("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Sửa
                </button>
                <DeleteButton onDelete={() => setItems((list) => list.filter((i) => i.id !== it.id))} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="tool-foot">
        <p className="muted small">Sao lưu thư viện thành tệp để chuyển sang máy khác hoặc phòng khi xóa dữ liệu trình duyệt.</p>
        <div className="btn-row">
          <button type="button" className="btn btn-ghost btn-sm" onClick={exportJson}>
            Tải tệp sao lưu
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
            Nhập từ tệp
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJson(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      <SavedNote />
    </div>
  );
}
