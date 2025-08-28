import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/prisma-posts";

export async function GET() {
  try {
    const posts = await getAllPosts();

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
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
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      featured_image,
      status,
      meta_title,
      meta_description,
      tags,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Título e conteúdo são obrigatórios",
        },
        { status: 400 }
      );
    }

    const post = await createPost({
      title,
      excerpt,
      content,
      featured_image,
      status,
      meta_title,
      meta_description,
      tags,
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
