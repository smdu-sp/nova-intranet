import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/posts/[id]/likes - Obtém informações de likes de um post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "ID do post inválido" },
        { status: 400 }
      );
    }

    // Conta o total de likes
    const totalLikes = await prisma.like.count({
      where: { post_id: postId },
    });

    // Verifica se o usuário atual deu like (se estiver autenticado)
    let userLiked = false;
    const session = await SessionManager.getCurrentSession();
    if (session?.isAuthenticated) {
      const userLike = await prisma.like.findUnique({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: session.user.id,
          },
        },
      });
      userLiked = !!userLike;
    }

    return NextResponse.json({
      totalLikes,
      userLiked,
    });
  } catch (error) {
    console.error("Erro ao obter likes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts/[id]/likes - Adiciona ou remove like de um post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se o usuário está autenticado
    const session = await SessionManager.getCurrentSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "ID do post inválido" },
        { status: 400 }
      );
    }

    // Verifica se o post existe
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o usuário já deu like
    const existingLike = await prisma.like.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: session.user.id,
        },
      },
    });

    if (existingLike) {
      // Remove o like
      await prisma.like.delete({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: session.user.id,
          },
        },
      });

      // Conta o total de likes após remoção
      const totalLikes = await prisma.like.count({
        where: { post_id: postId },
      });

      return NextResponse.json({
        action: "removed",
        totalLikes,
        userLiked: false,
      });
    } else {
      // Adiciona o like
      await prisma.like.create({
        data: {
          post_id: postId,
          user_id: session.user.id,
        },
      });

      // Conta o total de likes após adição
      const totalLikes = await prisma.like.count({
        where: { post_id: postId },
      });

      return NextResponse.json({
        action: "added",
        totalLikes,
        userLiked: true,
      });
    }
  } catch (error) {
    console.error("Erro ao gerenciar like:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
