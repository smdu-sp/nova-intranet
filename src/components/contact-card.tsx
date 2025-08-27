interface Contact {
  id_key: number;
  cp_nome: string;
  cp_cargo: string;
  cp_telefone: string;
  cp_departamento: string;
  cp_secretaria: string;
  cp_email: string;
  cp_nasc_dia: string;
  cp_nasc_mes: number;
}

interface ContactCardProps {
  contact: Contact;
  index: number;
  formatBirthday: (day: string, month: number) => string;
}

export default function ContactCard({
  contact,
  index,
  formatBirthday,
}: ContactCardProps) {
  return (
    <div className="flex">
      {/* Número do contato */}
      <div className="w-16 bg-[#666666] text-white text-center py-4 font-bold text-lg flex-shrink-0">
        {index}
      </div>

      {/* Informações do contato */}
      <div className="flex-1 p-4 border-r border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          {/* Coluna esquerda - Rótulos */}
          <div className="space-y-3 text-sm">
            <div className="font-bold text-gray-700">Nome:</div>
            <div className="font-bold text-gray-700">Cargo:</div>
            <div className="font-bold text-gray-700">Tel. Novo:</div>
            <div className="font-bold text-gray-700">Tel. Antigo:</div>
            <div className="font-bold text-gray-700">Unidade:</div>
            <div className="font-bold text-gray-700">Aniversário:</div>
            <div className="font-bold text-gray-700">E-mail:</div>
          </div>

          {/* Coluna direita - Valores */}
          <div className="space-y-3 text-sm">
            <div className="text-gray-900">{contact.cp_nome || "-"}</div>
            <div className="text-gray-900">{contact.cp_cargo || "-"}</div>
            <div className="text-gray-900">{contact.cp_telefone || "-"}</div>
            <div className="text-gray-900">-</div>
            <div className="text-gray-900">
              {contact.cp_departamento || "-"}
            </div>
            <div className="text-gray-900">
              {formatBirthday(contact.cp_nasc_dia, contact.cp_nasc_mes)}
            </div>
            <div className="text-gray-900">
              {contact.cp_email ? (
                <a
                  href={`mailto:${contact.cp_email}`}
                  className="text-[#0a3299] hover:underline"
                >
                  {contact.cp_email}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
