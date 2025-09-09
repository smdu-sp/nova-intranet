"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Clock } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    display_name?: string;
    full_name?: string;
  };
}

interface CommentSectionProps {
  postId: number;
  isAuthenticated: boolean;
}

export default function CommentSection({
  postId,
  isAuthenticated,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError("Erro ao carregar comentários");
      }
    } catch (err) {
      setError("Erro ao carregar comentários");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !isAuthenticated) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao enviar comentário");
      }
    } catch (err) {
      setError("Erro ao enviar comentário");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Agora mesmo";
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInHours < 168) {
      // 7 dias
      const days = Math.floor(diffInHours / 24);
      return `${days}d atrás`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const getUserDisplayName = (user: Comment["user"]) => {
    return user.display_name || user.full_name || user.username;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-[#0a3299]" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário de novo comentário */}
      {isAuthenticated ? (
        <Card className="p-4 mb-6">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <Input
                placeholder="Escreva seu comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="focus:ring-2 focus:ring-[#0a3299]"
                disabled={submitting}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="bg-[#0a3299] hover:bg-[#395aad] text-white"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Comentar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-4 mb-6 bg-gray-50">
          <p className="text-gray-600 text-center">
            Faça login para comentar neste post
          </p>
        </Card>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a3299] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando comentários...</p>
        </div>
      ) : comments.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0a3299] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {getUserDisplayName(comment.user)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      @{comment.user.username}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="h-3 w-3" />
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
