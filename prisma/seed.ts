import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.menuItem.deleteMany();
  await prisma.navigationMenu.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.cMSPage.deleteMany();

  // Criar menus de navegação
  const mainMenu = await prisma.navigationMenu.create({
    data: {
      name: "Menu Principal",
      location: "header",
      is_active: true,
    },
  });

  const footerMenu = await prisma.navigationMenu.create({
    data: {
      name: "Menu Rodapé",
      location: "footer",
      is_active: true,
    },
  });

  console.log("✅ Menus criados");

  // Criar itens do menu principal (nível 1)
  const smulItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      level: 1,
      title: "SMUL",
      url: "/",
      order_position: 1,
      has_children: true,
    },
  });

  const servidoresItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      level: 1,
      title: "SERVIDORES",
      url: "#",
      order_position: 2,
      has_children: true,
    },
  });

  const solicitacoesItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      level: 1,
      title: "SOLICITAÇÕES",
      url: "#",
      order_position: 3,
      has_children: true,
    },
  });

  const contatosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      level: 1,
      title: "CONTATOS",
      url: "/contatos",
      order_position: 4,
      has_children: false,
    },
  });

  const manuaisItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      level: 1,
      title: "MANUAIS",
      url: "#",
      order_position: 5,
      has_children: true,
    },
  });

  const linksItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      level: 1,
      title: "LINKS",
      url: "#",
      order_position: 6,
      has_children: true,
    },
  });

  console.log("✅ Itens de nível 1 criados");

  // Criar submenus (nível 2)
  const institucionalItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: smulItem.id,
      level: 2,
      title: "Institucional",
      url: "/institucional",
      order_position: 1,
      has_children: false,
    },
  });

  const noticiasItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: smulItem.id,
      level: 2,
      title: "Notícias",
      url: "/noticias",
      order_position: 2,
      has_children: false,
    },
  });

  const funcionariosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: servidoresItem.id,
      level: 2,
      title: "Funcionários",
      url: "/servidores/funcionarios",
      order_position: 1,
      has_children: false,
    },
  });

  const departamentosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: servidoresItem.id,
      level: 2,
      title: "Departamentos",
      url: "/servidores/departamentos",
      order_position: 2,
      has_children: false,
    },
  });

  const formulariosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: solicitacoesItem.id,
      level: 2,
      title: "Formulários",
      url: "/solicitacoes/formularios",
      order_position: 1,
      has_children: true,
    },
  });

  const protocolosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: solicitacoesItem.id,
      level: 2,
      title: "Protocolos",
      url: "/solicitacoes/protocolos",
      order_position: 2,
      has_children: true,
    },
  });

  const manualUsuarioItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: manuaisItem.id,
      level: 2,
      title: "Manual do Usuário",
      url: "/manuais/usuario",
      order_position: 1,
      has_children: true,
    },
  });

  const procedimentosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: manuaisItem.id,
      level: 2,
      title: "Procedimentos",
      url: "/manuais/procedimentos",
      order_position: 2,
      has_children: true,
    },
  });

  const sistemasItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: linksItem.id,
      level: 2,
      title: "Sistemas",
      url: "/links/sistemas",
      order_position: 1,
      has_children: true,
    },
  });

  const recursosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: linksItem.id,
      level: 2,
      title: "Recursos",
      url: "/links/recursos",
      order_position: 2,
      has_children: true,
    },
  });

  console.log("✅ Itens de nível 2 criados");

  // Criar sub-submenus (nível 3)
  const formularioSolicitacaoItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: formulariosItem.id,
      level: 3,
      title: "Formulário de Solicitação",
      url: "/solicitacoes/formularios/solicitacao",
      order_position: 1,
      has_children: true,
    },
  });

  const formularioReclamacaoItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: formulariosItem.id,
      level: 3,
      title: "Formulário de Reclamação",
      url: "/solicitacoes/formularios/reclamacao",
      order_position: 2,
      has_children: true,
    },
  });

  const manualBasicoItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: manualUsuarioItem.id,
      level: 3,
      title: "Manual Básico",
      url: "/manuais/usuario/basico",
      order_position: 1,
      has_children: true,
    },
  });

  const sistemaRHItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: sistemasItem.id,
      level: 3,
      title: "Sistema de RH",
      url: "/links/sistemas/rh",
      order_position: 1,
      has_children: true,
    },
  });

  const documentosItem = await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: recursosItem.id,
      level: 3,
      title: "Documentos",
      url: "/links/recursos/documentos",
      order_position: 1,
      has_children: true,
    },
  });

  console.log("✅ Itens de nível 3 criados");

  // Criar sub-sub-submenus (nível 4)
  await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: formularioSolicitacaoItem.id,
      level: 4,
      title: "Solicitação de Material",
      url: "/solicitacoes/formularios/solicitacao/material",
      order_position: 1,
      has_children: false,
    },
  });

  await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: manualBasicoItem.id,
      level: 4,
      title: "Manual de Navegação",
      url: "/manuais/usuario/basico/navegacao",
      order_position: 1,
      has_children: false,
    },
  });

  await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: sistemaRHItem.id,
      level: 4,
      title: "Gestão de Pessoas",
      url: "/links/sistemas/rh/gestao",
      order_position: 1,
      has_children: false,
    },
  });

  await prisma.menuItem.create({
    data: {
      menu_id: mainMenu.id,
      parent_id: documentosItem.id,
      level: 4,
      title: "Políticas",
      url: "/links/recursos/documentos/politicas",
      order_position: 1,
      has_children: false,
    },
  });

  console.log("✅ Itens de nível 4 criados");

  // Criar páginas CMS de exemplo
  await prisma.cMSPage.create({
    data: {
      title: "Página Institucional",
      slug: "institucional",
      content:
        "<h1>Página Institucional</h1><p>Bem-vindo à página institucional da SMUL.</p>",
      is_published: true,
    },
  });

  await prisma.cMSPage.create({
    data: {
      title: "Sobre Nós",
      slug: "sobre-nos",
      content:
        "<h1>Sobre Nós</h1><p>Conheça mais sobre a SMUL e nossa missão.</p>",
      is_published: true,
    },
  });

  console.log("✅ Páginas CMS criadas");

  // Criar posts de exemplo
  await prisma.blogPost.create({
    data: {
      title: "Primeiro Post do Blog",
      slug: "primeiro-post",
      excerpt: "Este é o primeiro post do nosso blog corporativo.",
      content:
        "<h1>Primeiro Post do Blog</h1><p>Bem-vindo ao nosso blog corporativo!</p>",
      status: "published",
      author: "admin",
      published_at: new Date(),
      meta_title: "Primeiro Post do Blog",
      meta_description:
        "Primeiro post do blog corporativo com notícias e atualizações",
      tags: ["notícias", "corporativo"],
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Como Usar o Sistema CMS",
      slug: "como-usar-cms",
      excerpt:
        "Guia completo para usar o sistema de gerenciamento de conteúdo.",
      content:
        "<h1>Como Usar o Sistema CMS</h1><p>Este guia mostra como criar e gerenciar conteúdo.</p>",
      status: "published",
      author: "admin",
      published_at: new Date(),
      meta_title: "Como Usar o Sistema CMS",
      meta_description: "Guia completo para usar o sistema CMS da intranet",
      tags: ["guia", "cms", "tutorial"],
    },
  });

  console.log("✅ Posts criados");

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
