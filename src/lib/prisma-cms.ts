import { CMSPage } from "@prisma/client";
import prisma from "./prisma";

export async function getAllPages(): Promise<CMSPage[]> {
  try {
    return await prisma.cMSPage.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching all pages:", error);
    throw error;
  }
}

export async function createPage(
  data: Omit<CMSPage, "id" | "created_at" | "updated_at">
): Promise<CMSPage> {
  try {
    return await prisma.cMSPage.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
}

export async function getPageById(id: number): Promise<CMSPage | null> {
  try {
    return await prisma.cMSPage.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching page by ID:", error);
    throw error;
  }
}

export async function updatePage(
  id: number,
  data: Partial<Omit<CMSPage, "id" | "created_at">>
): Promise<CMSPage> {
  try {
    return await prisma.cMSPage.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
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
    });
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    throw error;
  }
}
