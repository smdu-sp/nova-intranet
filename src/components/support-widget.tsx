"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SystemInfo {
  hostname: string;
  ipAddress: string;
}

export default function SupportWidget() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSystemInfo = async () => {
      try {
        setLoading(true);

        // Buscar informações do sistema via API
        const response = await fetch("/api/system-info");
        const result = await response.json();

        if (result.success) {
          setSystemInfo(result.data);
          setError(null);
        } else {
          setError(result.error || "Erro ao obter informações do sistema");
        }
      } catch (err) {
        setError("Erro ao obter informações do sistema");
        console.error("Error fetching system info:", err);
      } finally {
        setLoading(false);
      }
    };

    getSystemInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🖥️</span>
          <h2 className="text-lg font-bold text-[#0a3299] ">SUPORTE TÉCNICO</h2>
        </div>
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🖥️</span>
          <h2 className="text-lg font-bold text-[#0a3299]">SUPORTE TÉCNICO</h2>
        </div>
        <div className="text-center text-red-500 text-sm mb-2">{error}</div>
        <div className="text-center text-gray-500 text-xs">
          Não foi possível obter as informações do sistema
        </div>
      </div>
    );
  }

  if (!systemInfo) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🖥️</span>
          <h2 className="text-lg font-bold text-[#0a3299]">SUPORTE TÉCNICO</h2>
        </div>
        <div className="text-center text-gray-500 text-sm">
          Informações do sistema não disponíveis
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a3299] rounded-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-4 text-center">SUPORTE TÉCNICO</h2>
      <p className="text-sm mb-4 text-center">Identifique sua máquina:</p>
      <div className="bg-[#395aad] rounded p-3 mb-4 text-center">
        <div className="font-bold text-lg">{systemInfo.hostname}</div>
        <div className="text-sm">{systemInfo.ipAddress}</div>
      </div>
      <Button className="w-full bg-[#f94668] hover:bg-[#eb3c00] text-white">
        ABRIR CHAMADO
      </Button>
    </div>
  );
}
