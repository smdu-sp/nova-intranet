import { NextRequest, NextResponse } from "next/server";
import { getMenuItemsHierarchical, debugMenuItems } from "@/lib/prisma-menus";
import { extractNumericParam } from "@/lib/nextjs-15-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const menuId = await extractNumericParam(params, "id");
    console.log(`🔍 API: Recebida requisição para menu_id: ${menuId}`);

    if (!menuId) {
      console.log(`❌ API: ID do menu inválido`);
      return NextResponse.json(
        {
          success: false,
          error: "ID do menu inválido",
        },
        { status: 400 }
      );
    }

    // Primeiro, vamos fazer debug
    console.log(`🔍 API: Executando debug para menu_id: ${menuId}`);
    const debugResult = await debugMenuItems(menuId);
    console.log(`📊 API: Debug completo:`, debugResult);

    // Agora vamos tentar buscar os itens hierárquicos
    console.log(`🔍 API: Buscando itens hierárquicos para menu_id: ${menuId}`);
    const items = await getMenuItemsHierarchical(menuId);
    console.log(`📊 API: Itens hierárquicos retornados: ${items.length}`);

    return NextResponse.json({
      success: true,
      data: items,
      debug: debugResult, // Incluir debug na resposta
    });
  } catch (error) {
    console.error("❌ API Error fetching menu items:", error);
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
