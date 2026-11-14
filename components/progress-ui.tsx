"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { availableModules, flatLessons, groups, type Module } from "@/lib/curriculum";
import { Icon } from "./icons";

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

function countDone(m: Module, isDone: (id: string) => boolean) {
  return m.lessons.filter((l) => isDone(`${m.slug}/${l.slug}`)).length;
}

export function ModuleBar({ module }: { module: Module }) {
  const { isDone } = useProgress();
  const n = countDone(module, isDone);
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

/* Ba bài chưa học kế tiếp */
export function UpNext() {
  const { isDone } = useProgress();
  const items = flatLessons.filter((l) => !isDone(l.id)).slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="panel">
        <h3>Bạn đã học hết khóa</h3>
        <p className="muted small">Hãy hoàn thiện các đầu ra và portfolio của bạn.</p>
      </div>
    );
  }

  return (
    <ol className="next-list" aria-label="Bài học kế tiếp">
      {items.map((l, i) => (
        <li className="next-item rise" style={{ "--i": i + 1 } as React.CSSProperties} key={l.id}>
          <Link href={l.href}>
            <span className="badge" aria-hidden="true">
              {l.minutes}′
            </span>
            <span>
              {l.title}
              <small>
                {l.module.tag} · {l.module.title}
              </small>
            </span>
            <Icon name="chevron" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

/* Vòng thống kê tiến độ */
export function Stats() {
  const { isDone } = useProgress();
  const done = flatLessons.filter((l) => isDone(l.id)).length;

  return (
    <div className="stats">
      <div className="ring" role="img" aria-label={`Đã học ${done} trên ${flatLessons.length} bài`}>
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <div className="ring-core">
          <span>Đã học</span>
          <b>
            {done}/{flatLessons.length}
          </b>
          <span>bài</span>
        </div>
      </div>
      <ul className="stat-row">
        {groups.map((g) => {
          const total = g.modules.reduce((n, m) => n + m.lessons.length, 0);
          const n = g.modules.reduce((x, m) => x + countDone(m, isDone), 0);
          return (
            <li key={g.key}>
              <Link href={g.href} aria-label={g.label}>
                {g.short}
              </Link>
              <b>
                {n}/{total}
              </b>
              {g.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* Thanh học tiếp */
export function ContinueBar() {
  const { isDone } = useProgress();
  const next = flatLessons.find((l) => !isDone(l.id));
  if (!next) return null;
  const m = next.module;
  const n = countDone(m, isDone);

  return (
    <Link className="continue" href={next.href}>
      <span className="tile" aria-hidden="true">
        {m.tag}
      </span>
      <span>
        <h3>{next.title}</h3>
        <span className="pill" style={{ marginTop: 6 }}>
          {m.title}
        </span>
      </span>
      <span className="meta">
        <span>
          Khoảng {next.minutes} phút
          <small>
            {n}/{m.lessons.length} bài của {m.tag}
          </small>
        </span>
        <span className="play" aria-hidden="true">
          <Icon name="play" />
        </span>
      </span>
      <span className="progress-line" style={{ width: `${(n / m.lessons.length) * 100}%` }} />
    </Link>
  );
}

export function Dashboard() {
  const { isDone } = useProgress();
  const doneCount = flatLessons.filter((l) => isDone(l.id)).length;
  const next = flatLessons.find((l) => !isDone(l.id));
  const pct = Math.round((doneCount / flatLessons.length) * 100);

  return (
    <div className="stack">
      <div className="grid-2" style={{ alignItems: "stretch" }}>
        <section className="panel now rise">
          <span className="mono">Đang học</span>
          {next ? (
            <>
              <h2>
                {next.module.tag} · {next.module.title}
              </h2>
              <p>Bài tiếp theo: {next.title}</p>
              <Link className="btn btn-light" href={next.href}>
                {doneCount === 0 ? "Bắt đầu học" : "Học tiếp"}
              </Link>
            </>
          ) : (
            <>
              <h2>Bạn đã học hết khóa</h2>
              <p>Việc còn lại là hoàn thiện các đầu ra và đưa sản phẩm tốt nhất vào portfolio.</p>
            </>
          )}
          <div className="mod-bar" style={{ marginTop: "auto" }}>
            <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <span className="mono">
              {doneCount}/{flatLessons.length} bài · {pct}%
            </span>
          </div>
        </section>
        <div className="rise" style={{ "--i": 1 } as React.CSSProperties}>
          <Stats />
        </div>
      </div>

      <div className="grid-2">
        {availableModules.map((m, i) => (
          <section className="panel rise" style={{ "--i": i + 2 } as React.CSSProperties} key={m.slug}>
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
