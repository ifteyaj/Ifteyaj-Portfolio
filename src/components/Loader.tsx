import { siteConfig } from "@/data/site";
import LoaderSvg from "@/components/LoaderSvg";

export default function Loader() {
  return (
    <div className="frontpage-loader" aria-hidden="true">
      <div className="frontpage-loader-container">
        {/* Top left: Name */}
        <div className="loader-corner loader-corner--top-left">
          <div className="loader-header-one">
            <p className="loader-header">Ifteyaj Ahmed</p>
          </div>
        </div>

        {/* Top right: Loading counter */}
        <div className="loader-corner loader-corner--top-right">
          <div className="frontpage-loader-counter">
            <div className="frontpage-counter-content">[</div>
            <div className="frontpage-counter-number">0</div>
            <div className="frontpage-counter-content">]</div>
          </div>
        </div>

        {/* Middle left: Web Designer */}
        <div className="loader-corner loader-corner--middle-left">
          <div className="loader-header-one">
            <p className="loader-header">Web Designer</p>
          </div>
        </div>

        {/* Center: Logo with draw-on animation */}
        <div className="loader-center">
          <div className="frontpage-logo-loader loader-logo-wrap">
            <LoaderSvg />
          </div>
        </div>

        {/* Middle right: Brand Designer */}
        <div className="loader-corner loader-corner--middle-right">
          <div className="loader-header-one text-aling-right">
            <p className="loader-header text-aling-right">Brand Designer</p>
          </div>
        </div>

        {/* Bottom left: Portfolio */}
        <div className="loader-corner loader-corner--bottom-left">
          <div className="loader-header-one">
            <p className="loader-header grey-header">Portfolio</p>
          </div>
        </div>

        {/* Bottom right: Copyright */}
        <div className="loader-corner loader-corner--bottom-right">
          <div className="loader-header-one text-aling-right">
            <p className="loader-header grey-header text-aling-right">{siteConfig.copyright}!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
