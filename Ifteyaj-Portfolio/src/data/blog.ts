import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "designer-new-toolbox",
    title: "The Designer's New Toolbox: From Figma to Prompted Interfaces",
    tag: "AI",
    image: "/images/figma-make-toolbox.png",
    description:
      "For most of the last decade, a designer's day started in Figma. In 2026, it's just as likely to start in a chat window. The toolbox changed — the job didn't.",
    body: [
      "For most of the last decade, a designer's day started in Figma. In 2026, it's just as likely to start in a chat window. Tools that generate working UI from a prompt — then let you refine it with natural language instead of mouse-drag adjustments — have moved from novelty to default workflow at a lot of studios.",
      "This hasn't replaced traditional design tools so much as it's rearranged where they sit in the process. Designers increasingly use AI generation to get from a blank page to a rough, structurally sound first draft in minutes, then move into Figma (or straight into code) to do the part that still needs a human eye: taste. Spacing that feels right instead of just technically correct. Restraint. Knowing when not to add the extra gradient the model suggested.",
      "The studios doing this well aren't the ones chasing the fastest generation speed — they're the ones who've figured out how to use AI for the 80% that's mechanical (grids, component variants, responsive scaling) so more of the designer's actual time goes into the 20% that's judgment. The studios doing it badly are shipping interfaces that all look like they came from the same model, because nobody edited what the model gave them.",
      "The toolbox changed. The job — making something people actually want to use — didn't.",
    ],
  },
  {
    slug: "vibe-coding-seriously",
    title: "Vibe Coding, Seriously: What Happens When Anyone Can Build",
    tag: "Vibe Coding",
    image: "/images/Vibe Coding.png",
    description:
      "Vibe coding started as a half-joke. In 2026 it's a real category of work — and it has pulled a lot of new people into building things.",
    body: [
      "\u201CVibe coding\u201D started as a half-joke term for building software by describing what you want and letting an AI agent handle the implementation. In 2026 it's a real category of work, and it's pulled a lot of new people into building things — designers who never learned to code, founders skipping the \u201Chire an engineer\u201D step, hobbyists shipping apps over a weekend.",
      "The upside is obvious: the distance between an idea and a working prototype has collapsed. What used to take a small team a sprint can take one person an afternoon. That's genuinely changed who gets to build things, not just how fast.",
      "The less obvious part is what it's done to the middle of a project. Vibe coding is excellent at the first 80% — scaffolding, wiring up a UI, getting something clickable. It's much shakier at the last 20%: edge cases, performance under real load, security, the stuff that doesn't show up until someone other than the builder tries to break it. A lot of 2026's \u201Cbuilt in a weekend\u201D projects are quietly getting rebuilt by actual engineers before they can handle real users.",
      "The honest read: vibe coding is a real unlock for prototyping and personal tools, and a real risk when the output gets mistaken for production-ready just because it looks finished.",
    ],
  },
  {
    slug: "design-to-dev-handoff",
    title: "Design-to-Dev Handoff Is Disappearing — and That's Not All Good",
    tag: "Process",
    image: "/images/Design to Dev.webp",
    description:
      "The handoff used to be a defined boundary. In 2026 it's dissolving into a continuous loop — and that surfaces a new problem.",
    body: [
      "The classic handoff — designer finishes a Figma file, hands it to a developer, developer interprets it into code, designer does a review pass — used to be a defined, if often painful, boundary. In 2026, agentic coding tools increasingly go straight from a design reference — or even just a screenshot — to working code, and iterate on that code conversationally. The handoff, as a discrete step, is dissolving into a continuous loop.",
      "For a lot of small teams this is a clear win: less translation loss, faster iteration, and designers who can directly nudge spacing and motion in the actual build instead of a static mockup. The gap between \u201Cthis is what I designed\u201D and \u201Cthis is what shipped\u201D has narrowed.",
      "But it's surfaced a new problem — pixel-perfect isn't the same as intentional. An AI agent can match a reference screenshot closely and still miss the reasoning behind a design decision: why that button is secondary-styled, why that section breaks the grid on purpose, why the copy is short there and long here. Handoff used to force someone to articulate that reasoning, even informally, in a review conversation. When the loop is designer-to-agent with no developer in between, that reasoning has to get written down somewhere, or it gets lost — and six months later nobody remembers why a screen looks the way it does.",
      "The teams handling this well have started treating the \u201Cwhy,\u201D not just the \u201Cwhat,\u201D as a real deliverable — short rationale notes living alongside components, meant for the next person — human or agent — touching the file.",
    ],
  },
  {
    slug: "who-owns-an-ai-design",
    title: "Who Owns a Design an AI Helped You Make?",
    tag: "Ownership",
    image: "/images/Own a Design.webp",
    description:
      "\"Who made this\" has gotten genuinely complicated — legally, professionally, and just as a matter of how a designer feels about their own portfolio.",
    body: [
      "The originality question in design didn't start with AI, but 2026 has made it a lot harder to avoid. When a layout, an illustration style, or a whole brand system comes out of a model trained on a huge, largely unlicensed sweep of existing design work, \u201Cwho made this\u201D gets genuinely complicated — legally, professionally, and just as a matter of how a designer feels about their own portfolio.",
      "Two things are happening at once. Client contracts are starting to include explicit language about AI-assisted work — some clients want full disclosure, some want none of it, and some don't care as long as it's original enough to survive a reverse-image search. And designers themselves are split: some treat AI generation as just another tool, no different from a stock photo library or a plugin; others feel it undercuts the specific thing they're being paid for, which is a point of view, not just an output.",
      "There's no industry-wide resolution here yet, and there probably won't be a clean one — copyright law is still catching up, and \u201Cinspired by\u201D has always been a blurry line even before AI entered the picture. What's changed is the speed and volume: a designer can now produce in an hour what used to represent a week of visual research, which makes the \u201Cis this actually mine\u201D question come up a lot more often than it used to.",
      "The practical middle ground a lot of working designers have landed on: use AI freely for exploration and speed, but treat the final creative decisions — the ones that actually define the work — as the part that has to be genuinely yours.",
    ],
  },
  {
    slug: "the-job-didnt-disappear",
    title: "The Job Didn't Disappear. It Moved.",
    tag: "Industry",
    image: "/images/basic-feather.webp",
    description:
      "The pure production role is shrinking. The parts hardest to specify in a prompt are growing. The job didn't disappear — it moved.",
    body: [
      "Every year since generative AI got good at making things that look finished, someone predicts this is the year design jobs disappear. In 2026, that hasn't happened — but the job itself has moved, and the people who haven't moved with it are having a much harder time than the people who have.",
      "What's shrinking: the pure production role — someone whose main value was executing a well-defined brief efficiently in a tool. AI is legitimately faster and cheaper at that now, and clients know it.",
      "What's growing: the parts of the job that are hardest to specify in a prompt. Understanding a business problem well enough to know what the right design question even is. Making a call between two options that both \u201Cwork\u201D but serve different goals. Reviewing AI output critically instead of accepting the first plausible version. Client and stakeholder conversations, which still need a human who can read a room. Systems thinking — holding a whole brand or product coherent across dozens of touchpoints, which current tools are still bad at doing on their own.",
      "The designers thriving in 2026 aren't the ones who refused to touch AI tools, and they're not the ones who let AI make every decision for them. They're the ones who got fast at using AI for the mechanical parts of the job specifically so they'd have more time for the parts that still require a person — taste, judgment, and actually understanding what a client is trying to accomplish.",
      "That's not a smaller job. It's a different one.",
    ],
  },
];
