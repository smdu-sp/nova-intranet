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
import {
  FileText,
  Menu,
  Edit3,
  Plus,
  Settings,
  Users,
  BarChart3,
  ArrowRight,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { CMSPage } from "@prisma/client";
import { BlogPost } from "@prisma/client";

export default function AdminDashboard() {
  const { toasts, success, removeToast } = useToast();
  const [stats, setStats] = useState({
    pages: 0,
    posts: 0,
    menus: 0,
    published: 0,
  });
  const [recentPages, setRecentPages] = useState<CMSPage[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas
      const [pagesRes, postsRes, menusRes] = await Promise.all([
        fetch("/api/cms/pages"),
        fetch("/api/admin/posts"),
        fetch("/api/admin/menus"),
      ]);

      const pagesData = await pagesRes.json();
      const postsData = await postsRes.json();
      const menusData = await menusRes.json();

      if (pagesData.success && postsData.success && menusData.success) {
        const pages = pagesData.data || [];
        const posts = postsData.data || [];
        const menus = menusData.data || [];

        setStats({
          pages: pages.length,
          posts: posts.length,
          menus: menus.length,
          published:
            pages.filter((p: CMSPage) => p.is_published).length +
            posts.filter((p: BlogPost) => p.status === "published").length,
        });

        // Páginas recentes
        setRecentPages(pages.slice(0, 3));
        setRecentPosts(posts.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const dashboardCards = [
    {
      title: "Páginas CMS",
      value: stats.pages,
      description: "Páginas de conteúdo",
      icon: FileText,
      color: "bg-blue-500",
      href: "/admin/cms",
    },
    {
      title: "Posts do Blog",
      value: stats.posts,
      description: "Artigos e notícias",
      icon: Edit3,
      color: "bg-green-500",
      href: "/admin/posts",
    },
    {
      title: "Menus",
      value: stats.menus,
      description: "Navegação",
      icon: Menu,
      color: "bg-purple-500",
      href: "/admin/menus",
    },
    {
      title: "Publicados",
      value: stats.published,
      description: "Conteúdo ativo",
      icon: Eye,
      color: "bg-orange-500",
      href: "/admin/content",
    },
  ];

  const quickActions = [
    {
      title: "Nova Página",
      description: "Criar página de conteúdo",
      icon: Plus,
      href: "/admin/cms/create",
      color: "hover:bg-blue-50",
    },
    {
      title: "Novo Post",
      description: "Criar artigo do blog",
      icon: Edit3,
      href: "/admin/posts/create",
      color: "hover:bg-green-50",
    },
    {
      title: "Editar Menu",
      description: "Gerenciar navegação",
      icon: Menu,
      href: "/admin/menus",
      color: "hover:bg-purple-50",
    },
    {
      title: "Configurações",
      description: "Ajustes do sistema",
      icon: Settings,
      href: "/admin/settings",
      color: "hover:bg-gray-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0a3299] mb-2">
          Dashboard de Administração
        </h1>
        <p className="text-gray-600">
          Gerencie todo o conteúdo da intranet em um só lugar
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0a3299]">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              <Link href={card.href}>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                  Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card
                className={`cursor-pointer transition-colors ${action.color}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <action.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {action.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Conteúdo Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Páginas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Páginas Recentes
            </CardTitle>
            <CardDescription>
              Últimas páginas criadas ou editadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPages.length > 0 ? (
              <div className="space-y-3">
                {recentPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{page.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(page.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {page.is_published ? (
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
                      <Link href={`/admin/cms/edit/${page.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma página criada ainda</p>
              </div>
            )}
            <div className="mt-4">
              <Link href="/admin/cms">
                <Button variant="outline" className="w-full">
                  Ver Todas as Páginas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Posts Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-green-600" />
              Posts Recentes
            </CardTitle>
            <CardDescription>Últimos artigos do blog</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(post.updated_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status === "published" ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {post.status === "published"
                          ? "Publicado"
                          : post.status === "draft"
                          ? "Rascunho"
                          : "Arquivado"}
                      </span>
                      <Link href={`/admin/posts/edit/${post.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Edit3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum post criado ainda</p>
              </div>
            )}
            <div className="mt-4">
              <Link href="/admin/posts">
                <Button variant="outline" className="w-full">
                  Ver Todos os Posts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Container de Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
