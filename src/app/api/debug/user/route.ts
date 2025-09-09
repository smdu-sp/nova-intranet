import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionManager } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug: Verificando status do usuário...");

    // Verifica a sessão atual
    const session = await SessionManager.getCurrentSession();
    console.log("📋 Sessão atual:", {
      isAuthenticated: session?.isAuthenticated,
      username: session?.user?.username,
      role: session?.user?.role,
      id: session?.user?.id,
    });

    // Busca o usuário no banco de dados
    if (session?.user?.username) {
      const dbUser = await prisma.user.findUnique({
        where: { username: session.user.username },
      });

      console.log("🗄️ Usuário no banco:", {
        found: !!dbUser,
        id: dbUser?.id,
        username: dbUser?.username,
        role: dbUser?.role,
        isActive: dbUser?.is_active,
        lastLogin: dbUser?.last_login,
      });

      return NextResponse.json({
        session: {
          isAuthenticated: session?.isAuthenticated,
          username: session?.user?.username,
          role: session?.user?.role,
          id: session?.user?.id,
        },
        database: {
          found: !!dbUser,
          id: dbUser?.id,
          username: dbUser?.username,
          role: dbUser?.role,
          isActive: dbUser?.is_active,
          lastLogin: dbUser?.last_login,
        },
      });
    }

    return NextResponse.json({
      session: null,
      database: null,
      message: "Nenhuma sessão ativa encontrada",
    });
  } catch (error) {
    console.error("💥 Erro no debug:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
