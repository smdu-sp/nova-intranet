import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";
import { UserService } from "@/lib/user-service";

/**
 * GET /api/admin/users/[id] - Obtém um usuário específico
 */
export async function GET(
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

    const user = await UserService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id] - Atualiza um usuário
 */
export async function PUT(
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

    const body = await request.json();
    const { email, display_name, full_name, role, is_active } = body;

    const user = await UserService.updateUser(userId, {
      email,
      display_name,
      full_name,
      role,
      is_active,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] - Deleta um usuário
 */
export async function DELETE(
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

    await UserService.deleteUser(userId);

    return NextResponse.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
