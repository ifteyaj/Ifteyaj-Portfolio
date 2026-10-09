import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Serve AVIF first (smallest), fall back to WebP. Next generates
    // responsive variants automatically, fixing the Lighthouse
    // "Properly size images" (~8MB savings on case pages).
    formats: ["image/avif", "image/webp"],
    // 2048 / 3840 are Next's defaults: without them a full-width image on a
    // 2x retina screen tops out at 1920 and gets upscaled ~1.5x (visible blur).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Next 16 only accepts q values listed here; the default is [75] alone,
    // so <Image quality={90} /> would otherwise be rejected with a 400.
    qualities: [75, 85, 90, 100],
    // Production: keep optimized variants cached for a year (Lighthouse fix).
    // Dev: disable the optimizer disk cache entirely so replacing a file with
    // same-name content is picked up on reload instead of serving stale bytes.
    ...(process.env.NODE_ENV === "production"
      ? { minimumCacheTTL: 31536000 }
      : { maximumDiskCacheSize: 0 }),
  },
};

export default nextConfig;
