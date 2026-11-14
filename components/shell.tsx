"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { flatLessons } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { accountsEnabled } from "@/lib/supabase";
import { useAuth } from "./auth";
import { Icon } from "./icons";

const links = [
  { href: "/", label: "Trang chủ", icon: "home" as const, match: (p: string) => p === "/" },
  { href: "/lo-trinh", label: "Lộ trình", icon: "layers" as const, match: (p: string) => p.startsWith("/lo-trinh") || p.startsWith("/khoa-hoc") },
  { href: "/cong-cu", label: "Công cụ", icon: "tools" as const, match: (p: string) => p.startsWith("/cong-cu") },
  { href: "/hoc-tap", label: "Học tập", icon: "pie" as const, match: (p: string) => p.startsWith("/hoc-tap") },
  ...(accountsEnabled
    ? [
        {
          href: "/tai-khoan",
          label: "Tài khoản",
          icon: "user" as const,
          match: (p: string) => ["/tai-khoan", "/dang-nhap", "/portfolio"].some((x) => p.startsWith(x)),
        },
      ]
    : []),
];

export function Rail() {
  const path = usePathname();
  const { isDone } = useProgress();
  const next = flatLessons.find((l) => !isDone(l.id));

  return (
    <aside className="rail">
      <Link href="/" className="rail-logo" aria-label="AI Creator, về trang chủ">
        AI
      </Link>
      <nav aria-label="Điều hướng chính">
        {links.map((l) => {
          const active = l.match(path);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={active ? "rail-link is-active" : "rail-link"}
              aria-current={active ? "page" : undefined}
              aria-label={l.label}
            >
              <Icon name={l.icon} />
              <span className="tip" aria-hidden="true">
                {l.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <Link className="rail-go" href={next ? next.href : "/hoc-tap"} aria-label="Học tiếp bài kế">
        <span>
          <Icon name="play" />
        </span>
      </Link>
    </aside>
  );
}

function fold(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

export function TopBar() {
  const path = usePathname();
  const { isDone } = useProgress();
  const { user, profile } = useAuth();
  const name = profile?.display_name || (user ? (user.email ?? "").split("@")[0] : "Creator");
  const [greeting, setGreeting] = useState("Xin chào");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối");
  }, []);

  useEffect(() => {
    setQ("");
    setOpen(false);
  }, [path]);

  const results = useMemo(() => {
    const k = fold(q.trim());
    if (!k) return [];
    return flatLessons.filter((l) => fold(`${l.title} ${l.module.title} ${l.module.tag}`).includes(k)).slice(0, 6);
  }, [q]);

  const done = flatLessons.filter((l) => isDone(l.id)).length;

  return (
    <div className="topbar">
      <p className="greeting">
        {greeting}, <b>{name}</b>
      </p>
      <div
        className="search"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <Icon name="search" />
        <label className="sr-only" htmlFor="lesson-search">
          Tìm bài học
        </label>
        <input
          id="lesson-search"
          type="search"
          placeholder="Tìm bài học"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        />
        {open && q.trim() && (
          <ul className="search-results">
            {results.length === 0 && <li className="empty">Không có bài nào khớp. Thử từ khóa khác.</li>}
            {results.map((l) => (
              <li key={l.id}>
                <Link href={l.href}>
                  {l.title}
                  <small>
                    {l.module.tag} · {l.module.title}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link className="chip" href="/hoc-tap">
        <i aria-hidden="true" />
        {done}/{flatLessons.length} bài
      </Link>
    </div>
  );
}
