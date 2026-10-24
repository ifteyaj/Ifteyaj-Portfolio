import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 120 120",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

export function IconDiscovery(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true" focusable="false">
      <circle cx="52" cy="52" r="30" />
      <circle cx="52" cy="52" r="16" />
      <line x1="74" y1="74" x2="96" y2="96" />
      <circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="72" cy="34" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="34" cy="72" r="2.5" fill="currentColor" stroke="none" />
      <line x1="32" y1="32" x2="52" y2="52" strokeDasharray="2 3" />
      <line x1="72" y1="34" x2="52" y2="52" strokeDasharray="2 3" />
    </svg>
  );
}

export function IconStrategy(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true" focusable="false">
      <circle cx="46" cy="52" r="26" />
      <circle cx="74" cy="52" r="26" />
      <circle cx="60" cy="76" r="26" />
      {/* crosshatch in the central intersection */}
      <g stroke="currentColor" strokeWidth="1">
        <line x1="54" y1="56" x2="66" y2="68" />
        <line x1="66" y1="56" x2="54" y2="68" />
        <line x1="52" y1="62" x2="68" y2="62" />
        <line x1="60" y1="54" x2="60" y2="70" />
      </g>
    </svg>
  );
}

export function IconDesign(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true" focusable="false">
      <path d="M24 78 C 40 18, 80 18, 96 78" />
      <circle cx="24" cy="78" r="3" />
      <circle cx="96" cy="78" r="3" />
      <line x1="24" y1="78" x2="40" y2="18" strokeDasharray="3 3" />
      <line x1="96" y1="78" x2="80" y2="18" strokeDasharray="3 3" />
      <circle cx="40" cy="18" r="3" fill="currentColor" stroke="none" />
      <circle cx="80" cy="18" r="3" fill="currentColor" stroke="none" />
      <path d="M52 98 L 60 88 L 68 98" />
    </svg>
  );
}

export function IconBuildLaunch(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden="true" focusable="false">
      {/* 3x3 dot grid */}
      <circle cx="30" cy="30" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="60" cy="30" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="90" cy="30" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="30" cy="60" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="90" cy="60" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="30" cy="90" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="60" cy="90" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="90" cy="90" r="1.5" fill="currentColor" stroke="none" />
      {/* one shape resolved from the grid */}
      <circle cx="60" cy="60" r="18" />
      <line x1="60" y1="30" x2="60" y2="42" />
      <line x1="60" y1="78" x2="60" y2="90" />
      <line x1="30" y1="60" x2="42" y2="60" />
      <line x1="78" y1="60" x2="90" y2="60" />
    </svg>
  );
}
