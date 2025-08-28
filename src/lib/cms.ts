import pool from "./db";

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface CreatePageData {
  title: string;
  content: string;
  meta_description?: string;
  created_by?: string;
}

export interface UpdatePageData {
  title?: string;
  content?: string;
  meta_description?: string;
  is_published?: boolean;
}

// Função para gerar slug a partir do título
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Buscar todas as páginas publicadas
export async function getPublishedPages(): Promise<CMSPage[]> {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT id, title, slug, content, meta_description, is_published, created_at, updated_at, created_by
      FROM cms_pages
      WHERE is_published = TRUE
      ORDER BY title ASC
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    return rows as CMSPage[];
  } catch (error) {
    console.error("❌ Erro ao buscar páginas publicadas:", error);
    throw error;
  }
}

// Buscar todas as páginas (admin)
export async function getAllPages(): Promise<CMSPage[]> {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT id, title, slug, content, meta_description, is_published, created_at, updated_at, created_by
      FROM cms_pages
      ORDER BY updated_at DESC
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    return rows as CMSPage[];
  } catch (error) {
    console.error("❌ Erro ao buscar todas as páginas:", error);
    throw error;
  }
}

// Buscar página por slug
export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT id, title, slug, content, meta_description, is_published, created_at, updated_at, created_by
      FROM cms_pages
      WHERE slug = ? AND is_published = TRUE
    `;

    const [rows] = await connection.execute(query, [slug]);
    connection.release();

    const pages = rows as CMSPage[];
    return pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.error("❌ Erro ao buscar página por slug:", error);
    throw error;
  }
}

// Buscar página por ID (admin)
export async function getPageById(id: number): Promise<CMSPage | null> {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT id, title, slug, content, meta_description, is_published, created_at, updated_at, created_by
      FROM cms_pages
      WHERE id = ?
    `;

    const [rows] = await connection.execute(query, [id]);
    connection.release();

    const pages = rows as CMSPage[];
    return pages.length > 0 ? pages[0] : null;
  } catch (error) {
    console.error("❌ Erro ao buscar página por ID:", error);
    throw error;
  }
}

// Criar nova página
export async function createPage(data: CreatePageData): Promise<CMSPage> {
  try {
    const connection = await pool.getConnection();

    const slug = generateSlug(data.title);

    const query = `
      INSERT INTO cms_pages (title, slug, content, meta_description, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      data.title,
      slug,
      data.content,
      data.meta_description || null,
      data.created_by || "admin",
    ]);

    connection.release();

    const insertResult = result as any;
    const newPage = await getPageById(insertResult.insertId);

    if (!newPage) {
      throw new Error("Erro ao criar página");
    }

    return newPage;
  } catch (error) {
    console.error("❌ Erro ao criar página:", error);
    throw error;
  }
}

// Atualizar página
export async function updatePage(
  id: number,
  data: UpdatePageData
): Promise<CMSPage> {
  try {
    const connection = await pool.getConnection();

    let slug = undefined;
    if (data.title) {
      slug = generateSlug(data.title);
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (data.title) {
      updateFields.push("title = ?");
      updateValues.push(data.title);
    }

    if (slug) {
      updateFields.push("slug = ?");
      updateValues.push(slug);
    }

    if (data.content !== undefined) {
      updateFields.push("content = ?");
      updateValues.push(data.content);
    }

    if (data.meta_description !== undefined) {
      updateFields.push("meta_description = ?");
      updateValues.push(data.meta_description);
    }

    if (data.is_published !== undefined) {
      updateFields.push("is_published = ?");
      updateValues.push(data.is_published);
    }

    if (updateFields.length === 0) {
      throw new Error("Nenhum campo para atualizar");
    }

    updateValues.push(id);

    const query = `
      UPDATE cms_pages
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await connection.execute(query, updateValues);
    connection.release();

    const updatedPage = await getPageById(id);

    if (!updatedPage) {
      throw new Error("Erro ao atualizar página");
    }

    return updatedPage;
  } catch (error) {
    console.error("❌ Erro ao atualizar página:", error);
    throw error;
  }
}

// Deletar página
export async function deletePage(id: number): Promise<boolean> {
  try {
    const connection = await pool.getConnection();

    const query = "DELETE FROM cms_pages WHERE id = ?";

    const [result] = await connection.execute(query, [id]);
    connection.release();

    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  } catch (error) {
    console.error("❌ Erro ao deletar página:", error);
    throw error;
  }
}
