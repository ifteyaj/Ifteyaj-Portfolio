"use client";

import { cn } from "@/lib/utils";

type LogoGradient = { from: string; via: string; to: string };

type MarqueeLogo = {
  src: string;
  alt: string;
  gradient?: LogoGradient;
};

type MarqueeLogoScrollerProps = {
  title?: string;
  description?: string;
  logos: MarqueeLogo[];
  speed?: "slow" | "normal" | "fast";
  className?: string;
};

const DURATIONS: Record<NonNullable<MarqueeLogoScrollerProps["speed"]>, number> = {
  slow: 50,
  normal: 35,
  fast: 20,
};

export function MarqueeLogoScroller({
  title,
  description,
  logos,
  speed = "normal",
  className,
}: MarqueeLogoScrollerProps) {
  const duration = DURATIONS[speed];

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 pb-10 md:flex-row md:items-end md:justify-between">
          {title && <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h2>}
          {description && (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-left">{description}</p>
          )}
        </div>
      )}

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
<div
          className="flex w-max items-center gap-6"
          style={{
            animation: `marquee-scroll-scroll ${duration}s linear infinite`,
            willChange: "transform",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className={cn(
                "flex items-center gap-4 rounded-2xl border border-border px-6 py-4",
                logo.gradient ? "text-white" : "bg-card",
              )}
              style={
                logo.gradient
                  ? { background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.via}, ${logo.gradient.to})` }
                  : undefined
              }
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className={cn("h-6 select-none md:h-7", !logo.gradient && "dark:brightness-0 dark:invert")}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default MarqueeLogoScroller;