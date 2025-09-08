import { NextRequest, NextResponse } from "next/server";
import { getAllPages, createPage } from "@/lib/prisma-cms";

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
    const body = await request.json();
    console.log("📝 Dados recebidos:", body);

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

    // Criar dados compatíveis com a interface
    const pageData = {
      title: body.title,
      content: body.content,
      meta_description: body.meta_description || null,
      is_published: body.is_published || false,
      created_by: "admin",
    };

    console.log("📝 Dados processados:", pageData);

    const newPage = await createPage(pageData);

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
