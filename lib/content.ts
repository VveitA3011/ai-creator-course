import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

export async function readLesson(moduleSlug: string, lessonSlug: string) {
  const file = path.join(process.cwd(), "content", moduleSlug, `${lessonSlug}.mdx`);
  return fs.readFile(file, "utf8");
}

// Ảnh bìa bài học: public/images/bai/<số thứ tự bài>.(webp|jpg|jpeg|png), số từ 1 đến 63 theo thứ tự trong khóa.
export function findCover(no: number) {
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    const rel = `/images/bai/${no}.${ext}`;
    if (existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}
