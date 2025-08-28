"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Archive,
  Search,
  Filter,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { BlogPost } from "@prisma/client";

export default function PostsPage() {
  const { toasts, success, error: showError, removeToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/posts");
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
      } else {
        showError("Erro ao carregar posts", result.error);
      }
    } catch (err) {
      showError("Erro ao carregar posts", "Ocorreu um erro inesperado");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Post deletado com sucesso!",
          "O post foi removido permanentemente"
        );
        await fetchPosts();
      } else {
        showError("Erro ao deletar post", result.error);
      }
    } catch (err) {
      showError("Erro ao deletar post", "Ocorreu um erro inesperado");
      console.error("Error deleting post:", err);
    }
  };

  const handleStatusChange = async (post: BlogPost, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Status atualizado!",
          "O status do post foi alterado com sucesso"
        );
        await fetchPosts();
      } else {
        showError("Erro ao atualizar status", result.error);
      }
    } catch (err) {
      showError("Erro ao atualizar status", "Ocorreu um erro inesperado");
      console.error("Error updating post status:", err);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      draft: "Rascunho",
      published: "Publicado",
      archived: "Arquivado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <Eye className="w-3 h-3" />;
      case "draft":
        return <EyeOff className="w-3 h-3" />;
      case "archived":
        return <Archive className="w-3 h-3" />;
      default:
        return <EyeOff className="w-3 h-3" />;
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt &&
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0a3299] mb-2">
            Gerenciamento de Posts
          </h1>
          <p className="text-gray-600">
            Crie e gerencie artigos e notícias para o blog da intranet
          </p>
        </div>
        <Link href="/admin/posts/create">
          <Button className="bg-[#0a3299] hover:bg-[#082a7a]">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar posts por título ou resumo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="draft">Rascunhos</option>
                <option value="published">Publicados</option>
                <option value="archived">Arquivados</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Edit3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {posts.length === 0
                  ? "Nenhum post criado"
                  : "Nenhum post encontrado"}
              </h3>
              <p className="text-gray-500 mb-4">
                {posts.length === 0
                  ? "Comece criando seu primeiro post do blog"
                  : "Tente ajustar os filtros de busca"}
              </p>
              {posts.length === 0 && (
                <Link href="/admin/posts/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Post
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {getStatusIcon(post.status)}
                        {getStatusLabel(post.status)}
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      {post.published_at && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          Publicado em{" "}
                          {new Date(post.published_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {/* Ações de Status */}
                    <div className="flex flex-col gap-1">
                      {post.status !== "published" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(post, "published")}
                          className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Publicar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {post.status !== "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(post, "draft")}
                          className="h-8 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          title="Salvar como rascunho"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      )}
                      {post.status !== "archived" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(post, "archived")}
                          className="h-8 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          title="Arquivar"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Ações de Edição */}
                    <div className="flex flex-col gap-1">
                      <Link href={`/admin/posts/edit/${post.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas */}
      {posts.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Estatísticas dos Posts</CardTitle>
            <CardDescription>Visão geral do conteúdo do blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0a3299]">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600">Total de Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {posts.filter((p) => p.status === "published").length}
                </div>
                <div className="text-sm text-gray-600">Publicados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {posts.filter((p) => p.status === "draft").length}
                </div>
                <div className="text-sm text-gray-600">Rascunhos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {posts.filter((p) => p.status === "archived").length}
                </div>
                <div className="text-sm text-gray-600">Arquivados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Container de Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
