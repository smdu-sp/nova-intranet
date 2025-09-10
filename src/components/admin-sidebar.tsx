"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Menu,
  Settings,
  Users,
  BarChart3,
  Shield,
  Database,
  Globe,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";

interface User {
  username: string;
  displayName: string;
  role: string;
}

interface AdminSidebarProps {
  user?: User | null;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
    }
  };

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
      description: "Painel principal",
    },
    {
      title: "Páginas",
      href: "/admin/pages",
      icon: FileText,
      description: "Gerenciar páginas",
    },
    {
      title: "Menus",
      href: "/admin/menus",
      icon: Menu,
      description: "Configurar menus",
    },
    {
      title: "Usuários",
      href: "/admin/users",
      icon: Users,
      description: "Gerenciar usuários",
    },
    {
      title: "Galerias",
      href: "/admin/galerias",
      icon: ImageIcon,
      description: "Gerenciar galerias",
    },
    {
      title: "Relatórios",
      href: "/admin/reports",
      icon: BarChart3,
      description: "Relatórios e estatísticas",
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: Settings,
      description: "Configurações gerais",
    },
    {
      title: "Segurança",
      href: "/admin/security",
      icon: Shield,
      description: "Configurações de segurança",
    },
    {
      title: "Banco de Dados",
      href: "/admin/database",
      icon: Database,
      description: "Gerenciar dados",
    },
  ];

  const externalLinks = [
    {
      title: "Site Público",
      href: "/",
      icon: Globe,
      description: "Visualizar site público",
      external: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: isCollapsed ? "64px" : "256px",
        height: "100vh",
        backgroundColor: "#0a3299",
        color: "white",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: "1px solid #1e40af" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {!isCollapsed && (
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                Painel Admin
              </h1>
              <p style={{ fontSize: "12px", color: "#93c5fd", margin: 0 }}>
                Intranet SMUL
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {currentUser && (
        <div style={{ padding: "16px", borderBottom: "1px solid #1e40af" }}>
          {!isCollapsed ? (
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#1e40af",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {currentUser.displayName?.charAt(0) ||
                      currentUser.username.charAt(0)}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentUser.displayName || currentUser.username}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#93c5fd",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentUser.role === "admin" ? "Administrador" : "Usuário"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#1e40af",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  {currentUser.displayName?.charAt(0) ||
                    currentUser.username.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                    backgroundColor: active ? "#1e40af" : "transparent",
                    color: active ? "white" : "#e5e7eb",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "#1e40af";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon
                    size={20}
                    style={{ marginRight: isCollapsed ? 0 : "12px" }}
                  />
                  {!isCollapsed && (
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        {item.title}
                      </span>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#93c5fd",
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* External Links */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #1e40af",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {externalLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: "8px",
                      transition: "background-color 0.2s",
                      color: "#e5e7eb",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1e40af";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon
                      size={20}
                      style={{ marginRight: isCollapsed ? 0 : "12px" }}
                    />
                    {!isCollapsed && (
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          {item.title}
                        </span>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#93c5fd",
                            margin: 0,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px", borderTop: "1px solid #1e40af" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "8px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1e40af";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut size={20} style={{ marginRight: isCollapsed ? 0 : "12px" }} />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
