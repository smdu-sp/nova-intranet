import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionManager } from "@/lib/session";

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

    const { title, url, target, parent_id, level } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Título e URL são obrigatórios",
        },
        { status: 400 }
      );
    }

    // Buscar o próximo order_position
    const lastItem = await prisma.menuItem.findFirst({
      where: {
        menu_id: 1,
        parent_id: parent_id || null,
      },
      orderBy: {
        order_position: "desc",
      },
    });

    const nextOrder = (lastItem?.order_position || 0) + 1;

    // Criar item do menu
    const menuItem = await prisma.menuItem.create({
      data: {
        menu_id: 1,
        title,
        url,
        target: target || "_self",
        parent_id: parent_id || null,
        level: level || 1,
        order_position: nextOrder,
        is_active: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: menuItem,
      message: "Item do menu criado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar item do menu:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
