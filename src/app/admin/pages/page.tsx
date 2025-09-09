"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin-layout";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
  } | null>(null);

  useEffect(() => {
    fetchPages();
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

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/cms/pages");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPages(result.data);
        } else {
          setError("Erro ao carregar páginas");
        }
      } else {
        setError("Erro ao carregar páginas");
      }
    } catch (error) {
      console.error("Erro ao carregar páginas:", error);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta página?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPages(pages.filter((page) => page.id !== id));
      } else {
        alert("Erro ao excluir página");
      }
    } catch (error) {
      console.error("Erro ao excluir página:", error);
      alert("Erro de conexão");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando páginas...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      title="Gerenciar Páginas"
      description="Crie e gerencie páginas da intranet"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages/create">
            <Button className="bg-[#0a3299] hover:bg-[#395aad]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Página
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6">
            <p className="text-red-800 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Pages List */}
      {!Array.isArray(pages) || pages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma página encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando sua primeira página
            </p>
            <Link href="/admin/pages/create">
              <Button className="bg-[#0a3299] hover:bg-[#395aad]">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Página
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(pages) &&
            pages.map((page) => (
              <Card key={page.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {page.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        /{page.slug}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={page.is_published ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {page.is_published ? "Publicada" : "Rascunho"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {page.meta_description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {page.meta_description}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Criada em:{" "}
                        {new Date(page.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {page.created_by && (
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>Por: {page.created_by}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/pages/edit/${page.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/pagina/${page.slug}`, "_blank")
                      }
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </AdminLayout>
  );
}
