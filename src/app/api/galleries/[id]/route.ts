import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryId = parseInt(id);

    if (isNaN(galleryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID da galeria inválido",
        },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.findFirst({
      where: {
        id: galleryId,
        is_published: true,
      },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
        comments: {
          include: {
            user: {
              select: {
                display_name: true,
                username: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          error: "Galeria não encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Erro ao buscar galeria:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
