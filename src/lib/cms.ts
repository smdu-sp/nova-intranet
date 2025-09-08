import { CMSPage } from "@prisma/client";
import prisma from "./prisma";

export interface CMSPageWithImages extends CMSPage {
  images?: Array<{
    id: number;
    image_url: string;
    alt_text?: string;
    caption?: string;
    order_position: number;
    is_featured: boolean;
  }>;
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
export async function getPublishedPages(): Promise<CMSPageWithImages[]> {
  try {
    return await prisma.cMSPage.findMany({
      where: { is_published: true },
      orderBy: { title: "asc" },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar páginas publicadas:", error);
    throw error;
  }
}

// Buscar todas as páginas (admin)
export async function getAllPages(): Promise<CMSPageWithImages[]> {
  try {
    return await prisma.cMSPage.findMany({
      orderBy: { updated_at: "desc" },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar todas as páginas:", error);
    throw error;
  }
}

// Buscar página por slug
export async function getPageBySlug(
  slug: string
): Promise<CMSPageWithImages | null> {
  try {
    return await prisma.cMSPage.findFirst({
      where: {
        slug,
        is_published: true,
      },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar página por slug:", error);
    throw error;
  }
}

// Buscar página por ID (admin)
export async function getPageById(
  id: number
): Promise<CMSPageWithImages | null> {
  try {
    return await prisma.cMSPage.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar página por ID:", error);
    throw error;
  }
}

// Criar nova página
export async function createPage(
  data: CreatePageData
): Promise<CMSPageWithImages> {
  try {
    const slug = generateSlug(data.title);

    return await prisma.cMSPage.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        meta_description: data.meta_description || null,
        created_by: data.created_by || "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao criar página:", error);
    throw error;
  }
}

// Atualizar página
export async function updatePage(
  id: number,
  data: UpdatePageData
): Promise<CMSPageWithImages> {
  try {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (data.title) {
      updateData.title = data.title;
      updateData.slug = generateSlug(data.title);
    }

    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    if (data.meta_description !== undefined) {
      updateData.meta_description = data.meta_description;
    }

    if (data.is_published !== undefined) {
      updateData.is_published = data.is_published;
    }

    return await prisma.cMSPage.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar página:", error);
    throw error;
  }
}

// Deletar página
export async function deletePage(id: number): Promise<void> {
  try {
    await prisma.cMSPage.delete({
      where: { id },
    });
  } catch (error) {
    console.error("❌ Erro ao deletar página:", error);
    throw error;
  }
}
