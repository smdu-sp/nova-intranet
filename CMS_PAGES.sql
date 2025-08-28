-- Script para criar a tabela de páginas do CMS
CREATE TABLE IF NOT EXISTS cms_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content LONGTEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  INDEX idx_slug (slug),
  INDEX idx_published (is_published)
);

-- Inserir algumas páginas de exemplo
INSERT INTO cms_pages (title, slug, content, meta_description, created_by) VALUES
('Manual do Usuário', 'manual-usuario', '<h1>Manual do Usuário</h1><p>Este é o manual completo para usuários da intranet.</p>', 'Manual completo para usuários da intranet', 'admin'),
('Políticas da Empresa', 'politicas-empresa', '<h1>Políticas da Empresa</h1><p>Aqui estão todas as políticas internas da empresa.</p>', 'Políticas internas da empresa', 'admin'),
('Procedimentos', 'procedimentos', '<h1>Procedimentos</h1><p>Procedimentos padrão para operações diárias.</p>', 'Procedimentos padrão da empresa', 'admin');
