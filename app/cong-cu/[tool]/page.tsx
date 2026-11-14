import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolView } from "@/components/tools/tool-view";
import { getTool, tools } from "@/lib/tools";

type Props = { params: Promise<{ tool: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTool((await params).tool);
  return { title: t ? t.name : "Không tìm thấy" };
}

export default async function ToolPage({ params }: Props) {
  const t = getTool((await params).tool);
  if (!t) notFound();

  return (
    <div className="stack">
      <header className={`tool-hero t-${t.tone} rise`}>
        <p className="crumbs">
          <Link href="/cong-cu">Công cụ</Link> / {t.name}
        </p>
        <h1>{t.name}</h1>
        <p>{t.summary}</p>
        <div className="pill-row">
          {t.lessons.map((l) => (
            <Link key={l.href} href={l.href} className="pill">
              Bài: {l.label}
            </Link>
          ))}
        </div>
      </header>
      <ToolView slug={t.slug} />
    </div>
  );
}
