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
