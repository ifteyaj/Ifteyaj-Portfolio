"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { justifiedLayout } from "@/lib/justifiedLayout";
import type { MoodboardItem } from "@/types";

interface JustifiedGalleryProps {
  items: MoodboardItem[];
  className?: string;
  targetRowHeight?: number;
  maxRowHeight?: number;
  sizes?: string;
  priorityCount?: number;
}

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

export default function JustifiedGallery({
  items,
  className,
  targetRowHeight = 250,
  maxRowHeight = 400,
  sizes = DEFAULT_SIZES,
  priorityCount = 0,
}: JustifiedGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Measure container width; repack on resize (debounced via rAF), not per frame.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let last = 0;
    const measure = () => {
      const w = el.clientWidth;
      if (w !== last) setContainerWidth(w);
      last = w;
    };
    measure();
    setMounted(true);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(measure);
      });
      ro.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Pure, cached layout computation.
  const layout = useMemo(() => {
    if (containerWidth <= 0) return null;
    const galleryItems = items.map((item, i) => ({
      item,
      aspect: item.width / item.height,
      key: `${item.title}-${i}`,
    }));
    return justifiedLayout<MoodboardItem>(galleryItems, {
      containerWidth,
      targetRowHeight,
      maxRowHeight,
    });
  }, [items, containerWidth, targetRowHeight, maxRowHeight]);

  if (!mounted || !layout) {
    return <div ref={containerRef} className={`justified-gallery ${className ?? ""}`} />;
  }

  let painted = 0;

  return (
    <div ref={containerRef} className={`justified-gallery ${className ?? ""}`}>
      {layout.rows.map((row, r) => (
        <div key={r} className="justified-row" style={{ height: row.height }}>
          {row.panels.map((panel) => {
            const item = panel.item;
            const isPriority = priorityCount > 0 && painted < priorityCount;
            if (isPriority) painted += 1;
            return (
              <div
                key={panel.key}
                className="justified-cell"
                style={{ flexGrow: panel.aspect, flexBasis: 0 }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes={sizes}
                  loading={isPriority ? "eager" : "lazy"}
                  className="justified-img"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}