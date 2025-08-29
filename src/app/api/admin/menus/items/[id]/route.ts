import { NextRequest, NextResponse } from "next/server";
import { deleteMenuItem, updateMenuItem } from "@/lib/prisma-menus";
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

    await deleteMenuItem(itemId);

    return NextResponse.json({
      success: true,
      message: "Item do menu deletado com sucesso",
    });
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

export async function PUT(
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

    const body = await request.json();
    const { title, url, target, level, is_active } = body;

    if (!title || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Título e URL são obrigatórios",
        },
        { status: 400 }
      );
    }

    const updatedItem = await updateMenuItem(itemId, {
      title,
      url,
      target: target || "_self",
      level: level || 1,
      is_active: is_active !== undefined ? is_active : true,
    });

    if (updatedItem) {
      return NextResponse.json({
        success: true,
        data: updatedItem,
        message: "Item do menu atualizado com sucesso",
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
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
