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
      <body className="min-h-full">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}