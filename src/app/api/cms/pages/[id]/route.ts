import { NextRequest, NextResponse } from "next/server";
import {
  getPageById,
  updatePage,
  deletePage,
  UpdatePageData,
} from "@/lib/prisma-cms";
import { extractNumericParam } from "@/lib/nextjs-15-utils";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Buscar página por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = await extractNumericParam(params, "id");

    if (id === null) {
      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 }
      );
    }

    const page = await getPageById(id);

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Página não encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar página:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// PUT - Atualizar página
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = await extractNumericParam(params, "id");

    if (id === null) {
      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 }
      );
    }

    const body: UpdatePageData = await request.json();

    // Verificar se a página existe
    const existingPage = await getPageById(id);
    if (!existingPage) {
      return NextResponse.json(
        {
          success: false,
          error: "Página não encontrada",
        },
        { status: 404 }
      );
    }

    const updatedPage = await updatePage(id, body);

    return NextResponse.json({
      success: true,
      data: updatedPage,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar página:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// DELETE - Deletar página
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = await extractNumericParam(params, "id");

    if (id === null) {
      return NextResponse.json(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 }
      );
    }

    // Verificar se a página existe
    const existingPage = await getPageById(id);
    if (!existingPage) {
      return NextResponse.json(
        {
          success: false,
          error: "Página não encontrada",
        },
        { status: 404 }
      );
    }

    const deleted = await deletePage(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao deletar página",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Página deletada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao deletar página:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
