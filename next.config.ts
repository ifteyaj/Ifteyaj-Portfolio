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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Production: keep optimized variants cached for a year (Lighthouse fix).
    // Dev: disable the optimizer disk cache entirely so replacing a file with
    // same-name content is picked up on reload instead of serving stale bytes.
    ...(process.env.NODE_ENV === "production"
      ? { minimumCacheTTL: 31536000 }
      : { maximumDiskCacheSize: 0 }),
  },
};

export default nextConfig;
