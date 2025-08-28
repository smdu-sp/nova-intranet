# 🧭 Sistema de Menus Hierárquicos - Intranet SMUL

## 📋 Visão Geral

O sistema de menus da intranet agora suporta **4 níveis de hierarquia**, permitindo criar estruturas de navegação complexas e organizadas. Os menus são gerenciados através do painel administrativo e exibidos dinamicamente na navegação principal.

## 🏗️ Estrutura dos Níveis

### **Nível 1 - Menu Principal**
- Itens visíveis na barra de navegação principal
- Exemplos: SMUL, SERVIDORES, SOLICITAÇÕES, CONTATOS, MANUAIS, LINKS
- São os itens de primeiro nível que aparecem horizontalmente

### **Nível 2 - Submenu**
- Dropdown que aparece ao passar o mouse sobre itens do nível 1
- Exemplos: Institucional, Notícias, Funcionários, Departamentos
- Organizam categorias principais

### **Nível 3 - Sub-submenu**
- Dropdown secundário que aparece ao passar o mouse sobre itens do nível 2
- Exemplos: Formulário de Solicitação, Manual Básico, Sistema de RH
- Detalham subcategorias específicas

### **Nível 4 - Sub-sub-submenu**
- Dropdown terciário para itens muito específicos
- Exemplos: Solicitação de Material, Gestão de Pessoas, Políticas
- Nível mais granular de organização

## 🗄️ Banco de Dados

### Tabela `menu_items` Atualizada
```sql
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_id INT NOT NULL,
  parent_id INT NULL,
  level INT DEFAULT 1,                    -- NOVO: Nível do menu (1-4)
  title VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  target VARCHAR(20) DEFAULT '_self',
  order_position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  has_children BOOLEAN DEFAULT FALSE,     -- NOVO: Indica se tem submenus
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Índices Otimizados
- `idx_level`: Para consultas por nível
- `idx_parent_id`: Para hierarquia
- `idx_order`: Para ordenação
- `idx_active`: Para filtros de status

## 🔧 Funcionalidades Técnicas

### 1. **Gerenciamento de Menus**
- **Localização**: `/admin/menus`
- **Funcionalidades**:
  - Visualização hierárquica dos menus
  - Criação de novos itens com seleção de nível
  - Seleção de item pai para submenus
  - Controle de ativação/desativação
  - Exclusão de itens

### 2. **APIs de Menu**
- **`/api/admin/menus`**: CRUD de menus
- **`/api/admin/menus/[id]/items/hierarchical`**: Itens em formato hierárquico
- **`/api/admin/menus/items`**: Criação de itens
- **`/api/admin/menus/items/[id]`**: Exclusão de itens

### 3. **Componente de Navegação**
- **Arquivo**: `src/components/navigation.tsx`
- **Funcionalidades**:
  - Carregamento dinâmico dos menus do banco
  - Dropdowns automáticos para submenus
  - Suporte a 4 níveis de profundidade
  - Hover effects para ativação dos dropdowns

## 🎨 Interface do Usuário

### **Visualização Hierárquica**
- Indentação visual para diferentes níveis
- Badges indicando o nível de cada item
- Botões de ação (editar, deletar) para cada item
- Expansão/colapso de menus

### **Modal de Criação**
- Seleção de item pai (opcional)
- Seleção de nível (1-4)
- Campos para título, URL e target
- Validação de campos obrigatórios

### **Responsividade**
- Dropdowns adaptáveis para mobile
- Transições suaves entre níveis
- Z-index apropriado para sobreposições

## 🚀 Como Usar

### 1. **Acessar o Gerenciador**
```
URL: /admin/menus
```

### 2. **Criar Novo Item**
```
1. Clicar em "Adicionar Item" em qualquer menu
2. Selecionar item pai (se for submenu)
3. Escolher nível (1-4)
4. Preencher título e URL
5. Salvar
```

### 3. **Organizar Hierarquia**
```
- Nível 1: Itens principais da navegação
- Nível 2: Categorias principais
- Nível 3: Subcategorias específicas
- Nível 4: Itens muito específicos
```

### 4. **Exemplo de Estrutura**
```
SMUL (Nível 1)
├── Institucional (Nível 2)
├── Notícias (Nível 2)

SERVIDORES (Nível 1)
├── Funcionários (Nível 2)
├── Departamentos (Nível 2)

SOLICITAÇÕES (Nível 1)
├── Formulários (Nível 2)
│   ├── Formulário de Solicitação (Nível 3)
│   │   ├── Solicitação de Material (Nível 4)
│   │   └── Solicitação de Serviço (Nível 4)
│   └── Formulário de Reclamação (Nível 3)
└── Protocolos (Nível 2)
    ├── Protocolo de Entrada (Nível 3)
    └── Protocolo de Saída (Nível 3)
```

## 🔒 Validações e Segurança

### **Validações Frontend**
- Campos obrigatórios
- Seleção de nível apropriado
- Validação de URLs

### **Validações Backend**
- Verificação de integridade hierárquica
- Prevenção de loops infinitos
- Sanitização de dados

### **Integridade do Banco**
- Foreign keys para relacionamentos
- Cascade delete para itens filhos
- Índices para performance

## 📱 Responsividade

### **Desktop**
- Dropdowns horizontais
- Hover effects
- Transições suaves

### **Mobile**
- Menus colapsáveis
- Touch-friendly
- Navegação vertical

## 🎯 Benefícios

### **Para Administradores**
- Controle total sobre a navegação
- Interface intuitiva de gerenciamento
- Organização hierárquica clara

### **Para Usuários**
- Navegação organizada e lógica
- Acesso rápido a funcionalidades
- Experiência consistente

### **Para Desenvolvedores**
- Sistema flexível e extensível
- APIs bem estruturadas
- Código reutilizável

## 🚧 Funcionalidades Futuras

### **Fase 2**
- [ ] Drag & drop para reordenação
- [ ] Templates de menu pré-definidos
- [ ] Cache de menus para performance
- [ ] Logs de alterações

### **Fase 3**
- [ ] Menus condicionais por usuário
- [ ] Integração com sistema de permissões
- [ ] Analytics de uso dos menus
- [ ] Backup automático de estrutura

## 🐛 Troubleshooting

### **Problemas Comuns**

#### 1. **Menus não aparecem**
```bash
# Verificar se as tabelas existem
mysql -u usuario -p database < MENU_AND_POSTS_SETUP.sql

# Verificar se há itens ativos
SELECT * FROM menu_items WHERE is_active = TRUE;
```

#### 2. **Dropdowns não funcionam**
```bash
# Verificar CSS de hover
# Verificar se has_children está correto
# Verificar console do navegador
```

#### 3. **Erro de hierarquia**
```bash
# Verificar se os níveis estão corretos
# Verificar se parent_id está correto
# Verificar se não há loops
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console do navegador
2. Verificar logs do servidor Next.js
3. Verificar estrutura do banco de dados
4. Consultar documentação das APIs

---

**Desenvolvido para a Intranet SMUL** 🏢  
**Versão**: 2.0.0 (Sistema Hierárquico)  
**Última Atualização**: Dezembro 2024
