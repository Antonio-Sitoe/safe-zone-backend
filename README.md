# Safe Zone Backend API

Backend API para o sistema Safe Zone - Mapeamento de locais seguros e inseguros.

## 🚀 Tecnologias

- **Bun** - Runtime e package manager
- **Elysia** - Framework web moderno e rápido
- **TypeScript** - Linguagem de programação
- **Zod** - Validação de schemas
- **Biome** - Linter e formatter

## 📋 Pré-requisitos

- [Bun](https://bun.sh) instalado
- Node.js 18+ (opcional, se não usar Bun)

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd safe-zone
```

2. Instale as dependências:

```bash
bun install
```

3. Configure as variáveis de ambiente:

```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

## 🚀 Executando o projeto

### Desenvolvimento

```bash
bun run dev
```

### Produção

```bash
bun run build
bun run start
```

### Scripts disponíveis

- `bun run dev` - Executa em modo desenvolvimento com hot reload
- `bun run start` - Executa em modo produção
- `bun run build` - Compila o projeto para produção
- `bun run lint` - Executa o linter
- `bun run lint:fix` - Executa o linter e corrige automaticamente
- `bun run format` - Formata o código

## 📁 Estrutura do Projeto

### Utilitários

- `GET /health` - Health check
- `GET /` - Informações da API
- `GET /swagger` - Documentação Swagger

## 📚 Documentação

A documentação interativa da API está disponível em:

- **Swagger UI**: `http://localhost:3000/swagger`

## 🧪 Testes

```bash
bun test
```

## 🔍 Linting e Formatação

```bash
# Verificar problemas
bun run lint

# Corrigir automaticamente
bun run lint:fix

# Formatar código
bun run format
```

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
