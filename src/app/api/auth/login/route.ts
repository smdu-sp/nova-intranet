import { NextRequest, NextResponse } from "next/server";
import { ldapAuth } from "@/lib/ldap-auth";
import { SessionManager } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log("🚀 Tentativa de login para usuário:", username);

    // Validação básica
    if (!username || !password) {
      console.log("❌ Validação falhou: usuário ou senha em branco");
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    console.log("✅ Validação básica passou, iniciando autenticação LDAP...");

    // Autentica via LDAP
    const ldapUser = await ldapAuth.authenticate(username, password);

    if (!ldapUser) {
      console.log("❌ Autenticação LDAP falhou para usuário:", username);
      return NextResponse.json(
        { error: "Credenciais inválidas. Verifique seu usuário e senha." },
        { status: 401 }
      );
    }

    console.log("✅ Autenticação LDAP bem-sucedida, criando sessão...");

    // Cria a sessão
    const token = await SessionManager.createSession(ldapUser);
    console.log("✅ Sessão criada com sucesso");

    // Define o cookie da sessão
    await SessionManager.setSessionCookie(token);
    console.log("✅ Cookie de sessão definido");

    const responseData = {
      success: true,
      user: {
        username: ldapUser.sAMAccountName,
        displayName: ldapUser.displayName || ldapUser.cn,
        email: ldapUser.mail,
      },
    };

    console.log("🎉 Login concluído com sucesso:", responseData.user);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("💥 Erro no login:", {
      error: error,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
