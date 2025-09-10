"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin-layout";
import RichTextEditor from "@/components/rich-text-editor";

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

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    is_published: false,
  });

  useEffect(() => {
    if (pageId) {
      fetchPage();
      fetchUser();
    }
  }, [pageId]);

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

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/cms/pages/${pageId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const pageData = result.data;
          setPage(pageData);
          setFormData({
            title: pageData.title || "",
            slug: pageData.slug || "",
            content: pageData.content || "",
            meta_description: pageData.meta_description || "",
            is_published: pageData.is_published || false,
          });
        } else {
          setError("Página não encontrada");
        }
      } else {
        setError("Erro ao carregar página");
      }
    } catch (error) {
      console.error("Erro ao carregar página:", error);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      setError("Título e slug são obrigatórios");
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
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/admin/pages");
      } else {
        setError(result.error || "Erro ao salvar página");
      }
    } catch (error) {
      console.error("Erro ao salvar página:", error);
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  if (loading) {
    return (
      <AdminLayout
        title="Editando Página"
        description="Carregando dados da página..."
      >
        <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando página...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !page) {
    return (
      <AdminLayout
        title="Erro"
        description="Não foi possível carregar a página"
      >
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800 text-sm">{error}</p>
            <div className="mt-4">
              <Link href="/admin/pages">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Páginas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Editando Página"
      description={`Editando: ${page?.title || "Carregando..."}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/pages">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Páginas
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0a3299] hover:bg-[#395aad]"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            {page && (
              <Button
                variant="outline"
                onClick={() => window.open(`/pagina/${page.slug}`, "_blank")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Título da página"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="url-da-pagina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <Input
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_description: e.target.value,
                      }))
                    }
                    placeholder="Descrição para SEO"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="is_published"
                      className="text-sm font-medium"
                    >
                      Publicada
                    </label>
                  </div>
                  {page && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        Criada em:{" "}
                        {new Date(page.created_at).toLocaleDateString("pt-BR")}
                      </p>
                      <p>
                        Atualizada em:{" "}
                        {new Date(page.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                      {page.created_by && <p>Por: {page.created_by}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
