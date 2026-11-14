import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";
import { Icon } from "@/components/icons";
import { LessonMotion } from "@/components/lesson-interactive";
import { CompleteButton, LessonList } from "@/components/progress-ui";
import { findCover, readLesson } from "@/lib/content";
import { allModules, flatLessons } from "@/lib/curriculum";

type Props = { params: Promise<{ module: string; lesson: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return flatLessons.map((l) => ({ module: l.module.slug, lesson: l.slug }));
}

async function find(params: Props["params"]) {
  const p = await params;
  const index = flatLessons.findIndex((l) => l.id === `${p.module}/${p.lesson}`);
  return { index, lesson: flatLessons[index] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson } = await find(params);
  return { title: lesson ? lesson.title : "Không tìm thấy" };
}

export default async function LessonPage({ params }: Props) {
  const { index, lesson } = await find(params);
  if (!lesson) notFound();

  const source = await readLesson(lesson.module.slug, lesson.slug);
  const cover = findCover(lesson.module.slug, lesson.slug);
  const prev = flatLessons[index - 1];
  const next = flatLessons[index + 1];
  const m = lesson.module;
  const no = m.lessons.findIndex((l) => l.slug === lesson.slug) + 1;

  return (
    <div className="lesson-layout">
      <aside className="lesson-side" aria-label={`Các bài trong ${m.tag}`}>
        <span className="mono">{m.tag}</span>
        <h2>{m.title}</h2>
        <LessonList module={m} current={lesson.slug} />
      </aside>

      <article className="stack rise">
        <LessonMotion />
        <header className={`lesson-hero v${allModules.indexOf(m) % 4}${cover ? " has-cover" : ""}`}>
          {cover && <img className="lesson-cover" src={cover} alt="" />}
          <span className="lesson-num" aria-hidden="true">
            {String(no).padStart(2, "0")}
          </span>
          <p className="crumbs">
            <Link href="/lo-trinh">Lộ trình</Link> / <Link href={`/khoa-hoc/${m.slug}`}>{m.tag}</Link>
          </p>
          <h1>{lesson.title}</h1>
          <div className="pill-row">
            <span className="pill cream">
              Bài {no}/{m.lessons.length}
            </span>
            <span className="pill">
              <Icon name="clock" /> Khoảng {lesson.minutes} phút
            </span>
            <span className="pill">{m.title}</span>
          </div>
        </header>
        <div className="prose">
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
        <div className="lesson-foot">
          <CompleteButton id={lesson.id} />
          <div className="btn-row">
            {prev && (
              <Link className="btn btn-ghost" href={prev.href}>
                ← Bài trước
              </Link>
            )}
            {next ? (
              <Link className="btn btn-ghost" href={next.href}>
                Bài tiếp →
              </Link>
            ) : (
              <Link className="btn btn-ghost" href="/hoc-tap">
                Về bảng học tập
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
