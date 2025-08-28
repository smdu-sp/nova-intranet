import { NextRequest, NextResponse } from "next/server";
import { createMenuItem } from "@/lib/prisma-menus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menu_id, parent_id, level, title, url, target, order_position } =
      body;

    if (!menu_id || !level || !title || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Menu ID, nível, título e URL são obrigatórios",
        },
        { status: 400 }
      );
    }

    const menuItem = await createMenuItem({
      menu_id,
      parent_id,
      level,
      title,
      url,
      target,
      order_position,
    });

    return NextResponse.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
