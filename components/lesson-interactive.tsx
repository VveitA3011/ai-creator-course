"use client";

import { useEffect, useState } from "react";
import { useSaved } from "@/lib/use-saved";

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

/* Mục lục bài học ở cột phải trên màn hình rộng: lấy các tiêu đề h2 trong bài, đánh dấu mục đang đọc */
export function LessonToc() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLHeadingElement>(".prose h2")];
    const used = new Set<string>();
    const list = heads.map((h, i) => {
      if (!h.id) {
        let id = `muc-${i + 1}`;
        while (used.has(id)) id += "-x";
        h.id = id;
      }
      used.add(h.id);
      return { id: h.id, text: h.textContent ?? "" };
    });
    setItems(list);
    if (!("IntersectionObserver" in window) || heads.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  if (items.length < 2) return null;
  return (
    <nav className="lesson-toc" aria-label="Các mục trong bài">
      <span className="mono">Trong bài này</span>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={active === it.id ? "is-on" : undefined} aria-current={active === it.id ? "location" : undefined}>
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
