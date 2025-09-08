import { NextResponse } from "next/server";
import { getPublishedPages } from "@/lib/cms";

// GET - Listar páginas publicadas
export async function GET() {
  try {
    const pages = await getPublishedPages();

    return NextResponse.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar páginas publicadas:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
