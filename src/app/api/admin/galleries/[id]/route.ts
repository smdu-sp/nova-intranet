import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionManager } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário está logado e é admin
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Acesso negado",
        },
        { status: 403 }
      );
    }

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

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: {
        images: {
          orderBy: {
            order_position: "asc",
          },
        },
        _count: {
          select: {
            images: true,
            comments: true,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário está logado e é admin
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Acesso negado",
        },
        { status: 403 }
      );
    }

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

    const { title, description, cover_image, is_published } =
      await request.json();

    // Verificar se a galeria existe
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          error: "Galeria não encontrada",
        },
        { status: 404 }
      );
    }

    // Atualizar galeria
    const gallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(cover_image && { cover_image }),
        ...(is_published !== undefined && { is_published }),
      },
    });

    return NextResponse.json({
      success: true,
      data: gallery,
      message: "Galeria atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar galeria:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário está logado e é admin
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Acesso negado",
        },
        { status: 403 }
      );
    }

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

    // Verificar se a galeria existe
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });

    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          error: "Galeria não encontrada",
        },
        { status: 404 }
      );
    }

    // Deletar galeria (cascade deletará imagens, comentários e likes)
    await prisma.gallery.delete({
      where: { id: galleryId },
    });

    return NextResponse.json({
      success: true,
      message: "Galeria deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar galeria:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
