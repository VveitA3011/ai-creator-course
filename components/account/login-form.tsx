"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth";
import { friendlyError, supabase } from "@/lib/supabase";
import { AccountsOff, Notice } from "./common";

type Mode = "login" | "signup" | "forgot";

export function LoginForm() {
  const { enabled, user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/tai-khoan");
  }, [loading, user, router]);

  if (!enabled)
    return (
      <div className="auth-wrap">
        <AccountsOff />
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const auth = supabase().auth;
    try {
      if (mode === "login") {
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/tai-khoan` } });
        if (error) throw error;
        if (!data.session) setMsg({ kind: "ok", text: "Đã tạo tài khoản. Mở thư xác nhận vừa gửi tới email của bạn rồi quay lại đăng nhập." });
      } else {
        const { error } = await auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/tai-khoan` });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Nếu email này có tài khoản, thư đặt lại mật khẩu đã được gửi. Mở thư và làm theo hướng dẫn." });
      }
    } catch (err) {
      setMsg({ kind: "error", text: friendlyError(err) });
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Mode, string> = { login: "Đăng nhập", signup: "Tạo tài khoản", forgot: "Quên mật khẩu" };

  return (
    <div className="auth-wrap">
      <form className="auth-card rise" onSubmit={submit}>
        <span className="mono">Tài khoản học viên</span>
        <h1>{titles[mode]}</h1>
        <p className="muted small">
          Có tài khoản, tiến độ học và dữ liệu các công cụ được lưu lại để học tiếp trên máy khác. Bạn cũng tạo được trang portfolio công khai.
        </p>
        {mode !== "forgot" && (
          <div className="seg-picker" role="tablist" aria-label="Chọn đăng nhập hoặc tạo tài khoản">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                className={mode === m ? "is-on" : undefined}
                onClick={() => {
                  setMode(m);
                  setMsg(null);
                }}
              >
                {titles[m]}
              </button>
            ))}
          </div>
        )}
        <label className="field">
          <span className="mono">Email</span>
          <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== "forgot" && (
          <label className="field">
            <span className="mono">Mật khẩu{mode === "signup" ? " (ít nhất 6 ký tự)" : ""}</span>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Đang xử lý…" : mode === "forgot" ? "Gửi thư đặt lại mật khẩu" : titles[mode]}
        </button>
        <div className="row-between small">
          {mode === "forgot" ? (
            <button type="button" className="linklike" onClick={() => setMode("login")}>
              ← Quay lại đăng nhập
            </button>
          ) : (
            <button type="button" className="linklike" onClick={() => setMode("forgot")}>
              Quên mật khẩu?
            </button>
          )}
          <Link href="/hoc-tap" className="muted">
            Học tiếp không cần tài khoản
          </Link>
        </div>
        {mode === "signup" && (
          <p className="muted small">
            Dữ liệu bạn đã làm trên trình duyệt này sẽ được chuyển vào tài khoản mới. Khi đăng xuất, dữ liệu được xóa khỏi trình duyệt và vẫn còn
            trong tài khoản.
          </p>
        )}
      </form>
    </div>
  );
}
