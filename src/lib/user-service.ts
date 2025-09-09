import { prisma } from "./prisma";
import { User, UserRole } from "@prisma/client";
import { LDAPUser } from "./ldap-auth";

export interface CreateUserData {
  username: string;
  email?: string;
  display_name?: string;
  full_name?: string;
  role?: UserRole;
}

export interface UpdateUserData {
  email?: string;
  display_name?: string;
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export class UserService {
  /**
   * Cria um usuário automaticamente a partir dos dados do LDAP
   */
  static async createUserFromLDAP(ldapUser: LDAPUser): Promise<User> {
    const userData: CreateUserData = {
      username: ldapUser.sAMAccountName || ldapUser.dn,
      email: ldapUser.mail || undefined,
      display_name: ldapUser.displayName || undefined,
      full_name: ldapUser.cn || undefined,
      role: UserRole.user, // Por padrão, novos usuários são usuários comuns
    };

    return await this.createUser(userData);
  }

  /**
   * Cria um novo usuário
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    return await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        display_name: userData.display_name,
        full_name: userData.full_name,
        role: userData.role || UserRole.user,
        is_active: true,
      },
    });
  }

  /**
   * Busca um usuário por username
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Busca um usuário por ID
   */
  static async getUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Atualiza um usuário
   */
  static async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  /**
   * Atualiza o último login do usuário
   */
  static async updateLastLogin(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { last_login: new Date() },
    });
  }

  /**
   * Lista todos os usuários com paginação
   */
  static async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ users: User[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { username: { contains: search } },
            { display_name: { contains: search } },
            { full_name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Verifica se um usuário é administrador
   */
  static async isAdmin(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user?.role === UserRole.admin;
  }

  /**
   * Promove um usuário a administrador
   */
  static async promoteToAdmin(userId: number): Promise<User> {
    return await this.updateUser(userId, { role: UserRole.admin });
  }

  /**
   * Remove privilégios de administrador de um usuário
   */
  static async demoteFromAdmin(userId: number): Promise<User> {
    return await this.updateUser(userId, { role: UserRole.user });
  }

  /**
   * Ativa/desativa um usuário
   */
  static async toggleUserStatus(userId: number): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("Usuário não encontrado");

    return await this.updateUser(userId, { is_active: !user.is_active });
  }

  /**
   * Deleta um usuário
   */
  static async deleteUser(userId: number): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Busca ou cria um usuário automaticamente a partir do LDAP
   */
  static async findOrCreateUserFromLDAP(ldapUser: LDAPUser): Promise<User> {
    // Primeiro tenta encontrar o usuário existente
    const existingUser = await this.getUserByUsername(
      ldapUser.sAMAccountName || ldapUser.dn
    );

    if (existingUser) {
      // Atualiza informações do usuário com dados mais recentes do LDAP
      await this.updateUser(existingUser.id, {
        email: ldapUser.mail || existingUser.email,
        display_name: ldapUser.displayName || existingUser.display_name,
        full_name: ldapUser.cn || existingUser.full_name,
      });

      // Atualiza o último login
      await this.updateLastLogin(existingUser.id);

      return existingUser;
    }

    // Se não encontrou, cria um novo usuário
    const newUser = await this.createUserFromLDAP(ldapUser);
    await this.updateLastLogin(newUser.id);

    return newUser;
  }
}
