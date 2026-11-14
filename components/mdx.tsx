import { Children, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Icon } from "./icons";
import { Checklist, IncomeCalc, Quiz, Rubric, SelfCheck } from "./lesson-interactive";

// Thành phần dùng trong bài học (.mdx).

/* Nhịp kịch bản: thanh thời gian theo tỷ lệ giây + danh sách chi tiết */
export function Beats({ children }: { children: ReactNode }) {
  const beats = Children.toArray(children).filter(isValidElement) as ReactElement<{ time?: string; label?: string }>[];
  const segs = beats.map((b) => {
    const m = b.props.time?.match(/(\d+)\D+(\d+)/);
    return m ? { label: b.props.label ?? "", time: b.props.time ?? "", len: Number(m[2]) - Number(m[1]) } : null;
  });
  const showBar = segs.length > 1 && segs.every((s) => s && s.len > 0);

  return (
    <div className="beats-wrap">
      {showBar && (
        <div className="timebar" aria-hidden="true">
          {segs.map((s, i) => (
            <span key={i} className={`seg c${i % 5}`} style={{ flexGrow: s!.len, "--i": i } as CSSProperties}>
              <b>{s!.label}</b>
              <small>{s!.time}</small>
            </span>
          ))}
        </div>
      )}
      <ol className="beats">{children}</ol>
    </div>
  );
}

export function Beat({ time, label, children }: { time: string; label: string; children: ReactNode }) {
  return (
    <li className="beat">
      <span className="beat-time">{time}</span>
      <span className="beat-label">{label}</span>
      <span className="beat-text">{children}</span>
    </li>
  );
}

/* Nút mở công cụ thực hành */
export function ToolLink({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return (
    <a className="tool-link" href={href}>
      <span className="tool-link-icon" aria-hidden="true">
        <Icon name="tools" />
      </span>
      <span>
        <b>{title}</b>
        <span className="muted">{children}</span>
      </span>
      <Icon name="chevron" />
    </a>
  );
}

/* Hộp bài tập, đầu ra, lưu ý */
export function Exercise({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="callout exercise">
      <span className="callout-tag">
        <Icon name="pencil" /> Bài tập
      </span>
      {title && <h3>{title}</h3>}
      {children}
    </aside>
  );
}

export function Output({ children }: { children: ReactNode }) {
  return (
    <aside className="callout output-box">
      <span className="callout-tag">
        <Icon name="flag" /> Đầu ra của bài
      </span>
      {children}
    </aside>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="callout note">
      <span className="callout-tag">
        <Icon name="alert" /> Lưu ý
      </span>
      {children}
    </aside>
  );
}

/* Thẻ khái niệm nhiều màu */
export function Cards({ children }: { children: ReactNode }) {
  return <div className="ccards">{children}</div>;
}

export function Card({ title, tag, tone = "dark", children }: { title: string; tag?: string; tone?: string; children: ReactNode }) {
  return (
    <div className={`ccard t-${tone}`}>
      {tag && <span className="ccard-tag">{tag}</span>}
      <h3>{title}</h3>
      <div className="ccard-body">{children}</div>
    </div>
  );
}

/* Trước và sau */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="compare">{children}</div>;
}

export function Before({ label = "Trước", children }: { label?: string; children: ReactNode }) {
  return (
    <div className="cmp before">
      <span className="cmp-tag">{label}</span>
      {children}
    </div>
  );
}

export function After({ label = "Sau", children }: { label?: string; children: ReactNode }) {
  return (
    <div className="cmp after">
      <span className="cmp-tag">{label}</span>
      {children}
    </div>
  );
}

/* Các bước theo trục dọc */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="steps">{children}</ol>;
}

export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="step">
      <h3>{title}</h3>
      <div>{children}</div>
    </li>
  );
}

/* Thanh điểm so sánh */
export function Bars({ children }: { children: ReactNode }) {
  return <div className="bars">{children}</div>;
}

export function Bar({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="hbar">
      <div className="hbar-head">
        <b>{label}</b>
        <span>{value}</span>
      </div>
      <div className="hbar-track">
        <i style={{ width: `${Number(value)}%` }} />
      </div>
      {note && <small>{note}</small>}
    </div>
  );
}

/* Thanh tỷ lệ, ví dụ parts="60,25,15" labels="A|B|C" */
export function Mix({ parts, labels }: { parts: string; labels: string }) {
  const ps = parts.split(",").map(Number);
  const ls = labels.split("|");
  return (
    <div className="mix" role="img" aria-label={ps.map((p, i) => `${ls[i]} ${p}%`).join(", ")}>
      {ps.map((p, i) => (
        <span key={i} className={`seg c${i % 5}`} style={{ flexGrow: p }}>
          <b>{p}%</b>
          <small>{ls[i]}</small>
        </span>
      ))}
    </div>
  );
}

/* Khung storyboard 9:16 */
export function Frames({ children }: { children: ReactNode }) {
  return <div className="frames">{children}</div>;
}

export function Frame({
  n,
  shot,
  cam,
  dur,
  tone = "dark",
  children,
}: {
  n: string;
  shot: string;
  cam: string;
  dur: string;
  tone?: string;
  children: ReactNode;
}) {
  return (
    <figure className="sframe">
      <div className={`sframe-pic t-${tone}`}>
        <span className="sframe-n">{n}</span>
        <span className="sframe-dur">{dur}</span>
        <span className="sframe-shot">{shot}</span>
      </div>
      <figcaption>
        <b>{cam}</b>
        {children}
      </figcaption>
    </figure>
  );
}

/* Bảng màu */
export function Palette({ colors, names }: { colors: string; names: string }) {
  const cs = colors.split(",");
  const ns = names.split("|");
  return (
    <div className="palette">
      {cs.map((c, i) => (
        <div key={c} className="swatch">
          <i style={{ background: c.trim() }} />
          <b>{ns[i]}</b>
          <small>{c.trim()}</small>
        </div>
      ))}
    </div>
  );
}

/* Minh họa cỡ cảnh */
const sizes = [
  { name: "Wide shot", vi: "Toàn cảnh", s: 0.32, y: "62%" },
  { name: "Full shot", vi: "Toàn thân", s: 0.62, y: "34%" },
  { name: "Medium shot", vi: "Trung cảnh", s: 1.25, y: "40%" },
  { name: "Close-up", vi: "Cận cảnh", s: 2.5, y: "46%" },
  { name: "Extreme close-up", vi: "Đặc tả", s: 5.2, y: "50%" },
];

function Figure() {
  return (
    <span className="fig">
      <i className="fig-head" />
      <i className="fig-body" />
    </span>
  );
}

export function ShotSizes() {
  return (
    <div className="demo-row" aria-label="Minh họa năm cỡ cảnh">
      {sizes.map((z) => (
        <figure className="demo" key={z.name}>
          <div className="demo-pic scene" style={{ "--s": z.s, "--y": z.y } as CSSProperties}>
            <Figure />
          </div>
          <figcaption>
            <b>{z.name}</b>
            {z.vi}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* Minh họa chuyển động máy */
const moves = [
  { cls: "mv-static", name: "Static", vi: "Máy đứng yên" },
  { cls: "mv-dolly", name: "Slow dolly-in", vi: "Tiến chậm vào chủ thể" },
  { cls: "mv-track", name: "Tracking shot", vi: "Đi theo nhân vật" },
  { cls: "mv-pan", name: "Pan", vi: "Xoay ngang" },
  { cls: "mv-orbit", name: "Orbit", vi: "Quay vòng quanh chủ thể" },
];

export function CameraMoves() {
  return (
    <div className="demo-row" aria-label="Minh họa năm chuyển động máy">
      {moves.map((m) => (
        <figure className="demo" key={m.name}>
          <div className={`demo-pic scene ${m.cls}`} style={{ "--s": 0.9, "--y": "36%" } as CSSProperties}>
            <span className="scene-inner">
              <Figure />
            </span>
          </div>
          <figcaption>
            <b>{m.name}</b>
            {m.vi}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* Minh họa ánh sáng */
const lights = [
  { cls: "lt-soft", name: "Soft natural light", vi: "Gần gũi, đời thường" },
  { cls: "lt-golden", name: "Golden hour", vi: "Hoài niệm, ấm áp" },
  { cls: "lt-rim", name: "Backlight, rim light", vi: "Sang trọng, tách nền" },
  { cls: "lt-low", name: "Low-key", vi: "Bí ẩn, kịch tính" },
  { cls: "lt-high", name: "High-key", vi: "Tươi, sạch" },
  { cls: "lt-rain", name: "Overcast, rainy", vi: "Buồn, tĩnh lặng" },
];

export function LightingDemo() {
  return (
    <div className="demo-row six" aria-label="Minh họa sáu kiểu ánh sáng">
      {lights.map((l) => (
        <figure className="demo" key={l.name}>
          <div className={`demo-pic light ${l.cls}`}>
            <i className="orb" />
          </div>
          <figcaption>
            <b>{l.name}</b>
            {l.vi}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export const mdxComponents = {
  Beats,
  Beat,
  Exercise,
  Output,
  Note,
  Cards,
  Card,
  Compare,
  Before,
  After,
  Steps,
  Step,
  Bars,
  Bar,
  Mix,
  Frames,
  Frame,
  Palette,
  ShotSizes,
  CameraMoves,
  LightingDemo,
  ToolLink,
  Quiz,
  SelfCheck,
  Rubric,
  Checklist,
  IncomeCalc,
  table: (props: React.ComponentProps<"table">) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};
