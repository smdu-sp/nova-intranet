import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionManager } from "@/lib/session";

export async function POST(
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

    // Verificar se o usuário está logado
    const session = await SessionManager.getCurrentSession(request);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não autenticado",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verificar se a galeria existe
    const gallery = await prisma.gallery.findFirst({
      where: {
        id: galleryId,
        is_published: true,
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

    // Verificar se o usuário já deu like
    const existingLike = await prisma.galleryLike.findFirst({
      where: {
        gallery_id: galleryId,
        user_id: userId,
      },
    });

    if (existingLike) {
      // Remover like
      await prisma.galleryLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        success: true,
        action: "removed",
        message: "Like removido com sucesso",
      });
    } else {
      // Adicionar like
      await prisma.galleryLike.create({
        data: {
          gallery_id: galleryId,
          user_id: userId,
        },
      });

      return NextResponse.json({
        success: true,
        action: "added",
        message: "Like adicionado com sucesso",
      });
    }
  } catch (error) {
    console.error("Erro ao processar like:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
