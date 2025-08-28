import { NextRequest, NextResponse } from "next/server";
import { deleteMenuItem } from "@/lib/prisma-menus";
import { extractNumericParam } from "@/lib/nextjs-15-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const itemId = await extractNumericParam(params, "id");

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do item inválido",
        },
        { status: 400 }
      );
    }

    const success = await deleteMenuItem(itemId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Item do menu deletado com sucesso",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Item não encontrado",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
