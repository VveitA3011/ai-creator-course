import Link from "next/link";
import { Beat, Beats } from "@/components/mdx";
import { ModuleCard } from "@/components/module-card";
import { flatLessons, modules, pipeline } from "@/lib/curriculum";

export default function Home() {
  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="hero-copy">
          <span className="mono">Khóa học thực chiến · 8 tuần · 8–10 giờ mỗi tuần</span>
          <h1>Từ người viết content thành AI Short-form Video Creator</h1>
          <p className="lead">
            Học trọn quy trình làm video ngắn bằng AI cho TikTok, YouTube Shorts và Reels: nhận brief, viết kịch bản,
            dựng storyboard, tạo hình ảnh và video, lồng tiếng, hậu kỳ. Mỗi tuần kết thúc bằng một sản phẩm nộp được.
          </p>
          <div className="btn-row">
            <Link className="btn" href={flatLessons[0].href}>
              Học thử Module 0
            </Link>
            <Link className="btn btn-ghost" href="/lo-trinh">
              Xem lộ trình
            </Link>
          </div>
        </div>
        <div className="script-card">
          <span className="mono">Kịch bản mẫu · phim AI 60 giây</span>
          <h2>Một kịch bản dùng được trông như thế này</h2>
          <Beats>
            <Beat time="0–5s" label="Hook">
              Chú mèo già nằm dưới hiên nhà trong cơn mưa.
            </Beat>
            <Beat time="5–15s" label="Thiết lập">
              Hé lộ chiếc vòng cổ cũ và ký ức về người chủ.
            </Beat>
            <Beat time="15–35s" label="Phát triển">
              Chú mèo đi qua những nơi quen thuộc để tìm chủ.
            </Beat>
            <Beat time="35–50s" label="Cao trào">
              Một người bước xuống xe, trên tay là chiếc vòng giống hệt.
            </Beat>
            <Beat time="50–60s" label="Kết thúc">
              Hai người bạn đoàn tụ. Cảnh cận và lời dẫn kết.
            </Beat>
          </Beats>
        </div>
      </section>

      <section className="stack">
        <h2>Bạn học cả quy trình, không chỉ học viết prompt</h2>
        <p className="lead">
          Người làm chuyên nghiệp biến ý tưởng thành thứ mà đội sản xuất dùng được. Khóa học đi qua đủ sáu bước của một
          dự án thật.
        </p>
        <ol className="pipeline">
          {pipeline.map((p) => (
            <li key={p.step}>
              <b>{p.step}</b>
              {p.text}
            </li>
          ))}
        </ol>
      </section>

      <section className="stack">
        <h2>Lộ trình</h2>
        <div className="strip">
          {modules.map((m) => (
            <ModuleCard key={m.slug} module={m} />
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Học xong bạn cầm được gì</h2>
        <div className="outcomes">
          <div>
            <h3>5–6 video hoàn chỉnh</h3>
            <p>Quảng cáo sản phẩm, phim ngắn chân thực, hoạt hình, video kiến thức. Khung dọc 9:16, có lồng tiếng và phụ đề.</p>
          </div>
          <div>
            <h3>Một portfolio có quy trình</h3>
            <p>Mỗi video kèm case study: brief, định hướng sáng tạo, kịch bản, storyboard, cách làm và ghi chú sản xuất.</p>
          </div>
          <div>
            <h3>Ba gói dịch vụ để chào khách</h3>
            <p>Gói kịch bản, gói video trọn gói và gói series, có phạm vi và số lần chỉnh sửa rõ ràng.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
