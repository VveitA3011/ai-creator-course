import fs from "node:fs/promises";
import path from "node:path";

export async function readLesson(moduleSlug: string, lessonSlug: string) {
  const file = path.join(process.cwd(), "content", moduleSlug, `${lessonSlug}.mdx`);
  return fs.readFile(file, "utf8");
}
