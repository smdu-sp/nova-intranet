import { Client } from "ldapts";

export interface LDAPConfig {
  server: string;
  domain: string;
  base: string;
  user: string;
  pass: string;
}

export interface LDAPUser {
  dn: string;
  cn?: string;
  mail?: string;
  sAMAccountName?: string;
  displayName?: string;
  memberOf?: string[];
}

export class LDAPAuthService {
  private config: LDAPConfig;

  constructor() {
    this.config = {
      server: process.env.LDAP_SERVER || "ldap://10.10.65.242",
      domain: process.env.LDAP_DOMAIN || "@rede.sp",
      base: process.env.LDAP_BASE || "DC=rede,DC=sp",
      user: process.env.LDAP_USER || "usr_smdu_freenas",
      pass: process.env.LDAP_PASS || "",
    };
  }

  /**
   * Autentica um usuário via LDAP
   */
  async authenticate(
    username: string,
    password: string
  ): Promise<LDAPUser | null> {
    console.log("🔐 Iniciando autenticação LDAP para:", username);

    const client = new Client({
      url: this.config.server,
      timeout: 10000,
    });

    try {
      console.log("📡 Conectando ao servidor LDAP:", this.config.server);
      // Conecta ao servidor LDAP
      await client.bind(this.config.user, this.config.pass);
      console.log("✅ Conexão LDAP estabelecida com sucesso");

      // Busca o usuário
      const searchFilter = `(&(objectClass=user)(sAMAccountName=${username}))`;
      console.log("🔍 Buscando usuário com filtro:", searchFilter);

      const searchResult = await client.search(this.config.base, {
        scope: "sub",
        filter: searchFilter,
        attributes: ["cn", "mail", "sAMAccountName", "displayName", "memberOf"],
      });

      console.log("📊 Resultado da busca:", {
        entriesFound: searchResult.searchEntries.length,
        entries: searchResult.searchEntries.map((entry) => ({
          dn: entry.dn,
          sAMAccountName: entry.sAMAccountName,
          displayName: entry.displayName,
        })),
      });

      if (searchResult.searchEntries.length === 0) {
        console.log("❌ Usuário não encontrado no LDAP");
        return null;
      }

      const user = searchResult.searchEntries[0];
      const userDN = user.dn;
      console.log("👤 Usuário encontrado:", {
        dn: userDN,
        sAMAccountName: user.sAMAccountName,
        displayName: user.displayName,
      });

      // Tenta autenticar o usuário com sua senha
      const authClient = new Client({
        url: this.config.server,
        timeout: 10000,
      });

      try {
        console.log("🔑 Tentando autenticar usuário com senha...");
        await authClient.bind(userDN, password);
        console.log("✅ Autenticação bem-sucedida!");

        // Se chegou até aqui, a autenticação foi bem-sucedida
        const ldapUser: LDAPUser = {
          dn: userDN,
          cn: user.cn as string,
          mail: user.mail as string,
          sAMAccountName: user.sAMAccountName as string,
          displayName: user.displayName as string,
          memberOf: user.memberOf as string[],
        };

        console.log("🎉 Usuário LDAP autenticado:", {
          username: ldapUser.sAMAccountName,
          displayName: ldapUser.displayName,
          email: ldapUser.mail,
        });

        return ldapUser;
      } catch (authError) {
        console.error("❌ Erro na autenticação LDAP:", {
          error: authError,
          message:
            authError instanceof Error
              ? authError.message
              : "Erro desconhecido",
          code: (authError as any)?.code,
        });
        return null;
      } finally {
        await authClient.unbind();
      }
    } catch (error) {
      console.error("❌ Erro na conexão LDAP:", {
        error: error,
        message: error instanceof Error ? error.message : "Erro desconhecido",
        code: (error as any)?.code,
      });
      return null;
    } finally {
      await client.unbind();
    }
  }

  /**
   * Verifica se o usuário pertence a um grupo específico
   */
  async isUserInGroup(username: string, groupName: string): Promise<boolean> {
    const client = new Client({
      url: this.config.server,
      timeout: 10000,
    });

    try {
      await client.bind(this.config.user, this.config.pass);

      const searchResult = await client.search(this.config.base, {
        scope: "sub",
        filter: `(&(objectClass=user)(sAMAccountName=${username}))`,
        attributes: ["memberOf"],
      });

      if (searchResult.searchEntries.length === 0) {
        return false;
      }

      const user = searchResult.searchEntries[0];
      const memberOf = (user.memberOf as string[]) || [];

      return memberOf.some((group) =>
        group.toLowerCase().includes(groupName.toLowerCase())
      );
    } catch (error) {
      console.error("Erro ao verificar grupo do usuário:", error);
      return false;
    } finally {
      await client.unbind();
    }
  }

  /**
   * Testa a conexão com o servidor LDAP
   */
  async testConnection(): Promise<boolean> {
    const client = new Client({
      url: this.config.server,
      timeout: 5000,
    });

    try {
      await client.bind(this.config.user, this.config.pass);
      return true;
    } catch (error) {
      console.error("Erro no teste de conexão LDAP:", error);
      return false;
    } finally {
      await client.unbind();
    }
  }
}

// Instância singleton
export const ldapAuth = new LDAPAuthService();
