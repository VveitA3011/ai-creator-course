import Link from "next/link";
import { ModuleCard } from "@/components/module-card";
import { ContinueBar, Stats, UpNext } from "@/components/progress-ui";
import { allModules, flatLessons, pipeline } from "@/lib/curriculum";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export default function Home() {
  return (
    <div className="home">
      <section className="hero a-hero rise">
        <div className="hero-body">
          <div className="pill-row">
            <span className="pill cream">{flatLessons.length} bài</span>
            <span className="pill">8 tuần</span>
            <span className="pill">9:16</span>
          </div>
          <h1>AI Short-form Video Creator</h1>
          <p>
            Học trọn quy trình làm video ngắn bằng AI cho TikTok, Shorts và Reels: từ brief, kịch bản, storyboard đến
            video hoàn chỉnh. Mỗi tuần kết thúc bằng một sản phẩm nộp được.
          </p>
          <div className="btn-row">
            <Link className="btn btn-light" href={flatLessons[0].href}>
              Học thử Module 0
            </Link>
            <Link className="btn btn-ghost" href="/lo-trinh">
              Xem lộ trình
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="shot s1">
            <small>0–5s</small>Hook
          </div>
          <div className="shot s2">
            <small>35–50s</small>Cao trào
          </div>
          <div className="shot s3">
            <small>50–60s</small>Kết thúc
          </div>
        </div>
      </section>

      <div className="a-next">
        <UpNext />
      </div>

      <section className="stack a-mods">
        <div className="section-head">
          <h2>Lộ trình</h2>
          <Link href="/lo-trinh">Xem tất cả</Link>
        </div>
        <div className="cards-row">
          {allModules.map((m, n) => (
            <ModuleCard key={m.slug} module={m} index={n} />
          ))}
        </div>
      </section>

      <section className="stack a-stats rise" style={i(3)}>
        <div className="section-head">
          <h2>Tiến độ của bạn</h2>
          <Link href="/hoc-tap" aria-label="Mở bảng học tập">
            →
          </Link>
        </div>
        <Stats />
      </section>

      <section className="stack a-cont rise" style={i(4)}>
        <div className="section-head">
          <h2>Học tiếp</h2>
          <Link href="/hoc-tap">Bảng học tập</Link>
        </div>
        <ContinueBar />
      </section>

      <section className="stack a-pipe">
        <h2>Bạn học cả quy trình, không chỉ học viết prompt</h2>
        <ol className="pipeline">
          {pipeline.map((p) => (
            <li key={p.step}>
              <b>{p.step}</b>
              {p.text}
            </li>
          ))}
        </ol>
      </section>

      <section className="stack a-out">
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
