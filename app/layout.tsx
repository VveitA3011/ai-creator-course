import type { Metadata, Viewport } from "next";
import { Rail, TopBar } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AI Creator · Khóa học AI Short-form Video", template: "%s · AI Creator" },
  description:
    "Lộ trình 8 tuần thực chiến để trở thành AI Short-form Video Creator: từ kịch bản, storyboard đến video AI hoàn chỉnh và portfolio.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#4b1b22" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Bỏ qua điều hướng
        </a>
        <div className="shell">
          <Rail />
          <div className="stage">
            <TopBar />
            <main id="main">{children}</main>
            <footer className="site-footer">
              Nội dung mang tính hướng dẫn nghề nghiệp. Các con số về thị trường, giá dịch vụ và thu nhập là nhận định
              tham khảo, không phải cam kết kết quả.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
