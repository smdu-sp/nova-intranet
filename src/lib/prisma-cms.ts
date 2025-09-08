import { CMSPage } from "@prisma/client";
import prisma from "./prisma";

// Interface para imagem da página
export interface PageImage {
  image_url: string;
  alt_text?: string | null;
  caption?: string | null;
  order_position: number;
  is_featured: boolean;
}

// Tipos para criação e atualização
export type CreatePageData = Omit<
  CMSPage,
  "id" | "created_at" | "updated_at"
> & {
  images?: PageImage[];
};

export type UpdatePageData = Partial<Omit<CMSPage, "id" | "created_at">> & {
  images?: PageImage[];
};

export async function getAllPages(): Promise<CMSPage[]> {
  try {
    return await prisma.cMSPage.findMany({
      orderBy: { created_at: "desc" },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching all pages:", error);
    throw error;
  }
}

export async function createPage(data: CreatePageData): Promise<CMSPage> {
  try {
    // Gerar slug baseado no título se não fornecido
    const slug = data.slug || generateSlug(data.title);

    // Extrair imagens dos dados
    const { images, ...pageData } = data;

    return await prisma.cMSPage.create({
      data: {
        ...pageData,
        slug,
        created_at: new Date(),
        updated_at: new Date(),
        // Criar imagens usando a sintaxe correta do Prisma
        ...(images &&
          images.length > 0 && {
            images: {
              create: images.map((img) => ({
                image_url: img.image_url,
                alt_text: img.alt_text || null,
                caption: img.caption || null,
                order_position: img.order_position,
                is_featured: img.is_featured,
              })),
            },
          }),
      },
      // Incluir as imagens na resposta
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
}

// Função para gerar slug a partir do título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .trim();
}

export async function getPageById(id: number): Promise<CMSPage | null> {
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
    console.error("Error fetching page by ID:", error);
    throw error;
  }
}

export async function updatePage(
  id: number,
  data: UpdatePageData
): Promise<CMSPage> {
  try {
    // Extrair imagens dos dados
    const { images, ...pageData } = data;

    return await prisma.cMSPage.update({
      where: { id },
      data: {
        ...pageData,
        updated_at: new Date(),
        // Atualizar imagens usando a sintaxe correta do Prisma
        ...(images && {
          images: {
            // Deletar todas as imagens existentes
            deleteMany: {},
            // Criar as novas imagens
            create: images.map((img) => ({
              image_url: img.image_url,
              alt_text: img.alt_text || null,
              caption: img.caption || null,
              order_position: img.order_position,
              is_featured: img.is_featured,
            })),
          },
        }),
      },
      // Incluir as imagens na resposta
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.error("Error updating page:", error);
    throw error;
  }
}

export async function deletePage(id: number): Promise<void> {
  try {
    await prisma.cMSPage.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    throw error;
  }
}

export async function getPublishedPages(): Promise<CMSPage[]> {
  try {
    return await prisma.cMSPage.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching published pages:", error);
    throw error;
  }
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
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
    console.error("Error fetching page by slug:", error);
    throw error;
  }
}
