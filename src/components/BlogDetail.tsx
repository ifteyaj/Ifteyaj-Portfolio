"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
import { gsap, registerEases } from "@/lib/gsap";
import { setupMenuLinkHovers } from "@/lib/menuHover";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { blogPosts } from "@/data/blog";
import type { BlogPost } from "@/types";

interface BlogDetailProps {
  post: BlogPost;
}

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|==[^=]+==)/g;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

function formatDate(value: string) {
  return DATE_FORMATTER.format(new Date(value));
}

/** Renders light inline markdown: **bold**, *italic* and [links](/path). */
function InlineText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("==")) {
      nodes.push(<span key={key++} className="blog-content-green">{token.slice(2, -2)}</span>);
    } else if (token.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (link) {
        const [, label, href] = link;
        nodes.push(
          href.startsWith("/") ? (
            <Link key={key++} href={href}>
              {label}
            </Link>
          ) : (
            <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          )
        );
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return <>{nodes}</>;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 4);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerEases();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ lerp: prefersReducedMotion ? 1 : 0.1, smoothWheel: !prefersReducedMotion });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    setupMenuLinkHovers(root);

    gsap.fromTo(".moodboard-detail-image", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "texttshow", delay: 0.3 });
    gsap.fromTo(".moodboard-detail-info", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "texttshow", delay: 0.7 });
    gsap.fromTo(".moodboard-related-pin", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "texttshow", stagger: 0.06, delay: 1.0 });
    gsap.fromTo(".blog-content > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "texttshow", stagger: 0.08, delay: 0.9 });
    gsap.fromTo(".case-footer-block", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "texttshow", delay: 1.2 });

    gsap.to(".first-menu-link:not(.case-bottom-nav .first-menu-link):not(.about-nav-wrapper .first-menu-link):not(.contact-nav-wrapper .first-menu-link):not(.nav-clock-wrapper .first-menu-link):not(.work-nav-wrapper .first-menu-link)", { y: "0%", duration: 1, ease: "texttshow", delay: 0.3 });

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

      <main className="moodboard-detail-main">
        <nav className="moodboard-detail-breadcrumb">
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true"> / </span>
          <span>{post.title}</span>
        </nav>

        <div className="moodboard-detail-card">
          <div className="moodboard-detail-image-wrap moodboard-detail-image">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
              unoptimized
              fetchPriority="high"
              decoding="async"
              className="moodboard-detail-img"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="moodboard-detail-info">
            <span className="moodboard-pin-tag">{post.tag}</span>
            <h1 className="moodboard-detail-title">{post.title}</h1>
            <p className="blog-detail-dates">
              <time dateTime={post.publishedAt}>
                Published {formatDate(post.publishedAt)}
              </time>
            </p>
            <p className="moodboard-detail-desc">{post.description}</p>
          </div>
        </div>

        {post.content && post.content.length > 0 ? (
          <section className="blog-content">
            {post.content.map((block, i) => {
              switch (block.type) {
                case "heading": {
                  const numbered = /^(\d{2}\.)\s+(.*)$/.exec(block.text);
                  return (
                    <h2 key={i} className="blog-content-heading">
                      {numbered ? (
                        <>
                          <span className="blog-content-heading-index">{numbered[1]}</span>{" "}
                          {numbered[2]}
                        </>
                      ) : (
                        block.text
                      )}
                    </h2>
                  );
                }
                case "subheading":
                  return (
                    <h3 key={i} className="blog-content-subheading">
                      {block.text}
                    </h3>
                  );
                case "list":
                  return (
                    <ul key={i} className="blog-content-list">
                      {block.items.map((item, j) => (
                        <li key={j}>
                          <InlineText text={item} />
                        </li>
                      ))}
                    </ul>
                  );
                case "lead":
                  return (
                    <p key={i} className="blog-content-lead">
                      <InlineText text={block.text} />
                    </p>
                  );
                case "callout":
                  return (
                    <p key={i} className="blog-content-callout">
                      <InlineText text={block.text} />
                    </p>
                  );
                case "note":
                  return (
                    <p key={i} className="blog-content-note">
                      <InlineText text={block.text} />
                    </p>
                  );
                default:
                  return (
                    <p key={i} className="blog-content-paragraph">
                      <InlineText text={block.text} />
                    </p>
                  );
              }
            })}
          </section>
        ) : (
          post.body &&
          post.body.length > 0 && (
            <section className="blog-content">
              {post.body.map((paragraph, i) => (
                <p key={i} className="blog-content-paragraph">
                  {paragraph}
                </p>
              ))}
            </section>
          )
        )}

        <div className="blog-divider" />

        <section className="moodboard-related">
          <h2 className="moodboard-related-heading">More from the blog</h2>
          <div className="moodboard-grid moodboard-related-grid">
            {related.map((p, i) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="moodboard-pin moodboard-related-pin">
                <div className={`moodboard-pin-media moodboard-pin-media--${(i % 5) + 1}`}>
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                    className="moodboard-pin-img"
                    loading="lazy" decoding="async" style={{ objectFit: "cover" }}
                  />
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