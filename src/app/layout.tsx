import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/data/site";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <head>
        <link
          rel="preload"
          href="/fonts/PPNeueMontrealTT-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PPNeueMontrealTT-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}