"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
import { DeleteButton } from "@/components/tools/common";
import { friendlyError, supabase, type PortfolioItem } from "@/lib/supabase";
import { Notice, RequireAccount } from "./common";
import { VideoBox } from "./video";

export const categories: Record<PortfolioItem["category"], string> = {
  commercial: "Commercial Video",
  storytelling: "Storytelling",
  social: "Social Media Content",
  process: "Production Process",
};

export const caseFields: { key: keyof PortfolioItem; label: string; hint: string }[] = [
  { key: "brief", label: "Project Brief", hint: "Mục tiêu, sản phẩm và khách hàng mục tiêu." },
  { key: "direction", label: "Creative Direction", hint: "Concept, insight, thông điệp và phong cách hình ảnh." },
  { key: "script", label: "Script", hint: "Kịch bản hoàn chỉnh và phân chia thời lượng từng cảnh." },
  { key: "storyboard", label: "Storyboard", hint: "Mô tả hoặc dán bảng storyboard từng shot." },
  { key: "workflow", label: "AI Workflow", hint: "Prompt, công cụ sử dụng, ảnh tham chiếu và quá trình tạo video." },
  { key: "notes", label: "Production Notes", hint: "Khó khăn đã xử lý, thời gian hoàn thành và số vòng chỉnh sửa." },
];

type Draft = Omit<PortfolioItem, "id" | "user_id" | "sort">;
const blank: Draft = {
  title: "",
  category: "commercial",
  video_url: "",
  brief: "",
  direction: "",
  script: "",
  storyboard: "",
  workflow: "",
  notes: "",
  is_spec: true,
  is_public: false,
};

export function PortfolioEditor() {
  return (
    <div className="stack" style={{ maxWidth: 980 }}>
      <header className="stack rise">
        <span className="mono">Tuần 7 · Hoàn thiện Portfolio</span>
        <h1>Portfolio của tôi</h1>
        <p className="lead">Mỗi sản phẩm là một case study bảy phần. Bật “Công khai” để sản phẩm hiện trên trang portfolio của bạn.</p>
      </header>
      <RequireAccount what="tạo và chia sẻ portfolio">
        <EditorInner />
      </RequireAccount>
    </div>
  );
}

function EditorInner() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(blank);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase()
      .from("portfolio_items")
      .select("*")
      .eq("user_id", user.id)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) setMsg({ kind: "error", text: friendlyError(error) });
    setItems((data as PortfolioItem[]) ?? []);
    setLoaded(true);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const open = (it?: PortfolioItem) => {
    setMsg(null);
    if (it) {
      const { id: _id, user_id: _u, sort: _s, ...rest } = it;
      setDraft({ ...blank, ...rest });
      setEditing(it.id);
    } else {
      setDraft(blank);
      setEditing("new");
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!draft.title.trim()) return setMsg({ kind: "error", text: "Hãy đặt tên cho sản phẩm." });
    setBusy(true);
    const db = supabase().from("portfolio_items");
    const row = { ...draft, title: draft.title.trim() };
    const { error } =
      editing === "new"
        ? await db.insert({ ...row, user_id: user.id, sort: items.length })
        : await db.update(row).eq("id", editing as string);
    setBusy(false);
    if (error) return setMsg({ kind: "error", text: friendlyError(error) });
    setEditing(null);
    setMsg({ kind: "ok", text: "Đã lưu sản phẩm." });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase().from("portfolio_items").delete().eq("id", id);
    if (error) return setMsg({ kind: "error", text: friendlyError(error) });
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    // Mỗi lệnh cập nhật cần một truy vấn mới: bộ lọc của Supabase cộng dồn nếu dùng chung một đối tượng.
    const results = await Promise.all(
      next.map((it, k) => (it.sort === k ? null : supabase().from("portfolio_items").update({ sort: k }).eq("id", it.id))),
    );
    const failed = results.find((r) => r?.error);
    if (failed?.error) setMsg({ kind: "error", text: friendlyError(failed.error) });
    load();
  };

  const togglePublic = async (it: PortfolioItem) => {
    const { error } = await supabase().from("portfolio_items").update({ is_public: !it.is_public }).eq("id", it.id);
    if (error) return setMsg({ kind: "error", text: friendlyError(error) });
    load();
  };

  const publicCount = items.filter((i) => i.is_public).length;

  if (editing)
    return (
      <form className="stack" onSubmit={save}>
        <div className="tool-panel stack">
          <h2 className="tool-h">{editing === "new" ? "Thêm sản phẩm" : "Sửa sản phẩm"}</h2>
          <div className="form-grid">
            <label className="field span-2">
              <span className="mono">Tên sản phẩm</span>
              <input id="pi-title" value={draft.title} maxLength={120} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </label>
            <label className="field">
              <span className="mono">Nhóm</span>
              <select id="pi-cat" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Draft["category"] })}>
                {Object.entries(categories).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="mono">Đường dẫn video</span>
              <input
                id="pi-video"
                value={draft.video_url}
                maxLength={500}
                placeholder="YouTube, TikTok, Google Drive hoặc tệp .mp4"
                onChange={(e) => setDraft({ ...draft, video_url: e.target.value })}
              />
            </label>
          </div>
          {draft.video_url && (
            <div className="video-preview">
              <VideoBox url={draft.video_url} title={draft.title || "Xem trước video"} />
              <p className="muted small">YouTube được nhúng thẳng vào trang. Video ở nơi khác hiện thành nút mở trang gốc.</p>
            </div>
          )}
        </div>

        <div className="tool-panel stack">
          <h2 className="tool-h">Case study</h2>
          {caseFields.map((f, i) => (
            <label key={f.key} className="field case-field">
              <span className="case-label">
                <span className="case-no">{i + 1}</span>
                <b>{f.label}</b>
                <span className="muted small">{f.hint}</span>
              </span>
              <textarea
                id={`pi-${f.key}`}
                rows={f.key === "script" || f.key === "storyboard" || f.key === "workflow" ? 5 : 3}
                value={String(draft[f.key as keyof Draft] ?? "")}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </label>
          ))}
          <p className="muted small">Phần thứ 7, Final Video, là video ở đường dẫn phía trên.</p>
        </div>

        <div className="tool-panel stack">
          <label className="check-row">
            <input type="checkbox" checked={draft.is_spec} onChange={(e) => setDraft({ ...draft, is_spec: e.target.checked })} />
            <span>
              <b>Dự án tự thực hiện (Self-initiated project / Spec work)</b>
              <span className="muted small">Giữ dấu này cho mọi dự án không làm cho khách hàng thật. Trang công khai sẽ ghi rõ nhãn này.</span>
            </span>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={draft.is_public} onChange={(e) => setDraft({ ...draft, is_public: e.target.checked })} />
            <span>
              <b>Công khai</b>
              <span className="muted small">Hiện sản phẩm này trên trang portfolio của bạn.</span>
            </span>
          </label>
          {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
          <div className="btn-row">
            <button type="submit" className="btn btn-sm" disabled={busy}>
              {busy ? "Đang lưu…" : "Lưu sản phẩm"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Hủy
            </button>
          </div>
        </div>
      </form>
    );

  return (
    <div className="stack">
      <div className="tool-panel row-between">
        <p className="muted small">
          {profile?.handle ? (
            <>
              Trang công khai: <Link href={`/p/${profile.handle}`}>/p/{profile.handle}</Link> · {publicCount} sản phẩm đang công khai
            </>
          ) : (
            <>
              Bạn chưa đặt tên trang. <Link href="/tai-khoan">Đặt tên trang ở mục Tài khoản</Link> để có đường dẫn portfolio công khai.
            </>
          )}
        </p>
        <button type="button" className="btn btn-sm" onClick={() => open()}>
          + Thêm sản phẩm
        </button>
      </div>
      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
      {!loaded ? (
        <p className="muted">Đang tải…</p>
      ) : items.length === 0 ? (
        <div className="tool-panel stack">
          <h2 className="tool-h">Chưa có sản phẩm nào</h2>
          <p className="muted">Bắt đầu với 2–3 video hoàn chỉnh tốt nhất của bạn, mỗi video kèm case study. Mục tiêu sau Tuần 7 là 5–6 sản phẩm.</p>
        </div>
      ) : (
        <ol className="pf-list">
          {items.map((it, i) => (
            <li key={it.id} className="pf-row">
              <span className="shot-no">{i + 1}</span>
              <div className="pf-main">
                <b>{it.title}</b>
                <span className="muted small">
                  {categories[it.category]}
                  {it.is_spec ? " · Spec work" : ""}
                  {it.video_url ? "" : " · chưa có video"}
                </span>
              </div>
              <button type="button" className={it.is_public ? "pill-toggle on" : "pill-toggle"} aria-pressed={it.is_public} onClick={() => togglePublic(it)}>
                {it.is_public ? "Công khai" : "Riêng tư"}
              </button>
              <div className="btn-row">
                <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Đưa ${it.title} lên`}>
                  ↑
                </button>
                <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Đưa ${it.title} xuống`}>
                  ↓
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => open(it)}>
                  Sửa
                </button>
                <DeleteButton onDelete={() => remove(it.id)} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
