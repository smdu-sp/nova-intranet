import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";

/**
 * GET /api/auth/check - Verifica se o usuário está autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await SessionManager.getCurrentSession();

    if (!session?.isAuthenticated) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: session.user.id,
        username: session.user.username,
        displayName: session.user.displayName,
        email: session.user.email,
        fullName: session.user.fullName,
        role: session.user.role,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
