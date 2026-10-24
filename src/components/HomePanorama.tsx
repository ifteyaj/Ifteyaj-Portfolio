"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Port of Framer's "Panorama Carousel" (CurveCarouselScroll).
 *
 * The row is a faceted cylinder: each tile is cut into 16 vertical strips and
 * every strip is rotated a little further round the arc, so the ends bend
 * toward the viewer. One WAAPI animation per tile keeps them on a shared clock,
 * which lets a tile wrap round the loop invisibly and pick up its next image.
 *
 * Everything is driven by container-query units, so the band only needs a
 * height. Cards are square-cornered and keep drifting; drag adds momentum.
 */

const SLICES = 12;
const CAMERA = 1.6;
const MAX_WIDTH = 55;
const BLEED = 2;

type Layout = {
  columns: number;
  sweep: number;
  unit: number;
  limit: number;
};

/** Cylinder radius, as a share of the width, that puts the edge `bend` round the arc. */
function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number
): Layout {
  const h = Math.min((tile / 100) * height, (MAX_WIDTH / 100) * width / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) {
    return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  }

  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);

  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
  };
}

export type HomePanoramaProps = {
  images: string[];
  /** Seconds for the row to advance by one image. */
  speed?: number;
  direction?: "left" | "right";
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  momentum?: number;
  /** Image height, as a share of the band height. */
  tileHeight?: number;
  /** Image width divided by height. */
  aspectRatio?: number;
  /** Space between images, as a share of their height. */
  gap?: number;
  /** Vertical centre of the row, as a share of the band height. */
  axis?: number;
  /** How hard the ends bend toward the viewer, in degrees. */
  curve?: number;
  /** Edge fade, as a share of the band width. */
  fade?: number;
};

export default function HomePanorama({
  images,
  speed = 4,
  direction = "left",
  autoplay = true,
  pauseOnHover = false,
  draggable = true,
  momentum = 0.5,
  tileHeight = 38,
  aspectRatio = 1.78,
  gap = 6,
  axis = 50,
  curve = 80,
  fade = 12,
}: HomePanoramaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tileEls = useRef<Array<HTMLDivElement | null>>([]);
  const anims = useRef<Animation[]>([]);

  /** Logical time of the loop in ms, carried over whenever the animations rebuild. */
  const clock = useRef({ base: 0, time: 0 });
  const lapsRef = useRef<number[]>([]);
  const tilePx = useRef(0);
  const drag = useRef({ id: -1, x: 0, t: 0, v: 0, raf: 0 });
  const flags = useRef({
    inView: true,
    hovered: false,
    dragging: false,
    coasting: false,
    reduced: false,
    autoplay,
  });

  const [layout, setLayout] = useState<Layout | null>(null);
  const [laps, setLaps] = useState<number[]>([]);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;
  const reverse = direction === "right";

  /* ── Measure the band, then derive the arc geometry. ─────────────────── */
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      tilePx.current = Math.min(
        (tileHeight / 100) * height,
        ((MAX_WIDTH / 100) * width) / aspectRatio
      );

      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      startTransition(() =>
        setLayout((prev) =>
          prev &&
          prev.columns === next.columns &&
          prev.sweep === next.sweep &&
          prev.unit === next.unit
            ? prev
            : next
        )
      );
      setReady(true);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  /* ── Only animate while the band is near the viewport. ───────────────── */
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => startTransition(() => setInView(entry.isIntersecting)),
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ── Preload every image once, so a wrapping tile never pops. ────────── */
  const srcKey = images.join("|");
  useEffect(() => {
    if (typeof window === "undefined") return;
    for (const src of images) {
      if (src) new window.Image().src = src;
    }
  }, [srcKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Playback rate: eased hand-off between playing, hover and drag. ──── */
  const rate = useRef({ value: autoplay ? 1 : 0, raf: 0 });

  const setRate = useCallback((value: number) => {
    rate.current.value = value;
    for (const a of anims.current) a.playbackRate = value;
  }, []);

  const syncPlay = useCallback(() => {
    const f = flags.current;
    const r = rate.current;
    cancelAnimationFrame(r.raf);
    r.raf = 0;

    if (!f.inView) {
      for (const a of anims.current) a.pause();
      return;
    }

    for (const a of anims.current) {
      if (a.playState !== "running") a.play();
    }

    if (f.dragging) {
      setRate(0);
      return;
    }

    const target = f.autoplay && !f.hovered && !f.reduced ? 1 : 0;
    let last = performance.now();

    const ease = () => {
      const now = performance.now();
      const k = 1 - Math.exp(-(now - last) / 280);
      last = now;
      const v = r.value + (target - r.value) * k;

      if (Math.abs(target - v) < 0.005) {
        setRate(target);
        r.raf = 0;
      } else {
        setRate(v);
        r.raf = requestAnimationFrame(ease);
      }
    };

    if (r.value !== target) r.raf = requestAnimationFrame(ease);
    else setRate(target);
  }, [setRate]);

  const { columns, sweep, unit, limit } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  /* Every length is a multiple of the tile's height. */
  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(
      MAX_WIDTH / aspectRatio
    ).toFixed(4)}cqw))`;

  const radiusCq = `${+(100 * arc(bend)).toFixed(3)}cqw`;
  const turn = (deg: number) =>
    `translateZ(${radiusCq}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radiusCq})`;

  /** Share of the loop, at each end, where a tile is wholly off-screen. */
  const hide = Math.max(0, (sweep - limit) / (2 * sweep || 1));
  const share = aspectRatio / SLICES;
  const durMs = columns * speed * 1000;
  const stepMs = speed * 1000;

  /* ── Build one animation per tile, all sharing the same clock. ───────── */
  useEffect(() => {
    if (!(sweep > 0)) return;

    const els = tileEls.current.slice(0, columns);
    if (
      els.length < columns ||
      els.some((el) => !el || typeof el.animate !== "function")
    ) {
      return;
    }

    flags.current.reduced =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const at = (o: number) => turn(-sweep + 2 * sweep * o);
    const e = 1e-5;
    const stops: Array<[number, "hidden" | "visible"]> = [
      [0, "hidden"],
      [hide, "hidden"],
      [Math.min(hide + e, 0.5), "visible"],
      [Math.max(1 - hide - e, 0.5), "visible"],
      [1 - hide, "hidden"],
      [1, "hidden"],
    ];
    const frames = stops.map(([offset, visibility]) => ({
      offset,
      transform: at(offset),
      visibility,
    }));

    /* A large base keeps currentTime positive however far back the row is dragged. */
    const base = durMs * 1e4;
    clock.current.base = base;

    const built = els.map((el, t) => {
      const a = el!.animate(frames, {
        duration: durMs,
        iterations: Infinity,
        easing: "linear",
        direction: reverse ? "reverse" : "normal",
      });
      a.currentTime = base + clock.current.time + t * stepMs;
      a.playbackRate = rate.current.value;
      return a;
    });
    anims.current = built;

    syncPlay();

    const clockNode = clock.current;
    return () => {
      const lead = built[0];
      if (lead && clockNode) {
        clockNode.time =
          Number(lead.currentTime ?? 0) - clockNode.base;
      }
      for (const a of built) a.cancel();
      if (anims.current === built) anims.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, durMs, stepMs, reverse, sweep, hide, radiusCq, syncPlay]);

  useEffect(() => {
    flags.current.inView = inView;
    syncPlay();
  }, [inView, syncPlay]);

  useEffect(() => {
    flags.current.autoplay = autoplay;
    syncPlay();
  }, [autoplay, syncPlay]);

  /* Hand each tile its next image once it has wrapped. A 4 Hz check is enough:
     the swap only matters while the tile is off-screen, and it keeps the main
     thread idle between laps. */
  useEffect(() => {
    if (!inView) return;

    const read = () => {
      const list = anims.current;
      if (!list.length) return;

      const base = clock.current.base;
      const next = list.map((a) =>
        Math.floor((Number(a.currentTime ?? 0) - base) / durMs)
      );
      const prev = lapsRef.current;

      if (next.length !== prev.length || next.some((v, i) => v !== prev[i])) {
        lapsRef.current = next;
        startTransition(() => setLaps(next));
      }
    };

    read();
    const timer = window.setInterval(read, 250);
    return () => window.clearInterval(timer);
  }, [inView, durMs, columns]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rate.current.raf);
      cancelAnimationFrame(drag.current.raf);
    },
    []
  );

  /* Honour a reduced-motion preference that changes after mount. */
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const read = () => {
      flags.current.reduced = query.matches;
      syncPlay();
    };
    query.addEventListener?.("change", read);
    return () => query.removeEventListener?.("change", read);
  }, [syncPlay]);

  /* ── Drag the row by screen pixels, measured at the centre of the arc. ─ */
  const shift = useCallback(
    (dx: number) => {
      const pitchPx = (aspectRatio + gap / 100) * tilePx.current;
      if (!(pitchPx > 0)) return;
      const ms = ((reverse ? dx : -dx) * stepMs) / pitchPx;
      for (const a of anims.current) {
        // eslint-disable-next-line react-hooks/immutability
        a.currentTime = Number(a.currentTime ?? 0) + ms;
      }
    },
    [aspectRatio, gap, stepMs, reverse]
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const d = drag.current;
    cancelAnimationFrame(d.raf);
    d.id = event.pointerId;
    d.x = event.clientX;
    d.t = performance.now();
    d.v = 0;
    flags.current.dragging = true;
    flags.current.coasting = false;
    syncPlay();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!flags.current.dragging || event.pointerId !== d.id) return;

    const now = performance.now();
    const dx = event.clientX - d.x;
    const dt = Math.max(1, now - d.t);
    shift(dx);
    d.v = 0.8 * d.v + 0.2 * (dx / dt);
    d.x = event.clientX;
    d.t = now;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!flags.current.dragging || event.pointerId !== d.id) return;

    flags.current.dragging = false;
    d.id = -1;
    event.currentTarget.style.cursor = "grab";
    syncPlay();

    /* A pause before letting go means no throw. */
    let v = performance.now() - d.t > 80 ? 0 : d.v;

    if (momentum > 0 && Math.abs(v) > 0.05) {
      flags.current.coasting = true;
      const friction = 0.86 + 0.12 * Math.min(1, momentum);
      let last = performance.now();

      const coast = () => {
        const now = performance.now();
        const dt = now - last;
        last = now;
        shift(v * dt);
        v *= Math.pow(friction, dt / 16.67);
        if (Math.abs(v) > 0.01 && flags.current.coasting) {
          d.raf = requestAnimationFrame(coast);
        } else {
          flags.current.coasting = false;
        }
      };

      d.raf = requestAnimationFrame(coast);
    }
  };

  const onPointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pauseOnHover || event.pointerType !== "mouse") return;
    flags.current.hovered = true;
    syncPlay();
  };

  const onPointerLeave = () => {
    if (!flags.current.hovered) return;
    flags.current.hovered = false;
    syncPlay();
  };

  useEffect(() => {
    if (!pauseOnHover && flags.current.hovered) {
      flags.current.hovered = false;
      syncPlay();
    }
  }, [pauseOnHover, syncPlay]);

  const canDrag = draggable;
  const count = Math.max(images.length, 1);

  /* Fully transparent for the last 2px on each side. */
  const mask = `linear-gradient(90deg,transparent 2px,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent calc(100% - 2px))`;

  return (
    <div
      ref={ref}
      className="home-panorama"
      aria-hidden="true"
      onPointerDown={canDrag ? onPointerDown : undefined}
      onPointerMove={canDrag ? onPointerMove : undefined}
      onPointerUp={canDrag ? onPointerUp : undefined}
      onPointerCancel={canDrag ? onPointerUp : undefined}
      onPointerEnter={pauseOnHover ? onPointerEnter : undefined}
      onPointerLeave={pauseOnHover ? onPointerLeave : undefined}
      onDragStart={(event) => event.preventDefault()}
      style={{
        containerType: "size",
        cursor: canDrag ? "grab" : undefined,
        touchAction: canDrag ? "pan-y" : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.5s ease",
          perspective: `${+(100 * arc(bend) * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          /* Numbers tiles in the order they come on screen. */
          const first = reverse ? t : columns - 1 - t;
          const img =
            images[(((laps[t] ?? 0) * columns + first) % count + count) % count];

          /* `base` is where the strips' common centre sits: the tile's own box. */
          const strips = (base: string) =>
            Array.from({ length: SLICES }, (_, k) => {
              const isFirst = k === 0;
              const isLast = k === SLICES - 1;
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    top: 0,
                    overflow: "hidden",
                    borderRadius: 0,
                    /* One background per facet: the browser decodes each image once
                       and paints a crop, instead of 12 <img> nodes per tile. */
                    backgroundImage: img ? `url("${img}")` : undefined,
                    backgroundSize: `${u(aspectRatio)} ${u(1)}`,
                    backgroundPosition: `calc(${u(-k * share)} + ${
                      isFirst ? 0 : BLEED
                    }px) 0`,
                    backgroundRepeat: "no-repeat",
                    /* Inner edges reach BLEED px under the neighbour, so no hairline opens. */
                    left: `calc(${base} - ${isFirst ? 0 : BLEED}px)`,
                    width: `calc(${u(share)} + ${
                      (isFirst ? 0 : BLEED) + (isLast ? 0 : BLEED)
                    }px)`,
                    height: u(1),
                    transform: turn(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit
                    ),
                  }}
                />
              );
            });

          return (
            <div
              key={t}
              ref={(el) => {
                tileEls.current[t] = el;
              }}
              style={{
                position: "absolute",
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                /* Hidden until its animation takes over. */
                visibility: "hidden",
              }}
            >
              {strips(u((aspectRatio - share) / 2))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
