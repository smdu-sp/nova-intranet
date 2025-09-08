import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para resolver problemas de SSR com TipTap
  experimental: {
    // Configurações compatíveis com Turbopack
    optimizePackageImports: ["@next/font"],
  },
  // Configurações para TipTap (apenas quando não usar Turbopack)
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Configurações para fontes
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Configurações para Turbopack
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
