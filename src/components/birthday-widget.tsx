"use client";

import { useState, useEffect } from "react";

interface BirthdayPerson {
  cp_nome: string;
  cp_nasc_mes: number;
  cp_nasc_dia: number;
  cp_departamento: string;
}

export default function BirthdayWidget() {
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/birthdays");
        const result = await response.json();

        if (result.success) {
          setBirthdays(result.data);
          setError(null);
        } else {
          setError(result.error || "Erro ao carregar aniversariantes");
        }
      } catch (err) {
        setError("Erro ao carregar aniversariantes");
        console.error("Error fetching birthdays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  // Calculate date range for display
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);

  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎂</span>
          <h2 className="text-lg font-bold text-[#f94668]">
            ANIVERSARIANTES
            <br />
            {formatDate(threeDaysAgo)} - {formatDate(sevenDaysFromNow)}
          </h2>
        </div>
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎂</span>
          <h2 className="text-lg font-bold text-[#f94668]">
            ANIVERSARIANTES
            <br />
            {formatDate(threeDaysAgo)} - {formatDate(sevenDaysFromNow)}
          </h2>
        </div>
        <div className="text-center text-red-500 text-sm mb-2">{error}</div>
        <div className="text-center text-gray-500 text-xs">
          Verifique a conexão com o banco de dados
        </div>
      </div>
    );
  }

  if (birthdays.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎂</span>
          <h2 className="text-lg font-bold text-[#f94668]">
            ANIVERSARIANTES
            <br />
            {formatDate(threeDaysAgo)} - {formatDate(sevenDaysFromNow)}
          </h2>
        </div>
        <div className="text-center text-gray-500 text-sm">
          Nenhum aniversariante neste período
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎂</span>
        <h2 className="text-lg font-bold text-[#f94668]">
          ANIVERSARIANTES
          <br />
          {formatDate(threeDaysAgo)} - {formatDate(sevenDaysFromNow)}
        </h2>
      </div>
      <div className="space-y-3">
        {birthdays.map((person, index) => {
          const today = new Date();
          const currentMonth = today.getMonth() + 1; // getMonth() retorna 0-11
          const currentDay = today.getDate();

          // Converter para número para garantir comparação correta
          const personMonth = Number(person.cp_nasc_mes);
          const personDay = Number(person.cp_nasc_dia);

          const isToday =
            personMonth === currentMonth && personDay === currentDay;

          return (
            <div key={index} className="flex gap-3 p-2 rounded bg-[#f6f6f6]">
              <div className="bg-[#f94668] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {person.cp_nasc_dia}
              </div>
              <div className="text-xs flex-1">
                <div className="font-bold text-[#0a3299]">{person.cp_nome}</div>
                <div className="text-[#666666]">{person.cp_departamento}</div>
                {isToday && (
                  <div className="text-[#f94668] font-bold text-xs mt-1  pt-1">
                    Hoje!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
