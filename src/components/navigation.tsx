import Link from "next/link";

export default function Navigation() {
  const navItems = [
    "SMUL",
    "SERVIDORES",
    "SOLICITAÇÕES",
    "CONTATOS",
    "MANUAIS",
    "LINKS",
  ];

  return (
    <nav className="flex justify-center">
      <div className="w-[1491px] bg-[#e5e5e5] px-4">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const href =
              item === "CONTATOS" ? "/contatos" : item === "SMUL" ? "/" : "#";
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
  );
}
