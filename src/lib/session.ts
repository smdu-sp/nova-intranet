import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { LDAPUser } from "./ldap-auth";
import { UserService } from "./user-service";
import { User } from "@prisma/client";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-key"
);

export interface SessionData {
  user: {
    id: number;
    username: string;
    displayName: string;
    email?: string;
    fullName?: string;
    role: "admin" | "user";
    groups?: string[];
  };
  isAuthenticated: boolean;
  expiresAt: Date;
}

export class SessionManager {
  /**
   * Cria uma nova sessão para o usuário
   */
  static async createSession(ldapUser: LDAPUser): Promise<string> {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Busca ou cria o usuário no banco de dados
    const user = await UserService.findOrCreateUserFromLDAP(ldapUser);

    const sessionData: SessionData = {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name || user.full_name || user.username,
        email: user.email || undefined,
        fullName: user.full_name || undefined,
        role: user.role as "admin" | "user",
        groups: ldapUser.memberOf || [],
      },
      isAuthenticated: true,
      expiresAt,
    };

    const token = await new SignJWT(sessionData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(secret);

    return token;
  }

  /**
   * Verifica e decodifica o token da sessão
   */
  static async verifySession(token: string): Promise<SessionData | null> {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as SessionData;
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      return null;
    }
  }

  /**
   * Obtém a sessão atual do usuário
   */
  static async getCurrentSession(): Promise<SessionData | null> {
    try {
      console.log("🔍 Verificando sessão atual...");
      const cookieStore = await cookies();
      const token = cookieStore.get("admin-session")?.value;

      console.log("🍪 Cookie encontrado:", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? token.substring(0, 20) + "..." : "N/A",
      });

      if (!token) {
        console.log("❌ Nenhum token de sessão encontrado");
        return null;
      }

      const sessionData = await this.verifySession(token);
      console.log("✅ Sessão verificada:", {
        isAuthenticated: sessionData?.isAuthenticated,
        username: sessionData?.user?.username,
        role: sessionData?.user?.role,
      });

      return sessionData;
    } catch (error) {
      console.error("❌ Erro ao obter sessão atual:", error);
      return null;
    }
  }

  /**
   * Define o cookie da sessão
   */
  static async setSessionCookie(token: string): Promise<void> {
    try {
      console.log("🍪 Definindo cookie de sessão...");
      const cookieStore = await cookies();
      cookieStore.set("admin-session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 horas
        path: "/",
      });
      console.log("✅ Cookie de sessão definido com sucesso");
    } catch (error) {
      console.error("❌ Erro ao definir cookie da sessão:", error);
    }
  }

  /**
   * Remove o cookie da sessão (logout)
   */
  static async clearSession(): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.delete("admin-session");
    } catch (error) {
      console.error("Erro ao limpar sessão:", error);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session?.isAuthenticated === true;
  }

  /**
   * Verifica se o usuário pertence a um grupo específico
   */
  static async isUserInGroup(groupName: string): Promise<boolean> {
    const session = await this.getCurrentSession();
    if (!session?.user.groups) {
      return false;
    }

    return session.user.groups.some((group) =>
      group.toLowerCase().includes(groupName.toLowerCase())
    );
  }

  /**
   * Obtém informações do usuário atual
   */
  static async getCurrentUser(): Promise<SessionData["user"] | null> {
    const session = await this.getCurrentSession();
    return session?.user || null;
  }

  /**
   * Verifica se o usuário atual é administrador
   */
  static async isAdmin(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session?.user.role === "admin";
  }

  /**
   * Verifica se o usuário atual tem permissão de administrador
   */
  static async hasAdminPermission(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session?.isAuthenticated === true && session?.user.role === "admin";
  }
}
