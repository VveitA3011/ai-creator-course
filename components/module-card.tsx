import Link from "next/link";
import type { Module } from "@/lib/curriculum";

export function ModuleCard({ module: m }: { module: Module }) {
  const ready = m.lessons.length > 0;
  const body = (
    <>
      <span className="tc">
        <span>{m.tag}</span>
        <span>{ready ? `${m.lessonCount} bài` : "Sắp có"}</span>
      </span>
      <h3>{m.title}</h3>
      <span>{m.summary}</span>
      <span className="out">Đầu ra: {m.output}</span>
    </>
  );
  return ready ? (
    <Link className="frame" href={`/khoa-hoc/${m.slug}`}>
      {body}
    </Link>
  ) : (
    <div className="frame soon">{body}</div>
  );
}
