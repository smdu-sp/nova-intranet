import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionManager } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Promovendo usuário atual para admin...");

    // Verifica a sessão atual
    const session = await SessionManager.getCurrentSession();

    if (!session?.isAuthenticated || !session?.user?.username) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    console.log("👤 Usuário atual:", {
      username: session.user.username,
      currentRole: session.user.role,
    });

    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado no banco de dados" },
        { status: 404 }
      );
    }

    // Promove para admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "admin" },
    });

    console.log("✅ Usuário promovido para admin:", {
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
    });

    return NextResponse.json({
      success: true,
      message: "Usuário promovido para administrador com sucesso!",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        displayName: updatedUser.display_name,
      },
    });
  } catch (error) {
    console.error("💥 Erro ao promover usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
