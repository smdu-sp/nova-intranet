import { NextRequest, NextResponse } from "next/server";
import { reorderMenuItems } from "@/lib/prisma-menus";
import { extractNumericParam } from "@/lib/nextjs-15-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const menuId = await extractNumericParam(params, "id");

    if (!menuId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do menu inválido",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { itemIds } = body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Lista de IDs de itens é obrigatória",
        },
        { status: 400 }
      );
    }

    const success = await reorderMenuItems(menuId, itemIds);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Itens do menu reordenados com sucesso",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao reordenar itens",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error reordering menu items:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
