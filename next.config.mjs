// Nhận địa chỉ và khóa Supabase dưới nhiều tên biến, vì giao diện Vercel đôi khi không cho đặt tên
// bắt đầu bằng NEXT_PUBLIC_. Giá trị được gắn vào mã phía trình duyệt lúc build.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.ANON_KEY || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl.trim(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey.trim(),
  },
};

export default nextConfig;
