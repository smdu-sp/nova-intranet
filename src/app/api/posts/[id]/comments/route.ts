import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/posts/[id]/comments - Lista comentários de um post
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

    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId,
        is_approved: true, // Só mostra comentários aprovados
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            display_name: true,
            full_name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts/[id]/comments - Cria um novo comentário
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

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Conteúdo do comentário é obrigatório" },
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

    // Cria o comentário
    const comment = await prisma.comment.create({
      data: {
        post_id: postId,
        user_id: session.user.id,
        content: content.trim(),
        is_approved: session.user.role === "admin", // Admins têm comentários aprovados automaticamente
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            display_name: true,
            full_name: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
