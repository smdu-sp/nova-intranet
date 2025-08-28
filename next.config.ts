import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para resolver problemas de SSR com TipTap
  experimental: {
    // Configurações compatíveis com Turbopack
    serverComponentsExternalPackages: ["@tiptap/react", "@tiptap/starter-kit"],
  },
  // Configurações de webpack para TipTap (apenas quando não usar Turbopack)
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
