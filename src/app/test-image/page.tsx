"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TestImagePage() {
  const [testContent, setTestContent] = useState(`
    <h1>Teste de Imagens</h1>
    <p>Esta é uma página de teste para verificar se as imagens estão sendo exibidas corretamente.</p>
    
    <h2>Imagem de teste 1</h2>
    <img src="/uploads/test-image.jpg" alt="Imagem de teste" />
    
    <h2>Imagem de teste 2</h2>
    <img src="https://via.placeholder.com/400x300/0a3299/ffffff?text=Teste+Externo" alt="Imagem externa" />
    
    <h2>Vídeo de teste</h2>
    <video controls style="max-width: 100%; height: auto;">
      <source src="/uploads/test-video.mp4" type="video/mp4">
      Seu navegador não suporta vídeo.
    </video>
    
    <h2>Iframe de teste</h2>
    <iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
      frameborder="0" 
      allowfullscreen>
    </iframe>
  `);

  const [processedContent, setProcessedContent] = useState("");

  const processContent = () => {
    // Simular o processamento que fazemos no CMSPageViewer
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = testContent;

    // Processar imagens
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img) => {
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.borderRadius = "8px";
      img.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      img.style.margin = "1rem 0";
      img.style.display = "block";

      // Adicionar fallback para imagens quebradas
      img.onerror = () => {
        img.style.display = "none";
        const fallback = document.createElement("div");
        fallback.style.backgroundColor = "#f3f4f6";
        fallback.style.padding = "2rem";
        fallback.style.borderRadius = "8px";
        fallback.style.textAlign = "center";
        fallback.style.color = "#6b7280";
        fallback.style.fontSize = "1.1rem";
        fallback.style.margin = "1rem 0";
        fallback.innerHTML = "🖼️ Imagem não encontrada";
        img.parentNode?.insertBefore(fallback, img);
      };
    });

    // Processar vídeos
    const videos = tempDiv.querySelectorAll("video");
    videos.forEach((video) => {
      video.style.maxWidth = "100%";
      video.style.height = "auto";
      video.style.borderRadius = "8px";
      video.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      video.style.margin = "1rem 0";
    });

    // Processar iframes
    const iframes = tempDiv.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.style.maxWidth = "100%";
      iframe.style.borderRadius = "8px";
      iframe.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      iframe.style.margin = "1rem 0";
    });

    setProcessedContent(tempDiv.innerHTML);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Teste de Renderização de Imagens
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conteúdo original */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Conteúdo Original (HTML)
          </h2>
          <textarea
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Digite o HTML aqui..."
          />
          <Button onClick={processContent} className="mt-4">
            Processar Conteúdo
          </Button>
        </div>

        {/* Conteúdo processado */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Conteúdo Processado (Renderizado)
          </h2>
          <div className="border border-gray-300 rounded-lg p-4 min-h-96 bg-white">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: processedContent || testContent,
              }}
            />
          </div>
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Informações de Debug:</h3>
        <p>
          <strong>Imagens encontradas:</strong>{" "}
          {(testContent.match(/<img/g) || []).length}
        </p>
        <p>
          <strong>Vídeos encontrados:</strong>{" "}
          {(testContent.match(/<video/g) || []).length}
        </p>
        <p>
          <strong>Iframes encontrados:</strong>{" "}
          {(testContent.match(/<iframe/g) || []).length}
        </p>
        <p>
          <strong>Tamanho do conteúdo:</strong> {testContent.length} caracteres
        </p>
      </div>
    </div>
  );
}
