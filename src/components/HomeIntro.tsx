import { homeContent } from "@/data/home";

/**
 * Home copy block: the small intro paragraph and the big headline.
 *
 * On desktop the paragraph is placed on the header nav's second column (see
 * `.home-copy-grid` in globals.css), so its left edge lines up with the nav.
 * The headline and everything below align to the page's left padding.
 */
export default function HomeIntro() {
  return (
    <>
      <div className="home-copy-grid">
        <p className="home-intro">{homeContent.intro}</p>
      </div>

      <h1 className="home-headline">
        {/* Name for search engines and screen readers without changing the hero. */}
        <span className="sr-only">Ifteyaj Ahmed</span>
        {homeContent.headline.map((line, lineIndex) => (
          <span className="home-headline-line" key={lineIndex}>
            {line}
          </span>
        ))}
      </h1>
    </>
  );
}
