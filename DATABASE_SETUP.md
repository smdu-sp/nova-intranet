# Configuração do Banco de Dados

## Passos para configurar:

### 1. Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

**⚠️ IMPORTANTE: Todas as variáveis são obrigatórias e devem ser preenchidas com valores reais.**

```env
DB_HOST=10.75.32.179
DB_NAME=telefones
DB_USER=seu_usuario_real_aqui
DB_PASSWORD=sua_senha_real_aqui
DB_PORT=3306
```

**NÃO deixe valores padrão como "your_username" - use suas credenciais reais do banco.**

### 2. Estrutura da tabela
O componente espera que exista uma tabela `tbl_telefones` com os seguintes campos:

- `cp_nome` - Nome da pessoa
- `cp_nasc_mes` - Mês de nascimento (1-12)
- `cp_nasc_dia` - Dia de nascimento (1-31)
- `cp_departamento` - Departamento onde trabalha

### 3. Exemplo de dados
```sql
INSERT INTO tbl_telefones (cp_nome, cp_nasc_mes, cp_nasc_dia, cp_departamento) VALUES
('João Silva', 8, 15, 'TI'),
('Maria Santos', 8, 20, 'RH'),
('Pedro Costa', 8, 25, 'Financeiro');
```

### 4. Testar a conexão
Após configurar o `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

O widget de aniversários deve aparecer no sidebar e buscar os dados do banco automaticamente.

### 5. Segurança
- **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore` para sua segurança
- Mantenha suas credenciais de banco de dados seguras

### 6. Solução de problemas
- Verifique se o servidor MySQL está rodando em 10.75.32.179:3306
- Confirme se as credenciais estão corretas no arquivo `.env`
- Verifique se a tabela `tbl_telefones` existe e tem os campos corretos
- Consulte o console do navegador para mensagens de erro detalhadas
- Se aparecer erro "Missing required database environment variables", verifique se o arquivo `.env` existe e tem todas as variáveis
