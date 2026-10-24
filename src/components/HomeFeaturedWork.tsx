import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/data/home";
import { projectCount, projects } from "@/data/projects";
import type { Project } from "@/types";

const selected = homeContent.featuredWorkSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

/** Falls back to the first four projects if the curated slugs are renamed. */
const featured = selected.length > 0 ? selected : projects.slice(0, 4);

/**
 * Selected work below the hero: one column on phones, two on tablets and a
 * four-up row from 1024px, with the project name and its category chip under
 * each cover, matching the All Works index.
 */
export default function HomeFeaturedWork() {
  return (
    <section className="home-work" aria-labelledby="home-work-heading">
      <div className="home-work-head">
        <h2 id="home-work-heading" className="home-work-title">
          {homeContent.featuredWorkHeading}
          <span className="home-work-count">({String(featured.length).padStart(2, "0")})</span>
        </h2>
        <Link href="/work" className="home-work-all">
          All Works ({String(projectCount).padStart(2, "0")})
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="home-work-grid">
        {featured.map((project) => {
          const cover =
            project.images?.[0] ?? project.image ?? "/images/about-hero.webp";

          return (
            <Link key={project.slug} href={project.href} className="home-work-item">
              <span className="home-work-media">
                <Image
                  src={cover}
                  alt={`${project.title} — ${project.category} project cover`}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 24vw"
                  className="home-work-img"
                />
              </span>
              <span className="home-work-meta">
                <span className="home-work-name">{project.title}</span>
                <span className="home-work-cat">{project.category}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
