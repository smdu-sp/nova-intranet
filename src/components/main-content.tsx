"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import ContentSection from "./content-section";

export default function MainContent() {
  return (
    <div className="space-y-8">
      {/* SMUL na Mídia */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          SMUL na Mídia
        </h2>
        <div className="space-y-4">
          <h3 className="font-bold text-[#333333]">
            Clipping diário de notícias
          </h3>
          <p className="text-[#666666] text-sm leading-relaxed">
            Acompanhe as reportagens publicadas nos principais veículos de
            imprensa do país sobre programas, planos, projetos e demais
            iniciativas da SMUL
          </p>
          <Button className="bg-[#0a3299] hover:bg-[#395aad] text-white px-6 py-2 text-sm">
            VER MAIS
          </Button>
        </div>
      </section>

      {/* Notícias SMUL */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          Notícias SMUL
        </h2>
        <div className="space-y-4">
          <h3 className="font-bold text-[#333333]">
            Matérias informativas elaboradas pela ASCOM.
          </h3>
          <p className="text-[#666666] text-sm leading-relaxed">
            Fique por dentro das últimas notícias produzidas pela Assessoria de
            Comunicação (ASCOM) para divulgar as ações em desenvolvimento na
            SMUL.
          </p>
          <Button className="bg-[#0a3299] hover:bg-[#395aad] text-white px-6 py-2 text-sm">
            VER MAIS
          </Button>
        </div>
      </section>

      {/* Comunicados */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          Comunicados
        </h2>
        <ComunicadosCarousel />
      </section>

      {/* Papo Urbano */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          Papo Urbano
        </h2>
        <div className="flex gap-4">
          <div className="w-48 h-32 flex-shrink-0">
            <Image
              src="/images/papo_urbano.png"
              alt="Urban scene"
              width={270}
              height={165}
              className="w-full h-full rounded object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#333333] mb-2">Entrevista do Mês</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Saiba quem foi notícia no boletim mensal “Papo Urbano”, publicação
              da SMUL feita exclusivamente para seus servidores e funcionários.
            </p>
          </div>
        </div>
      </section>

      {/* Urbanismo em Pauta */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          Urbanismo em Pauta
        </h2>
        <div className="flex gap-4">
          <div className="w-48 h-32 flex-shrink-0">
            <Image
              src="/images/urbanismo_em_pauta.png"
              alt="Urban development"
              width={270}
              height={165}
              className="w-full h-full rounded object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#333333] mb-2">
              Matéria em destaque
            </h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Confira o boletim “Urbanismo em Pauta”, que, mensalmente, divulga
              as ações de maior relevância da SMUL.
            </p>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
          Galeria
        </h2>
        <div className="relative rounded-lg overflow-hidden mb-4">
          <Image
            src="/images/galeria.png"
            alt="Gallery"
            width={600}
            height={200}
            className="w-full object-cover"
          />
          <div className="absolute inset-0  flex items-center">
            <h3 className="text-white text-4xl font-bold ml-8">              
            </h3>
          </div>
        </div>
        <Button className="bg-[#0a3299] hover:bg-[#395aad] text-white px-6 py-2 text-sm">
          VER MAIS
        </Button>
      </section>
    </div>
  );
}

function ComunicadosCarousel() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    {
      src: "/images/banner-noticia.png",
      alt: "Banner Notícia",
      title: "Banner Notícia",
      description: "Confira as últimas notícias da SMUL",
    },
    {
      src: "/images/banner_intranet_ouvidoria.png",
      alt: "Banner Intranet Ouvidoria",
      title: "Intranet Ouvidoria",
      description: "Acesse o sistema de ouvidoria",
    },
    {
      src: "/images/banner-pesquisa-enps.png",
      alt: "Banner Pesquisa ENPS",
      title: "Pesquisa ENPS",
      description: "Participe da pesquisa de satisfação",
    },
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative bg-gradient-to-r from-[#0a3299] to-[#395aad] rounded-lg text-white overflow-hidden h-[330px] max-w-[880px] mx-auto">
      {/* Imagem atual */}
      <div className="relative h-full w-full">
        <Image
          src={images[currentImage].src}
          alt={images[currentImage].alt}
          width={880}
          height={330}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Setas de navegação */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
        aria-label="Imagem anterior"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
        aria-label="Próxima imagem"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentImage ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
