import { Button } from "@/components/ui/button";
import BirthdayWidget from "./birthday-widget";

export default function Sidebar() {
  const systemLinks = [
    "FTI",
    "SEI",
    "CEDI",
    "SISPEUC",
    "SELSISA",
    "SIMPROC WEB",
    "SIMPROC (Antigo)",
    "SIMPROC SERVIÇOS",
    "SISZON",
    "De Olho na Obra",
    "Bens Patrimoniais",
    "GeoSampa",
    "DMASP",
  ];

  return (
    <div className="space-y-6">
      {/* Suporte Técnico */}
      <div className="bg-[#0a3299] rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">SUPORTE TÉCNICO</h2>
        <p className="text-sm mb-4">Identifique sua máquina:</p>
        <div className="bg-[#395aad] rounded p-3 mb-4 text-center">
          <div className="font-bold text-lg">SMULWK005</div>
          <div className="text-sm">10.75.33.9</div>
        </div>
        <Button className="w-full bg-[#f94668] hover:bg-[#eb3c00] text-white">
          ABRIR CHAMADO
        </Button>
      </div>

      {/* Sistemas */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          Sistemas
        </h2>
        <div className="space-y-2">
          {systemLinks.map((link) => (
            <Button
              key={link}
              variant="outline"
              className="w-full justify-start bg-[#0a3299] text-white border-[#0a3299] hover:bg-[#395aad] text-sm py-2"
            >
              {link}
            </Button>
          ))}
        </div>
      </div>

      {/* Aniversariantes */}
      <BirthdayWidget />
    </div>
  );
}
