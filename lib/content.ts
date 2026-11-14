import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

export async function readLesson(moduleSlug: string, lessonSlug: string) {
  const file = path.join(process.cwd(), "content", moduleSlug, `${lessonSlug}.mdx`);
  return fs.readFile(file, "utf8");
}

// Ảnh bìa tùy chọn: public/images/<module>/<bài>.(webp|jpg|jpeg|png)
export function findCover(moduleSlug: string, lessonSlug: string) {
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    const rel = `/images/${moduleSlug}/${lessonSlug}.${ext}`;
    if (existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}
