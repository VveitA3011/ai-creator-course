# Kiểm thử phần tài khoản

Không cần tài khoản Supabase thật. Cơ sở dữ liệu chạy bằng PGlite (Postgres trong bộ nhớ) với đúng tệp `supabase/schema.sql`. Phần đăng nhập được mô phỏng tối giản.

```bash
cd scripts/test-accounts && npm install
```

## 1. Quy tắc bảo mật của cơ sở dữ liệu

```bash
node rls.test.mjs ../../supabase/schema.sql
```

Kiểm tra: người khác không đọc hay sửa được dữ liệu riêng, khách chỉ thấy sản phẩm công khai, ràng buộc tên trang và nhóm sản phẩm.

## 2. Luồng trên trình duyệt

Cần Playwright có sẵn Chromium. Mở ba cửa sổ dòng lệnh:

```bash
node mock-supabase.mjs ../../supabase/schema.sql
```

```bash
cd ../.. && NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-test npx next build && npx next start -p 3214
```

```bash
node accounts.test.js
```

Kịch bản đóng vai hai học viên trên ba trình duyệt: học khi chưa đăng nhập, tạo tài khoản (dữ liệu cũ được chuyển vào), hồ sơ, portfolio, nộp đầu ra, đăng xuất, đồng bộ sang máy thứ hai, bỏ đánh dấu bài và kiểm tra máy kia nhận đúng. Kết quả cuối phải là `FAILS 0`.

Mỗi lần chạy lại cần khởi động lại `mock-supabase.mjs` để có cơ sở dữ liệu trống.
