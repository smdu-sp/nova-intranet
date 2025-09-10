"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Image as ImageIcon,
  MessageCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/admin-layout";

interface Gallery {
  id: number;
  title: string;
  description?: string;
  cover_image: string;
  is_published: boolean;
  created_at: string;
  created_by: string;
  _count: {
    images: number;
    comments: number;
    likes: number;
  };
}

export default function AdminGaleriasPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
  } | null>(null);

  useEffect(() => {
    fetchGalleries();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
    }
  };

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/galleries");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setGalleries(result.data);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar galerias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta galeria?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/galleries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGalleries(galleries.filter((gallery) => gallery.id !== id));
      } else {
        alert("Erro ao excluir galeria");
      }
    } catch (error) {
      console.error("Erro ao excluir galeria:", error);
      alert("Erro de conexão");
    }
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/galleries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      if (response.ok) {
        setGalleries((prev) =>
          prev.map((gallery) =>
            gallery.id === id
              ? { ...gallery, is_published: !currentStatus }
              : gallery
          )
        );
      } else {
        alert("Erro ao atualizar status da galeria");
      }
    } catch (error) {
      console.error("Erro ao atualizar galeria:", error);
      alert("Erro de conexão");
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Gerenciar Galerias"
        description="Carregando galerias..."
      >
        <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando galerias...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Gerenciar Galerias"
      description="Crie e gerencie galerias de fotos da intranet"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Galerias</h2>
            <p className="text-gray-600">
              {galleries.length} galeria{galleries.length !== 1 ? "s" : ""}{" "}
              encontrada{galleries.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/admin/galerias/create">
            <Button className="bg-[#0a3299] hover:bg-[#395aad]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Galeria
            </Button>
          </Link>
        </div>

        {/* Galerias List */}
        {galleries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma galeria criada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando sua primeira galeria de fotos
              </p>
              <Link href="/admin/galerias/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Galeria
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={gallery.is_published ? "default" : "secondary"}
                      className="bg-white/90 text-gray-800"
                    >
                      {gallery.is_published ? "Publicada" : "Rascunho"}
                    </Badge>
                  </div>

                  {/* Image Count */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-800"
                    >
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {gallery._count.images}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Título */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {gallery.title}
                    </h3>

                    {/* Descrição */}
                    {gallery.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}

                    {/* Metadados */}
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{gallery._count.comments} comentários</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{gallery._count.likes} curtidas</span>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Link href={`/galerias/${gallery.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-3 h-3 mr-1" />
                          Visualizar
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/galerias/edit/${gallery.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          togglePublish(gallery.id, gallery.is_published)
                        }
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {gallery.is_published ? "Despublicar" : "Publicar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
