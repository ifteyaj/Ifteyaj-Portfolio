"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TestimonialsProps {
  heading: string;
  testimonials: Testimonial[];
}

export default function Testimonials({ heading, testimonials }: TestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);

  const goTo = (index: number) => {
    if (isAnimating.current || index === activeIndex) return;
    isAnimating.current = true;

    const track = trackRef.current;
    if (!track) return;

    gsap.to(track, {
      y: -index * 100 + "%",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveIndex(index);
        isAnimating.current = false;
      },
    });
  };

  const next = () => {
    goTo((activeIndex + 1) % testimonials.length);
  };

  const prev = () => {
    goTo((activeIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, testimonials.length]);

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-heading">{heading}</h2>
      <div className="testimonials-slider" ref={containerRef}>
        <div className="testimonials-track" ref={trackRef}>
          {testimonials.map((testimonial, i) => (
            <div key={i} className="testimonials-slide">
              <div className="testimonials-card">
                <p className="testimonials-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="testimonials-author">
                  <span className="testimonials-name">{testimonial.name}</span>
                  <span className="testimonials-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="testimonials-nav">
        <button type="button" className="testimonials-btn" onClick={prev} aria-label="Previous">
          ↑
        </button>
        <div className="testimonials-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`testimonials-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="testimonials-btn" onClick={next} aria-label="Next">
          ↓
        </button>
      </div>
    </section>
  );
}
