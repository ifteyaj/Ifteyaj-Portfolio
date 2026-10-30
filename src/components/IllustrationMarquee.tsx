"use client";

import Image from "next/image";

export type MarqueeImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const ROWS = 3;

export default function IllustrationMarquee({ images }: { images: MarqueeImage[] }) {
  const rows: MarqueeImage[][] = Array.from({ length: ROWS }, () => []);
  images.forEach((img, i) => rows[i % ROWS].push(img));

  return (
    <div className="illustration-marquee" aria-label="Illustration gallery">
      {rows.map((row, r) => (
        <div
          key={r}
          className={`illustration-marquee-row${r % 2 === 1 ? " is-reverse" : ""}`}
        >
          <div
            className="illustration-marquee-track"
            style={{ animationDuration: `${72 + r * 9}s` }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="illustration-marquee-group"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {[...row, ...row].map((img, i) => {
                  // The track repeats every row twice for the seamless loop and
                  // renders a second copy for the reverse scroll. Only the first
                  // pass is exposed to assistive tech; the rest are decorative.
                  const isRepeat = copy === 1 || i >= row.length;
                  return (
                    <span
                      key={`${img.src}-${i}`}
                      className="illustration-marquee-tile"
                      aria-hidden={isRepeat || undefined}
                      style={{
                        width: `calc(var(--marquee-tile-h) * ${(img.width / img.height).toFixed(4)})`,
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={isRepeat ? "" : img.alt}
                        fill
                        sizes="240px"
                        unoptimized
                        loading="lazy"
                        decoding="async"
                        className="illustration-marquee-img"
                        style={{ objectFit: "cover" }}
                      />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
