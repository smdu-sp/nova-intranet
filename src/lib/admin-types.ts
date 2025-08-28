// Interfaces para o sistema de administração

export interface NavigationMenu {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  menu_id: number;
  parent_id: number | null;
  level: number;
  title: string;
  url: string;
  target: string;
  order_position: number;
  is_active: boolean;
  has_children: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
}

export interface CreateMenuData {
  name: string;
  location: string;
}

export interface UpdateMenuData {
  name?: string;
  location?: string;
  is_active?: boolean;
}

export interface CreateMenuItemData {
  menu_id: number;
  parent_id?: number | null;
  level: number;
  title: string;
  url: string;
  target?: string;
  order_position?: number;
  has_children?: boolean;
}

export interface UpdateMenuItemData {
  title?: string;
  url?: string;
  target?: string;
  level?: number;
  order_position?: number;
  is_active?: boolean;
  has_children?: boolean;
}

export interface CreatePostData {
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status?: "draft" | "published" | "archived";
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  status?: "draft" | "published" | "archived";
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}
