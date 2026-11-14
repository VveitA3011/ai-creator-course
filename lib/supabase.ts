import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Tài khoản chỉ bật khi đã khai báo hai biến môi trường này (xem docs/thiet-lap-tai-khoan.md).
// Khi chưa khai báo, web chạy như cũ: dữ liệu chỉ lưu trên trình duyệt.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const accountsEnabled = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!accountsEnabled) throw new Error("Tài khoản chưa được bật");
  if (!client) client = createClient(url, anonKey, { auth: { persistSession: true, detectSessionInUrl: true } });
  return client;
}

export type Profile = {
  id: string;
  handle: string | null;
  display_name: string;
  headline: string;
  bio: string;
  contact: string;
};

export type PortfolioItem = {
  id: string;
  user_id: string;
  title: string;
  category: "commercial" | "storytelling" | "social" | "process";
  video_url: string;
  brief: string;
  direction: string;
  script: string;
  storyboard: string;
  workflow: string;
  notes: string;
  is_spec: boolean;
  is_public: boolean;
  sort: number;
};

export type Submission = { id: string; module_slug: string; url: string; note: string; created_at: string };

/* Đổi lỗi kỹ thuật thành câu người học hiểu được */
export function friendlyError(e: unknown): string {
  const msg = typeof e === "object" && e && "message" in e ? String((e as { message: string }).message) : String(e);
  const code = typeof e === "object" && e && "code" in e ? String((e as { code: string }).code) : "";
  if (code === "23505" || /duplicate key/i.test(msg)) return "Tên này đã có người dùng. Hãy chọn tên khác.";
  if (/handle_check/.test(msg)) return "Tên trang chỉ gồm chữ thường không dấu, số và dấu gạch ngang, dài 3–30 ký tự.";
  if (/Invalid login credentials/i.test(msg)) return "Email hoặc mật khẩu chưa đúng.";
  if (/Email not confirmed/i.test(msg)) return "Email chưa được xác nhận. Hãy mở thư xác nhận trong hộp thư của bạn.";
  if (/User already registered/i.test(msg)) return "Email này đã có tài khoản. Hãy chuyển sang Đăng nhập.";
  if (/Password should be at least/i.test(msg)) return "Mật khẩu cần ít nhất 6 ký tự.";
  if (/rate limit/i.test(msg)) return "Bạn thao tác quá nhanh. Đợi một phút rồi thử lại.";
  if (/Failed to fetch|NetworkError|network/i.test(msg)) return "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.";
  return msg || "Có lỗi xảy ra. Hãy thử lại.";
}
