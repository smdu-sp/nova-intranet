import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionManager } from "@/lib/session";

export async function GET(request: NextRequest) {
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

    // Buscar todas as galerias (incluindo não publicadas)
    const galleries = await prisma.gallery.findMany({
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
    });

    return NextResponse.json({
      success: true,
      data: galleries,
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

export async function POST(request: NextRequest) {
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

    // Processar FormData
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isPublished = formData.get("is_published") as string;
    const coverImage = formData.get("cover_image") as File;

    if (!title || !coverImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Título e imagem de capa são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Por enquanto, vamos usar uma imagem existente como placeholder
    // Em produção, você deveria fazer upload da imagem para um serviço de armazenamento
    const coverImageUrl = `/images/galeria.png`;

    // Criar galeria
    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || null,
        cover_image: coverImageUrl,
        is_published: isPublished === "true",
        created_by: session.user.display_name || session.user.username,
        created_by_user_id: session.user.id,
      },
    });

    // Processar imagens da galeria se existirem
    const galleryImages = [];
    let index = 0;
    while (formData.has(`gallery_images[${index}][file]`)) {
      const file = formData.get(`gallery_images[${index}][file]`) as File;
      const caption = formData.get(
        `gallery_images[${index}][caption]`
      ) as string;
      const altText = formData.get(
        `gallery_images[${index}][alt_text]`
      ) as string;

      if (file) {
        // Usar imagens existentes como placeholder
        // Em produção, fazer upload para serviço de armazenamento
        const existingImages = [
          "/images/banner_home.png",
          "/images/banner_intranet_ouvidoria.png",
          "/images/banner-contato.png",
          "/images/banner-noticia.png",
          "/images/banner-pesquisa-eNPS.png",
          "/images/galeria.png",
          "/images/papo_urbano.png",
          "/images/urbanismo_em_pauta.png",
        ];
        const imageUrl = existingImages[index % existingImages.length];

        const galleryImage = await prisma.galleryImage.create({
          data: {
            gallery_id: gallery.id,
            image_url: imageUrl,
            alt_text: altText || null,
            caption: caption || null,
            order_position: index + 1,
          },
        });

        galleryImages.push(galleryImage);
      }
      index++;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...gallery,
        images: galleryImages,
      },
      message: "Galeria criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar galeria:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
