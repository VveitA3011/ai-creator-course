// Nhận diện đường dẫn video để nhúng. Chỉ nhúng YouTube (bản không cookie) và tệp video trực tiếp;
// các nền tảng khác (TikTok, Google Drive, Instagram...) hiện nút mở ở trang gốc.
export type VideoEmbed =
  | { kind: "youtube"; src: string; vertical: boolean }
  | { kind: "file"; src: string }
  | { kind: "link"; src: string; host: string }
  | { kind: "none" };

export function parseVideo(raw: string): VideoEmbed {
  const s = raw.trim();
  if (!s) return { kind: "none" };
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return { kind: "none" };
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return { kind: "none" };
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id = "";
  let vertical = false;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (host === "youtube.com") {
    if (u.pathname.startsWith("/shorts/")) {
      id = u.pathname.split("/")[2] ?? "";
      vertical = true;
    } else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2] ?? "";
    else id = u.searchParams.get("v") ?? "";
  }
  if (id && /^[\w-]{6,20}$/.test(id)) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}`, vertical };
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "file", src: u.toString() };
  return { kind: "link", src: u.toString(), host };
}
