import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug } from "@/lib/cms";
import { extractRouteParam } from "@/lib/nextjs-15-utils";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET - Buscar página por slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug é obrigatório",
        },
        { status: 400 }
      );
    }

    const page = await getPageBySlug(slug);

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
    console.error("❌ Erro ao buscar página por slug:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
