"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Menu,
  Link as LinkIcon,
  Eye,
  EyeOff,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { NavigationMenu, MenuItem } from "@prisma/client";

export default function MenusPage() {
  const { toasts, success, error: showError, removeToast } = useToast();
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [menuItems, setMenuItems] = useState<{ [key: number]: MenuItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState<number | null>(null);
  const [editingMenu, setEditingMenu] = useState<NavigationMenu | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/menus");
      const result = await response.json();

      if (result.success) {
        setMenus(result.data);
        // Buscar itens para cada menu
        for (const menu of result.data) {
          await fetchMenuItems(menu.id);
        }
      } else {
        showError("Erro ao carregar menus", result.error);
      }
    } catch (err) {
      showError("Erro ao carregar menus", "Ocorreu um erro inesperado");
      console.error("Error fetching menus:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (menuId: number) => {
    try {
      const response = await fetch(
        `/api/admin/menus/${menuId}/items/hierarchical`
      );
      const result = await response.json();

      if (result.success) {
        setMenuItems((prev) => ({
          ...prev,
          [menuId]: result.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const handleCreateMenu = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;

    if (!name.trim() || !location.trim()) {
      showError("Erro", "Nome e localização são obrigatórios");
      return;
    }

    try {
      const response = await fetch("/api/admin/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim(), location: location.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        success("Menu criado com sucesso!", "O menu foi criado e está ativo");
        setShowCreateForm(false);
        await fetchMenus();
      } else {
        showError("Erro ao criar menu", result.error);
      }
    } catch (err) {
      showError("Erro ao criar menu", "Ocorreu um erro inesperado");
      console.error("Error creating menu:", err);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (
      !confirm(
        "Tem certeza que deseja deletar este menu? Todos os itens serão removidos."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menus/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Menu deletado com sucesso!",
          "O menu e todos os seus itens foram removidos"
        );
        await fetchMenus();
      } else {
        showError("Erro ao deletar menu", result.error);
      }
    } catch (err) {
      showError("Erro ao deletar menu", "Ocorreu um erro inesperado");
      console.error("Error deleting menu:", err);
    }
  };

  const toggleMenuExpansion = (menuId: number) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  const getLocationLabel = (location: string) => {
    const labels: { [key: string]: string } = {
      header: "Cabeçalho",
      footer: "Rodapé",
      sidebar: "Barra Lateral",
    };
    return labels[location] || location;
  };

  const renderMenuItems = (items: MenuItem[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.id} className="space-y-2">
        <div
          className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${
            level > 0 ? `ml-${level * 4}` : ""
          }`}
        >
          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{item.title}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Nível {item.level}
              </span>
            </div>
            <div className="text-xs text-gray-500">{item.url}</div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                item.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.is_active ? "Ativo" : "Inativo"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleEditMenuItem(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600"
              onClick={() => handleDeleteMenuItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Renderizar submenus recursivamente */}
        {item.children && item.children.length > 0 && (
          <div className="ml-6 border-l-2 border-gray-200 pl-4">
            {renderMenuItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const handleEditMenuItem = (item: MenuItem) => {
    // TODO: Implementar edição de item do menu
    console.log("Editar item:", item);
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm("Tem certeza que deseja deletar este item do menu?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menus/items/${itemId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        success("Item deletado com sucesso!", "O item do menu foi removido");
        await fetchMenus();
      } else {
        showError("Erro ao deletar item", result.error);
      }
    } catch (err) {
      showError("Erro ao deletar item", "Ocorreu um erro inesperado");
      console.error("Error deleting menu item:", err);
    }
  };

  const handleCreateMenuItem = async (formData: FormData) => {
    const menuId = Number(formData.get("menu_id"));
    const parentId = formData.get("parent_id")
      ? Number(formData.get("parent_id"))
      : null;
    const level = Number(formData.get("level"));
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const target = formData.get("target") as string;

    if (!title.trim() || !url.trim()) {
      showError("Erro", "Título e URL são obrigatórios");
      return;
    }

    try {
      const response = await fetch("/api/admin/menus/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_id: menuId,
          parent_id: parentId,
          level,
          title: title.trim(),
          url: url.trim(),
          target: target || "_self",
          order_position: 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success("Item criado com sucesso!", "O item do menu foi adicionado");
        setShowAddItemForm(null);
        await fetchMenus();
      } else {
        showError("Erro ao criar item", result.error);
      }
    } catch (err) {
      showError("Erro ao criar item", "Ocorreu um erro inesperado");
      console.error("Error creating menu item:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0a3299] mb-2">
            Gerenciamento de Menus
          </h1>
          <p className="text-gray-600">
            Crie e gerencie menus de navegação para a intranet
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-[#0a3299] hover:bg-[#082a7a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Menu
        </Button>
      </div>

      {/* Lista de Menus */}
      <div className="space-y-6">
        {menus.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Menu className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum menu criado
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando seu primeiro menu de navegação
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          menus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMenuExpansion(menu.id)}
                      className="p-1"
                    >
                      {expandedMenus.has(menu.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="text-lg">{menu.name}</CardTitle>
                      <CardDescription>
                        Localização: {getLocationLabel(menu.location)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                        menu.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {menu.is_active ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {menu.is_active ? "Ativo" : "Inativo"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMenu(menu)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedMenus.has(menu.id) && (
                <CardContent>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Itens do Menu</h4>
                    {menuItems[menu.id] && menuItems[menu.id].length > 0 ? (
                      <div className="space-y-2">
                        {renderMenuItems(menuItems[menu.id])}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <LinkIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Nenhum item neste menu</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddItemForm(menu.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Modal de Criação */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Menu</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateMenu(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Menu
                  </label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Ex: Menu Principal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <select
                    name="location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="header">Cabeçalho</option>
                    <option value="footer">Rodapé</option>
                    <option value="sidebar">Barra Lateral</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" className="flex-1">
                  Criar Menu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Item */}
      {showAddItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Adicionar Item ao Menu
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateMenuItem(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-4">
                <input type="hidden" name="menu_id" value={showAddItemForm} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Pai (opcional)
                  </label>
                  <select
                    name="parent_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
                  >
                    <option value="">Nenhum (Item Principal)</option>
                    {menus
                      .map((menu) =>
                        menuItems[menu.id]?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title} (Nível {item.level})
                          </option>
                        ))
                      )
                      .flat()
                      .filter(Boolean)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível
                  </label>
                  <select
                    name="level"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
                    required
                  >
                    <option value="1">1 - Menu Principal</option>
                    <option value="2">2 - Submenu</option>
                    <option value="3">3 - Sub-submenu</option>
                    <option value="4">4 - Sub-sub-submenu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <Input
                    name="title"
                    type="text"
                    placeholder="Ex: Institucional"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <Input
                    name="url"
                    type="text"
                    placeholder="Ex: /institucional"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <select
                    name="target"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a3299] focus:border-transparent"
                  >
                    <option value="_self">Mesma janela</option>
                    <option value="_blank">Nova janela</option>
                    <option value="_parent">Janela pai</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" className="flex-1">
                  Adicionar Item
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddItemForm(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Container de Toast */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
