"use client";

import type { CSSProperties } from "react";
import { uid, useSaved } from "@/lib/use-saved";
import { CopyButton, DeleteButton, DocSwitcher, SavedNote } from "./common";

/* Khung nhịp lấy từ các bài học. share là tỷ lệ thời lượng của từng nhịp. */
const templates = {
  ad: {
    name: "Quảng cáo sản phẩm",
    lesson: "Tuần 1 · Cấu trúc video quảng cáo ngắn",
    durations: [20, 25, 30],
    beats: [
      { label: "Hook", share: 3, hint: "Khung hình và câu đầu tiên khiến người xem dừng lại." },
      { label: "Vấn đề", share: 7, hint: "Tình huống hoặc nhu cầu của khách hàng mà sản phẩm giải quyết." },
      { label: "Sản phẩm", share: 12, hint: "Hình ảnh sản phẩm đúng đặc điểm, lợi ích chính, khoảnh khắc sử dụng." },
      { label: "CTA", share: 8, hint: "Thông điệp chốt và lời kêu gọi hành động." },
    ],
  },
  social: {
    name: "Quảng cáo social nhịp nhanh",
    lesson: "Tuần 5 · Social Media Advertisement",
    durations: [15, 18, 20],
    beats: [
      { label: "Hook", share: 2, hint: "Một câu hoặc hình ảnh khiến người xem dừng lại ngay 2 giây đầu." },
      { label: "Vấn đề", share: 5, hint: "Tình huống quen thuộc với người xem." },
      { label: "Sản phẩm", share: 7, hint: "Sản phẩm xuất hiện như lời giải, hai đến ba lợi ích có thật." },
      { label: "CTA", share: 4, hint: "Một lời kêu gọi rõ ràng." },
    ],
  },
  story: {
    name: "Kể chuyện",
    lesson: "Tuần 1 · Cấu trúc video storytelling",
    durations: [30, 45, 60],
    beats: [
      { label: "Hook", share: 5, hint: "Một hình ảnh hoặc tình huống gây tò mò ngay." },
      { label: "Thiết lập", share: 10, hint: "Nhân vật và điều họ mong muốn hoặc đang thiếu. Gieo chi tiết sẽ quay lại ở cao trào." },
      { label: "Phát triển", share: 20, hint: "Nhân vật hành động. Trở ngại, manh mối, cảm xúc tăng dần." },
      { label: "Cao trào", share: 15, hint: "Hé lộ, lựa chọn, hoặc đoàn tụ. Cho thấy bằng hình, không kể bằng lời." },
      { label: "Kết thúc", share: 10, hint: "Hệ quả và cảm xúc đọng lại. Không giải thích lại câu chuyện." },
    ],
  },
  us: {
    name: "Kênh US 60–90 giây",
    lesson: "Kênh US · Chiến lược nội dung cho khán giả Mỹ",
    durations: [60, 75, 90],
    beats: [
      { label: "Hook", share: 3, hint: "A question or situation that makes viewers want to know what happens." },
      { label: "Setup", share: 12, hint: "Introduce the character and the problem." },
      { label: "Development", share: 30, hint: "Conflict, emotion and clues." },
      { label: "Payoff", share: 25, hint: "The climax or the twist." },
      { label: "Ending", share: 20, hint: "A meaningful ending, a natural question for comments." },
    ],
  },
} as const;

type TemplateKey = keyof typeof templates;

type Script = {
  id: string;
  title: string;
  template: TemplateKey;
  duration: number;
  hooks: string[];
  beats: { visual: string; vo: string }[];
};

function newScript(template: TemplateKey = "ad", title = ""): Script {
  const t = templates[template];
  return {
    id: uid(),
    title,
    template,
    duration: t.durations[t.durations.length - 1],
    hooks: ["", "", ""],
    beats: t.beats.map(() => ({ visual: "", vo: "" })),
  };
}

const example: Script = {
  id: "example",
  title: "Ví dụ: chú mèo và chiếc vòng cổ",
  template: "story",
  duration: 60,
  hooks: [
    "Hình ảnh chú mèo già nằm dưới hiên nhà trong cơn mưa.",
    "Mỗi tối, chú mèo này đều đợi một người.",
    "",
  ],
  beats: [
    { visual: "Chú mèo già nằm dưới hiên nhà trong cơn mưa. Wide shot, static.", vo: "" },
    { visual: "Cận chiếc vòng cổ cũ. Thoáng ký ức người chủ đeo vòng cho chú.", vo: "Chiếc vòng ấy là thứ cuối cùng chú còn giữ." },
    { visual: "Chú mèo đi qua công viên, quán cà phê, bến xe quen thuộc. Tracking shot.", vo: "" },
    { visual: "Một người bước xuống xe, trên tay là chiếc vòng giống hệt.", vo: "" },
    { visual: "Hai người bạn đoàn tụ. Cận cảnh khuôn mặt.", vo: "Có những lời hứa không cần nói ra." },
  ],
};

/* Chia thời lượng theo tỷ lệ, làm tròn mốc giây */
function timeline(key: TemplateKey, duration: number) {
  const beats = templates[key].beats;
  const total = beats.reduce((s, b) => s + b.share, 0);
  let acc = 0;
  return beats.map((b) => {
    const start = Math.round((acc / total) * duration);
    acc += b.share;
    const end = Math.round((acc / total) * duration);
    return { ...b, start, end, len: end - start };
  });
}

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function BeatBuilder() {
  const [state, setState, ready] = useSaved<{ docs: Script[]; current: string }>("aic-tool-script-v1", {
    docs: [example],
    current: example.id,
  });
  const doc = state.docs.find((d) => d.id === state.current) ?? state.docs[0];
  const t = templates[doc.template];
  const tl = timeline(doc.template, doc.duration);

  const update = (patch: Partial<Script>) =>
    setState((s) => ({ ...s, docs: s.docs.map((d) => (d.id === doc.id ? { ...d, ...patch } : d)) }));

  const setBeat = (i: number, field: "visual" | "vo", v: string) =>
    update({ beats: doc.beats.map((b, j) => (j === i ? { ...b, [field]: v } : b)) });

  const switchTemplate = (key: TemplateKey) => {
    const nt = templates[key];
    const beats = nt.beats.map((_, i) => doc.beats[i] ?? { visual: "", vo: "" });
    const duration = (nt.durations as readonly number[]).includes(doc.duration) ? doc.duration : nt.durations[nt.durations.length - 1];
    update({ template: key, beats, duration });
  };

  const totalWords = doc.beats.reduce((s, b) => s + countWords(b.vo), 0);

  const asText = () => {
    const lines = [`${doc.title || "Kịch bản"} · ${t.name} · ${doc.duration} giây`, ""];
    const hooks = doc.hooks.filter((h) => h.trim());
    if (hooks.length) {
      lines.push("PHƯƠNG ÁN HOOK");
      hooks.forEach((h, i) => lines.push(`${i + 1}. ${h}`));
      lines.push("");
    }
    tl.forEach((b, i) => {
      lines.push(`${b.start}–${b.end}s · ${b.label.toUpperCase()}`);
      if (doc.beats[i]?.visual.trim()) lines.push(`Hình ảnh: ${doc.beats[i].visual.trim()}`);
      if (doc.beats[i]?.vo.trim()) lines.push(`Lời dẫn: ${doc.beats[i].vo.trim()}`);
      lines.push("");
    });
    return lines.join("\n").trim();
  };

  return (
    <div className="tool stack" aria-busy={!ready}>
      <DocSwitcher
        docs={state.docs}
        current={doc}
        noun="kịch bản"
        onSelect={(id) => setState((s) => ({ ...s, current: id }))}
        onNew={() => {
          const n = newScript(doc.template);
          setState((s) => ({ docs: [...s.docs, n], current: n.id }));
        }}
        onRename={(title) => update({ title })}
        onDelete={() =>
          setState((s) => {
            const docs = s.docs.filter((d) => d.id !== doc.id);
            return { docs, current: docs[0].id };
          })
        }
      />

      <div className="tool-panel stack">
        <div className="seg-picker" role="radiogroup" aria-label="Khung kịch bản">
          {(Object.keys(templates) as TemplateKey[]).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={doc.template === k}
              className={doc.template === k ? "is-on" : undefined}
              onClick={() => switchTemplate(k)}
            >
              {templates[k].name}
            </button>
          ))}
        </div>
        <div className="row-between">
          <span className="muted small">Khung theo bài: {t.lesson}</span>
          <div className="seg-picker small" role="radiogroup" aria-label="Thời lượng">
            {t.durations.map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={doc.duration === d}
                className={doc.duration === d ? "is-on" : undefined}
                onClick={() => update({ duration: d })}
              >
                {d} giây
              </button>
            ))}
          </div>
        </div>
        <div className="timebar" aria-hidden="true">
          {tl.map((b, i) => (
            <span key={b.label} className={`seg c${i % 5}`} style={{ flexGrow: b.len, "--i": i } as CSSProperties}>
              <b>{b.label}</b>
              <small>
                {b.start}–{b.end}s
              </small>
            </span>
          ))}
        </div>
      </div>

      <section className="tool-panel stack">
        <h2 className="tool-h">Ba phương án hook</h2>
        <p className="muted small">Cảm xúc, gây tò mò, lợi ích. Ghi cả khung hình đầu tiên và câu đầu tiên.</p>
        <div className="hook-grid">
          {["Cảm xúc", "Gây tò mò", "Lợi ích"].map((name, i) => (
            <label key={name} className="field">
              <span className="mono">{name}</span>
              <textarea
                rows={3}
                value={doc.hooks[i] ?? ""}
                onChange={(e) => update({ hooks: doc.hooks.map((h, j) => (j === i ? e.target.value : h)) })}
                placeholder="Khung hình đầu tiên và câu đầu tiên"
              />
            </label>
          ))}
        </div>
      </section>

      <ol className="beat-editor">
        {tl.map((b, i) => {
          const words = countWords(doc.beats[i]?.vo ?? "");
          const max = Math.round(b.len * 2.5);
          const over = words > Math.round(b.len * 3);
          return (
            <li key={b.label} className="beat-card" style={{ "--i": i } as CSSProperties}>
              <header>
                <span className={`beat-chip c${i % 5}`}>{b.label}</span>
                <span className="mono">
                  {b.start}–{b.end}s · {b.len} giây
                </span>
              </header>
              <p className="muted small">{b.hint}</p>
              <label className="field">
                <span className="mono">Hình ảnh: máy quay thấy gì</span>
                <textarea rows={2} value={doc.beats[i]?.visual ?? ""} onChange={(e) => setBeat(i, "visual", e.target.value)} />
              </label>
              <label className="field">
                <span className="mono">Lời dẫn hoặc thoại</span>
                <textarea rows={2} value={doc.beats[i]?.vo ?? ""} onChange={(e) => setBeat(i, "vo", e.target.value)} />
              </label>
              <p className={over ? "word-meter over" : "word-meter"}>
                {words} từ · gợi ý tối đa khoảng {max} từ cho {b.len} giây
                {over && " · có thể quá dài, thử rút gọn"}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="tool-foot">
        <p className="muted small">
          Tổng lời dẫn: {totalWords} từ. Ước lượng theo nhịp đọc khoảng 2–3 từ mỗi giây; hãy đọc thành tiếng và bấm giờ để có số thật.
        </p>
        <div className="btn-row">
          <CopyButton text={asText} label="Sao chép kịch bản" className="btn btn-sm" />
          <DeleteButton
            label="Xóa nội dung"
            onDelete={() => update({ hooks: ["", "", ""], beats: t.beats.map(() => ({ visual: "", vo: "" })) })}
          />
        </div>
      </div>
      <SavedNote />
    </div>
  );
}
