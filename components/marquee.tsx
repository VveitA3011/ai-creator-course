/* Dải chữ chạy ngang kiểu brutalist. Nội dung được nhân đôi để chạy liền mạch. */
export function Marquee({ items, tone = "ink", reverse = false }: { items: string[]; tone?: "ink" | "yellow" | "teal"; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i}>
          {t}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee m-${tone}${reverse ? " reverse" : ""}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* Nhãn dán xoay nghiêng */
export function Sticker({ children, tone = "white", tilt = -6, className = "" }: { children: React.ReactNode; tone?: string; tilt?: number; className?: string }) {
  return (
    <span className={`sticker s-${tone} ${className}`} style={{ "--tilt": `${tilt}deg` } as React.CSSProperties} aria-hidden="true">
      {children}
    </span>
  );
}
