"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LikeButton from "@/components/like-button";
import CommentSection from "@/components/comment-section";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, User, ArrowLeft, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      // Aqui você implementaria a busca do post por ID
      // Por enquanto, vou criar um post de exemplo
      const mockPost: BlogPost = {
        id: parseInt(postId),
        title: "Exemplo de Post da Intranet",
        slug: "exemplo-post-intranet",
        excerpt:
          "Este é um exemplo de post para demonstrar as funcionalidades de comentários e likes.",
        content: `
          <h2>Bem-vindo ao Sistema de Posts da Intranet</h2>
          <p>Este é um exemplo de post que demonstra as funcionalidades implementadas:</p>
          <ul>
            <li><strong>Sistema de Likes:</strong> Os usuários podem curtir posts</li>
            <li><strong>Sistema de Comentários:</strong> Usuários autenticados podem comentar</li>
            <li><strong>Autenticação LDAP:</strong> Login automático via LDAP</li>
            <li><strong>Permissões:</strong> Diferenciação entre administradores e usuários comuns</li>
          </ul>
          <p>O sistema foi desenvolvido para facilitar a comunicação interna da SMUL.</p>
        `,
        author: "Sistema",
        status: "published",
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ["intranet", "sistema", "exemplo"],
      };

      setPost(mockPost);
    } catch (err) {
      setError("Erro ao carregar post");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Post não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O post que você está procurando não existe ou foi removido.
          </p>
          <Link href="/">
            <Button className="bg-[#0a3299] hover:bg-[#395aad] text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Header */}
      <div className="bg-[#0a3299] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-[#0a3299]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            {isAuthenticated && (
              <div className="ml-auto">
                <span className="text-sm text-[#395aad]">
                  Olá, {user?.displayName || user?.username}!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg">
          {/* Cabeçalho do post */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {post.status === "published" ? "Publicado" : post.status}
              </Badge>
              {post.tags &&
                post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-gray-600"
                  >
                    #{tag}
                  </Badge>
                ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Conteúdo do post */}
          <div className="p-6">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Ações do post */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <LikeButton
                postId={post.id}
                isAuthenticated={isAuthenticated}
                showCommentIcon={true}
              />

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>Visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>Comentários</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Seção de comentários */}
        <CommentSection postId={post.id} isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
