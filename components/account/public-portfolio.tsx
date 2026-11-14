"use client";

import { useEffect, useState } from "react";
import { accountsEnabled, supabase, type PortfolioItem, type Profile } from "@/lib/supabase";
import { AccountsOff } from "./common";
import { caseFields, categories } from "./portfolio-editor";
import { VideoBox } from "./video";

type State = { status: "loading" } | { status: "missing" } | { status: "error" } | { status: "ok"; profile: Profile; items: PortfolioItem[] };

export function PublicPortfolio({ handle }: { handle: string }) {
  const [s, setS] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!accountsEnabled) return;
    (async () => {
      const db = supabase();
      const { data: profile, error } = await db.from("profiles").select("*").eq("handle", handle).maybeSingle();
      if (error) return setS({ status: "error" });
      if (!profile) return setS({ status: "missing" });
      const { data: items, error: itemsError } = await db
        .from("portfolio_items")
        .select("*")
        .eq("user_id", profile.id)
        .eq("is_public", true)
        .order("sort", { ascending: true })
        .order("created_at", { ascending: true });
      if (itemsError) return setS({ status: "error" });
      setS({ status: "ok", profile: profile as Profile, items: (items as PortfolioItem[]) ?? [] });
    })();
  }, [handle]);

  if (!accountsEnabled) return <AccountsOff />;
  if (s.status === "loading")
    return (
      <div className="tool-panel" aria-busy="true">
        <p className="muted">Đang tải portfolio…</p>
      </div>
    );
  if (s.status === "missing" || s.status === "error")
    return (
      <div className="tool-panel stack">
        <h1 className="tool-h">{s.status === "missing" ? "Không tìm thấy portfolio" : "Không tải được portfolio"}</h1>
        <p className="muted">
          {s.status === "missing" ? `Chưa có ai dùng tên trang “${handle}”. Kiểm tra lại đường dẫn.` : "Kiểm tra kết nối mạng rồi tải lại trang."}
        </p>
      </div>
    );

  const { profile, items } = s;
  const groups = (Object.keys(categories) as PortfolioItem["category"][]).filter((c) => items.some((i) => i.category === c));

  return (
    <div className="stack-lg pf-public">
      <header className="pf-hero rise">
        <span className="mono">Portfolio</span>
        <h1>{profile.display_name || profile.handle}</h1>
        {profile.headline && <p className="pf-headline">{profile.headline}</p>}
        {profile.bio && <p className="pf-bio">{profile.bio}</p>}
        {profile.contact && (
          <p className="pf-contact">
            <span className="mono">Liên hệ</span> <span className="selectable">{profile.contact}</span>
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <div className="tool-panel">
          <p className="muted">Chưa có sản phẩm công khai.</p>
        </div>
      ) : (
        groups.map((c) => (
          <section key={c} className="stack">
            <h2>{categories[c]}</h2>
            <div className="pf-grid">
              {items
                .filter((i) => i.category === c)
                .map((it) => (
                  <article key={it.id} className="pf-card">
                    <VideoBox url={it.video_url} title={it.title} />
                    <div className="stack" style={{ gap: 10 }}>
                      <div className="pill-row">
                        {it.is_spec && <span className="pill cream">Self-initiated project</span>}
                        <span className="pill">{categories[it.category]}</span>
                      </div>
                      <h3>{it.title}</h3>
                      {caseFields
                        .filter((f) => String(it[f.key] ?? "").trim())
                        .map((f, n) => (
                          <details key={f.key} className="pf-case" open={n === 0}>
                            <summary>{f.label}</summary>
                            <p>{String(it[f.key])}</p>
                          </details>
                        ))}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
