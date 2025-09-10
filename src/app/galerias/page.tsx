"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  cover_image: string;
  created_at: string;
  created_by: string;
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

export default function GaleriasPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  useEffect(() => {
    fetchGalleries();
  }, [pagination.currentPage]);

  const fetchGalleries = async () => {
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
  };

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
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando galerias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0a3299] mb-2">
                Galeria
              </h1>
              <div className="w-16 h-1 bg-[#0a3299]"></div>
            </div>
            <div className="text-sm text-gray-500">
              {pagination.totalItems} galerias encontradas
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
                        <Link href={`/galerias/${gallery.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Ver Galeria
                          </Button>
                        </Link>
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
    </div>
  );
}
