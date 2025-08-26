# 🔧 Solução de Problemas - Conexão com Banco de Dados

## 🚨 Erro de Conexão Detectado

Se você está recebendo erro de conexão com o banco de dados, siga este guia passo a passo:

### 1. Verificar Arquivo .env
Certifique-se de que o arquivo `.env` existe na raiz do projeto e contém:

```env
DB_HOST=10.75.32.179
DB_NAME=telefones
DB_USER=seu_usuario_real
DB_PASSWORD=sua_senha_real
DB_PORT=3306
```

### 2. Testar Conexão
Acesse no navegador: `http://localhost:3000/api/test-db`

Este endpoint irá:
- ✅ Testar a conexão com o banco
- ✅ Verificar se a tabela existe
- ✅ Mostrar logs detalhados no console

### 3. Problemas Comuns e Soluções

#### ❌ **ECONNREFUSED - Conexão Recusada**
**Causa:** Servidor MySQL não está rodando ou IP incorreto
**Solução:**
- Verifique se o servidor MySQL está ativo em 10.75.32.179:3306
- Confirme se o IP está correto
- Teste conectividade: `ping 10.75.32.179`

#### ❌ **Access Denied - Acesso Negado**
**Causa:** Usuário ou senha incorretos
**Solução:**
- Verifique credenciais no arquivo `.env`
- Confirme se o usuário tem acesso ao banco `telefones`
- Teste login direto no MySQL

#### ❌ **Unknown Database - Banco Não Encontrado**
**Causa:** Banco de dados `telefones` não existe
**Solução:**
- Verifique se o banco foi criado
- Confirme o nome correto do banco

#### ❌ **ENOTFOUND - Host Não Encontrado**
**Causa:** IP do servidor incorreto ou problema de DNS
**Solução:**
- Verifique o IP 10.75.32.179
- Teste conectividade de rede

### 4. Verificar Logs
Abra o console do terminal onde está rodando `npm run dev` e procure por:

```
🧪 Testing database connection...
Database config: { host: '10.75.32.179', ... }
❌ Database connection test failed: [erro específico]
```

### 5. Teste Manual de Conexão
Se possível, teste a conexão diretamente:

```bash
mysql -h 10.75.32.179 -u seu_usuario -p
```

### 6. Checklist Final
- [ ] Arquivo `.env` existe e tem todas as variáveis
- [ ] Credenciais estão corretas
- [ ] Servidor MySQL está rodando
- [ ] IP e porta estão corretos
- [ ] Usuário tem permissões no banco
- [ ] Tabela `tbl_telefones` existe

### 7. Próximos Passos
1. Execute o teste: `/api/test-db`
2. Verifique os logs no console
3. Identifique o erro específico
4. Aplique a solução correspondente
5. Teste novamente

**💡 Dica:** O endpoint `/api/test-db` fornecerá informações detalhadas sobre o problema!
