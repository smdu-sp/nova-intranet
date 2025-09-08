"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import styles from "./page.module.css";

export default function CreatePage() {
  const router = useRouter();
  const { success } = useToast();

  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [addToMenu, setAddToMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPageToMenu = async (pageTitle: string, pageSlug: string) => {
    try {
      const response = await fetch("/api/admin/menus/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_id: 5, // ID do menu principal
          parent_id: null,
          level: 0,
          title: pageTitle,
          url: `/pagina/${pageSlug}`,
          target: "_self",
          is_active: true,
        }),
      });

      if (response.ok) {
        console.log("Página adicionada ao menu com sucesso!");
      } else {
        console.error("Erro ao adicionar página ao menu");
      }
    } catch (error) {
      console.error("Erro ao adicionar página ao menu:", error);
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
          content: content.trim(),
          meta_description: metaDescription.trim() || null,
          is_published: isPublished,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        success("Página criada com sucesso!");

        // Adicionar ao menu se solicitado
        if (addToMenu) {
          try {
            await addPageToMenu(result.data.title, result.data.slug);
          } catch (error) {
            console.error("Erro ao adicionar ao menu:", error);
          }
        }

        // Redirecionar para a página principal com a nova página após 2 segundos
        setTimeout(() => {
          router.push(`/?page=${result.data.slug}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao criar página");
      }
    } catch (error) {
      console.error("Erro ao criar página:", error);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/pages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Páginas
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#0a3299]">
              Criar Nova Página
            </h1>
            <p className="text-gray-600">
              Use o editor avançado para criar conteúdo rico
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Informações da Página
              </CardTitle>
              <CardDescription>
                Configure as informações básicas da sua página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Página *
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da página"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Meta (SEO)
                </label>
                <Input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Descrição para motores de busca (opcional)"
                  className="w-full"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {metaDescription.length}/160 caracteres
                </p>
              </div>

              <div className="flex flex-col gap-3">
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

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToMenu}
                    onChange={(e) => setAddToMenu(e.target.checked)}
                    className="rounded border-gray-300 text-[#0a3299] focus:ring-[#0a3299]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Adicionar ao menu principal
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Editor de Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Conteúdo da Página
              </CardTitle>
              <CardDescription>
                Use o editor avançado do Tiptap para criar conteúdo rico com
                formatação, imagens, links e muito mais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className={styles.simpleEditorContainer}>
                  <SimpleEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Digite o conteúdo da sua página aqui..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensagem de erro */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Botões de ação */}
          <div className="flex gap-4 justify-end">
            <Link href="/admin/pages">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0a3299] hover:bg-[#395aad]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar Página
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
