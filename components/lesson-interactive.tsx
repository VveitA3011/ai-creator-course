"use client";

import { useEffect, useState } from "react";

/* Câu hỏi kiểm tra nhanh */
export function Quiz({
  q,
  a,
  b,
  c,
  correct,
  why,
}: {
  q: string;
  a: string;
  b: string;
  c?: string;
  correct: string;
  why: string;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const choices = [
    ["a", a],
    ["b", b],
    ["c", c],
  ].filter((x): x is [string, string] => Boolean(x[1]));
  const right = picked === correct;

  return (
    <aside className="quiz">
      <span className="callout-tag">Kiểm tra nhanh</span>
      <h3>{q}</h3>
      <div className="quiz-choices">
        {choices.map(([id, text]) => {
          const state = !picked ? "" : id === correct ? " is-right" : id === picked ? " is-wrong" : " is-dim";
          return (
            <button
              key={id}
              type="button"
              className={`quiz-choice${state}`}
              aria-pressed={picked === id}
              onClick={() => setPicked(id)}
            >
              <span className="quiz-key">{id.toUpperCase()}</span>
              {text}
            </button>
          );
        })}
      </div>
      <p className="quiz-why" role="status">
        {picked && (
          <>
            <b>{right ? "Đúng rồi." : "Chưa đúng."}</b> {why}
          </>
        )}
      </p>
    </aside>
  );
}

/* Bảng tự chấm sáu năng lực */
const skills = [
  "Tư duy sáng tạo nội dung",
  "Viết và phát triển ý tưởng",
  "Storytelling",
  "Sử dụng AI",
  "Xây dựng prompt",
  "Kinh nghiệm social media",
];
const KEY = "aic-selfcheck-v1";

export function SelfCheck() {
  const [vals, setVals] = useState<number[]>(skills.map(() => 5));

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
      if (Array.isArray(saved) && saved.length === skills.length) setVals(saved.map(Number));
    } catch {
      /* không đọc được thì dùng giá trị mặc định */
    }
  }, []);

  function set(i: number, v: number) {
    const next = vals.map((x, j) => (j === i ? v : x));
    setVals(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* bỏ qua */
    }
  }

  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const max = Math.max(...vals);
  const min = Math.min(...vals);

  return (
    <div className="selfcheck">
      <div className="selfcheck-rows">
        {skills.map((s, i) => (
          <label key={s} htmlFor={`sc-${i}`}>
            <span>{s}</span>
            <b>{vals[i]}</b>
            <input
              id={`sc-${i}`}
              type="range"
              min={0}
              max={10}
              step={1}
              value={vals[i]}
              onChange={(e) => set(i, Number(e.target.value))}
              style={{ "--p": `${vals[i] * 10}%` } as React.CSSProperties}
            />
          </label>
        ))}
      </div>
      <div className="selfcheck-sum" aria-live="polite">
        <span className="mono">Trung bình</span>
        <b className="selfcheck-avg">{avg.toFixed(1).replace(".", ",")}</b>
        {max === min ? (
          <p>Kéo các thanh trượt để thấy điểm mạnh và điểm cần bồi thêm.</p>
        ) : (
          <>
            <p>
              <strong>Mạnh nhất:</strong> {skills[vals.indexOf(max)]}
            </p>
            <p>
              <strong>Cần bồi thêm:</strong> {skills[vals.indexOf(min)]}
            </p>
          </>
        )}
        <small>Điểm được lưu trên trình duyệt này.</small>
      </div>
    </div>
  );
}

/* Thanh tiến độ đọc + hiệu ứng hiện dần khi cuộn */
export function LessonMotion() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      const els = document.querySelectorAll<HTMLElement>(".prose > *");
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      els.forEach((el) => {
        el.classList.add("rv");
        io?.observe(el);
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return <div className="read-bar" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}
