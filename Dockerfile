# Use a imagem oficial do Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Instalar dependências de produção
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Instalar todas as dependências (dev + prod) para build
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copiar código e build
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Executar migrations (opcional, pode ser feito no startup)
# RUN bun run migrate

# Produção
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .
COPY --from=prerelease /app/drizzle.config.ts .

# Criar usuário não-root para segurança
USER bun

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun run --bun -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Comando de start
ENTRYPOINT ["bun", "run", "src/app.ts"]

