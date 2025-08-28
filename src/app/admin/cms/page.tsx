"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CMSPage } from "@/lib/cms";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText } from "lucide-react";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/ui/toast";

export default function CMSAdminPage() {
  const { toasts, success, error: showError, removeToast } = useToast();
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/pages");
      const result = await response.json();

      if (result.success) {
        setPages(result.data);
        setError(null);
      } else {
        setError(result.error || "Erro ao carregar páginas");
      }
    } catch (err) {
      setError("Erro ao carregar páginas");
      console.error("Error fetching pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta página?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Página deletada com sucesso!",
          "A página foi removida permanentemente."
        );
        await fetchPages();
      } else {
        showError("Erro ao deletar página", result.error);
      }
    } catch (err) {
      showError(
        "Erro ao deletar página",
        "Ocorreu um erro inesperado ao tentar deletar a página."
      );
      console.error("Error deleting page:", err);
    }
  };

  const togglePublishStatus = async (page: CMSPage) => {
    try {
      const response = await fetch(`/api/cms/pages/${page.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: !page.is_published,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success("Status atualizado!", "A página foi atualizada com sucesso.");
        await fetchPages();
      } else {
        showError("Erro ao atualizar status", result.error);
      }
    } catch (err) {
      showError(
        "Erro ao atualizar status",
        "Ocorreu um erro inesperado ao tentar atualizar o status da página."
      );
      console.error("Error updating page:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
        <Button onClick={fetchPages} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0a3299] mb-2">
            Gerenciamento de Conteúdo
          </h1>
          <p className="text-gray-600">
            Crie e gerencie páginas de conteúdo para a intranet
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#0a3299] hover:bg-[#082a7a]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
          <Link href="/admin/cms/test-advanced">
            <Button
              variant="outline"
              className="border-[#0a3299] text-[#0a3299] hover:bg-[#0a3299] hover:text-white"
            >
              🎨 Testar Editor
            </Button>
          </Link>
        </div>
      </div>

      {/* Lista de páginas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Páginas Existentes</h2>

          {pages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma página criada ainda</p>
              <p className="text-sm">
                Clique em &quot;Nova Página&quot; para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{page.title}</h3>
                      <span className="text-sm text-gray-500">
                        /{page.slug}
                      </span>
                      {page.is_published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Publicada
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Rascunho
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {page.meta_description || "Sem descrição"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Criada em:{" "}
                      {new Date(page.created_at).toLocaleDateString("pt-BR")}
                      {page.updated_at !== page.created_at &&
                        ` | Atualizada em: ${new Date(
                          page.updated_at
                        ).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(page)}
                      className="flex items-center gap-1"
                    >
                      {page.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Despublicar
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Publicar
                        </>
                      )}
                    </Button>

                    <Link href={`/admin/cms/edit/${page.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de criação rápida */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Criar Nova Página</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  type="text"
                  placeholder="Digite o título da página"
                  id="quick-title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <Input
                  type="text"
                  placeholder="Breve descrição da página"
                  id="quick-description"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => {
                  const title = (
                    document.getElementById("quick-title") as HTMLInputElement
                  ).value;
                  const description = (
                    document.getElementById(
                      "quick-description"
                    ) as HTMLInputElement
                  ).value;

                  if (title.trim()) {
                    window.location.href = `/admin/cms/create?title=${encodeURIComponent(
                      title
                    )}&description=${encodeURIComponent(description)}`;
                  }
                }}
                className="flex-1"
              >
                Criar e Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Container de Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
