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
          {navItems.map((item) => (
            <button
              key={item}
              className="py-4 px-2 text-[#333333] font-semibold hover:text-[#0a3299] border-b-2 border-transparent hover:border-[#0a3299] transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
