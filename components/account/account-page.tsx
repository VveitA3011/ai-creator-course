"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
import { friendlyError, supabase } from "@/lib/supabase";
import { Notice, RequireAccount, timeAgo } from "./common";

const HANDLE_RE = /^[a-z0-9-]{3,30}$/;

export function AccountPage() {
  return (
    <div className="stack" style={{ maxWidth: 820 }}>
      <header className="stack rise">
        <span className="mono">Tài khoản</span>
        <h1>Hồ sơ và đồng bộ</h1>
      </header>
      <RequireAccount what="quản lý hồ sơ và đồng bộ dữ liệu học tập">
        <AccountInner />
      </RequireAccount>
    </div>
  );
}

function AccountInner() {
  const { user, profile, sync, syncNow, reloadProfile, signOut, recovering } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ handle: "", display_name: "", headline: "", bio: "", contact: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    if (profile)
      setForm({
        handle: profile.handle ?? "",
        display_name: profile.display_name,
        headline: profile.headline,
        bio: profile.bio,
        contact: profile.contact,
      });
  }, [profile]);

  const handleOk = form.handle === "" || HANDLE_RE.test(form.handle);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!handleOk) {
      setMsg({ kind: "error", text: "Tên trang chỉ gồm chữ thường không dấu, số và dấu gạch ngang, dài 3–30 ký tự." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const row = { id: user.id, ...form, handle: form.handle || null };
    const { error } = await supabase().from("profiles").upsert(row, { onConflict: "id" });
    setBusy(false);
    if (error) return setMsg({ kind: "error", text: friendlyError(error) });
    await reloadProfile();
    setMsg({ kind: "ok", text: "Đã lưu hồ sơ." });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: k === "handle" ? e.target.value.toLowerCase().trim() : e.target.value });

  return (
    <>
      {recovering && <NewPassword />}

      <section className="tool-panel stack">
        <div className="row-between">
          <div>
            <h2 className="tool-h">Đồng bộ dữ liệu học tập</h2>
            <p className="muted small">Tiến độ bài học, kịch bản, storyboard, thư viện prompt và điểm tự chấm được lưu vào tài khoản.</p>
          </div>
          <span className={`sync-pill ${sync.state}`} aria-live="polite">
            {sync.state === "syncing" ? "Đang đồng bộ…" : sync.state === "error" ? "Lỗi đồng bộ" : `Đã đồng bộ ${timeAgo(sync.lastSync)}`}
          </span>
        </div>
        {sync.state === "error" && <Notice kind="error">Chưa đồng bộ được: {friendlyError(sync.error)}. Dữ liệu vẫn an toàn trên trình duyệt này.</Notice>}
        <div className="btn-row">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => syncNow()} disabled={sync.state === "syncing"}>
            Đồng bộ ngay
          </button>
        </div>
      </section>

      <form className="tool-panel stack" onSubmit={save}>
        <h2 className="tool-h">Hồ sơ công khai</h2>
        <p className="muted small">Tên hiển thị, dòng định vị, giới thiệu và cách liên hệ hiện trên trang portfolio công khai của bạn.</p>
        <div className="form-grid">
          <label className="field">
            <span className="mono">Tên trang (đường dẫn portfolio)</span>
            <input id="pf-handle" value={form.handle} onChange={set("handle")} placeholder="vi-du-ten-ban" aria-invalid={!handleOk} />
            <small className={handleOk ? "muted" : "field-err"}>
              {form.handle ? `Trang của bạn: /p/${form.handle}` : "Chữ thường không dấu, số, dấu gạch ngang. 3–30 ký tự."}
            </small>
          </label>
          <label className="field">
            <span className="mono">Tên hiển thị</span>
            <input id="pf-name" value={form.display_name} onChange={set("display_name")} maxLength={80} />
          </label>
          <label className="field span-2">
            <span className="mono">Dòng định vị</span>
            <input
              id="pf-headline"
              value={form.headline}
              onChange={set("headline")}
              maxLength={160}
              placeholder="AI Short-form Video Creator · AI Scriptwriting · Storytelling · AI Video Production"
            />
          </label>
          <label className="field span-2">
            <span className="mono">Giới thiệu</span>
            <textarea id="pf-bio" rows={4} value={form.bio} onChange={set("bio")} maxLength={1200} />
          </label>
          <label className="field span-2">
            <span className="mono">Cách liên hệ (hiện công khai)</span>
            <input id="pf-contact" value={form.contact} onChange={set("contact")} maxLength={200} placeholder="Email công việc hoặc đường dẫn LinkedIn" />
          </label>
        </div>
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <div className="btn-row">
          <button type="submit" className="btn btn-sm" disabled={busy}>
            {busy ? "Đang lưu…" : "Lưu hồ sơ"}
          </button>
          <Link className="btn btn-ghost btn-sm" href="/portfolio">
            Quản lý portfolio
          </Link>
          {profile?.handle && (
            <Link className="btn btn-ghost btn-sm" href={`/p/${profile.handle}`}>
              Xem trang công khai
            </Link>
          )}
        </div>
      </form>

      <section className="tool-panel row-between">
        <p className="muted small">
          Đang đăng nhập bằng <b>{user?.email}</b>. Đăng xuất sẽ xóa dữ liệu học tập khỏi trình duyệt này; dữ liệu vẫn còn trong tài khoản.
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          Đăng xuất
        </button>
      </section>
    </>
  );
}

function NewPassword() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  return (
    <form
      className="tool-panel stack"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await supabase().auth.updateUser({ password: pw });
        setMsg(error ? { kind: "error", text: friendlyError(error) } : { kind: "ok", text: "Đã đổi mật khẩu." });
      }}
    >
      <h2 className="tool-h">Đặt mật khẩu mới</h2>
      <label className="field">
        <span className="mono">Mật khẩu mới (ít nhất 6 ký tự)</span>
        <input id="new-pw" type="password" autoComplete="new-password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} />
      </label>
      {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
      <button type="submit" className="btn btn-sm">
        Lưu mật khẩu mới
      </button>
    </form>
  );
}
