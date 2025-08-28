import { NavigationMenu, MenuItem } from "@prisma/client";
import prisma from "./prisma";

// Navigation Menu functions
export async function getAllMenus(): Promise<NavigationMenu[]> {
  try {
    return await prisma.navigationMenu.findMany({
      orderBy: { id: "asc" },
    });
  } catch (error) {
    console.error("Error fetching all menus:", error);
    throw error;
  }
}

export async function createMenu(
  data: Omit<NavigationMenu, "id" | "created_at" | "updated_at">
): Promise<NavigationMenu> {
  try {
    return await prisma.navigationMenu.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
}

export async function updateMenu(
  id: number,
  data: Partial<Omit<NavigationMenu, "id" | "created_at">>
): Promise<NavigationMenu> {
  try {
    return await prisma.navigationMenu.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
}

export async function deleteMenu(id: number): Promise<void> {
  try {
    await prisma.navigationMenu.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
}

// Menu Item functions
export async function getMenuItemsHierarchical(
  menuId: number
): Promise<MenuItem[]> {
  try {
    console.log(`🔍 Buscando itens de menu para menu_id: ${menuId}`);

    const menuItems = await prisma.menuItem.findMany({
      where: { menu_id: menuId },
      orderBy: [{ level: "asc" }, { order_position: "asc" }, { id: "asc" }],
    });

    console.log(`📊 Itens encontrados: ${menuItems.length}`);
    console.log(
      `📋 Itens:`,
      menuItems.map((item) => ({
        id: item.id,
        title: item.title,
        level: item.level,
        parent_id: item.parent_id,
      }))
    );

    // Build hierarchical structure
    const buildHierarchy = (
      items: MenuItem[],
      parentId: number | null = null
    ): any[] => {
      const filtered = items.filter((item) => item.parent_id === parentId);
      console.log(
        `🏗️ Construindo hierarquia para parent_id: ${parentId}, itens encontrados: ${filtered.length}`
      );

      return filtered.map((item) => ({
        ...item,
        children: buildHierarchy(items, item.id),
      }));
    };

    const result = buildHierarchy(menuItems);
    console.log(
      `✅ Hierarquia construída com ${result.length} itens de nível 1`
    );

    return result;
  } catch (error) {
    console.error("❌ Error fetching hierarchical menu items:", error);
    throw error;
  }
}

export async function createMenuItem(
  data: Omit<MenuItem, "id" | "created_at" | "updated_at">
): Promise<MenuItem> {
  try {
    // Update has_children for parent if this is a child item
    if (data.parent_id) {
      await prisma.menuItem.update({
        where: { id: data.parent_id },
        data: { has_children: true },
      });
    }

    return await prisma.menuItem.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
}

export async function updateMenuItem(
  id: number,
  data: Partial<Omit<MenuItem, "id" | "created_at">>
): Promise<MenuItem> {
  try {
    return await prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
}

export async function deleteMenuItem(id: number): Promise<void> {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { children: true },
    });

    if (menuItem) {
      // Delete all children first
      if (menuItem.children && menuItem.children.length > 0) {
        await prisma.menuItem.deleteMany({
          where: { parent_id: id },
        });
      }

      // Delete the item itself
      await prisma.menuItem.delete({
        where: { id },
      });

      // Update parent's has_children if this was the last child
      if (menuItem.parent_id) {
        const remainingChildren = await prisma.menuItem.count({
          where: { parent_id: menuItem.parent_id },
        });

        if (remainingChildren === 0) {
          await prisma.menuItem.update({
            where: { id: menuItem.parent_id },
            data: { has_children: false },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
}

export async function getMenuItemsByMenuId(
  menuId: number
): Promise<MenuItem[]> {
  try {
    return await prisma.menuItem.findMany({
      where: { menu_id: menuId },
      orderBy: [{ level: "asc" }, { order_position: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching menu items by menu ID:", error);
    throw error;
  }
}

// Função de teste para debug
export async function debugMenuItems(menuId: number): Promise<any> {
  try {
    console.log(`🔍 DEBUG: Verificando menu_id: ${menuId}`);

    // Verificar se o menu existe
    const menu = await prisma.navigationMenu.findUnique({
      where: { id: menuId },
    });
    console.log(`📋 Menu encontrado:`, menu);

    // Verificar todos os itens de menu
    const allItems = await prisma.menuItem.findMany();
    console.log(`📊 Total de itens no banco: ${allItems.length}`);
    console.log(
      `📋 Todos os itens:`,
      allItems.map((item) => ({
        id: item.id,
        title: item.title,
        menu_id: item.menu_id,
        level: item.level,
      }))
    );

    // Verificar itens específicos deste menu
    const menuItems = await prisma.menuItem.findMany({
      where: { menu_id: menuId },
    });
    console.log(`📊 Itens para menu ${menuId}: ${menuItems.length}`);
    console.log(
      `📋 Itens do menu:`,
      menuItems.map((item) => ({
        id: item.id,
        title: item.title,
        level: item.level,
        parent_id: item.parent_id,
      }))
    );

    return { menu, allItems, menuItems };
  } catch (error) {
    console.error("❌ DEBUG Error:", error);
    throw error;
  }
}
