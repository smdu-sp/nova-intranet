import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await SessionManager.getCurrentSession();

    if (!session || !session.isAuthenticated) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    return NextResponse.json({
      user: session.user,
      isAuthenticated: session.isAuthenticated,
    });
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
