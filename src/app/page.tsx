"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import Image from "next/image";

interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  images?: Array<{
    id: number;
    image_url: string;
    alt_text?: string;
    caption?: string;
    order_position: number;
    is_featured: boolean;
  }>;
}

export default function Home() {
  const searchParams = useSearchParams();
  const pageSlug = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pageSlug) {
      fetchPage(pageSlug);
    } else {
      setCurrentPage(null);
    }
  }, [pageSlug]);

  const fetchPage = async (slug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/pages/slug/${slug}`);

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          setCurrentPage(result.data);
        } else {
          setCurrentPage(null);
        }
      } else {
        setCurrentPage(null);
      }
    } catch (error) {
      console.error("Erro ao buscar página:", error);
      setCurrentPage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage(null);
    // Limpar parâmetro da URL
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Header />
      <SearchBar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {currentPage ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6">
                  <button
                    onClick={handleBackToHome}
                    className="hover:text-[#0a3299] text-[#0a3299] hover:underline"
                  >
                    ← Voltar ao início
                  </button>
                  <span className="mx-2">/</span>
                  <span>{currentPage.title}</span>
                </nav>

                {/* Conteúdo da página */}
                <article>
                  {/* Cabeçalho */}
                  <header className="mb-8">
                    <h1 className="text-xl font-bold text-[#0a3299] mb-4 border-b-2 border-[#0a3299] pb-2">
                      {currentPage.title}
                    </h1>

                    {currentPage.meta_description && (
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {currentPage.meta_description}
                      </p>
                    )}
                  </header>

                  {/* Imagens da página */}
                  {currentPage.images && currentPage.images.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold text-[#0a3299] mb-4">
                        Galeria de Imagens
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPage.images.map((image, index) => (
                          <div key={index} className="space-y-2">
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={image.image_url}
                                alt={image.alt_text || `Imagem ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {image.is_featured && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  ★ Destaque
                                </div>
                              )}
                            </div>
                            {image.caption && (
                              <p className="text-sm text-gray-600 text-center">
                                {image.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conteúdo HTML */}
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentPage.content }}
                  />
                </article>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a3299]"></div>
                  <span className="ml-2 text-gray-600">
                    Carregando página...
                  </span>
                </div>
              </div>
            ) : (
              <MainContent />
            )}
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
