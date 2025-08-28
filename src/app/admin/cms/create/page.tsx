"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdvancedEditor from "@/components/advanced-editor";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/ui/toast";

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toasts, success, error: showError, removeToast } = useToast();

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [metaDescription, setMetaDescription] = useState(
    searchParams.get("description") || ""
  );
  const [content, setContent] = useState(
    "<h1>Nova Página</h1><p>Digite o conteúdo da sua página aqui...</p>"
  );
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (
      !content.trim() ||
      content ===
        "<h1>Nova Página</h1><p>Digite o conteúdo da sua página aqui...</p>"
    ) {
      setError("O conteúdo é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cms/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          meta_description: metaDescription.trim() || null,
          created_by: "admin", // TODO: Pegar do contexto de autenticação
        }),
      });

      const result = await response.json();

      if (result.success) {
        success("Página criada com sucesso!", "Redirecionando para edição...");
        // Redirecionar para a página de edição da nova página
        setTimeout(() => {
          router.push(`/admin/cms/edit/${result.data.id}`);
        }, 1500);
      } else {
        setError(result.error || "Erro ao criar página");
      }
    } catch (err) {
      setError("Erro ao criar página");
      console.error("Error creating page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cms/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          meta_description: metaDescription.trim() || null,
          created_by: "admin",
        }),
      });

      const result = await response.json();

      if (result.success) {
        success("Rascunho salvo com sucesso!", "Redirecionando para o CMS...");
        // Redirecionar para a lista de páginas
        setTimeout(() => {
          router.push("/admin/cms");
        }, 1500);
      } else {
        setError(result.error || "Erro ao salvar rascunho");
      }
    } catch (err) {
      setError("Erro ao salvar rascunho");
      console.error("Error saving draft:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cms">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#0a3299]">
            Criar Nova Página
          </h1>
          <p className="text-gray-600">
            Crie uma nova página de conteúdo para a intranet
          </p>
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
                O título será usado para gerar o slug da URL automaticamente
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
                Publicar página imediatamente
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

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            Salvar Rascunho
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#0a3299] hover:bg-[#082a7a]"
          >
            {loading ? (
              "Salvando..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isPublished ? "Criar e Publicar" : "Criar Página"}
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
