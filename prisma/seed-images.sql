-- Inserir imagens de exemplo para páginas CMS
-- (Execute após criar algumas páginas no sistema)

-- Exemplo de inserção de imagens para uma página
INSERT INTO cms_page_images (page_id, image_url, alt_text, caption, order_position, is_featured, created_at, updated_at) VALUES
(1, '/uploads/1703123456789-example1.jpg', 'Imagem principal da página', 'Esta é a imagem destacada da página', 0, true, NOW(), NOW()),
(1, '/uploads/1703123456790-example2.jpg', 'Segunda imagem', 'Imagem adicional para ilustrar o conteúdo', 1, false, NOW(), NOW()),
(1, '/uploads/1703123456791-example3.jpg', 'Terceira imagem', 'Mais uma imagem para enriquecer a página', 2, false, NOW(), NOW());

-- Exemplo para outra página
INSERT INTO cms_page_images (page_id, image_url, alt_text, caption, order_position, is_featured, created_at, updated_at) VALUES
(2, '/uploads/1703123456792-example4.jpg', 'Imagem da segunda página', 'Imagem destacada da segunda página', 0, true, NOW(), NOW());
