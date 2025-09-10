"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ldapStatus, setLdapStatus] = useState<{
    isConnected: boolean;
    message: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  useEffect(() => {
    // Testa a conexão LDAP ao carregar a página
    testLDAPConnection();

    // Foco no campo de usuário ao carregar a página
    const usernameInput = document.getElementById(
      "username"
    ) as HTMLInputElement;
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  const testLDAPConnection = async () => {
    try {
      const response = await fetch("/api/auth/test-ldap");
      const data = await response.json();
      setLdapStatus({
        isConnected: data.success,
        message: data.message,
      });
    } catch (error) {
      setLdapStatus({
        isConnected: false,
        message: "Erro ao testar conexão LDAP",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validação básica
    if (!username.trim()) {
      setError("Por favor, digite seu usuário");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Por favor, digite sua senha");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🚀 Iniciando processo de login...");
      console.log("📡 Enviando requisição para API de login...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      console.log("📊 Resposta recebida:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const data = await response.json();
      console.log("📋 Dados da resposta:", data);

      if (response.ok) {
        console.log("✅ Login bem-sucedido, redirecionando...");
        // Login bem-sucedido, redireciona para página de sucesso
        router.push("/admin/login-success");
        router.refresh();
      } else {
        console.log("❌ Login falhou:", data.error);
        setError(data.error || "Erro no login");
      }
    } catch (error) {
      console.error("💥 Erro na requisição:", error);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para limpar erro quando o usuário começar a digitar
  const handleInputChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (error) {
        setError("");
      }
    };

  // Função para lidar com tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[#0a3299] shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0a3299]">
            Acesso Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login com suas credenciais LDAP
          </p>
        </div>

        <Card className="p-6 shadow-xl border-0 bg-white">
          {/* Status da conexão LDAP */}
          {ldapStatus && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                ldapStatus.isConnected
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                {ldapStatus.isConnected ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                )}
                {ldapStatus.message}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  placeholder="Digite seu usuário"
                  className="w-full pl-10 focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-10 focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0a3299] hover:bg-[#395aad] text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Sistema de autenticação via LDAP
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                Servidor:{" "}
                {process.env.NEXT_PUBLIC_LDAP_SERVER || "ldap://10.10.65.242"}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              © 2024 SMUL - Secretaria Municipal de Urbanismo e Licenciamento
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
