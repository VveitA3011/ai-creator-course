"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
import { DeleteButton } from "@/components/tools/common";
import { friendlyError, supabase, type Submission } from "@/lib/supabase";
import { Notice } from "./common";

/* Nộp đầu ra của một tuần. Chỉ hiện khi web đã bật tài khoản. */
export function Submissions({ moduleSlug, output }: { moduleSlug: string; output: string }) {
  const { enabled, user, loading } = useAuth();
  const [list, setList] = useState<Submission[]>([]);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase()
      .from("submissions")
      .select("id, module_slug, url, note, created_at")
      .eq("user_id", user.id)
      .eq("module_slug", moduleSlug)
      .order("created_at", { ascending: false });
    setList((data as Submission[]) ?? []);
  }, [user, moduleSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (!enabled || loading) return null;

  if (!user)
    return (
      <section className="tool-panel stack">
        <h2 className="tool-h">Nộp đầu ra</h2>
        <p className="muted small">
          <Link href="/dang-nhap">Đăng nhập</Link> để lưu đường dẫn tới sản phẩm của tuần này và xem lại các lần nộp.
        </p>
      </section>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !note.trim()) return setMsg({ kind: "error", text: "Thêm đường dẫn tới sản phẩm hoặc một ghi chú trước khi nộp." });
    setBusy(true);
    setMsg(null);
    const { error } = await supabase().from("submissions").insert({ user_id: user.id, module_slug: moduleSlug, url: url.trim(), note: note.trim() });
    setBusy(false);
    if (error) return setMsg({ kind: "error", text: friendlyError(error) });
    setUrl("");
    setNote("");
    setMsg({ kind: "ok", text: "Đã nộp." });
    load();
  };

  return (
    <section className="tool-panel stack">
      <h2 className="tool-h">Nộp đầu ra</h2>
      <p className="muted small">
        <b>Cần có:</b> {output}. Dán đường dẫn tới thư mục hoặc video (Google Drive, YouTube, Notion…), kèm ghi chú nếu cần.
      </p>
      <form className="form-grid" onSubmit={submit}>
        <label className="field span-2">
          <span className="mono">Đường dẫn</span>
          <input id={`sub-url-${moduleSlug}`} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" maxLength={500} />
        </label>
        <label className="field span-2">
          <span className="mono">Ghi chú</span>
          <textarea id={`sub-note-${moduleSlug}`} rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
        </label>
        <div className="btn-row span-2">
          <button type="submit" className="btn btn-sm" disabled={busy}>
            {busy ? "Đang nộp…" : "Nộp"}
          </button>
          {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        </div>
      </form>
      {list.length > 0 && (
        <ul className="sub-list">
          {list.map((s) => (
            <li key={s.id}>
              <div className="pf-main">
                <span className="mono">{new Date(s.created_at).toLocaleString("vi-VN")}</span>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.url}
                  </a>
                )}
                {s.note && <span className="muted small">{s.note}</span>}
              </div>
              <DeleteButton
                onDelete={async () => {
                  await supabase().from("submissions").delete().eq("id", s.id);
                  load();
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
