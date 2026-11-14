# Bật tài khoản học viên

Khi bật tài khoản, học viên có thêm:

- Đăng nhập bằng email và mật khẩu.
- Tiến độ bài học và dữ liệu các công cụ (kịch bản, storyboard, thư viện prompt, điểm tự chấm, checklist) được lưu vào tài khoản và đồng bộ giữa các máy.
- Nộp đầu ra từng tuần ở trang module.
- Trang portfolio công khai tại `/p/<tên-trang>`, mỗi sản phẩm có case study 7 phần.

Khi chưa bật, web chạy như cũ: dữ liệu chỉ lưu trên trình duyệt.

Cần khoảng 15 phút. Gói miễn phí của Supabase đủ cho giai đoạn đầu.

## 1. Tạo dự án Supabase

1. Vào supabase.com, đăng nhập (có thể dùng tài khoản GitHub).
2. Bấm **New project**. Đặt tên, ví dụ `ai-creator-course`. Đặt mật khẩu cơ sở dữ liệu và cất ở nơi an toàn. Chọn vùng gần học viên, ví dụ Singapore.
3. Đợi dự án khởi tạo xong.

## 2. Tạo bảng dữ liệu

1. Trong dự án, mở **SQL Editor**, bấm **New query**.
2. Mở tệp `supabase/schema.sql` trong kho mã, sao chép toàn bộ, dán vào và bấm **Run**.
3. Thấy dòng báo thành công là xong. Chạy lại tệp này lần nữa cũng không sao.

Tệp này tạo 4 bảng (hồ sơ, dữ liệu học tập, bài nộp, portfolio) và bật bảo mật theo dòng: mỗi người chỉ đọc và sửa được dữ liệu của mình; khách chỉ xem được hồ sơ có tên trang và các sản phẩm portfolio đã bật công khai.

## 3. Khai báo địa chỉ web

Mở **Authentication → URL Configuration**:

- **Site URL**: địa chỉ web của bạn trên Vercel, ví dụ `https://ai-creator-course.vercel.app`.
- **Redirect URLs**: thêm `https://ai-creator-course.vercel.app/tai-khoan` (thay bằng địa chỉ của bạn). Đây là trang mở ra khi học viên bấm vào thư xác nhận email hoặc thư đặt lại mật khẩu.

## 4. Lấy hai giá trị kết nối

Mở **Project Settings → API** (tên mục có thể đổi theo phiên bản, tìm mục có **Project URL** và khóa **anon public**). Sao chép:

- **Project URL**
- Khóa **anon public**

Khóa anon được thiết kế để nằm trong mã phía trình duyệt; dữ liệu được bảo vệ bởi quy tắc bảo mật theo dòng ở bước 2. **Không bao giờ** dùng khóa `service_role` cho web này.

## 5. Đưa vào Vercel

1. Mở dự án trên vercel.com → **Settings → Environment Variables**.
2. Thêm hai biến, áp dụng cho Production (và Preview nếu muốn):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = khóa anon public
3. Vào **Deployments**, bấm **Redeploy** bản mới nhất để web nhận biến mới.

Sau khi triển khai lại, thanh điều hướng có thêm biểu tượng **Tài khoản**.

## 6. Thử

1. Mở web, bấm biểu tượng Tài khoản → **Tạo tài khoản**.
2. Mở thư xác nhận trong hộp thư, bấm liên kết.
3. Đăng nhập, đặt tên trang ở mục Hồ sơ, thêm một sản phẩm ở **Quản lý portfolio**, bật **Công khai**, rồi mở `/p/<tên-trang>` ở cửa sổ ẩn danh.

## Lưu ý

- **Thư xác nhận:** máy chủ thư có sẵn của Supabase giới hạn số thư gửi mỗi giờ khá thấp và chỉ hợp để thử. Khi có nhiều học viên, hãy cấu hình máy chủ thư riêng ở **Authentication → Emails → SMTP Settings**. Nếu không muốn học viên xác nhận email, có thể tắt **Confirm email** trong **Authentication → Sign In / Providers → Email**.
- **Dữ liệu công khai:** tên hiển thị, dòng định vị, giới thiệu và cách liên hệ trong hồ sơ đều hiện công khai khi học viên đã đặt tên trang.
- **Đăng xuất** xóa dữ liệu học tập khỏi trình duyệt đó (dữ liệu vẫn còn trong tài khoản), để an toàn trên máy dùng chung.
- **Video portfolio:** YouTube được nhúng thẳng vào trang. TikTok, Google Drive và các nơi khác hiện thành nút mở trang gốc.

## Chạy thử trên máy

Tạo tệp `.env.local` ở thư mục gốc (tệp này không được đưa lên kho):

```bash
cp .env.example .env.local
```

Điền hai giá trị ở bước 4 rồi chạy `npm run dev`.

Bộ kiểm thử tự động cho phần tài khoản nằm ở `scripts/test-accounts/`.
