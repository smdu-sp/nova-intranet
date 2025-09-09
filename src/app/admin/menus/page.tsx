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
import { AdminLayout } from "@/components/admin-layout";

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
  const [user, setUser] = useState<{
    username: string;
    displayName: string;
  } | null>(null);

  useEffect(() => {
    fetchMenus();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Erro ao obter dados do usuÃ¡rio:", error);
    }
  };

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
      showError("Erro", "Nome e localizaÃ§Ã£o sÃ£o obrigatÃ³rios");
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
        success("Menu criado com sucesso!", "O menu foi criado e estÃ¡ ativo");
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
        "Tem certeza que deseja deletar este menu? Todos os itens serÃ£o removidos."
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
      header: "CabeÃ§alho",
      footer: "RodapÃ©",
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
        {/* Ãrea de drop para nÃ­vel raiz */}
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
              Arraste itens aqui para movÃª-los para o nÃ­vel raiz
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
                      placeholder="TÃ­tulo do item"
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
                        NÃ­vel {item.level}
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

      // Primeiro, tentar reordenar no mesmo nÃ­vel
      const reorderSuccess = await handleReorderInSameLevel(
        draggedItem.id,
        targetItemId,
        menuId
      );

      if (reorderSuccess) {
        success(
          "Ordem atualizada!",
          "Os itens foram reordenados no mesmo nÃ­vel"
        );
        await fetchMenus();
        setDraggedItem(null);
        return;
      }

      // Se nÃ£o foi possÃ­vel reordenar no mesmo nÃ­vel, tentar mover entre nÃ­veis
      // Verificar se o movimento Ã© vÃ¡lido
      if (!isValidMove(draggedItemData, targetItemData)) {
        showError(
          "Movimento invÃ¡lido",
          "NÃ£o Ã© possÃ­vel mover para este local"
        );
        return;
      }

      // Determinar o novo parent_id e nÃ­vel
      let newParentId: number | null = null;
      let newLevel = 1;

      if (targetItemData.level === 1) {
        // Soltando em um item de nÃ­vel 1 - vira filho dele
        newParentId = targetItemData.id;
        newLevel = 2;
      } else if (targetItemData.level === 2) {
        // Soltando em um item de nÃ­vel 2 - vira filho dele
        newParentId = targetItemData.id;
        newLevel = 3;
      } else if (targetItemData.level === 3) {
        // Soltando em um item de nÃ­vel 3 - vira filho dele
        newParentId = targetItemData.id;
        newLevel = 4;
      } else {
        // Soltando em um item de nÃ­vel 4 - nÃ£o pode ter filhos
        showError(
          "Movimento invÃ¡lido",
          "Itens de nÃ­vel 4 nÃ£o podem ter filhos"
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

  // FunÃ§Ã£o para reordenar itens dentro do mesmo nÃ­vel
  const handleReorderInSameLevel = async (
    draggedId: number,
    targetId: number,
    menuId: number
  ) => {
    try {
      const draggedItem = findMenuItemById(menuItems[menuId] || [], draggedId);
      const targetItem = findMenuItemById(menuItems[menuId] || [], targetId);

      if (!draggedItem || !targetItem) return;

      // SÃ³ reordenar se estiverem no mesmo nÃ­vel e mesmo pai
      if (
        draggedItem.level !== targetItem.level ||
        draggedItem.parent_id !== targetItem.parent_id
      ) {
        return false;
      }

      // Obter todos os itens do mesmo nÃ­vel e pai
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

  // FunÃ§Ã£o para obter itens do mesmo nÃ­vel e mesmo pai
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

  // FunÃ§Ã£o para validar se o movimento Ã© vÃ¡lido
  const isValidMove = (
    draggedItem: MenuItemWithChildren,
    targetItem: MenuItemWithChildren
  ): boolean => {
    // NÃ£o pode mover para si mesmo
    if (draggedItem.id === targetItem.id) return false;

    // NÃ£o pode mover para um filho (criaria loop infinito)
    if (isDescendant(draggedItem, targetItem)) return false;

    // Verificar se o nÃ­vel resultante seria vÃ¡lido
    const newLevel = targetItem.level + 1;
    if (newLevel > 4) return false;

    return true;
  };

  // FunÃ§Ã£o para verificar se um item Ã© descendente de outro
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
      showError("Erro", "TÃ­tulo e URL sÃ£o obrigatÃ³rios");
      return;
    }

    // ValidaÃ§Ã£o de nÃ­vel baseado no item pai
    let actualLevel = level;
    if (parentId) {
      const parentItem = findMenuItemById(menuItems[menuId] || [], parentId);
      if (parentItem) {
        actualLevel = parentItem.level + 1;
        if (actualLevel > 4) {
          showError(
            "Erro",
            "NÃ£o Ã© possÃ­vel criar mais de 4 nÃ­veis de menu"
          );
          return;
        }
      }
    } else {
      actualLevel = 1; // Sem pai = nÃ­vel 1
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

  // FunÃ§Ã£o auxiliar para encontrar item por ID em qualquer nÃ­vel
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

  // FunÃ§Ã£o para obter todos os itens disponÃ­veis para seleÃ§Ã£o como pai
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
          // NÃ£o pode ser pai se jÃ¡ estÃ¡ no nÃ­vel 4
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

      // Verificar se o item jÃ¡ estÃ¡ no nÃ­vel raiz
      if (draggedItemData.level === 1) {
        showError("Movimento invÃ¡lido", "Este item jÃ¡ estÃ¡ no nÃ­vel raiz.");
        return;
      }

      // Determinar o novo nÃ­vel (raiz)
      const newLevel = 1;

      // Atualizar o item movido
      const response = await fetch(`/api/admin/menus/items/${draggedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_id: null, // Para mover para o nÃ­vel raiz, parent_id deve ser null
          level: newLevel,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success(
          "Item movido com sucesso para o nÃ­vel raiz!",
          "O item foi movido para o nÃ­vel raiz."
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
    <AdminLayout
      title="Gerenciamento de Menus"
      description="Crie e gerencie menus de navegaÃ§Ã£o para a intranet"
    >
      <div className="flex justify-end items-center mb-8">
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
                Comece criando seu primeiro menu de navegaÃ§Ã£o
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            style={{
              backgroundColor: "lightblue",
              padding: "20px",
              border: "2px solid blue",
            }}
          >
            <h2>MENUS ENCONTRADOS: {menus.length}</h2>
            {menus.map((menu) => (
              <div
                key={menu.id}
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  margin: "10px",
                  border: "1px solid black",
                }}
              >
                <h3>Menu: {menu.name}</h3>
                <p>ID: {menu.id}</p>
                <p>LocalizaÃ§Ã£o: {menu.location}</p>
                <p>Ativo: {menu.is_active ? "Sim" : "NÃ£o"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de CriaÃ§Ã£o */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Criar Novo Menu</h2>
            <form onSubmit={handleCreateMenu}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Menu
                  </label>
                  <Input
                    name="name"
                    placeholder="Ex: Menu Principal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LocalizaÃ§Ã£o
                  </label>
                  <select
                    name="location"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="header">CabeÃ§alho</option>
                    <option value="footer">RodapÃ©</option>
                    <option value="sidebar">Barra Lateral</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
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
    </AdminLayout>
  );
}
