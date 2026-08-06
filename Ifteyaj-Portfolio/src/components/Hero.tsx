"use client";

import Image from "next/image";
import LottiePlayer from "@/components/ui/Lottie";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

interface HeroProps {
  gridView: boolean;
  onToggleGridView: () => void;
}

export default function Hero({ gridView, onToggleGridView }: HeroProps) {
  return (
    <section className="section is-hero">
      <div className="container is-hero">
        <div className="slider-toggle-nav">
          <div className="slider-nav-border" />
          <div className="circle-btn container-arrows" aria-label="trail{link}">
            <button
              type="button"
              className="circle-scale-btn"
              aria-label={gridView ? "Switch to slider view" : "Switch to grid view"}
              onClick={onToggleGridView}
            >
              {gridView ? (
                <LottiePlayer src="/lottie/btn-close.json" loop={false} autoplay={false} />
              ) : (
                <LottiePlayer src="/lottie/btn-open.json" loop={false} autoplay={false} />
              )}
            </button>
          </div>
        <div className="circle-minimize" aria-label="trail{link}">
          <div className="minimizetool">
            <button
              type="button"
              className="circle-minimize-btn"
              aria-label="Exit grid view"
              onClick={onToggleGridView}
            />
          </div>
        </div>
        </div>

        <div className="main-slider">
          <div className="main-slider_wrap">
            <div className="main-slider_list">
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  className={`main-slider_item${i === 0 ? " active" : ""}`}
                  data-index={i}
                >
                  <a href={project.href} className="main-slider-link">
                    <div className="main-slider-card">
                      <div className="container is-main-slider">
                        <div className="main-slider_title-wrap">
                          <p className="main-slider_title">{project.title}</p>
                        </div>
                      </div>
                      <div className="main-slider_img-wrap">
                        {project.video ? (
                          <div className="video-cover">
                            <video
                              muted
                              autoPlay
                              playsInline
                              loop
                              poster={project.poster}
                              preload="metadata"
                            >
                              <source src={project.video} type="video/mp4" />
                            </video>
                          </div>
                        ) : (
                          <Image
                            src={project.images?.[0] ?? project.image ?? ""}
                            alt={project.title}
                            fill
                            sizes="100vw"
                            priority={i === 0}
                            className="main-slider_img"
                          />
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="number-wrapper">
          <div className="numbers">
            <div className="numbers_wrap">
              <div className="numbers_list">
                {projects.map((project, i) => (
                  <div
                    key={project.slug}
                    className={`numbers_item${i === 0 ? " active" : ""}`}
                  >
                    <p className="number_static">(0</p>
                    <p className="numbers_text">{i + 1}</p>
                    <p className="number_static">)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="prev-btn-wrapper">
          <div className="btn-prevslide">
            <div className="menu-link">
              <div className="menu-text first-menu-link slider-nav-text">
                <p className="menu-big-text">[←] Prev</p>
              </div>
              <div className="menu-text second-menu-link">
                <p className="menu-big-text">[←] Prev</p>
              </div>
            </div>
          </div>
        </div>
        <div className="next-btn-wrapper">
          <div className="btn-nextslide">
            <div className="menu-link">
              <div className="menu-text first-menu-link slider-nav-text">
                <p className="menu-big-text">Next [→]</p>
              </div>
              <div className="menu-text second-menu-link">
                <p className="menu-big-text">Next [→]</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="slider-footer">
        <div className="slider-footer-wrapper">
          <div className="slider-footer-information">
            <p className="slider-footer-text">{siteConfig.copyright}</p>
          </div>
        </div>
        <div className="slider-footer-social-wrapper">
          <div className="social-link-container">
            {siteConfig.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" className="menu-link">
                <div className="menu-text first-menu-link-social">
                  <p className="menu-big-text social-link">{social.label}</p>
                </div>
                <div className="menu-text second-menu-link-social">
                  <p className="menu-big-text social-link">{social.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="slider-footer-border" />
      </div>
    </section>
  );
}