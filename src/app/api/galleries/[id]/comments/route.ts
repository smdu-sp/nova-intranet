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
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Conteúdo do comentário é obrigatório",
        },
        { status: 400 }
      );
    }

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

    // Criar comentário
    const comment = await prisma.galleryComment.create({
      data: {
        gallery_id: galleryId,
        user_id: userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            display_name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
      message: "Comentário adicionado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
