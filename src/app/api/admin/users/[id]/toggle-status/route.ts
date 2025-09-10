import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";
import { UserService } from "@/lib/user-service";

/**
 * POST /api/admin/users/[id]/toggle-status - Ativa/desativa usuário
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verifica se o usuário tem permissão de admin
    const hasAdminPermission = await SessionManager.hasAdminPermission();
    if (!hasAdminPermission) {
      return NextResponse.json(
        { error: "Acesso negado. Permissão de administrador necessária." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID do usuário inválido" },
        { status: 400 }
      );
    }

    const user = await UserService.toggleUserStatus(userId);

    return NextResponse.json({
      message: `Usuário ${
        user.is_active ? "ativado" : "desativado"
      } com sucesso`,
      user,
    });
  } catch (error) {
    console.error("Erro ao alterar status do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
