import { NextRequest, NextResponse } from "next/server";
import { SessionManager } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("🛡️ Middleware executando para:", pathname);

  // Rotas que NÃO requerem autenticação
  const publicRoutes = ["/admin/login", "/admin/login-success", "/test-login"];

  // Se for uma rota pública, permite acesso
  if (publicRoutes.includes(pathname)) {
    console.log("✅ Rota pública, permitindo acesso:", pathname);
    return NextResponse.next();
  }

  // Rotas que requerem autenticação de admin
  const protectedRoutes = ["/admin"];

  // Verifica se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    console.log("🔒 Rota protegida detectada:", pathname);
    try {
      const hasAdminPermission = await SessionManager.hasAdminPermission();
      console.log("🔐 Verificação de permissão admin:", hasAdminPermission);

      if (!hasAdminPermission) {
        console.log("❌ Sem permissão admin, redirecionando para login");
        // Redireciona para a página de login
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      console.log("✅ Permissão admin confirmada, permitindo acesso");
    } catch (error) {
      console.error("💥 Erro no middleware de autenticação:", error);
      // Em caso de erro, redireciona para login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  console.log("✅ Middleware concluído, permitindo acesso");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
