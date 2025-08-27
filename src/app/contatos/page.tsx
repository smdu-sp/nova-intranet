"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactCard from "@/components/contact-card";
import Image from "next/image";
import Link from "next/link";
import AccessibilityBar from "@/components/accessibility-bar";
import Navigation from "@/components/navigation";

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

export default function ContatosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("cp_nome");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const searchFields = [
    { value: "cp_nome", label: "Nome" },
    { value: "cp_cargo", label: "Cargo" },
    { value: "cp_departamento", label: "Departamento" },
    { value: "cp_secretaria", label: "Secretaria" },
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
        params.append("field", searchField);
      }
      if (selectedLetter) {
        params.append("letter", selectedLetter);
      }

      const url = `/api/contacts?${params}`;
      console.log("🔍 Fazendo requisição para:", url);
      console.log("📝 Parâmetros:", {
        searchTerm,
        searchField,
        selectedLetter,
      });

      const response = await fetch(url);
      const result = await response.json();

      console.log("📡 Resposta da API:", result);

      if (result.success) {
        setContacts(result.data);
        setTotalResults(result.total);
        setError(null);
        console.log(`✅ ${result.total} contatos carregados`);
      } else {
        setError(result.error || "Erro ao carregar contatos");
        console.error("❌ Erro da API:", result.error);
      }
    } catch (err) {
      setError("Erro ao carregar contatos");
      console.error("❌ Erro ao fazer requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
    setSearchTerm("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedLetter(null);
    fetchContacts();
  };

  const formatBirthday = (day: string, month: number) => {
    if (!day || !month) return "/";
    return `${day} / ${month}`;
  };

  return (
    <>
      <AccessibilityBar />
      <header
        className="site-header w-full bg-[#f5f5f5] mt-8"
        id="masthead"
        aria-label="Site"
      >
        <div className="flex flex-col items-center">
          <div className="inside-header w-[1491px]">
            <div className="site-logo">
              <Link href="/" rel="home">
                <Image
                  className="header-image is-logo-image w-full h-auto"
                  alt="SMUL – Intranet - Contatos"
                  src="/images/banner-contato.png"
                  width={1491}
                  height={286}
                  priority
                />
              </Link>
            </div>
          </div>
          <Navigation />
        </div>
      </header>

      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contatos</h1>
            <div className="w-full h-0.5 bg-[#0a3299]"></div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
              {/* Dropdown Field Selector */}
              <div className="relative">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="appearance-none bg-gray-200 text-gray-700 px-4 py-2 pr-8 rounded-l border-0 focus:outline-none focus:ring-2 focus:ring-[#0a3299]"
                >
                  {searchFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Digite o termo de busca..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value && selectedLetter) {
                    setSelectedLetter(null);
                  }
                }}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:border-[#0a3299] hover:bg-gray-50 focus:outline-none"
              />

              {/* Search Button */}
              <Button
                type="submit"
                className="bg-[#0a3299] hover:bg-[#395aad] text-white px-6"
              >
                Buscar
              </Button>

              {/* Refresh Button */}
              <Button
                type="button"
                onClick={fetchContacts}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4"
              >
                Atualizar
              </Button>

              {/* Clear Filters Button */}
              {(selectedLetter || searchTerm) && (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedLetter(null);
                    setSearchTerm("");
                    fetchContacts();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4"
                >
                  Limpar Filtros
                </Button>
              )}
            </form>
          </div>

          {/* Alphabet Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-1">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`w-10 h-10 text-sm font-medium rounded transition-colors ${
                    selectedLetter === letter
                      ? "bg-[#0a3299] text-white"
                      : "bg-white text-[#0a3299] hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="bg-[#395aad] text-white p-4 rounded-t-lg">
            <h3 className="font-medium">
              {searchTerm
                ? `Resultados para "${searchTerm}" (${totalResults} resultados)`
                : selectedLetter
                ? `Contatos iniciando com "${selectedLetter}" (${totalResults} resultados)`
                : `Todos os contatos (${totalResults} resultados)`}
            </h3>
            {/* Indicadores visuais */}
            <div className="flex gap-2 mt-2 text-sm">
              {selectedLetter && (
                <span className="bg-white text-[#395aad] px-2 py-1 rounded">
                  🔤 Filtro: Letra &ldquo;{selectedLetter}&rdquo;
                </span>
              )}
              {searchTerm && (
                <span className="bg-white text-[#395aad] px-2 py-1 rounded">
                  🔍 Busca: &ldquo;{searchTerm}&rdquo; em{" "}
                  {searchFields.find((f) => f.value === searchField)?.label}
                </span>
              )}
            </div>
          </div>

          {/* Contacts List */}
          <div className="bg-white rounded-b-lg shadow-sm">
            {loading ? (
              <div className="p-8 text-center">
                <div className="text-gray-500">Carregando contatos...</div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-2">{error}</div>
                <Button
                  onClick={fetchContacts}
                  className="bg-[#0a3299] hover:bg-[#395aad]"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500">Nenhum contato encontrado</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {contacts.map((contact, index) => (
                  <ContactCard
                    key={contact.id_key}
                    contact={contact}
                    index={index + 1}
                    formatBirthday={formatBirthday}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
