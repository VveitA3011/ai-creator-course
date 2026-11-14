"use client";

import { useEffect, useState } from "react";
import { useSaved } from "@/lib/use-saved";

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

/* Thang điểm tự chấm video, mốc đạt 80/100 */
const criteria: [string, number][] = [
  ["Kịch bản và storytelling", 20],
  ["Chất lượng hình ảnh", 20],
  ["Nhất quán nhân vật", 20],
  ["Chuyển động và camera", 15],
  ["Âm thanh, thoại", 10],
  ["Hậu kỳ", 15],
];

export function Rubric() {
  const [vals, setVals] = useSaved<number[]>("aic-rubric-v1", criteria.map(() => 7));
  const total = Math.round(criteria.reduce((s, c, i) => s + ((vals[i] ?? 0) / 10) * c[1], 0) * 10) / 10;
  const pass = total >= 80;
  const fmt = (n: number) => String(n).replace(".", ",");

  return (
    <div className="selfcheck">
      <div className="selfcheck-rows">
        {criteria.map((c, i) => (
          <label key={c[0]} htmlFor={`rb-${i}`}>
            <span>
              {c[0]} <small className="muted">× {c[1]}%</small>
            </span>
            <b>{vals[i]}</b>
            <input
              id={`rb-${i}`}
              type="range"
              min={0}
              max={10}
              step={1}
              value={vals[i] ?? 0}
              onChange={(e) => setVals(vals.map((x, j) => (j === i ? Number(e.target.value) : x)))}
            />
          </label>
        ))}
      </div>
      <div className="selfcheck-sum" aria-live="polite">
        <span className="mono">Tổng điểm</span>
        <b className="selfcheck-avg">
          {fmt(total)}
          <small>/100</small>
        </b>
        <div className="meter" aria-hidden="true">
          <i style={{ width: `${total}%` }} />
          <b />
        </div>
        <p>
          {pass
            ? "Đạt mốc 80. Video đủ điều kiện đưa vào portfolio."
            : `Chưa đạt, còn thiếu ${fmt(Math.round((80 - total) * 10) / 10)} điểm. Sửa tiêu chí có trọng số cao trước.`}
        </p>
        <small>Vạch sáng trên thanh là mốc 80. Điểm được lưu trên trình duyệt này.</small>
      </div>
    </div>
  );
}

/* Checklist tích được, items="a|b|c" */
export function Checklist({ id, items }: { id: string; items: string }) {
  const list = items.split("|");
  const [done, setDone] = useSaved<boolean[]>(`aic-check-${id}`, list.map(() => false));
  const n = list.filter((_, i) => done[i]).length;

  return (
    <div className="checklist">
      <div className="mod-bar">
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={list.length} aria-valuenow={n}>
          <i style={{ width: `${(n / list.length) * 100}%` }} />
        </div>
        <span className="mono">
          {n}/{list.length}
        </span>
      </div>
      <ul>
        {list.map((t, i) => (
          <li key={t}>
            <label className={done[i] ? "is-done" : undefined}>
              <input
                type="checkbox"
                checked={Boolean(done[i])}
                onChange={(e) => setDone(list.map((_, j) => (j === i ? e.target.checked : Boolean(done[j]))))}
              />
              <span>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-ghost" onClick={() => setDone(list.map(() => false))}>
        Bỏ tích tất cả
      </button>
    </div>
  );
}

/* Máy tính thu nhập: số video × giá (triệu đồng) */
const rows: [string, number, number][] = [
  ["Khách retainer: video quảng cáo mỗi tháng", 8, 1.5],
  ["Khách dự án: video", 3, 1.8],
  ["Repurposing: video ngắn", 4, 0.9],
];

export function IncomeCalc() {
  const [v, setV] = useSaved<number[]>("aic-income-v1", [8, 1.5, 3, 1.8, 4, 0.9, 2.5, 0.7, 120]);
  const set = (i: number, x: string) => setV(v.map((y, j) => (j === i ? Number(x) || 0 : y)));
  const revenue = v[0] * v[1] + v[2] * v[3] + v[4] * v[5];
  const net = revenue - v[6] - v[7];
  const hourly = v[8] > 0 ? Math.round((net * 1_000_000) / v[8] / 1000) * 1000 : 0;
  const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString("vi-VN");

  return (
    <div className="calc">
      <div className="calc-rows">
        {rows.map((r, i) => (
          <div className="calc-row" key={r[0]}>
            <span>{r[0]}</span>
            <label>
              <span className="sr-only">Số video: {r[0]}</span>
              <input type="number" min={0} step={1} value={v[i * 2]} onChange={(e) => set(i * 2, e.target.value)} />
            </label>
            <span aria-hidden="true">×</span>
            <label>
              <span className="sr-only">Giá mỗi video, triệu đồng: {r[0]}</span>
              <input type="number" min={0} step={0.1} value={v[i * 2 + 1]} onChange={(e) => set(i * 2 + 1, e.target.value)} />
            </label>
            <span className="muted">triệu</span>
          </div>
        ))}
        <div className="calc-row">
          <span>Công cụ, AI credits, lưu trữ</span>
          <label className="wide">
            <span className="sr-only">Chi phí công cụ, triệu đồng</span>
            <input type="number" min={0} step={0.1} value={v[6]} onChange={(e) => set(6, e.target.value)} />
          </label>
          <span className="muted">triệu</span>
        </div>
        <div className="calc-row">
          <span>Phí thanh toán, nền tảng</span>
          <label className="wide">
            <span className="sr-only">Phí nền tảng, triệu đồng</span>
            <input type="number" min={0} step={0.1} value={v[7]} onChange={(e) => set(7, e.target.value)} />
          </label>
          <span className="muted">triệu</span>
        </div>
        <div className="calc-row">
          <span>Tổng giờ làm trong tháng</span>
          <label className="wide">
            <span className="sr-only">Tổng giờ làm trong tháng</span>
            <input type="number" min={0} step={1} value={v[8]} onChange={(e) => set(8, e.target.value)} />
          </label>
          <span className="muted">giờ</span>
        </div>
      </div>
      <div className="selfcheck-sum" aria-live="polite">
        <span className="mono">Còn lại trước thuế</span>
        <b className="selfcheck-avg">
          {fmt(net)}
          <small> triệu</small>
        </b>
        <p>
          <strong>Doanh thu:</strong> {fmt(revenue)} triệu
        </p>
        <p>
          <strong>Mỗi giờ làm:</strong> {hourly.toLocaleString("vi-VN")} đồng
        </p>
        <small>Đây là công cụ mô phỏng, không phải dự báo thu nhập.</small>
      </div>
    </div>
  );
}
