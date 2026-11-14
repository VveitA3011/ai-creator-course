"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { availableModules, flatLessons, type Module } from "@/lib/curriculum";

export function CompleteButton({ id }: { id: string }) {
  const { isDone, toggle } = useProgress();
  const done = isDone(id);
  return (
    <button
      type="button"
      className={done ? "btn btn-ghost" : "btn"}
      aria-pressed={done}
      onClick={() => toggle(id)}
    >
      {done ? "Đã hoàn thành ✓ (bấm để bỏ)" : "Đánh dấu hoàn thành"}
    </button>
  );
}

export function LessonList({ module, current }: { module: Module; current?: string }) {
  const { isDone } = useProgress();
  return (
    <ol className="lesson-list">
      {module.lessons.map((l, i) => {
        const id = `${module.slug}/${l.slug}`;
        return (
          <li key={l.slug}>
            <Link
              href={`/khoa-hoc/${id}`}
              className={l.slug === current ? "is-current" : undefined}
              aria-current={l.slug === current ? "page" : undefined}
            >
              <span className={isDone(id) ? "check on" : "check"} aria-hidden="true" />
              <span className="lesson-title">
                {i + 1}. {l.title}
                {isDone(id) && <span className="sr-only"> (đã hoàn thành)</span>}
              </span>
              <span className="mins">{l.minutes}′</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function ModuleBar({ module }: { module: Module }) {
  const { isDone } = useProgress();
  const n = module.lessons.filter((l) => isDone(`${module.slug}/${l.slug}`)).length;
  const total = module.lessons.length;
  return (
    <div className="mod-bar">
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={n}>
        <i style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
      </div>
      <span className="mono">
        {n}/{total} bài
      </span>
    </div>
  );
}

export function Dashboard() {
  const { isDone } = useProgress();
  const doneCount = flatLessons.filter((l) => isDone(l.id)).length;
  const next = flatLessons.find((l) => !isDone(l.id));
  const pct = Math.round((doneCount / flatLessons.length) * 100);

  return (
    <div className="stack">
      <section className="panel now">
        <span className="mono">Đang học</span>
        {next ? (
          <>
            <h2>
              {next.module.tag} · {next.module.title}
            </h2>
            <p>Bài tiếp theo: {next.title}</p>
            <Link className="btn" href={next.href}>
              {doneCount === 0 ? "Bắt đầu học" : "Học tiếp"}
            </Link>
          </>
        ) : (
          <>
            <h2>Bạn đã học hết các bài hiện có</h2>
            <p>Tuần 3 trở đi đang được biên soạn. Trong lúc chờ, hãy hoàn thiện các đầu ra của Tuần 1 và Tuần 2.</p>
          </>
        )}
        <div className="mod-bar">
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <span className="mono">
            {doneCount}/{flatLessons.length} bài · {pct}%
          </span>
        </div>
      </section>

      <div className="grid-2">
        {availableModules.map((m) => (
          <section className="panel" key={m.slug}>
            <span className="mono">{m.tag}</span>
            <h3>
              <Link href={`/khoa-hoc/${m.slug}`}>{m.title}</Link>
            </h3>
            <ModuleBar module={m} />
            <LessonList module={m} />
            <p className="output">
              <strong>Đầu ra cần có:</strong> {m.output}
            </p>
          </section>
        ))}
      </div>
      <p className="muted small">
        Tiến độ được lưu trên trình duyệt này. Đổi máy hoặc xóa dữ liệu trình duyệt sẽ mất tiến độ cho đến khi có tính năng tài khoản.
      </p>
    </div>
  );
}
