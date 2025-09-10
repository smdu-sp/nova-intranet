import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Buscar galerias publicadas
    const [galleries, totalItems] = await Promise.all([
      prisma.gallery.findMany({
        where: {
          is_published: true,
        },
        include: {
          _count: {
            select: {
              images: true,
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.gallery.count({
        where: {
          is_published: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      data: {
        galleries,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar galerias:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
