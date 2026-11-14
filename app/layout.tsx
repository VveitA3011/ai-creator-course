import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth";
import { Marquee } from "@/components/marquee";
import { Rail, TopBar } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AI Creator · Khóa học AI Short-form Video", template: "%s · AI Creator" },
  description:
    "Lộ trình 8 tuần thực chiến để trở thành AI Short-form Video Creator: từ kịch bản, storyboard đến video AI hoàn chỉnh và portfolio.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f5f5dc" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Bỏ qua điều hướng
        </a>
        <AuthProvider>
        <div className="shell">
          <Rail />
          <div className="stage">
            <TopBar />
            <main id="main">{children}</main>
            <Marquee tone="yellow" reverse items={["Học", "Làm", "Nộp", "Sửa", "Đưa vào portfolio", "Nhận job"]} />
            <footer className="site-footer">
              Nội dung mang tính hướng dẫn nghề nghiệp. Các con số về thị trường, giá dịch vụ và thu nhập là nhận định
              tham khảo, không phải cam kết kết quả.
            </footer>
          </div>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
