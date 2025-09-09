"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, Shield } from "lucide-react";

interface UserData {
  username: string;
  displayName: string;
  email: string;
  role: string;
}

export default function LoginSuccessPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Se não conseguir verificar a sessão, redireciona para login
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleGoToAdmin = () => {
    router.push("/admin");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const handlePromoteToAdmin = async () => {
    try {
      const response = await fetch("/api/admin/promote-me", { method: "POST" });
      const data = await response.json();

      if (response.ok) {
        alert(
          "✅ Usuário promovido para administrador! Agora você pode acessar o painel admin."
        );
        // Recarrega a página para atualizar os dados
        window.location.reload();
      } else {
        alert("❌ Erro ao promover usuário: " + data.error);
      }
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      alert("❌ Erro ao promover usuário");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a3299] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro na autenticação</p>
          <Button
            onClick={() => router.push("/admin/login")}
            className="mt-4 bg-[#0a3299] hover:bg-[#395aad] text-white"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-500 shadow-lg">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0a3299]">
            Login Realizado com Sucesso!
          </h2>
          <p className="mt-2 text-gray-600">
            Bem-vindo ao sistema administrativo
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-[#0a3299]" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-[#0a3299]" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-[#0a3299]" />
              <div>
                <p className="text-sm font-medium text-gray-500">Usuário</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              {user.role === "user" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    ⚠️ Você está logado como usuário comum. Para acessar o
                    painel administrativo, você precisa ser promovido a
                    administrador.
                  </p>
                  <Button
                    onClick={handlePromoteToAdmin}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Promover para Administrador
                  </Button>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={handleGoToAdmin}
                  className="flex-1 bg-[#0a3299] hover:bg-[#395aad] text-white"
                  disabled={user.role === "user"}
                >
                  {user.role === "admin" ? "Acessar Admin" : "Acesso Restrito"}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <a
            href="/test-login"
            className="text-[#0a3299] hover:underline text-sm"
          >
            ← Voltar para página de teste
          </a>
        </div>
      </div>
    </div>
  );
}
