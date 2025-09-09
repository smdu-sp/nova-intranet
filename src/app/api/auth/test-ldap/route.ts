import { NextRequest, NextResponse } from "next/server";
import { ldapAuth } from "@/lib/ldap-auth";

export async function GET(request: NextRequest) {
  try {
    // Testa a conexão com o servidor LDAP
    const isConnected = await ldapAuth.testConnection();

    return NextResponse.json({
      success: isConnected,
      message: isConnected
        ? "Conexão LDAP funcionando corretamente"
        : "Erro na conexão LDAP",
      config: {
        server: process.env.LDAP_SERVER,
        domain: process.env.LDAP_DOMAIN,
        base: process.env.LDAP_BASE,
        user: process.env.LDAP_USER,
        // Não expor a senha por segurança
        hasPassword: !!process.env.LDAP_PASS,
      },
    });
  } catch (error) {
    console.error("Erro no teste LDAP:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
