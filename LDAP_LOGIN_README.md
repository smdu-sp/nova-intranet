# Sistema de Login LDAP

Este documento descreve o sistema de autenticação LDAP implementado para o painel administrativo da intranet.

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# LDAP Configuration
LDAP_SERVER="ldap://10.10.65.242"
LDAP_DOMAIN="@rede.sp"
LDAP_BASE="DC=rede,DC=sp"
LDAP_USER="usr_smdu_freenas"
LDAP_PASS=""

# Session Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Dependências

O sistema utiliza a biblioteca `ldapts` para comunicação com o servidor LDAP:

```bash
npm install ldapts
```

## Funcionalidades

### 1. Autenticação LDAP
- Validação de credenciais contra servidor LDAP
- Busca de informações do usuário (nome, email, grupos)
- Verificação de grupos de usuário

### 2. Gerenciamento de Sessão
- Tokens JWT para autenticação
- Cookies seguros para persistência
- Expiração automática de sessões (24 horas)

### 3. Middleware de Proteção
- Proteção automática de rotas administrativas
- Redirecionamento para login quando não autenticado
- Verificação de sessão em tempo real

## Estrutura de Arquivos

```
src/
├── lib/
│   ├── ldap-auth.ts          # Serviço de autenticação LDAP
│   └── session.ts            # Gerenciamento de sessões
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts    # API de login
│   │   ├── logout/route.ts   # API de logout
│   │   ├── me/route.ts       # API de dados do usuário
│   │   └── test-ldap/route.ts # API de teste LDAP
│   └── admin/
│       ├── login/page.tsx    # Página de login
│       └── page.tsx          # Dashboard administrativo
├── components/
│   └── admin-logout.tsx      # Componente de logout
└── middleware.ts             # Middleware de autenticação
```

## APIs Disponíveis

### POST /api/auth/login
Autentica um usuário via LDAP.

**Request:**
```json
{
  "username": "usuario",
  "password": "senha"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "user": {
    "username": "usuario",
    "displayName": "Nome do Usuário",
    "email": "usuario@rede.sp"
  }
}
```

### POST /api/auth/logout
Realiza logout do usuário.

**Response:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### GET /api/auth/me
Retorna dados do usuário autenticado.

**Response:**
```json
{
  "user": {
    "username": "usuario",
    "displayName": "Nome do Usuário",
    "email": "usuario@rede.sp",
    "groups": ["grupo1", "grupo2"]
  },
  "isAuthenticated": true
}
```

### GET /api/auth/test-ldap
Testa a conexão com o servidor LDAP.

**Response:**
```json
{
  "success": true,
  "message": "Conexão LDAP funcionando corretamente",
  "config": {
    "server": "ldap://10.10.65.242",
    "domain": "@rede.sp",
    "base": "DC=rede,DC=sp",
    "user": "usr_smdu_freenas",
    "hasPassword": true
  }
}
```

## Rotas Protegidas

As seguintes rotas são automaticamente protegidas pelo middleware:

- `/admin/*` - Todas as rotas administrativas

Usuários não autenticados são redirecionados para `/admin/login`.

## Uso nos Componentes

### Verificar Autenticação
```typescript
import { SessionManager } from '@/lib/session';

// Verificar se está autenticado
const isAuthenticated = await SessionManager.isAuthenticated();

// Obter dados do usuário
const user = await SessionManager.getCurrentUser();

// Verificar se pertence a um grupo
const isInGroup = await SessionManager.isUserInGroup('admin');
```

### Componente de Logout
```tsx
import { AdminLogout } from '@/components/admin-logout';

function AdminPage() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <AdminLogout user={user} />
    </div>
  );
}
```

## Segurança

### Cookies
- Cookies HTTP-only para prevenir acesso via JavaScript
- Secure flag em produção
- SameSite=Lax para proteção CSRF

### Tokens JWT
- Assinatura com chave secreta
- Expiração de 24 horas
- Verificação de integridade

### LDAP
- Conexão segura com servidor LDAP
- Validação de credenciais
- Timeout de conexão configurado

## Troubleshooting

### Erro de Conexão LDAP
1. Verifique se o servidor LDAP está acessível
2. Confirme as credenciais de conexão
3. Teste a conexão via `/api/auth/test-ldap`

### Problemas de Sessão
1. Verifique se `NEXTAUTH_SECRET` está configurado
2. Confirme se os cookies estão sendo definidos
3. Verifique o console do navegador para erros

### Usuário não consegue fazer login
1. Verifique se o usuário existe no LDAP
2. Confirme se a senha está correta
3. Verifique se o usuário tem as permissões necessárias

## Desenvolvimento

### Testando Localmente
1. Configure as variáveis de ambiente
2. Execute `npm run dev`
3. Acesse `/admin/login`
4. Use credenciais válidas do LDAP

### Logs
Os logs de autenticação são exibidos no console do servidor para facilitar o debug.

## Manutenção

### Atualização de Configurações
Para alterar configurações LDAP, edite as variáveis de ambiente e reinicie o servidor.

### Backup de Sessões
As sessões são armazenadas em cookies, não requerem backup especial.

### Monitoramento
Monitore os logs do servidor para identificar tentativas de login falhadas ou problemas de conectividade LDAP.
