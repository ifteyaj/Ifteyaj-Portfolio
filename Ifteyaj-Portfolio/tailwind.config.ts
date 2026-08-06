import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      // ── Colors (verbatim from RECON rootVariables) ──
      colors: {
        black:       "#1a1a1a",
        lightblack:  "#212121",
        darkgrey:    "#272727",
        white:       "#ffffff",
        grey:        "#a3a3a3",
        "mid-grey":  "#7a7771",
        naturalgrey: "#a8a59c",
        offwhite:    "#f8f3ed",
        "border-white": "rgba(255,255,255,0.3)",
      },
      // ── Font families ──
      fontFamily: {
        montreal: ["PPNeueMontrealTT", "sans-serif"],
        serif:    ["PT Serif", "Georgia", "serif"],
      },
      // ── Spacing / sizes (fluid rem values; root sets 1rem = f(vw)) ──
      spacing: {
        "page":   "0.7rem",       // --page-margin
        "header-indent": "4.5rem", // --header-left-space
      },
      // ── Breakpoints matching RECON ──
      screens: {
        xs:  "360px",
        sm:  "390px",
        md:  "768px",
        lg:  "1024px",
        xl:  "1366px",
        "2xl": "1440px",
        "3xl": "1920px",
      },
      // ── Motion easing (CSS cubic-bezier strings) ──
      transitionTimingFunction: {
        pagtrans:    "cubic-bezier(0.645, 0.045, 0.355, 1)",
        texttshow:   "cubic-bezier(0.35, 0.15, 0.35, 1)",
        linedraw:    "cubic-bezier(0.65, 0.05, 0.36, 1)",
        hoverout:    "cubic-bezier(0.23, 1, 0.32, 1)",
        hoverin:     "cubic-bezier(0.65, 0.05, 0.36, 1)",
        slowoutfade: "cubic-bezier(1, 0, 1, 0.93)",
        fastinfade:  "cubic-bezier(0, 0.89, 0.63, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
