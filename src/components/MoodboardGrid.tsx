"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { MoodboardItem } from "@/types";

const SIZES =
  "(max-width: 479px) 33vw, (max-width: 767px) 25vw, (max-width: 1023px) 20vw, (max-width: 1439px) 17vw, 14vw";

function columnsFor(width: number): number {
  if (width >= 1440) return 7;
  if (width >= 1024) return 6;
  if (width >= 768) return 5;
  if (width >= 480) return 4;
  return 3;
}

/**
 * Pinterest-style distribution: every tile keeps its natural aspect ratio and
 * each one is dropped into whichever column is currently the shortest (measured
 * in relative height units — `height / width`, so it is independent of the
 * actual column pixel width). Columns stay balanced while reading roughly
 * left-to-right.
 */
function distribute(items: MoodboardItem[], cols: number): MoodboardItem[][] {
  const buckets: MoodboardItem[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);

  for (const item of items) {
    let target = 0;
    for (let i = 1; i < cols; i++) {
      if (heights[i] < heights[target]) target = i;
    }
    buckets[target].push(item);
    heights[target] += item.height / item.width;
  }

  return buckets;
}

export default function MoodboardGrid({ items }: { items: MoodboardItem[] }) {
  const [cols, setCols] = useState(0);

  useEffect(() => {
    const update = () => setCols(columnsFor(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const buckets = useMemo(() => (cols ? distribute(items, cols) : []), [items, cols]);

  const eager = useMemo(() => new Set(items.slice(0, cols).map((i) => i.image)), [items, cols]);

  return (
    <div
      className="mb-grid"
      style={cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
    >
      {buckets.map((col, c) => (
        <div key={c} className="mb-col">
          {col.map((item) => (
            <div
              key={item.image}
              className="mb-tile"
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes={SIZES}
                unoptimized
                loading={eager.has(item.image) ? "eager" : "lazy"}
                decoding="async"
                className="mb-tile-img"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
