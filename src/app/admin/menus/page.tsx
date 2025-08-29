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
  Save,
  X,
} from "lucide-react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { NavigationMenu, MenuItem } from "@prisma/client";

interface EditingItem {
  id: number;
  title: string;
  url: string;
  target: string;
  level: number;
  is_active: boolean;
}

interface MenuItemWithChildren extends MenuItem {
  children?: MenuItemWithChildren[];
}

export default function MenusPage() {
  const { toasts, success, error: showError, removeToast } = useToast();
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [menuItems, setMenuItems] = useState<{
    [key: number]: MenuItemWithChildren[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState<number | null>(null);
  const [editingMenu, setEditingMenu] = useState<NavigationMenu | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const [draggedItem, setDraggedItem] = useState<{
    id: number;
    menuId: number;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

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

  const renderMenuItems = (
    items: MenuItemWithChildren[],
    level: number = 0,
    menuId: number
  ) => {
    return (
      <div className="space-y-2">
        {/* Área de drop para nível raiz */}
        {level === 0 && (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 transition-colors ${
              dragOverItem === -1 ? "border-blue-400 bg-blue-50" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, -1)}
            onDrop={(e) => handleDropToRoot(e, menuId)}
            onDragLeave={handleDragLeave}
          >
            <GripVertical className="h-6 w-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">
              Arraste itens aqui para movê-los para o nível raiz
            </p>
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <div
              className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${
                level > 0 ? `ml-${level * 4}` : ""
              } ${draggedItem?.id === item.id ? "opacity-50" : ""} ${
                draggedItem?.id !== item.id ? "hover:bg-gray-100" : ""
              } ${
                dragOverItem === item.id
                  ? "ring-2 ring-blue-400 bg-blue-50"
                  : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id, menuId)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id, menuId)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
            >
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <div className="flex-1">
                {editingItem?.id === item.id ? (
                  // Edit mode
                  <div className="space-y-2">
                    <Input
                      value={editingItem.title}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          title: e.target.value,
                        })
                      }
                      placeholder="Título do item"
                      className="text-sm"
                    />
                    <Input
                      value={editingItem.url}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, url: e.target.value })
                      }
                      placeholder="URL"
                      className="text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={editingItem.target}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            target: e.target.value,
                          })
                        }
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="_self">Mesma aba</option>
                        <option value="_blank">Nova aba</option>
                      </select>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={editingItem.is_active}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        Ativo
                      </label>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.title}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Nível {item.level}
                      </span>
                      {item.parent_id && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Filho
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{item.url}</div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingItem?.id === item.id ? (
                  // Edit mode buttons
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600"
                      onClick={handleSaveMenuItem}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  // View mode buttons
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Renderizar submenus recursivamente */}
            {item.has_children && item.children && item.children.length > 0 && (
              <div className="ml-6 border-l-2 border-gray-200 pl-4">
                {renderMenuItems(item.children, level + 1, menuId)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleEditMenuItem = (item: MenuItemWithChildren) => {
    setEditingItem({
      id: item.id,
      title: item.title,
      url: item.url,
      target: item.target,
      level: item.level,
      is_active: item.is_active,
    });
  };

  const handleSaveMenuItem = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/menus/items/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingItem.title,
          url: editingItem.url,
          target: editingItem.target,
          level: editingItem.level,
          is_active: editingItem.is_active,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Item atualizado com sucesso!",
          "O item do menu foi modificado"
        );
        setEditingItem(null);
        await fetchMenus();
      } else {
        showError("Erro ao atualizar item", result.error);
      }
    } catch (err) {
      showError("Erro ao atualizar item", "Ocorreu um erro inesperado");
      console.error("Error updating menu item:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Drag & Drop functions
  const handleDragStart = (
    e: React.DragEvent,
    itemId: number,
    menuId: number
  ) => {
    setDraggedItem({ id: itemId, menuId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, itemId?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (itemId !== undefined) {
      setDragOverItem(itemId);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (
    e: React.DragEvent,
    targetItemId: number,
    menuId: number
  ) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItemId) return;

    try {
      // Obter o item sendo arrastado
      const draggedItemData = findMenuItemById(
        menuItems[menuId] || [],
        draggedItem.id
      );
      const targetItemData = findMenuItemById(
        menuItems[menuId] || [],
        targetItemId
      );

      if (!draggedItemData || !targetItemData) return;

      // Primeiro, tentar reordenar no mesmo nível
      const reorderSuccess = await handleReorderInSameLevel(
        draggedItem.id,
        targetItemId,
        menuId
      );

      if (reorderSuccess) {
        success(
          "Ordem atualizada!",
          "Os itens foram reordenados no mesmo nível"
        );
        await fetchMenus();
        setDraggedItem(null);
        return;
      }

      // Se não foi possível reordenar no mesmo nível, tentar mover entre níveis
      // Verificar se o movimento é válido
      if (!isValidMove(draggedItemData, targetItemData)) {
        showError("Movimento inválido", "Não é possível mover para este local");
        return;
      }

      // Determinar o novo parent_id e nível
      let newParentId: number | null = null;
      let newLevel = 1;

      if (targetItemData.level === 1) {
        // Soltando em um item de nível 1 - vira filho dele
        newParentId = targetItemData.id;
        newLevel = 2;
      } else if (targetItemData.level === 2) {
        // Soltando em um item de nível 2 - vira filho dele
        newParentId = targetItemData.id;
        newLevel = 3;
      } else if (targetItemData.level === 3) {
        // Soltando em um item de nível 3 - vira filho dele
        newParentId = targetItemData.id;
        newLevel = 4;
      } else {
        // Soltando em um item de nível 4 - não pode ter filhos
        showError(
          "Movimento inválido",
          "Itens de nível 4 não podem ter filhos"
        );
        return;
      }

      // Atualizar o item movido
      const response = await fetch(`/api/admin/menus/items/${draggedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_id: newParentId,
          level: newLevel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Item movido com sucesso!",
          "O item foi reorganizado na hierarquia"
        );
        await fetchMenus();
      } else {
        showError("Erro ao mover item", result.error);
      }
    } catch (err) {
      showError("Erro ao mover item", "Ocorreu um erro inesperado");
      console.error("Error moving menu item:", err);
    } finally {
      setDraggedItem(null);
    }
  };

  // Função para reordenar itens dentro do mesmo nível
  const handleReorderInSameLevel = async (
    draggedId: number,
    targetId: number,
    menuId: number
  ) => {
    try {
      const draggedItem = findMenuItemById(menuItems[menuId] || [], draggedId);
      const targetItem = findMenuItemById(menuItems[menuId] || [], targetId);

      if (!draggedItem || !targetItem) return;

      // Só reordenar se estiverem no mesmo nível e mesmo pai
      if (
        draggedItem.level !== targetItem.level ||
        draggedItem.parent_id !== targetItem.parent_id
      ) {
        return false;
      }

      // Obter todos os itens do mesmo nível e pai
      const sameLevelItems = getItemsAtSameLevel(
        menuItems[menuId] || [],
        draggedItem.level,
        draggedItem.parent_id
      );

      // Reordenar
      const draggedIndex = sameLevelItems.findIndex(
        (item) => item.id === draggedId
      );
      const targetIndex = sameLevelItems.findIndex(
        (item) => item.id === targetId
      );

      if (draggedIndex === -1 || targetIndex === -1) return false;

      const newOrder = [...sameLevelItems];
      const [draggedItemData] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItemData);

      // Atualizar order_position para todos os itens
      const updatePromises = newOrder.map((item, index) =>
        fetch(`/api/admin/menus/items/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_position: index + 1 }),
        })
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error("Error reordering in same level:", error);
      return false;
    }
  };

  // Função para obter itens do mesmo nível e mesmo pai
  const getItemsAtSameLevel = (
    items: MenuItemWithChildren[],
    level: number,
    parentId: number | null
  ): MenuItemWithChildren[] => {
    const result: MenuItemWithChildren[] = [];

    const collectItems = (items: MenuItemWithChildren[]) => {
      items.forEach((item) => {
        if (item.level === level && item.parent_id === parentId) {
          result.push(item);
        }
        if (item.children) {
          collectItems(item.children);
        }
      });
    };

    collectItems(items);
    return result.sort((a, b) => a.order_position - b.order_position);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Função para validar se o movimento é válido
  const isValidMove = (
    draggedItem: MenuItemWithChildren,
    targetItem: MenuItemWithChildren
  ): boolean => {
    // Não pode mover para si mesmo
    if (draggedItem.id === targetItem.id) return false;

    // Não pode mover para um filho (criaria loop infinito)
    if (isDescendant(draggedItem, targetItem)) return false;

    // Verificar se o nível resultante seria válido
    const newLevel = targetItem.level + 1;
    if (newLevel > 4) return false;

    return true;
  };

  // Função para verificar se um item é descendente de outro
  const isDescendant = (
    parent: MenuItemWithChildren,
    child: MenuItemWithChildren
  ): boolean => {
    if (!parent.children) return false;

    for (const item of parent.children) {
      if (item.id === child.id) return true;
      if (isDescendant(item, child)) return true;
    }

    return false;
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

    // Validação de nível baseado no item pai
    let actualLevel = level;
    if (parentId) {
      const parentItem = findMenuItemById(menuItems[menuId] || [], parentId);
      if (parentItem) {
        actualLevel = parentItem.level + 1;
        if (actualLevel > 4) {
          showError("Erro", "Não é possível criar mais de 4 níveis de menu");
          return;
        }
      }
    } else {
      actualLevel = 1; // Sem pai = nível 1
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
          level: actualLevel,
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

  // Função auxiliar para encontrar item por ID em qualquer nível
  const findMenuItemById = (
    items: MenuItemWithChildren[],
    id: number
  ): MenuItemWithChildren | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findMenuItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Função para obter todos os itens disponíveis para seleção como pai
  const getAvailableParentItems = (
    menuId: number,
    excludeId?: number
  ): Array<{ id: number; title: string; level: number; path: string }> => {
    const items = menuItems[menuId] || [];
    const result: Array<{
      id: number;
      title: string;
      level: number;
      path: string;
    }> = [];

    const collectItems = (items: MenuItemWithChildren[], path: string = "") => {
      items.forEach((item) => {
        if (item.id !== excludeId && item.level < 4) {
          // Não pode ser pai se já está no nível 4
          const currentPath = path ? `${path} > ${item.title}` : item.title;
          result.push({
            id: item.id,
            title: item.title,
            level: item.level,
            path: currentPath,
          });

          if (item.children && item.children.length > 0) {
            collectItems(item.children, currentPath);
          }
        }
      });
    };

    collectItems(items);
    return result;
  };

  const handleDropToRoot = async (e: React.DragEvent, menuId: number) => {
    e.preventDefault();

    if (!draggedItem) return;

    try {
      const draggedItemData = findMenuItemById(
        menuItems[menuId] || [],
        draggedItem.id
      );
      if (!draggedItemData) return;

      // Verificar se o item já está no nível raiz
      if (draggedItemData.level === 1) {
        showError("Movimento inválido", "Este item já está no nível raiz.");
        return;
      }

      // Determinar o novo nível (raiz)
      const newLevel = 1;

      // Atualizar o item movido
      const response = await fetch(`/api/admin/menus/items/${draggedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_id: null, // Para mover para o nível raiz, parent_id deve ser null
          level: newLevel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Item movido com sucesso para o nível raiz!",
          "O item foi movido para o nível raiz."
        );
        await fetchMenus();
      } else {
        showError("Erro ao mover item para raiz", result.error);
      }
    } catch (err) {
      showError("Erro ao mover item para raiz", "Ocorreu um erro inesperado");
      console.error("Error moving item to root:", err);
    } finally {
      setDraggedItem(null);
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
                        {renderMenuItems(menuItems[menu.id], 0, menu.id)}
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
                    <option value="">Nenhum (Item Principal - Nível 1)</option>
                    {getAvailableParentItems(showAddItemForm).map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.path} (Nível {item.level + 1})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    O nível será automaticamente definido baseado no item pai
                    selecionado
                  </p>
                </div>

                <input type="hidden" name="level" value="1" />

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
