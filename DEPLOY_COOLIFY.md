# 🚀 Deploy no Coolify - Safe Zone Backend

Este guia irá ajudá-lo a fazer o deploy da aplicação Safe Zone no Coolify.

## 📋 Pré-requisitos

- Conta no Coolify (self-hosted ou cloud)
- Repositório Git (GitHub, GitLab, etc.)
- Acesso ao painel do Coolify

## 🎯 Passo a Passo

### 1. Preparar os Serviços no Coolify

Primeiro, crie os serviços necessários no Coolify:

#### a) PostgreSQL com PostGIS

1. No Coolify, vá em **Resources** → **Add New** → **Database**
2. Selecione **PostgreSQL**
3. Configure:
   - **Name**: safe-zone-postgres
   - **Database Name**: safe_zone_db
   - **Username**: safezone_user
   - **Password**: [gerar senha segura]
4. Em **Advanced Settings**, adicione:
   - **Image**: `postgis/postgis:17-master` ⚠️ **IMPORTANTE: Use essa imagem para suporte PostGIS/Geolocalização**
5. Deploy o banco
6. **Após o deploy**, habilite a extensão PostGIS:
   - Acesse o **Terminal** do container PostgreSQL no Coolify
   - Execute os comandos:

   ```bash
   psql -U safezone_user -d safe_zone_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
   psql -U safezone_user -d safe_zone_db -c "CREATE EXTENSION IF NOT EXISTS postgis_topology;"
   ```

   - Verifique se está instalado:

   ```bash
   psql -U safezone_user -d safe_zone_db -c "SELECT PostGIS_version();"
   ```

#### b) Redis

1. No Coolify, vá em **Resources** → **Add New** → **Database**
2. Selecione **Redis**
3. Configure:
   - **Name**: safe-zone-redis
4. Deploy o Redis

### 2. Configurar a Aplicação

1. No Coolify, vá em **Resources** → **Add New** → **Application**
2. Configure:
   - **Source**: Conecte seu repositório Git
   - **Branch**: main (ou sua branch de produção)
   - **Build Pack**: Dockerfile
   - **Port**: 3000

### 3. Variáveis de Ambiente

Configure as seguintes variáveis no Coolify (Settings → Environment Variables):

```bash
# Servidor
PORT=3000
NODE_ENV=production
HOST=0.0.0.0

# Database (copiar do serviço PostgreSQL criado)
DATABASE_URL=postgresql://safezone_user:[PASSWORD]@safe-zone-postgres:5432/safe_zone_db

# Redis (copiar do serviço Redis criado)
REDIS_URL=redis://safe-zone-redis:6379

# Auth (GERAR CHAVE SEGURA!)
JWT_SECRET=[gerar chave segura aleatória]

# CORS (adicionar seu domínio)
CORS_ORIGIN=https://seu-dominio.com
CORS_CREDENTIALS=true

# Email (se usar)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# Logs
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### 4. Configurar Domínio (Opcional)

1. Em **Domains**, adicione seu domínio customizado
2. Coolify irá automaticamente configurar SSL com Let's Encrypt

### 5. Deploy

1. Clique em **Deploy**
2. Acompanhe os logs de build
3. Aguarde o deploy finalizar

### 6. Executar Migrations

⚠️ **IMPORTANTE**: Antes de executar as migrations, **certifique-se de que o PostGIS está habilitado** (passo 1.a.6)!

Após o primeiro deploy e habilitar PostGIS, você precisa executar as migrations:

**Opção 1: Via Terminal do Coolify**

1. Vá em **Terminal** no painel da aplicação
2. Execute:

```bash
bun run migrate
```

**Opção 2: Adicionar ao Dockerfile**
Descomente a linha no Dockerfile:

```dockerfile
# RUN bun run migrate
```

## 🔍 Verificar Deploy

Acesse o endpoint de health check:

```
https://seu-dominio.com/health
```

Ou via curl:

```bash
curl https://seu-dominio.com/health
```

## 🔄 Deploys Automáticos

O Coolify pode fazer deploy automático a cada push:

1. Em **Settings** → **Auto Deploy**
2. Ative o webhook
3. Configure no seu repositório Git

## 📊 Monitoramento

- **Logs**: Veja logs em tempo real no painel
- **Metrics**: Monitore CPU, memória e rede
- **Health Checks**: Coolify verifica automaticamente a saúde do app

## 🔐 Backup

Configure backups automáticos no Coolify:

1. Vá em **Backups** no serviço PostgreSQL
2. Configure frequência e retenção
3. Ative backups automáticos

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se o DATABASE_URL está correto
- Confirme que o PostgreSQL está rodando
- Verifique logs do container

### Erro com PostGIS/Geolocalização

**Problema**: Erros tipo `extension "postgis" does not exist` ou `type geography not found`

**Solução**:

1. Confirme que está usando a imagem `postgis/postgis:17-master`
2. Acesse o terminal do PostgreSQL no Coolify
3. Habilite as extensões:

```bash
psql -U safezone_user -d safe_zone_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U safezone_user -d safe_zone_db -c "CREATE EXTENSION IF NOT EXISTS postgis_topology;"
```

4. Verifique a instalação:

```bash
psql -U safezone_user -d safe_zone_db -c "SELECT PostGIS_version();"
```

### App não inicia

- Verifique variáveis de ambiente
- Veja logs de build
- Confirme que a porta 3000 está exposta

### Migrations falharam

- Execute manualmente via terminal do Coolify
- Verifique permissões do usuário do banco
- Confirme que o banco está acessível
- **Para PostGIS**: Certifique-se de que a extensão está habilitada ANTES de rodar migrations

## 📚 Recursos Úteis

- [Documentação Coolify](https://coolify.io/docs)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Bun Documentation](https://bun.sh/docs)

## 🔑 Checklist de Segurança

- [ ] JWT_SECRET gerado aleatoriamente (mínimo 32 caracteres)
- [ ] Senhas de banco fortes
- [ ] CORS configurado corretamente
- [ ] SSL/HTTPS ativado
- [ ] Backups configurados
- [ ] Variáveis sensíveis como secrets (não hardcoded)
- [ ] Rate limiting configurado (se necessário)

---

**Dica Pro**: Use o recurso de "Preview Deployments" do Coolify para testar mudanças antes de ir para produção!
