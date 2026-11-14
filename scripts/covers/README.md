# Dựng ảnh bìa bài học

Ảnh bìa trong `public/images/` được dựng bằng three.js: mỗi bài một cảnh 3D trong `scenes.js`, ghép từ các đạo cụ trong `kit.js`.

## Dựng lại ảnh

Cần Node và Playwright có sẵn Chromium.

```bash
cd scripts/covers && npm install
```

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Ở một cửa sổ dòng lệnh khác, dựng một hoặc nhiều bài (dạng `module/bài`):

```bash
node shoot.js ../../public/images tuan-1/hook-3-giay-dau tuan-2/storyboard
```

## Thêm bài mới

Thêm một hàm vào `scenes` trong `scenes.js` với khóa là slug của bài, rồi chạy lệnh dựng cho bài đó. Chủ thể tự được đặt vào nửa phải khung hình vì tiêu đề bài nằm đè lên nửa trái.

## Thay bằng ảnh khác

Muốn dùng ảnh tạo bằng AI thay cho ảnh 3D, xem prompt từng bài ở `docs/prompt-anh-minh-hoa.md` và ghi đè tệp cùng tên trong `public/images/`.
