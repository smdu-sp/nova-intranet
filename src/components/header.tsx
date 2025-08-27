import Image from "next/image";
import Link from "next/link";
import AccessibilityBar from "./accessibility-bar";

const navItems = [
  "SMUL",
  "SERVIDORES",
  "SOLICITAÇÕES",
  "CONTATOS",
  "MANUAIS",
  "LINKS",
];

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
                {navItems.map((item) => {
                  const href = item === "CONTATOS" ? "/contatos" : "#";
                  return (
                    <Link
                      key={item}
                      href={href}
                      className="py-4 px-2 text-[#333333] font-semibold hover:text-[#0a3299] border-b-2 border-transparent hover:border-[#0a3299] transition-colors"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
