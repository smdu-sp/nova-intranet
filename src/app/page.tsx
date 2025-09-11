"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import MainContent from "@/components/main-content";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Eye,
} from "lucide-react";

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

interface Gallery {
  id: number;
  title: string;
  description?: string;
  cover_image: string;
  created_at: string;
  created_by: string;
  images?: GalleryImage[];
  comments?: GalleryComment[];
  _count: {
    images: number;
    comments: number;
    likes: number;
  };
  is_liked?: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface GalleryImage {
  id: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
  order_position: number;
}

interface GalleryComment {
  id: number;
  content: string;
  created_at: string;
  user: {
    display_name: string;
    username: string;
  };
}

export default function Home() {
  const searchParams = useSearchParams();
  const pageSlug = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGalleries, setShowGalleries] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

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
    setShowGalleries(false);
    setSelectedGallery(null);
    // Limpar parâmetro da URL
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.replaceState({}, "", url.toString());
  };

  const handleShowGalleries = () => {
    setShowGalleries(true);
    setCurrentPage(null);
    setSelectedGallery(null);
  };

  const handleSelectGallery = async (galleryId: number) => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}`);
      const result = await response.json();

      if (result.success) {
        setSelectedGallery(result.data);
        setShowGalleries(false);
        setCurrentPage(null);
      }
    } catch (error) {
      console.error("Erro ao carregar galeria:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Header />
      <SearchBar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={"grid grid-cols-1 lg:grid-cols-4 gap-6"}>
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
            ) : selectedGallery ? (
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
                  <button
                    onClick={handleShowGalleries}
                    className="hover:text-[#0a3299] text-[#0a3299] hover:underline"
                  >
                    Galerias
                  </button>
                  <span className="mx-2">/</span>
                  <span>{selectedGallery.title}</span>
                </nav>

                {/* Componente de Galeria Individual */}
                <GalleryDetailComponent gallery={selectedGallery} />
              </div>
            ) : showGalleries ? (
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
                  <span>Galerias</span>
                </nav>

                {/* Componente de Galerias */}
                <GalleriesComponent onSelectGallery={handleSelectGallery} />
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
              <MainContent onShowGalleries={handleShowGalleries} />
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

// Componente de Galerias para ser usado na página principal
function GalleriesComponent({
  onSelectGallery,
}: {
  onSelectGallery: (galleryId: number) => void;
}) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const fetchGalleries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/galleries?page=${pagination.currentPage}&limit=12`
      );
      const result = await response.json();

      if (result.success) {
        setGalleries(result.data.galleries);
        setPagination((prev) => ({
          ...prev,
          totalPages: result.data.totalPages,
          totalItems: result.data.totalItems,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar galerias:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const handleLike = async (galleryId: number) => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        // Atualizar estado local
        setGalleries((prev) =>
          prev.map((gallery) => {
            if (gallery.id === galleryId) {
              const isLiked = !gallery.is_liked;
              return {
                ...gallery,
                is_liked: isLiked,
                _count: {
                  ...gallery._count,
                  likes: isLiked
                    ? gallery._count.likes + 1
                    : gallery._count.likes - 1,
                },
              };
            }
            return gallery;
          })
        );
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando galerias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a3299] mb-2">Galeria</h1>
          <div className="w-16 h-1 bg-[#0a3299]"></div>
        </div>
        <div className="text-sm text-gray-500">
          {pagination.totalItems} galerias encontradas
        </div>
      </div>

      {/* Content */}
      {galleries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma galeria encontrada
          </h3>
          <p className="text-gray-500">Ainda não há galerias disponíveis.</p>
        </div>
      ) : (
        <>
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {galleries.map((gallery) => (
              <Card
                key={gallery.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={gallery.cover_image}
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                  {/* Overlay com informações */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {gallery.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>{gallery._count.images} fotos</span>
                      <span>
                        {new Date(gallery.created_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Badge de status */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-800"
                    >
                      {gallery._count.images} fotos
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Informações da galeria */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {gallery.title}
                      </h3>
                      {gallery.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                    </div>

                    {/* Metadados */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{gallery.created_by}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(gallery.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(gallery.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            gallery.is_liked
                              ? "text-red-500"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              gallery.is_liked ? "fill-current" : ""
                            }`}
                          />
                          <span>{gallery._count.likes}</span>
                        </button>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{gallery._count.comments}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => onSelectGallery(gallery.id)}
                      >
                        Ver Galeria
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={
                          pagination.currentPage === page
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Componente de Galeria Individual para ser usado na página principal
function GalleryDetailComponent({ gallery }: { gallery: Gallery }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [galleryData, setGalleryData] = useState<Gallery>(gallery);

  useEffect(() => {
    if (galleryData.images && galleryData.images.length > 0) {
      setSelectedImage(galleryData.images[0]);
    }
  }, [galleryData.images]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!galleryData.images || galleryData.images.length <= 1) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const currentIndex = galleryData.images.findIndex(
          (img) => img.id === selectedImage?.id
        );
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : galleryData.images.length - 1;
        setSelectedImage(galleryData.images[prevIndex]);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const currentIndex = galleryData.images.findIndex(
          (img) => img.id === selectedImage?.id
        );
        const nextIndex =
          currentIndex < galleryData.images.length - 1 ? currentIndex + 1 : 0;
        setSelectedImage(galleryData.images[nextIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryData.images, selectedImage]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/galleries/${galleryData.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setGalleryData((prev) => {
          if (!prev) return galleryData;
          const isLiked = !prev.is_liked;
          return {
            ...prev,
            is_liked: isLiked,
            _count: {
              ...prev._count,
              likes: isLiked ? prev._count.likes + 1 : prev._count.likes - 1,
            },
          };
        });
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(
        `/api/galleries/${galleryData.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (response.ok) {
        setNewComment("");
        // Recarregar galeria para pegar o novo comentário
        const galleryResponse = await fetch(`/api/galleries/${galleryData.id}`);
        const result = await galleryResponse.json();
        if (result.success) {
          setGalleryData(result.data);
        }
      }
    } catch (error) {
      console.error("Erro ao comentar:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Galeria */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a3299] mb-2">
            {galleryData.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{galleryData.created_by}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(galleryData.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{galleryData.images?.length || 0} fotos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={galleryData.is_liked ? "text-red-500" : ""}
          >
            <Heart
              className={`w-4 h-4 mr-1 ${
                galleryData.is_liked ? "fill-current" : ""
              }`}
            />
            {galleryData._count.likes}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Galeria de Imagens */}
        <div>
          {/* Imagem Principal com Navegação */}
          {selectedImage && (
            <Card className="mb-6 border-gray-200 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden group">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text || galleryData.title}
                  fill
                  className="object-cover"
                />

                {/* Setas de Navegação */}
                {galleryData.images && galleryData.images.length > 1 && (
                  <>
                    {/* Seta Esquerda */}
                    <button
                      onClick={() => {
                        if (!galleryData.images) return;
                        const currentIndex = galleryData.images.findIndex(
                          (img) => img.id === selectedImage.id
                        );
                        const prevIndex =
                          currentIndex > 0
                            ? currentIndex - 1
                            : galleryData.images.length - 1;
                        setSelectedImage(galleryData.images[prevIndex]);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0a3299] p-3 rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                      title="Foto anterior (←)"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Seta Direita */}
                    <button
                      onClick={() => {
                        if (!galleryData.images) return;
                        const currentIndex = galleryData.images.findIndex(
                          (img) => img.id === selectedImage.id
                        );
                        const nextIndex =
                          currentIndex < galleryData.images.length - 1
                            ? currentIndex + 1
                            : 0;
                        setSelectedImage(galleryData.images[nextIndex]);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0a3299] p-3 rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                      title="Próxima foto (→)"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Contador de Fotos */}
                    <div className="absolute top-4 right-4 bg-white/90 text-[#0a3299] px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm font-medium">
                      {galleryData.images.findIndex(
                        (img) => img.id === selectedImage.id
                      ) + 1}{" "}
                      / {galleryData.images.length}
                    </div>
                  </>
                )}
              </div>
              <CardContent className="p-4">
                {selectedImage.caption && (
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedImage.caption}
                  </p>
                )}
                {galleryData.images && galleryData.images.length > 1 && (
                  <p className="text-xs text-gray-500">
                    💡 Use as setas do mouse ou as teclas ← → para navegar entre
                    as fotos
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Grid de Imagens - 3 colunas */}
          {galleryData.images && galleryData.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Todas as Fotos ({galleryData.images.length})
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {galleryData.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition-all hover:shadow-lg ${
                      selectedImage?.id === image.id
                        ? "border-[#0a3299] ring-2 ring-[#0a3299] ring-opacity-30 shadow-lg"
                        : "border-gray-200 hover:border-[#0a3299] hover:shadow-md"
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || galleryData.title}
                      fill
                      className="object-cover"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
                        <p className="text-xs truncate font-medium">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Seção de Comentários - Movida para baixo */}
        <div>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Comentários ({galleryData.comments?.length || 0})
              </h3>

              {/* Formulário de Comentário */}
              <div className="space-y-3 mb-6">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="w-full border-[#d9d9d9] focus:border-[#0a3299] focus:outline-none"
                />
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="w-full"
                  size="sm"
                >
                  {submittingComment ? "Enviando..." : "Comentar"}
                </Button>
              </div>

              {/* Lista de Comentários */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {!galleryData.comments || galleryData.comments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum comentário ainda. Seja o primeiro!
                  </p>
                ) : (
                  galleryData.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#0a3299] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {comment.user.display_name?.charAt(0) ||
                            comment.user.username.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {comment.user.display_name ||
                                comment.user.username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
