import { NextRequest, NextResponse } from "next/server";
import { getAllPages, createPage, CreatePageData } from "@/lib/prisma-cms";

// GET - Listar todas as páginas (admin)
export async function GET() {
  try {
    const pages = await getAllPages();

    return NextResponse.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar páginas:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// POST - Criar nova página
export async function POST(request: NextRequest) {
  try {
    const body: CreatePageData = await request.json();

    // Validação básica
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Título e conteúdo são obrigatórios",
        },
        { status: 400 }
      );
    }

    const newPage = await createPage(body);

    return NextResponse.json(
      {
        success: true,
        data: newPage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erro ao criar página:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
