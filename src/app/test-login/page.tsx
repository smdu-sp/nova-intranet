"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function TestLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    user?: { username: string; displayName: string; email: string };
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log("🧪 Testando login...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();

      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
      });

      console.log("🧪 Resultado do teste:", {
        status: response.status,
        ok: response.ok,
        data: data,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      console.error("🧪 Erro no teste:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLDAP = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log("🧪 Testando conexão LDAP...");

      const response = await fetch("/api/auth/test-ldap");
      const data = await response.json();

      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
      });

      console.log("🧪 Resultado do teste LDAP:", {
        status: response.status,
        ok: response.ok,
        data: data,
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      console.error("🧪 Erro no teste LDAP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#0a3299]">
            Teste de Login
          </h2>
          <p className="mt-2 text-gray-600">
            Página para testar o sistema de login
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="focus:ring-2 focus:ring-[#0a3299]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="focus:ring-2 focus:ring-[#0a3299]"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleTestLogin}
                disabled={loading || !username || !password}
                className="flex-1 bg-[#0a3299] hover:bg-[#395aad] text-white"
              >
                {loading ? "Testando..." : "Testar Login"}
              </Button>

              <Button
                onClick={handleTestLDAP}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? "Testando..." : "Testar LDAP"}
              </Button>
            </div>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resultado:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}

        <div className="text-center">
          <a href="/admin/login" className="text-[#0a3299] hover:underline">
            ← Voltar para página de login
          </a>
        </div>
      </div>
    </div>
  );
}
