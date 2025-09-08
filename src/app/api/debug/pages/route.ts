import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Buscar todas as páginas
    const allPages = await prisma.cMSPage.findMany({
      orderBy: { created_at: "desc" },
    });

    // Buscar páginas publicadas
    const publishedPages = await prisma.cMSPage.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
    });

    // Buscar itens do menu
    const menuItems = await prisma.menuItem.findMany({
      where: { menu_id: 5 },
      orderBy: { order_position: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPages: allPages.length,
        publishedPages: publishedPages.length,
        allPages: allPages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          is_published: page.is_published,
          created_at: page.created_at,
        })),
        publishedPages: publishedPages.map(page => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          is_published: page.is_published,
        })),
        menuItems: menuItems.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          level: item.level,
          is_active: item.is_active,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Erro ao debugar páginas:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
