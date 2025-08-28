"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdvancedEditor from "@/components/advanced-editor";
import { CMSPage } from "@/lib/cms";
import { ArrowLeft, Save, Eye, EyeOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/ui/toast";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  const { toasts, success, error: showError, removeToast } = useToast();

  const [page, setPage] = useState<CMSPage | null>(null);
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/pages/${pageId}`);
      const result = await response.json();

      if (result.success) {
        const pageData = result.data;
        setPage(pageData);
        setTitle(pageData.title);
        setMetaDescription(pageData.meta_description || "");
        setContent(pageData.content);
        setIsPublished(pageData.is_published);
        setError(null);
      } else {
        setError(result.error || "Erro ao carregar página");
      }
    } catch (err) {
      setError("Erro ao carregar página");
      console.error("Error fetching page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (!content.trim()) {
      setError("O conteúdo é obrigatório");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          meta_description: metaDescription.trim() || null,
          is_published: isPublished,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Atualizar os dados locais
        setPage(result.data);
        success(
          "Página atualizada com sucesso!",
          "As alterações foram salvas no banco de dados."
        );
      } else {
        setError(result.error || "Erro ao atualizar página");
      }
    } catch (err) {
      setError("Erro ao atualizar página");
      console.error("Error updating page:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja deletar esta página? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Página deletada com sucesso!",
          "A página foi removida permanentemente."
        );
        router.push("/admin/cms");
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 mb-4">
          {error || "Página não encontrada"}
        </div>
        <Link href="/admin/cms">
          <Button>Voltar para o CMS</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/cms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#0a3299]">Editar Página</h1>
            <p className="text-gray-600">Editando: {page.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Slug: /{page.slug}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Deletar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Informações da Página</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Página *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da página"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                O slug será atualizado automaticamente baseado no novo título
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Meta
              </label>
              <Input
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Breve descrição da página (opcional)"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Descrição que aparece nos resultados de busca
              </p>
            </div>
          </div>
        </div>

        {/* Editor de conteúdo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Conteúdo da Página</h2>
          <AdvancedEditor content={content} onChange={setContent} />
        </div>

        {/* Configurações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações</h2>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-gray-300 text-[#0a3299] focus:ring-[#0a3299]"
              />
              <span className="text-sm font-medium text-gray-700">
                Página publicada
              </span>
            </label>
            {isPublished ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Pública
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                Rascunho
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Se desmarcado, a página será salva como rascunho e não será visível
            publicamente
          </p>
        </div>

        {/* Informações do sistema */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Criada em:</span>{" "}
              {new Date(page.created_at).toLocaleDateString("pt-BR")} às{" "}
              {new Date(page.created_at).toLocaleTimeString("pt-BR")}
            </div>
            <div>
              <span className="font-medium">Última atualização:</span>{" "}
              {new Date(page.updated_at).toLocaleDateString("pt-BR")} às{" "}
              {new Date(page.updated_at).toLocaleTimeString("pt-BR")}
            </div>
            <div>
              <span className="font-medium">Criada por:</span>{" "}
              {page.created_by || "Sistema"}
            </div>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/cms">
            <Button variant="outline">Cancelar</Button>
          </Link>

          <Button
            type="submit"
            disabled={saving}
            className="bg-[#0a3299] hover:bg-[#082a7a]"
          >
            {saving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Container de Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
