-- Dados de teste para o widget de aniversários
-- Execute estes comandos no seu banco MySQL local

USE telefones;

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS tbl_telefones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cp_nome VARCHAR(255) NOT NULL,
    cp_nasc_mes INT NOT NULL,
    cp_nasc_dia INT NOT NULL,
    cp_departamento VARCHAR(255) NOT NULL
);

-- Inserir dados de teste para diferentes cenários
INSERT INTO tbl_telefones (cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento) VALUES
-- Aniversariantes de hoje (26 de agosto)
('Julio Cesar de Sousa', 8, 26, 'ATIC'),       -- HOJE!
('João Silva', 8, 26, 'TI'),                    -- HOJE!
('Maria Santos', 8, 26, 'RH'),                  -- HOJE!

-- Aniversariantes dos últimos 3 dias
('Pedro Costa', 8, 25, 'Financeiro'),           -- 1 dia atrás
('Ana Oliveira', 8, 24, 'Marketing'),           -- 2 dias atrás
('Carlos Lima', 8, 23, 'Vendas'),               -- 3 dias atrás

-- Aniversariantes dos próximos 7 dias
('Fernanda Silva', 8, 27, 'Administrativo'),    -- 1 dia à frente
('Roberto Alves', 8, 28, 'Operações'),          -- 2 dias à frente
('Juliana Costa', 8, 29, 'Recursos Humanos'),   -- 3 dias à frente
('Marcos Santos', 8, 30, 'TI'),                 -- 4 dias à frente
('Patrícia Lima', 8, 31, 'Marketing'),          -- 5 dias à frente
('Ricardo Silva', 9, 1, 'Vendas'),              -- 6 dias à frente
('Camila Alves', 9, 2, 'Financeiro');           -- 7 dias à frente

-- Verificar dados inseridos
SELECT 
    cp_nome,
    cp_nasc_mes,
    cp_nasc_dia,
    cp_departamento,
    CASE 
        WHEN cp_nasc_mes = 8 AND cp_nasc_dia = 26 THEN 'HOJE'
        WHEN cp_nasc_mes = 8 AND cp_nasc_dia BETWEEN 23 AND 25 THEN 'PASSADO (3 dias)'
        WHEN (cp_nasc_mes = 8 AND cp_nasc_dia BETWEEN 27 AND 31) 
          OR (cp_nasc_mes = 9 AND cp_nasc_dia BETWEEN 1 AND 2) THEN 'FUTURO (7 dias)'
        ELSE 'FORA DO PERÍODO'
        END as periodo
FROM tbl_telefones
ORDER BY cp_nasc_mes, cp_nasc_dia;
