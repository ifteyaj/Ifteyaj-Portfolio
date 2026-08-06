import LottiePlayer from "@/components/ui/Lottie";
import { siteConfig } from "@/data/site";

export default function Loader() {
  return (
    <div className="frontpage-loader" aria-hidden="true">
      <div className="frontpage-loader-container">
        <div className="logo-loader-wrapper">
          <LottiePlayer src="/lottie/logo-loader.json" className="frontpage-logo-loader" />
        </div>
        <div className="loader-headline-right">
          <div className="loader-header-one text-aling-right">
            <h3 className="loader-header text-aling-right">Brand Designer</h3>
          </div>
          <div className="loader-header-two text-aling-right">
            <h3 className="loader-header-2 text-aling-right"></h3>
          </div>
        </div>
        <div className="loader-headline-portflio">
          <div className="loader-header-one">
            <h3 className="loader-header grey-header">Portfolio</h3>
          </div>
        </div>
        <div className="loader-headline-copyright">
          <div className="loader-header-one text-aling-right">
            <h3 className="loader-header grey-header text-aling-right">©{siteConfig.copyright.replace("©", "")}</h3>
          </div>
        </div>
        <div className="loader-headline-left">
          <div className="loader-header-one">
            <h3 className="loader-header">{siteConfig.name}</h3>
          </div>
          <div className="loader-header-two">
            <h3 className="loader-header-2"></h3>
          </div>
        </div>
        <div className="frontpage-loader-counter">
          <div className="frontpage-counter-content">(</div>
          <div className="frontpage-counter-number">0</div>
          <div className="frontpage-counter-content">)</div>
        </div>
      </div>
    </div>
  );
}