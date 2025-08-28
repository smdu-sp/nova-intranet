import db from "./db";
import {
  NavigationMenu,
  MenuItem,
  BlogPost,
  CreateMenuData,
  UpdateMenuData,
  CreateMenuItemData,
  UpdateMenuItemData,
  CreatePostData,
  UpdatePostData,
} from "./admin-types";

// ===== FUNÇÕES PARA MENUS =====

export async function getAllMenus(): Promise<NavigationMenu[]> {
  const [rows] = await db.execute(
    "SELECT * FROM navigation_menus ORDER BY location, name"
  );
  return rows as NavigationMenu[];
}

export async function getMenuById(id: number): Promise<NavigationMenu | null> {
  const [rows] = await db.execute(
    "SELECT * FROM navigation_menus WHERE id = ?",
    [id]
  );
  const menus = rows as NavigationMenu[];
  return menus.length > 0 ? menus[0] : null;
}

export async function createMenu(
  data: CreateMenuData
): Promise<NavigationMenu> {
  const [result] = await db.execute(
    "INSERT INTO navigation_menus (name, location) VALUES (?, ?)",
    [data.name, data.location]
  );
  const insertResult = result as any;
  return {
    id: insertResult.insertId,
    name: data.name,
    location: data.location,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateMenu(
  id: number,
  data: UpdateMenuData
): Promise<NavigationMenu | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    values.push(data.name);
  }
  if (data.location !== undefined) {
    updates.push("location = ?");
    values.push(data.location);
  }
  if (data.is_active !== undefined) {
    updates.push("is_active = ?");
    values.push(data.is_active);
  }

  if (updates.length === 0) return null;

  values.push(id);
  await db.execute(
    `UPDATE navigation_menus SET ${updates.join(
      ", "
    )}, updated_at = NOW() WHERE id = ?`,
    values
  );

  return getMenuById(id);
}

export async function deleteMenu(id: number): Promise<boolean> {
  const [result] = await db.execute(
    "DELETE FROM navigation_menus WHERE id = ?",
    [id]
  );
  const deleteResult = result as any;
  return deleteResult.affectedRows > 0;
}

// ===== FUNÇÕES PARA ITENS DO MENU =====

export async function getMenuItems(menuId: number): Promise<MenuItem[]> {
  const [rows] = await db.execute(
    "SELECT * FROM menu_items WHERE menu_id = ? ORDER BY level, order_position, title",
    [menuId]
  );
  return rows as MenuItem[];
}

export async function getMenuItemsHierarchical(
  menuId: number
): Promise<MenuItem[]> {
  const [rows] = await db.execute(
    "SELECT * FROM menu_items WHERE menu_id = ? ORDER BY level, order_position, title",
    [menuId]
  );

  const items = rows as MenuItem[];
  const itemMap = new Map<number, MenuItem>();
  const rootItems: MenuItem[] = [];

  // Primeiro, mapeia todos os itens
  items.forEach((item) => {
    item.children = [];
    itemMap.set(item.id, item);
  });

  // Depois, organiza a hierarquia
  items.forEach((item) => {
    if (item.parent_id === null) {
      rootItems.push(item);
    } else {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(item);
      }
    }
  });

  return rootItems;
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const [rows] = await db.execute("SELECT * FROM menu_items WHERE id = ?", [
    id,
  ]);
  const items = rows as MenuItem[];
  return items.length > 0 ? items[0] : null;
}

export async function createMenuItem(
  data: CreateMenuItemData
): Promise<MenuItem> {
  const [result] = await db.execute(
    "INSERT INTO menu_items (menu_id, parent_id, level, title, url, target, order_position, has_children) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.menu_id,
      data.parent_id || null,
      data.level,
      data.title,
      data.url,
      data.target || "_self",
      data.order_position || 0,
      data.has_children || false,
    ]
  );
  const insertResult = result as any;
  return {
    id: insertResult.insertId,
    menu_id: data.menu_id,
    parent_id: data.parent_id || null,
    level: data.level,
    title: data.title,
    url: data.url,
    target: data.target || "_self",
    order_position: data.order_position || 0,
    is_active: true,
    has_children: data.has_children || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateMenuItem(
  id: number,
  data: UpdateMenuItemData
): Promise<MenuItem | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    values.push(data.title);
  }
  if (data.url !== undefined) {
    updates.push("url = ?");
    values.push(data.url);
  }
  if (data.target !== undefined) {
    updates.push("target = ?");
    values.push(data.target);
  }
  if (data.level !== undefined) {
    updates.push("level = ?");
    values.push(data.level);
  }
  if (data.order_position !== undefined) {
    updates.push("order_position = ?");
    values.push(data.order_position);
  }
  if (data.is_active !== undefined) {
    updates.push("is_active = ?");
    values.push(data.is_active);
  }
  if (data.has_children !== undefined) {
    updates.push("has_children = ?");
    values.push(data.has_children);
  }

  if (updates.length === 0) return null;

  values.push(id);
  await db.execute(
    `UPDATE menu_items SET ${updates.join(
      ", "
    )}, updated_at = NOW() WHERE id = ?`,
    values
  );

  return getMenuItemById(id);
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const [result] = await db.execute("DELETE FROM menu_items WHERE id = ?", [
    id,
  ]);
  const deleteResult = result as any;
  return deleteResult.affectedRows > 0;
}

export async function reorderMenuItems(
  menuId: number,
  itemIds: number[]
): Promise<boolean> {
  try {
    for (let i = 0; i < itemIds.length; i++) {
      await db.execute(
        "UPDATE menu_items SET order_position = ? WHERE id = ? AND menu_id = ?",
        [i + 1, itemIds[i], menuId]
      );
    }
    return true;
  } catch (error) {
    console.error("Error reordering menu items:", error);
    return false;
  }
}

// ===== FUNÇÕES PARA POSTS =====

export async function getAllPosts(): Promise<BlogPost[]> {
  const [rows] = await db.execute(
    "SELECT * FROM blog_posts ORDER BY created_at DESC"
  );
  return rows as BlogPost[];
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const [rows] = await db.execute("SELECT * FROM blog_posts WHERE id = ?", [
    id,
  ]);
  const posts = rows as BlogPost[];
  return posts.length > 0 ? posts[0] : null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const [rows] = await db.execute("SELECT * FROM blog_posts WHERE slug = ?", [
    slug,
  ]);
  const posts = rows as BlogPost[];
  return posts.length > 0 ? posts[0] : null;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const [rows] = await db.execute(
    "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC"
  );
  return rows as BlogPost[];
}

export async function createPost(data: CreatePostData): Promise<BlogPost> {
  const slug = generateSlug(data.title);
  const [result] = await db.execute(
    `INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, status, meta_title, meta_description, tags, author) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      slug,
      data.excerpt || null,
      data.content,
      data.featured_image || null,
      data.status || "draft",
      data.meta_title || data.title,
      data.meta_description || data.excerpt || null,
      data.tags ? JSON.stringify(data.tags) : null,
      "admin",
    ]
  );
  const insertResult = result as any;
  return {
    id: insertResult.insertId,
    title: data.title,
    slug,
    excerpt: data.excerpt || null,
    content: data.content,
    featured_image: data.featured_image || null,
    author: "admin",
    status: data.status || "draft",
    published_at: data.status === "published" ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta_title: data.meta_title || data.title,
    meta_description: data.meta_description || data.excerpt || null,
    tags: data.tags || null,
  };
}

export async function updatePost(
  id: number,
  data: UpdatePostData
): Promise<BlogPost | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    values.push(data.title);
  }
  if (data.excerpt !== undefined) {
    updates.push("excerpt = ?");
    values.push(data.excerpt);
  }
  if (data.content !== undefined) {
    updates.push("content = ?");
    values.push(data.content);
  }
  if (data.featured_image !== undefined) {
    updates.push("featured_image = ?");
    values.push(data.featured_image);
  }
  if (data.status !== undefined) {
    updates.push("status = ?");
    values.push(data.status);
    if (data.status === "published") {
      updates.push("published_at = NOW()");
    }
  }
  if (data.meta_title !== undefined) {
    updates.push("meta_title = ?");
    values.push(data.meta_title);
  }
  if (data.meta_description !== undefined) {
    updates.push("meta_description = ?");
    values.push(data.meta_description);
  }
  if (data.tags !== undefined) {
    updates.push("tags = ?");
    values.push(data.tags ? JSON.stringify(data.tags) : null);
  }

  if (updates.length === 0) return null;

  values.push(id);
  await db.execute(
    `UPDATE blog_posts SET ${updates.join(
      ", "
    )}, updated_at = NOW() WHERE id = ?`,
    values
  );

  return getPostById(id);
}

export async function deletePost(id: number): Promise<boolean> {
  const [result] = await db.execute("DELETE FROM blog_posts WHERE id = ?", [
    id,
  ]);
  const deleteResult = result as any;
  return deleteResult.affectedRows > 0;
}

// ===== FUNÇÕES UTILITÁRIAS =====

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
