import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    // Remove o cookie da sessão
    await SessionManager.clearSession();

    return NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
