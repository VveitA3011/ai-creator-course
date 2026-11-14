import type { ReactNode } from "react";

// Thành phần dùng trong bài học (.mdx).

export function Beats({ children }: { children: ReactNode }) {
  return <ol className="beats">{children}</ol>;
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

export function Exercise({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="callout exercise">
      <span className="mono">Bài tập</span>
      {title && <h3>{title}</h3>}
      {children}
    </aside>
  );
}

export function Output({ children }: { children: ReactNode }) {
  return (
    <aside className="callout output-box">
      <span className="mono">Đầu ra của bài</span>
      {children}
    </aside>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="callout note">
      <span className="mono">Lưu ý</span>
      {children}
    </aside>
  );
}

export const mdxComponents = {
  Beats,
  Beat,
  Exercise,
  Output,
  Note,
  table: (props: React.ComponentProps<"table">) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};
