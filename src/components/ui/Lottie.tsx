"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

interface LottieProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onError?: () => void;
}

/**
 * LottiePlayer — renders a Lottie animation from /lottie/*.json as inline SVG.
 */
export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className,
  onError,
}: LottieProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      path: src,
    });
    animRef.current = anim;
    anim.addEventListener("data_failed", () => onError?.());
    return () => {
      anim.destroy();
      animRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}

export default LottiePlayer;