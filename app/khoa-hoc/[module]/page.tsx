import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonList, ModuleBar } from "@/components/progress-ui";
import { availableModules, getModule } from "@/lib/curriculum";

type Props = { params: Promise<{ module: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return availableModules.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getModule((await params).module);
  return { title: m ? `${m.tag}: ${m.title}` : "Không tìm thấy" };
}

export default async function ModulePage({ params }: Props) {
  const m = getModule((await params).module);
  if (!m || m.lessons.length === 0) notFound();

  return (
    <div className="stack" style={{ maxWidth: 720 }}>
      <p className="crumbs">
        <Link href="/lo-trinh">Lộ trình</Link> / {m.tag}
      </p>
      <span className="mono">
        {m.tag} · {m.lessonCount} bài
      </span>
      <h1>{m.title}</h1>
      <p className="lead">{m.summary}</p>
      <div className="panel">
        <ModuleBar module={m} />
        <LessonList module={m} />
        <p className="output">
          <strong>Đầu ra cần có:</strong> {m.output}
        </p>
      </div>
      <Link className="btn" href={`/khoa-hoc/${m.slug}/${m.lessons[0].slug}`}>
        Vào bài đầu tiên
      </Link>
    </div>
  );
}
