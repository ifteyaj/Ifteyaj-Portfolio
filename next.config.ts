import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-mode indicator parks itself in the bottom-left corner, on top of
  // the loading screen's "Portfolio" label (it uses the maximum z-index).
  // Errors and warnings still surface without it.
  devIndicators: false,
  async redirects() {
    return [
      // The brand post was published with this slug first; keep old links alive.
      {
        source: "/blog/how-to-make-a-small-brand-feel-established",
        destination: "/blog/how-to-make-a-small-brand-feel-more-established",
        permanent: true,
      },
    ];
  },
  images: {
    // Serve AVIF first (smallest), fall back to WebP. Next generates
    // responsive variants automatically, fixing the Lighthouse
    // "Properly size images" (~8MB savings on case pages).
    formats: ["image/avif", "image/webp"],
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
