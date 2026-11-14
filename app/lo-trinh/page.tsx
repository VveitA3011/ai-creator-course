import type { Metadata } from "next";
import { ModuleCard } from "@/components/module-card";
import { extraModules, flatLessons, modules, totalPlanned } from "@/lib/curriculum";

export const metadata: Metadata = { title: "Lộ trình" };

export default function Roadmap() {
  return (
    <div className="stack-lg">
      <header className="stack rise">
        <span className="mono">Lộ trình lõi · {totalPlanned} bài</span>
        <h1>Lộ trình 8 tuần thực chiến</h1>
        <p className="lead">
          Mỗi tuần một module, mỗi module kết thúc bằng một đầu ra cụ thể. Cộng hai lộ trình mở rộng, toàn khóa có
          {flatLessons.length} bài.
        </p>
      </header>

      <div className="cards-grid">
        {modules.map((m, n) => (
          <ModuleCard key={m.slug} module={m} index={n} />
        ))}
      </div>

      <section className="stack">
        <h2>Sau lộ trình lõi</h2>
        <p className="lead">Hai lộ trình mở rộng, học theo thứ tự nào cũng được.</p>
        <div className="cards-grid">
          {extraModules.map((m, n) => (
            <ModuleCard key={m.slug} module={m} index={n + 2} />
          ))}
        </div>
      </section>
    </div>
  );
}
