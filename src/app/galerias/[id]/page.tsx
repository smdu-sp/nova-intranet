"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Share2,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

interface Gallery {
  id: number;
  title: string;
  description?: string;
  cover_image: string;
  created_at: string;
  created_by: string;
  images: GalleryImage[];
  comments: GalleryComment[];
  _count: {
    likes: number;
  };
  is_liked?: boolean;
}

export default function GalleryPage() {
  const params = useParams();
  const galleryId = params.id as string;

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (galleryId) {
      fetchGallery();
    }
  }, [galleryId]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/galleries/${galleryId}`);
      const result = await response.json();

      if (result.success) {
        setGallery(result.data);
        if (result.data.images.length > 0) {
          setSelectedImage(result.data.images[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar galeria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!gallery) return;

    try {
      const response = await fetch(`/api/galleries/${gallery.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setGallery((prev) => {
          if (!prev) return null;
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
    if (!gallery || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/galleries/${gallery.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment("");
        fetchGallery(); // Recarregar para pegar o novo comentário
      }
    } catch (error) {
      console.error("Erro ao comentar:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando galeria...</p>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Galeria não encontrada
          </h1>
          <Link href="/galerias">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Galerias
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/galerias">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#0a3299]">
                  {gallery.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{gallery.created_by}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(gallery.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{gallery.images.length} fotos</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={gallery.is_liked ? "text-red-500" : ""}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    gallery.is_liked ? "fill-current" : ""
                  }`}
                />
                {gallery._count.likes}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galeria de Imagens */}
          <div className="lg:col-span-2">
            {/* Imagem Principal */}
            {selectedImage && (
              <Card className="mb-6">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={selectedImage.image_url}
                    alt={selectedImage.alt_text || gallery.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedImage.caption && (
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">
                      {selectedImage.caption}
                    </p>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Thumbnails */}
            {gallery.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {gallery.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage?.id === image.id
                        ? "border-[#0a3299]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || gallery.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Descrição */}
            {gallery.description && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Sobre esta galeria
                  </h3>
                  <p className="text-gray-600">{gallery.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Comentários */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Comentários ({gallery.comments.length})
                </h3>

                {/* Formulário de Comentário */}
                <div className="space-y-3 mb-6">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="w-full"
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
                  {gallery.comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhum comentário ainda. Seja o primeiro!
                    </p>
                  ) : (
                    gallery.comments.map((comment) => (
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
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString("pt-BR")}
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
    </div>
  );
}
