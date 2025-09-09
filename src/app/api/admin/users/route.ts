import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";
import { UserService } from "@/lib/user-service";

/**
 * GET /api/admin/users - Lista usuários com paginação e busca
 */
export async function GET(request: NextRequest) {
  try {
    // Verifica se o usuário tem permissão de admin
    const hasAdminPermission = await SessionManager.hasAdminPermission();
    if (!hasAdminPermission) {
      return NextResponse.json(
        { error: "Acesso negado. Permissão de administrador necessária." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;

    const result = await UserService.getUsers(page, limit, search);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Cria um novo usuário
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica se o usuário tem permissão de admin
    const hasAdminPermission = await SessionManager.hasAdminPermission();
    if (!hasAdminPermission) {
      return NextResponse.json(
        { error: "Acesso negado. Permissão de administrador necessária." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, email, display_name, full_name, role } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username é obrigatório" },
        { status: 400 }
      );
    }

    const user = await UserService.createUser({
      username,
      email,
      display_name,
      full_name,
      role,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
