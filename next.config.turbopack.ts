import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração otimizada para Turbopack
  experimental: {
    // Pacotes externos para componentes do servidor
    serverComponentsExternalPackages: ["@tiptap/react", "@tiptap/starter-kit"],
    // Habilitar Turbopack
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
