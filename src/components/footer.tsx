import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <Image
              src="/images/logo_smul.png"
              alt="São Paulo Coat of Arms"
              width={211}
              height={101}              
            />           
          </div>

          <div>
            <h4 className="font-bold mb-2">Secretaria Municipal de Urbanismo e Licenciamento</h4>
            <p className="text-sm text-[#d9d9d9] leading-relaxed">
              Rua São Bento, 405 Centro - 8°, 17°, 18°, 19°, 20°, 21°
              <br />e 22° andar CEP 01011-100 - São Paulo - SP
            </p>
            <p className="text-sm text-[#d9d9d9] mt-4">
              Em caso de dúvidas, sugestões, entre em contato pelo email:
              <br />
              <a href="mailto:smulsuporte@prefeitura.sp.gov.br" className="text-[#37aee2]">
                smulsuporte@prefeitura.sp.gov.br
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">Institucional</h4>
            <ul className="text-sm text-[#d9d9d9] space-y-1">
              <li>
                <a href="#" className="hover:text-white">
                  Ouvidoria
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Transparência
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Manuais
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#494949] mt-8 pt-4 text-center">
          <p className="text-sm text-[#d9d9d9]">
            <a href="#" className="hover:text-white">
              Voltar ao topo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
