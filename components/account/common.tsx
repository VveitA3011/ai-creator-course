"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth";

/* Hiện nội dung khi đã đăng nhập; còn lại hiện lời mời đăng nhập hoặc thông báo chưa bật */
export function RequireAccount({ children, what }: { children: ReactNode; what: string }) {
  const { enabled, loading, user } = useAuth();
  if (!enabled) return <AccountsOff />;
  if (loading)
    return (
      <div className="tool-panel" aria-busy="true">
        <p className="muted">Đang tải tài khoản…</p>
      </div>
    );
  if (!user)
    return (
      <div className="tool-panel stack">
        <h2 className="tool-h">Cần đăng nhập</h2>
        <p className="muted">Đăng nhập để {what}.</p>
        <Link className="btn btn-sm" href="/dang-nhap">
          Đăng nhập hoặc tạo tài khoản
        </Link>
      </div>
    );
  return <>{children}</>;
}

export function AccountsOff() {
  return (
    <div className="tool-panel stack">
      <h2 className="tool-h">Tính năng tài khoản chưa được bật</h2>
      <p className="muted">
        Bạn vẫn học và dùng công cụ bình thường; dữ liệu được lưu trên trình duyệt này. Người quản trị web có thể bật tài khoản theo hướng dẫn
        trong <code>docs/thiet-lap-tai-khoan.md</code>.
      </p>
    </div>
  );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "error" | "ok"; children: ReactNode }) {
  return (
    <p className={`notice ${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}

export function timeAgo(iso: string | null) {
  if (!iso) return "chưa đồng bộ";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "vừa xong";
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}
