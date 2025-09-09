"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLayout } from "@/components/admin-layout";
import {
  FileText,
  Menu,
  Settings,
  Users,
  BarChart3,
  Shield,
  Database,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Se não estiver autenticado, redireciona para login
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const adminModules = [
    {
      title: "Gerenciar Páginas",
      description: "Crie e edite páginas da intranet",
      icon: FileText,
      href: "/admin/pages",
      color: "bg-blue-500",
    },
    {
      title: "Gerenciar Menus",
      description: "Configure menus de navegação",
      icon: Menu,
      href: "/admin/menus",
      color: "bg-green-500",
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-500",
    },
    {
      title: "Usuários",
      description: "Gerenciar usuários e permissões",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-500",
    },
    {
      title: "Relatórios",
      description: "Relatórios e estatísticas",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-red-500",
    },
    {
      title: "Segurança",
      description: "Configurações de segurança",
      icon: Shield,
      href: "/admin/security",
      color: "bg-gray-500",
    },
    {
      title: "Banco de Dados",
      description: "Gerenciar dados do sistema",
      icon: Database,
      href: "/admin/database",
      color: "bg-indigo-500",
    },
    {
      title: "Site Público",
      description: "Visualizar site público",
      icon: Globe,
      href: "/",
      color: "bg-teal-500",
      external: true,
    },
  ];

  return (
    <AdminLayout
      title="Painel Administrativo"
      description="Bem-vindo ao sistema de administração da intranet"
    >
      {/* User Info */}
      {user && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0a3299] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.displayName}</h3>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminModules.map((module, index) => {
          const IconComponent = module.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <Link
                href={module.href}
                target={module.external ? "_blank" : "_self"}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* System Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Sistema Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">LDAP Conectado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Banco de Dados OK</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
