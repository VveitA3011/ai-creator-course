# AI Creator · Web khóa học AI Short-form Video

Website khóa học lộ trình 8 tuần, xây bằng Next.js. Bài học là tệp MDX trong thư mục `content/`.

## Chạy trên máy

```bash
npm install
```

```bash
npm run dev
```

Mở http://localhost:3000.

## Cấu trúc

- `lib/curriculum.ts`: danh sách module và bài học, quyết định thứ tự học.
- `content/<module>/<bài>.mdx`: nội dung từng bài. Dùng được các thành phần `Beats`, `Beat`, `Exercise`, `Output`, `Note`.
- `app/`: các trang (trang chủ, lộ trình, module, bài học, học tập).
- `components/progress-ui.tsx`: tiến độ học, lưu trên trình duyệt của học viên.

## Thêm một bài học

1. Thêm một dòng vào mảng `lessons` của module trong `lib/curriculum.ts`.
2. Tạo tệp `content/<module>/<slug>.mdx` trùng với `slug` vừa khai báo.

## Ảnh bìa bài học

Cả 63 bài đã có ảnh bìa 3D trong `public/images/<module>/<slug>.jpg`, dựng bằng bộ công cụ ở `scripts/covers/`. Trang bài học tự hiện ảnh ở banner. Muốn thay bằng ảnh tạo bằng AI, dùng prompt ở `docs/prompt-anh-minh-hoa.md` và ghi đè tệp cùng tên.

## Tài khoản học viên (tùy chọn)

Đăng nhập, đồng bộ tiến độ và dữ liệu công cụ giữa các máy, nộp đầu ra từng tuần, trang portfolio công khai tại `/p/<tên-trang>`. Dùng Supabase; chỉ bật khi khai báo `SUPABASE_URL` và `ANON_KEY` (hoặc `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Hướng dẫn từng bước: `docs/thiet-lap-tai-khoan.md`. Cơ sở dữ liệu: `supabase/schema.sql`. Kiểm thử: `scripts/test-accounts/`.
