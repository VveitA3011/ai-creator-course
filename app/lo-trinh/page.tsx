import type { Metadata } from "next";
import { ModuleCard } from "@/components/module-card";
import { flatLessons, modules, totalPlanned, tracks } from "@/lib/curriculum";

export const metadata: Metadata = { title: "Lộ trình" };

export default function Roadmap() {
  return (
    <div className="stack-lg">
      <header className="stack">
        <span className="mono">Lộ trình lõi · {totalPlanned} bài</span>
        <h1>Lộ trình 8 tuần thực chiến</h1>
        <p className="lead">
          Mỗi tuần một module, mỗi module kết thúc bằng một đầu ra cụ thể. Hiện đã mở {flatLessons.length} bài đầu; các
          tuần còn lại đang được biên soạn.
        </p>
      </header>

      <div className="strip">
        {modules.map((m) => (
          <ModuleCard key={m.slug} module={m} />
        ))}
      </div>

      <section className="stack">
        <h2>Sau lộ trình lõi</h2>
        <div className="grid-2">
          {tracks.map((t) => (
            <div className="panel" key={t.title}>
              <span className="mono">{t.tag} · Sắp có</span>
              <h3>{t.title}</h3>
              <ul>
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
