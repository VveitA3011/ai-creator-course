import { parseVideo } from "@/lib/video";

export function VideoBox({ url, title }: { url: string; title: string }) {
  const v = parseVideo(url);
  if (v.kind === "youtube")
    return (
      <div className={v.vertical ? "video-box vertical" : "video-box"}>
        <iframe
          src={v.src}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  if (v.kind === "file")
    return (
      <div className="video-box vertical">
        <video src={v.src} controls playsInline preload="metadata" aria-label={title} />
      </div>
    );
  if (v.kind === "link")
    return (
      <a className="video-box vertical video-link" href={v.src} target="_blank" rel="noopener noreferrer">
        <span className="play" aria-hidden="true">
          ▶
        </span>
        <span>Xem video trên {v.host}</span>
      </a>
    );
  return (
    <div className="video-box vertical video-empty">
      <span className="muted small">Chưa có video</span>
    </div>
  );
}
