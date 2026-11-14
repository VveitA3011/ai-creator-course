import Link from "next/link";
import type { Module } from "@/lib/curriculum";
import { Icon } from "./icons";

export function ModuleCard({ module: m, index }: { module: Module; index: number }) {
  const ready = m.lessons.length > 0;
  const style = { "--i": index } as React.CSSProperties;

  if (!ready) {
    return (
      <div className="mcard soon rise" style={style}>
        <div className="mcard-top">
          <span className="pill">Sắp có</span>
        </div>
        <span className="mono">{m.tag}</span>
        <h3 style={{ marginTop: 0 }}>{m.title}</h3>
        <p>{m.lessonCount} bài · đang biên soạn</p>
      </div>
    );
  }

  return (
    <Link className={`mcard v${index % 4} rise`} style={style} href={`/khoa-hoc/${m.slug}`}>
      <div className="mcard-top">
        <span className="play">
          <Icon name="play" />
        </span>
        <span className="pill">{m.lessonCount} bài</span>
      </div>
      <h3>{m.title}</h3>
      <p>
        {m.tag} · {m.summary}
      </p>
    </Link>
  );
}
