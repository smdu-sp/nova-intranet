"use client";

import { useState } from "react";
import AdvancedEditor from "@/components/advanced-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestAdvancedEditorPage() {
  const [content, setContent] = useState(`
    <h1>Teste do Editor Avançado</h1>
    <p>Este é um teste do editor com <strong>formatação completa</strong> e <em>cores</em>.</p>
    <h2>Funcionalidades Disponíveis:</h2>
    <ul>
      <li><span style="color: #FF0000;">Texto colorido</span></li>
      <li><mark style="background-color: #FFFF00;">Texto destacado</mark></li>
      <li><u>Texto sublinhado</u></li>
      <li><s>Texto riscado</s></li>
      <li><sub>Subscript</sub> e <sup>Superscript</sup></li>
    </ul>
    <blockquote>
      <p>Este é um bloco de citação para testar a funcionalidade.</p>
    </blockquote>
    <p>Você pode usar diferentes <span style="font-family: 'Times New Roman';">fontes</span> e <span style="font-size: 24px;">tamanhos</span>.</p>
  `);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cms">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o CMS
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#0a3299]">
            Teste do Editor Avançado
          </h1>
          <p className="text-gray-600">
            Testando todas as funcionalidades de formatação
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Editor:</h2>
          <AdvancedEditor content={content} onChange={setContent} />
        </div>

        {/* Preview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Preview do Conteúdo:</h2>
          <div className="bg-white border border-gray-300 rounded-lg p-6 min-h-[400px] overflow-auto">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          🎨 Funcionalidades do Editor Avançado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold">Formatação de Texto:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Negrito, Itálico, Sublinhado, Riscado</li>
              <li>Subscript e Superscript</li>
              <li>Títulos H1, H2, H3</li>
              <li>Listas ordenadas e não ordenadas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Cores e Estilos:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Paleta de cores completa</li>
              <li>Destaque de texto</li>
              <li>Diferentes fontes</li>
              <li>Tamanhos de fonte variados</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Elementos:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Links</li>
              <li>Imagens</li>
              <li>Tabelas</li>
              <li>Blocos de código</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Alinhamento:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Esquerda, Centro, Direita</li>
              <li>Justificado</li>
              <li>Linhas horizontais</li>
              <li>Citações</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
