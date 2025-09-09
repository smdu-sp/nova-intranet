"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";
import {
  Search,
  UserPlus,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Users,
} from "lucide-react";

interface User {
  id: number;
  username: string;
  email?: string;
  display_name?: string;
  full_name?: string;
  role: "admin" | "user";
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Erro ao carregar usuários");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  const handlePromoteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao promover usuário");
      }

      // Atualiza a lista de usuários
      fetchUsers(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleDemoteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao remover privilégios");
      }

      // Atualiza a lista de usuários
      fetchUsers(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar status do usuário");
      }

      // Atualiza a lista de usuários
      fetchUsers(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar usuário");
      }

      // Atualiza a lista de usuários
      fetchUsers(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout
      title="Gerenciamento de Usuários"
      description="Administre usuários e permissões do sistema"
    >
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-[#0a3299] mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Usuários
              </p>
              <p className="text-2xl font-bold text-[#0a3299]">{total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Administradores
              </p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Usuários Ativos
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.is_active).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Usuários Inativos
              </p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter((u) => !u.is_active).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de busca */}
      <Card className="p-6 mb-6 bg-white shadow-lg">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar usuários por nome, email ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-[#0a3299]"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-[#0a3299] hover:bg-[#395aad] text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
      </Card>

      {/* Lista de usuários */}
      <Card className="bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Usuários
          </h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a3299] mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando usuários...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.display_name || user.full_name || user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className={
                          user.role === "admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {user.role === "admin" ? "Administrador" : "Usuário"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={user.is_active ? "default" : "secondary"}
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.last_login ? formatDate(user.last_login) : "Nunca"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.role === "admin" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDemoteUser(user.id)}
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            title="Rebaixar para usuário comum"
                          >
                            <ShieldOff className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromoteUser(user.id)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            title="Promover para administrador"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(user.id)}
                          className={
                            user.is_active
                              ? "text-red-600 border-red-300 hover:bg-red-50"
                              : "text-green-600 border-green-300 hover:bg-green-50"
                          }
                          title={
                            user.is_active
                              ? "Desativar usuário"
                              : "Ativar usuário"
                          }
                        >
                          {user.is_active ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          title="Excluir usuário permanentemente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Página {currentPage} de {totalPages} ({total} usuários)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
