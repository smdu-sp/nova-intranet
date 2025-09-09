# Página de Login Administrativo

## Visão Geral

A página de login administrativo (`/admin/login`) é uma interface moderna e responsiva para autenticação via LDAP dos administradores da intranet.

## Características

### 🎨 **Design Moderno**
- Interface com gradiente azul/índigo
- Card com efeito de vidro (backdrop-blur)
- Ícones intuitivos para cada campo
- Animações suaves e transições

### 🔐 **Funcionalidades de Segurança**
- Autenticação via LDAP
- Validação de credenciais em tempo real
- Botão para mostrar/ocultar senha
- AutoComplete para navegadores
- Validação de campos obrigatórios

### 🚀 **Experiência do Usuário**
- Foco automático no campo de usuário
- Login com tecla Enter
- Feedback visual de status LDAP
- Mensagens de erro claras
- Loading state com spinner
- Limpeza automática de erros ao digitar

### 📱 **Responsividade**
- Design totalmente responsivo
- Funciona em desktop, tablet e mobile
- Layout adaptativo

## Estrutura da Página

### Componentes Principais

1. **Header com Logo**
   - Ícone de cadeado com gradiente
   - Título "Acesso Administrativo"
   - Subtítulo explicativo

2. **Status LDAP**
   - Indicador visual de conexão
   - Mensagem de status em tempo real
   - Ícones de sucesso/erro

3. **Formulário de Login**
   - Campo de usuário com ícone
   - Campo de senha com toggle de visibilidade
   - Botão de submit com loading state

4. **Footer Informativo**
   - Informações do servidor LDAP
   - Copyright da SMUL

### Estados da Interface

#### Estado Inicial
- Campos vazios
- Status LDAP sendo verificado
- Botão "Entrar" habilitado

#### Estado de Loading
- Spinner no botão
- Texto "Entrando..."
- Campos desabilitados

#### Estado de Erro
- Mensagem de erro destacada
- Ícone de alerta
- Campos habilitados para nova tentativa

#### Estado de Sucesso
- Redirecionamento automático
- Refresh da página

## Validações

### Validação do Cliente
- Usuário obrigatório
- Senha obrigatória
- Trim de espaços em branco

### Validação do Servidor
- Verificação de credenciais LDAP
- Validação de grupos de usuário
- Criação de sessão JWT

## Integração com APIs

### `/api/auth/test-ldap`
- Testa conexão com servidor LDAP
- Exibe status em tempo real
- Configurações do servidor

### `/api/auth/login`
- Autentica usuário via LDAP
- Cria sessão JWT
- Define cookie de sessão

## Acessibilidade

- Labels associados aos campos
- Navegação por teclado
- Contraste adequado
- Ícones descritivos
- AutoComplete para navegadores

## Segurança

- Campos de senha protegidos
- Validação server-side
- Tokens JWT seguros
- Cookies HTTP-only
- Proteção CSRF

## Personalização

### Cores e Temas
```css
/* Gradiente principal */
bg-gradient-to-br from-blue-50 to-indigo-100

/* Botão principal */
bg-gradient-to-r from-blue-600 to-indigo-600

/* Estados de erro */
bg-red-50 text-red-700 border-red-200

/* Estados de sucesso */
bg-green-50 text-green-700 border-green-200
```

### Configurações
- Servidor LDAP configurável via env
- Timeout de conexão ajustável
- Mensagens personalizáveis

## Troubleshooting

### Problemas Comuns

1. **Erro de Conexão LDAP**
   - Verificar configurações do servidor
   - Testar conectividade de rede
   - Validar credenciais de serviço

2. **Login Falha**
   - Verificar usuário e senha
   - Confirmar permissões no LDAP
   - Verificar logs do servidor

3. **Redirecionamento Não Funciona**
   - Verificar middleware de autenticação
   - Confirmar configuração de cookies
   - Validar rotas protegidas

### Logs e Debug
- Console do navegador para erros de frontend
- Logs do servidor para erros de backend
- Network tab para monitorar requisições

## Manutenção

### Atualizações
- Manter dependências atualizadas
- Revisar configurações de segurança
- Testar em diferentes navegadores

### Monitoramento
- Status de conexão LDAP
- Tentativas de login falhadas
- Performance da página

## Exemplo de Uso

```typescript
// Acesso direto à página
window.location.href = '/admin/login';

// Com redirecionamento após login
window.location.href = '/admin/login?redirect=/admin/pages';

// Verificação de autenticação
const response = await fetch('/api/auth/me');
const user = await response.json();
```

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **LDAP** - Autenticação
- **JWT** - Gerenciamento de sessão
