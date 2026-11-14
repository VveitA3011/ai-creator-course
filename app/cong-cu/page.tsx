import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Sticker } from "@/components/marquee";
import { tools } from "@/lib/tools";

export const metadata: Metadata = { title: "Công cụ" };

export default function ToolsIndex() {
  return (
    <div className="stack-lg">
      <header className="stack rise page-head">
        <Sticker tone="yellow" tilt={7} className="head-sticker">
          Tự lưu
        </Sticker>
        <span className="mono">Công cụ thực hành · {tools.length} công cụ</span>
        <h1>Làm bài tập ngay trên web</h1>
        <p className="lead">
          Mỗi công cụ lấy một khung có sẵn trong bài học và cho bạn điền, lưu, sao chép ra. Dữ liệu tự lưu trên trình duyệt này.
        </p>
      </header>
      <div className="tool-grid">
        {tools.map((t, i) => (
          <Link key={t.slug} href={`/cong-cu/${t.slug}`} className={`tool-card t-${t.tone} rise`} style={{ "--i": i } as React.CSSProperties}>
            <span className="tool-no">{String(i + 1).padStart(2, "0")}</span>
            <h2>{t.name}</h2>
            <p>{t.summary}</p>
            <span className="tool-go">
              Mở công cụ <Icon name="chevron" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
