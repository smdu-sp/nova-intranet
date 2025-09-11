"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Filter, FileImage } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PapoUrbanoFile {
  name: string;
  coverPath: string;
  mainPath: string;
  year: number;
  month: string;
}

export default function PapoUrbanoPage() {
  const [files, setFiles] = useState<PapoUrbanoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<PapoUrbanoFile | null>(null);
  const [filterYear, setFilterYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    loadPapoUrbanoFiles();
  }, []);

  const loadPapoUrbanoFiles = () => {
    try {
      setLoading(true);

      // Lista dos arquivos PNG disponíveis baseada na estrutura de pastas
      const papoUrbanoFiles: PapoUrbanoFile[] = [
        {
          name: "Papo Urbano - Janeiro 2025",
          coverPath:
            "/images/Papo Urbano/2025/Janeiro/Capa/papo-urbano-intranet-janeiro-2025.png",
          mainPath:
            "/images/Papo Urbano/2025/Janeiro/Papo_Urbano_2025_Janeiro.png",
          year: 2025,
          month: "Janeiro",
        },
        {
          name: "Papo Urbano - Dezembro 2024",
          coverPath:
            "/images/Papo Urbano/2024/Dezembro/Capa/Papo_Urbano_2024_Dezembro.png",
          mainPath:
            "/images/Papo Urbano/2024/Dezembro/papo-urbano-intranet-dezembro-2024.png",
          year: 2024,
          month: "Dezembro",
        },
      ];

      setFiles(papoUrbanoFiles);

      // Extrair anos únicos para o filtro
      const years = [...new Set(papoUrbanoFiles.map((f) => f.year))].sort(
        (a, b) => b - a
      );
      setAvailableYears(years);
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = filterYear
    ? files.filter((file) => file.year === parseInt(filterYear))
    : files;

  const handleFileClick = (file: PapoUrbanoFile) => {
    console.log("Arquivo selecionado:", file);
    setSelectedFile(file);
  };

  const handleBackToList = () => {
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando edições...</p>
        </div>
      </div>
    );
  }

  if (selectedFile) {
    return (
      <div className="min-h-screen bg-[#f6f6f6]">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-[#0a3299]">
                    Papo Urbano
                  </h1>
                  <p className="text-gray-600">
                    {selectedFile.month} {selectedFile.year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualização do Arquivo */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="mb-4">
                <Badge variant="outline" className="mb-4">
                  {selectedFile.month} {selectedFile.year}
                </Badge>
                <h1 className="text-3xl font-bold text-[#0a3299] mb-4">
                  {selectedFile.name}
                </h1>
              </div>

              {/* Imagem do Papo Urbano */}
              <div className="relative w-full">
                {selectedFile.mainPath ? (
                  <Image
                    src={selectedFile.mainPath}
                    alt={selectedFile.name}
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Imagem não encontrada</p>
                  </div>
                )}
              </div>

              {/* Botão para abrir em nova aba */}
              <div className="mt-6 text-center">
                {selectedFile.mainPath && (
                  <Button
                    onClick={() => window.open(selectedFile.mainPath, "_blank")}
                    className="bg-[#0a3299] hover:bg-[#395aad] text-white"
                  >
                    <FileImage className="w-4 h-4 mr-2" />
                    Abrir em Nova Aba
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0a3299] mb-2">
                Papo Urbano
              </h1>
              <div className="w-16 h-1 bg-[#0a3299]"></div>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Início</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Filtrar por ano:
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
              >
                <option value="">Todos os anos</option>
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredFiles.length} arquivo
              {filteredFiles.length !== 1 ? "s" : ""} encontrado
              {filteredFiles.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Grid de Arquivos */}
        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredFiles.map((file, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={file.coverPath}
                    alt={file.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                  {/* Badge do Arquivo */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[#0a3299] text-white">
                      {file.month} {file.year}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3">
                  <div className="text-center">
                    <h3 className="font-semibold text-sm group-hover:text-[#0a3299] transition-colors">
                      {file.month} {file.year}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p className="text-gray-500">
              {filterYear
                ? `Não há arquivos do Papo Urbano em ${filterYear}.`
                : "Ainda não há arquivos do Papo Urbano disponíveis."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
