"use client";

import type { CSSProperties } from "react";
import { uid, useSaved } from "@/lib/use-saved";
import { CopyButton, DeleteButton, DocSwitcher, SavedNote } from "./common";

const shotSizes = [
  { v: "Wide shot", vi: "Toàn cảnh", s: 0.32, y: "62%" },
  { v: "Full shot", vi: "Toàn thân", s: 0.62, y: "34%" },
  { v: "Medium shot", vi: "Trung cảnh", s: 1.25, y: "40%" },
  { v: "Close-up", vi: "Cận cảnh", s: 2.5, y: "46%" },
  { v: "Extreme close-up", vi: "Đặc tả", s: 5.2, y: "50%" },
];

const cameras = ["Static", "Slow dolly-in", "Tracking shot", "Pan", "Orbit"];
const camClass: Record<string, string> = {
  "Slow dolly-in": "mv-dolly",
  "Tracking shot": "mv-track",
  Pan: "mv-pan",
  Orbit: "mv-orbit",
};

type Shot = { id: string; scene: string; shot: string; camera: string; lighting: string; action: string; duration: number };
type Board = { id: string; title: string; target: number; style: string; shots: Shot[] };

const blankShot = (): Shot => ({ id: uid(), scene: "", shot: "Medium shot", camera: "Static", lighting: "", action: "", duration: 4 });

const example: Board = {
  id: "example",
  title: "Ví dụ: quảng cáo nước hoa 24 giây",
  target: 24,
  style: "cinematic, realistic",
  shots: [
    { id: "s1", scene: "Bàn đá cẩm thạch đen", shot: "Extreme close-up", camera: "Slow dolly-in", lighting: "Low-key, rim light", action: "Một bàn tay chạm vào lọ nước hoa", duration: 3 },
    { id: "s2", scene: "Sảnh tiệc", shot: "Full shot", camera: "Tracking shot", lighting: "Vàng ấm, đèn chùm", action: "Nhân vật bước vào, tà váy chuyển động", duration: 5 },
    { id: "s3", scene: "Sảnh tiệc", shot: "Medium shot", camera: "Static", lighting: "Vàng ấm", action: "Hai người quay lại nhìn theo", duration: 4 },
    { id: "s4", scene: "Bàn đá cẩm thạch đen", shot: "Extreme close-up", camera: "Orbit", lighting: "Low-key, rim light", action: "Lọ nước hoa, hạt sương trên thân chai", duration: 5 },
    { id: "s5", scene: "Sảnh tiệc", shot: "Close-up", camera: "Slow dolly-in", lighting: "Vàng ấm", action: "Nhân vật mỉm cười, nhìn qua vai", duration: 4 },
    { id: "s6", scene: "Nền đen", shot: "Medium shot", camera: "Static", lighting: "Low-key", action: "Sản phẩm, tên thương hiệu, CTA", duration: 3 },
  ],
};

function shotWarnings(shots: Shot[], i: number) {
  const s = shots[i];
  const w: string[] = [];
  if (s.duration > 8) w.push("Dài hơn 8 giây: nên tách thành hai shot.");
  if (i > 0 && shots[i - 1].shot === s.shot) w.push("Trùng cỡ cảnh với shot trước.");
  return w;
}

export function StoryboardBoard() {
  const [state, setState, ready] = useSaved<{ docs: Board[]; current: string }>("aic-tool-storyboard-v1", {
    docs: [example],
    current: example.id,
  });
  const doc = state.docs.find((d) => d.id === state.current) ?? state.docs[0];
  const total = doc.shots.reduce((s, x) => s + (Number(x.duration) || 0), 0);
  const diff = total - doc.target;

  const update = (patch: Partial<Board>) =>
    setState((s) => ({ ...s, docs: s.docs.map((d) => (d.id === doc.id ? { ...d, ...patch } : d)) }));
  const setShot = (id: string, patch: Partial<Shot>) => update({ shots: doc.shots.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= doc.shots.length) return;
    const shots = [...doc.shots];
    [shots[i], shots[j]] = [shots[j], shots[i]];
    update({ shots });
  };

  const imagePrompt = (s: Shot) =>
    [s.shot, s.action, s.scene, s.lighting, doc.style, "vertical 9:16"].map((x) => String(x).trim()).filter(Boolean).join(", ");
  const motionPrompt = (s: Shot) => [s.action, `${s.camera}.`].map((x) => x.trim()).filter(Boolean).join(". ");

  const asTable = () => {
    const head = "| # | Scene | Shot | Camera | Lighting | Action | Duration |\n| --- | --- | --- | --- | --- | --- | --- |";
    const rows = doc.shots.map((s, i) => `| ${i + 1} | ${s.scene} | ${s.shot} | ${s.camera} | ${s.lighting} | ${s.action} | ${s.duration}s |`);
    return [`${doc.title || "Storyboard"} · tổng ${total} giây`, "", head, ...rows].join("\n");
  };

  return (
    <div className="tool stack" aria-busy={!ready}>
      <DocSwitcher
        docs={state.docs}
        current={doc}
        noun="storyboard"
        onSelect={(id) => setState((s) => ({ ...s, current: id }))}
        onNew={() => {
          const n: Board = { id: uid(), title: "", target: 30, style: doc.style, shots: [blankShot()] };
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

      <div className="tool-panel board-head">
        <label className="field">
          <span className="mono">Thời lượng mục tiêu (giây)</span>
          <input type="number" min={5} max={180} value={doc.target} onChange={(e) => update({ target: Number(e.target.value) || 0 })} />
        </label>
        <label className="field grow">
          <span className="mono">Phong cách chung, thêm vào mọi prompt</span>
          <input value={doc.style} onChange={(e) => update({ style: e.target.value })} placeholder="cinematic, realistic, warm color grading" />
        </label>
        <div className={`total-badge${diff === 0 ? " ok" : ""}`} aria-live="polite">
          <b>{total}s</b>
          <span>{diff === 0 ? "Khớp mục tiêu" : diff > 0 ? `Thừa ${diff} giây` : `Thiếu ${-diff} giây`}</span>
        </div>
      </div>

      <div className="filmstrip" aria-label="Xem trước chuỗi shot">
        {doc.shots.map((s, i) => {
          const z = shotSizes.find((x) => x.v === s.shot) ?? shotSizes[2];
          return (
            <figure key={s.id} className="strip-frame" style={{ flexGrow: Math.max(1, s.duration) }}>
              <div className={`demo-pic scene ${camClass[s.camera] ?? ""}`} style={{ "--s": z.s, "--y": z.y } as CSSProperties}>
                <span className="scene-inner">
                  <span className="fig">
                    <i className="fig-head" />
                    <i className="fig-body" />
                  </span>
                </span>
                <span className="sframe-n">{i + 1}</span>
              </div>
              <figcaption>{s.duration}s</figcaption>
            </figure>
          );
        })}
      </div>

      <ol className="shot-list">
        {doc.shots.map((s, i) => {
          const warns = shotWarnings(doc.shots, i);
          return (
            <li key={s.id} className="shot-card">
              <header>
                <span className="shot-no">{i + 1}</span>
                <div className="btn-row">
                  <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Đưa shot ${i + 1} lên`}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(i, 1)}
                    disabled={i === doc.shots.length - 1}
                    aria-label={`Đưa shot ${i + 1} xuống`}
                  >
                    ↓
                  </button>
                  {doc.shots.length > 1 && <DeleteButton onDelete={() => update({ shots: doc.shots.filter((x) => x.id !== s.id) })} />}
                </div>
              </header>
              <div className="shot-fields">
                <label className="field">
                  <span className="mono">Scene</span>
                  <input value={s.scene} onChange={(e) => setShot(s.id, { scene: e.target.value })} placeholder="Bối cảnh" />
                </label>
                <label className="field">
                  <span className="mono">Shot</span>
                  <select value={s.shot} onChange={(e) => setShot(s.id, { shot: e.target.value })}>
                    {shotSizes.map((z) => (
                      <option key={z.v} value={z.v}>
                        {z.v} · {z.vi}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="mono">Camera</span>
                  <select value={s.camera} onChange={(e) => setShot(s.id, { camera: e.target.value })}>
                    {cameras.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="mono">Lighting</span>
                  <input value={s.lighting} onChange={(e) => setShot(s.id, { lighting: e.target.value })} placeholder="Ánh sáng và màu" />
                </label>
                <label className="field span-2">
                  <span className="mono">Action</span>
                  <input value={s.action} onChange={(e) => setShot(s.id, { action: e.target.value })} placeholder="Ai làm gì, một hành động" />
                </label>
                <label className="field">
                  <span className="mono">Duration (giây)</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={s.duration}
                    onChange={(e) => setShot(s.id, { duration: Number(e.target.value) || 0 })}
                  />
                </label>
              </div>
              {warns.length > 0 && (
                <ul className="shot-warn">
                  {warns.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              )}
              <div className="btn-row">
                <CopyButton text={() => imagePrompt(s)} label="Sao chép prompt ảnh" />
                <CopyButton text={() => motionPrompt(s)} label="Sao chép prompt chuyển động" />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="tool-foot">
        <button type="button" className="btn btn-sm" onClick={() => update({ shots: [...doc.shots, blankShot()] })}>
          + Thêm shot
        </button>
        <CopyButton text={asTable} label="Sao chép bảng storyboard" />
      </div>
      <p className="muted small">
        Prompt được ghép từ các cột theo công thức của bài Storyboard. Hãy viết thêm phần mô tả nhân vật từ character sheet trước khi dùng.
      </p>
      <SavedNote />
    </div>
  );
}
