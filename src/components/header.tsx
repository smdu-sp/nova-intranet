import Image from "next/image";
import Link from "next/link";
import AccessibilityBar from "./accessibility-bar";
import Navigation from "./navigation";

export default function Header() {
  return (
    <>
      <AccessibilityBar />
      <header
        className="site-header grid-container grid-parent flex justify-center mt-8"
        id="masthead"
        aria-label="Site"
      >
        <div className="flex flex-col">
          <div className="inside-header w-[1491px]">
            <div className="site-logo">
              <Link href="/" rel="home">
                <Image
                  className="header-image is-logo-image w-full h-auto"
                  alt="SMUL – Intranet"
                  src="/images/banner_home.png"
                  width={1491}
                  height={286}
                  priority
                />
              </Link>
            </div>
          </div>
          <nav className="flex justify-center">
            <div className="w-[1491px] bg-[#e5e5e5]">
              <div className="flex justify-around">
                <Navigation />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
