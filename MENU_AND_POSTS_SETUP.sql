-- Configuração de Menus e Posts para o Sistema CMS
-- Execute este script no seu banco MySQL

-- Tabela para menus de navegação
CREATE TABLE IF NOT EXISTS navigation_menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT 'Nome do menu (ex: Menu Principal, Menu Rodapé)',
  location VARCHAR(50) NOT NULL COMMENT 'Localização do menu (header, footer, sidebar)',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location (location),
  INDEX idx_active (is_active)
);

-- Tabela para itens do menu (suporte a 4 níveis)
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  parent_id INT NULL COMMENT 'ID do item pai para submenus',
  level INT DEFAULT 1 COMMENT 'Nível do menu: 1=principal, 2=submenu, 3=sub-submenu, 4=sub-sub-submenu',
  title VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  target VARCHAR(20) DEFAULT '_self' COMMENT '_self, _blank, _parent',
  order_position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  has_children BOOLEAN DEFAULT FALSE COMMENT 'Indica se o item tem submenus',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES navigation_menus(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE SET NULL,
  INDEX idx_menu_id (menu_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_level (level),
  INDEX idx_order (order_position),
  INDEX idx_active (is_active)
);

-- Tabela para posts/blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT COMMENT 'Resumo do post',
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(255) COMMENT 'URL da imagem destacada',
  author VARCHAR(100) DEFAULT 'admin',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags JSON COMMENT 'Array de tags em formato JSON',
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published (published_at),
  INDEX idx_author (author)
);

-- Inserir dados iniciais
INSERT INTO navigation_menus (name, location) VALUES 
('Menu Principal', 'header'),
('Menu Rodapé', 'footer');

-- Inserir itens do menu principal (nível 1)
INSERT INTO menu_items (menu_id, level, title, url, order_position, has_children) VALUES 
(1, 1, 'SMUL', '/', 1, TRUE),
(1, 1, 'SERVIDORES', '#', 2, TRUE),
(1, 1, 'SOLICITAÇÕES', '#', 3, TRUE),
(1, 1, 'CONTATOS', '/contatos', 4, FALSE),
(1, 1, 'MANUAIS', '#', 5, TRUE),
(1, 1, 'LINKS', '#', 6, TRUE);

-- Inserir submenus (nível 2)
INSERT INTO menu_items (menu_id, parent_id, level, title, url, order_position, has_children) VALUES 
(1, 1, 2, 'Institucional', '/institucional', 1, FALSE),
(1, 1, 2, 'Notícias', '/noticias', 2, FALSE),
(1, 2, 2, 'Funcionários', '/servidores/funcionarios', 1, FALSE),
(1, 2, 2, 'Departamentos', '/servidores/departamentos', 2, FALSE),
(1, 3, 2, 'Formulários', '/solicitacoes/formularios', 1, FALSE),
(1, 3, 2, 'Protocolos', '/solicitacoes/protocolos', 2, FALSE),
(1, 5, 2, 'Manual do Usuário', '/manuais/usuario', 1, FALSE),
(1, 5, 2, 'Procedimentos', '/manuais/procedimentos', 2, FALSE),
(1, 6, 2, 'Sistemas', '/links/sistemas', 1, FALSE),
(1, 6, 2, 'Recursos', '/links/recursos', 2, FALSE);

-- Inserir sub-submenus (nível 3)
INSERT INTO menu_items (menu_id, parent_id, level, title, url, order_position, has_children) VALUES 
(1, 3, 3, 'Formulário de Solicitação', '/solicitacoes/formularios/solicitacao', 1, FALSE),
(1, 3, 3, 'Formulário de Reclamação', '/solicitacoes/formularios/reclamacao', 2, FALSE),
(1, 4, 3, 'Protocolo de Entrada', '/solicitacoes/protocolos/entrada', 1, FALSE),
(1, 4, 3, 'Protocolo de Saída', '/solicitacoes/protocolos/saida', 2, FALSE),
(1, 7, 3, 'Manual Básico', '/manuais/usuario/basico', 1, FALSE),
(1, 7, 3, 'Manual Avançado', '/manuais/usuario/avancado', 2, FALSE),
(1, 8, 3, 'Procedimentos Administrativos', '/manuais/procedimentos/admin', 1, FALSE),
(1, 8, 3, 'Procedimentos Técnicos', '/manuais/procedimentos/tecnicos', 2, FALSE),
(1, 9, 3, 'Sistema de RH', '/links/sistemas/rh', 1, FALSE),
(1, 9, 3, 'Sistema Financeiro', '/links/sistemas/financeiro', 2, FALSE),
(1, 10, 3, 'Documentos', '/links/recursos/documentos', 1, FALSE),
(1, 10, 3, 'Ferramentas', '/links/recursos/ferramentas', 2, FALSE);

-- Inserir sub-sub-submenus (nível 4)
INSERT INTO menu_items (menu_id, parent_id, level, title, url, order_position, has_children) VALUES 
(1, 11, 4, 'Solicitação de Material', '/solicitacoes/formularios/solicitacao/material', 1, FALSE),
(1, 11, 4, 'Solicitação de Serviço', '/solicitacoes/formularios/solicitacao/servico', 2, FALSE),
(1, 12, 4, 'Reclamação de Funcionário', '/solicitacoes/formularios/reclamacao/funcionario', 1, FALSE),
(1, 12, 4, 'Reclamação de Serviço', '/solicitacoes/formularios/reclamacao/servico', 2, FALSE),
(1, 15, 4, 'Manual de Navegação', '/manuais/usuario/basico/navegacao', 1, FALSE),
(1, 15, 4, 'Manual de Funcionalidades', '/manuais/usuario/basico/funcionalidades', 2, FALSE),
(1, 19, 4, 'Gestão de Pessoas', '/links/sistemas/rh/gestao', 1, FALSE),
(1, 19, 4, 'Folha de Pagamento', '/links/sistemas/rh/folha', 2, FALSE),
(1, 21, 4, 'Políticas', '/links/recursos/documentos/politicas', 1, FALSE),
(1, 21, 4, 'Regulamentos', '/links/recursos/documentos/regulamentos', 2, FALSE);

-- Inserir posts de exemplo
INSERT INTO blog_posts (title, slug, excerpt, content, status, author, meta_description) VALUES 
('Primeiro Post do Blog', 'primeiro-post', 'Este é o primeiro post do nosso blog corporativo.', '<h1>Primeiro Post do Blog</h1><p>Bem-vindo ao nosso blog corporativo! Aqui você encontrará notícias, atualizações e informações importantes sobre nossa empresa.</p>', 'published', 'admin', 'Primeiro post do blog corporativo com notícias e atualizações'),
('Como Usar o Sistema CMS', 'como-usar-cms', 'Guia completo para usar o sistema de gerenciamento de conteúdo.', '<h1>Como Usar o Sistema CMS</h1><p>Este guia mostra como criar e gerenciar conteúdo usando nosso sistema CMS avançado.</p>', 'published', 'admin', 'Guia completo para usar o sistema CMS da intranet');
