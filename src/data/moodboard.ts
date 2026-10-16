import type { MoodboardItem } from "@/types";

const mb = (n: string, width: number, height: number): MoodboardItem => ({
  title: "Moodboard",
  tag: "Moodboard",
  image: `/images/moodboard/mb-${n}.jpeg`,
  width,
  height,
});

export const moodboardItems: MoodboardItem[] = [
  { title: "Spendo", tag: "Brand Identity", image: "/images/moodboard/mb-06.jpeg", width: 736, height: 414 },
  { title: "Spendo", tag: "Detail", image: "/images/moodboard/mb-12.jpeg", width: 736, height: 736 },
  { title: "Spendo", tag: "Type Study", image: "/images/moodboard/mb-18.jpeg", width: 736, height: 736 },
  { title: "Spendo", tag: "Identity", image: "/images/moodboard/mb-24.jpeg", width: 736, height: 1308 },

  mb("25", 736, 902),
  mb("26", 736, 920),
  mb("27", 736, 466),
  mb("28", 736, 481),
  mb("29", 735, 1175),
  mb("30", 736, 981),
  mb("31", 736, 591),
  mb("32", 736, 983),
  mb("33", 735, 1144),
  mb("34", 736, 484),
  mb("35", 736, 414),
  mb("36", 736, 977),
  mb("37", 736, 920),
  mb("38", 736, 390),
  mb("39", 736, 1104),
  mb("40", 736, 920),
  mb("41", 736, 920),
  mb("42", 736, 981),
  mb("43", 736, 917),
  mb("44", 736, 529),
  mb("45", 736, 925),
  mb("46", 735, 910),
  mb("47", 736, 981),
  mb("48", 736, 736),
  mb("49", 736, 920),
  mb("50", 736, 920),
  mb("51", 736, 1030),
];
