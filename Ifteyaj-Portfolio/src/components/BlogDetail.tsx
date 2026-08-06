"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SiteFooter from "@/components/SiteFooter";
import { blogPosts } from "@/data/blog";
import type { BlogPost } from "@/types";

interface BlogDetailProps {
  post: BlogPost;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 4);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();
    const qs = <T extends Element = HTMLElement>(sel: string): T[] =>
      Array.from(root.querySelectorAll<T>(sel));

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    qs<HTMLElement>(".menu-link").forEach((link) => {
      const first = link.querySelector<HTMLElement>(".first-menu-link");
      const second = link.querySelector<HTMLElement>(".second-menu-link");
      link.addEventListener("mouseenter", () => {
        if (first) gsap.to(first, { y: "-100%", duration: 0.6, ease: "hoverin" });
        if (second) gsap.to(second, { y: "-100%", duration: 0.6, ease: "hoverin" });
      });
      link.addEventListener("mouseleave", () => {
        if (first) gsap.to(first, { y: "0%", duration: 1, ease: "hoverout" });
        if (second) gsap.to(second, { y: "0%", duration: 1, ease: "hoverout" });
      });
    });

    gsap.fromTo(".moodboard-detail-image", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "texttshow", delay: 0.3 });
    gsap.fromTo(".moodboard-detail-info", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", delay: 0.7 });
    gsap.fromTo(".moodboard-related-pin", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "texttshow", stagger: 0.06, delay: 1.0 });
    gsap.fromTo(".case-footer-block", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.2 });

    gsap.to(".first-menu-link", { y: "0%", duration: 1, ease: "texttshow", delay: 0.3 });

    setTimeout(() => {
      setRevealed(true);
      gsap.to(".nav-clock-dot", { y: "0%", duration: 1, ease: "texttshow" });
      gsap.to(".nav-clock", { y: "0%", duration: 1, ease: "texttshow" });
      gsap.to(".nav-clock-infomation", { y: "0%", duration: 1, ease: "texttshow" });
    }, 600);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="moodboard-detail-page">
      <Navbar revealed={revealed} />
      <CustomCursor />

      <main className="moodboard-detail-main">
        <nav className="moodboard-detail-breadcrumb">
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true"> / </span>
          <span>{post.title}</span>
        </nav>

        <div className="moodboard-detail-card">
          <div className="moodboard-detail-image-wrap moodboard-detail-image">
            <img src={post.image} alt={post.title} className="moodboard-detail-img" />
          </div>
          <div className="moodboard-detail-info">
            <span className="moodboard-pin-tag">{post.tag}</span>
            <h1 className="moodboard-detail-title">{post.title}</h1>
            <p className="moodboard-detail-desc">{post.description}</p>
          </div>
        </div>

        <section className="moodboard-related">
          <h2 className="moodboard-related-heading">More from the blog</h2>
          <div className="moodboard-grid moodboard-related-grid">
            {related.map((p, i) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="moodboard-pin moodboard-related-pin">
                <div className={`moodboard-pin-media moodboard-pin-media--${(i % 5) + 1}`}>
                  <img src={p.image} alt={p.title} className="moodboard-pin-img" loading="lazy" />
                </div>
                <div className="moodboard-pin-body">
                  <span className="moodboard-pin-tag">{p.tag}</span>
                  <h3 className="moodboard-pin-title">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}