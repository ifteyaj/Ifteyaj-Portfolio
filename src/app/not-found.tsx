import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-inner">
        <Image
          src="/nav-favicon.svg"
          alt=""
          width={48}
          height={48}
          className="not-found-icon"
          aria-hidden
        />
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-body">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <Link href="/" className="not-found-link">
          Back to home
        </Link>
      </div>
    </div>
  );
}
