import { NextRequest, NextResponse } from "next/server";
import { getMenuItems } from "@/lib/admin-db";
import { extractNumericParam } from "@/lib/nextjs-15-utils";

export async function GET(
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

    const items = await getMenuItems(menuId);

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
