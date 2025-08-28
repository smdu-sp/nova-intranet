import { NextRequest, NextResponse } from "next/server";
import { getAllMenus, createMenu } from "@/lib/prisma-menus";

export async function GET() {
  try {
    const menus = await getAllMenus();

    return NextResponse.json({
      success: true,
      data: menus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location } = body;

    if (!name || !location) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome e localização são obrigatórios",
        },
        { status: 400 }
      );
    }

    const menu = await createMenu({ name, location });

    return NextResponse.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
