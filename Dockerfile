FROM oven/bun:1.3.0

# Instalar dependências do sistema necessárias para compilar módulos nativos
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Configurar Python para node-gyp
ENV PYTHON=/usr/bin/python3

WORKDIR /app

# Copiar arquivos de dependências primeiro para melhor cache
COPY package.json bun.lockb* ./

# Instalar dependências
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

USER bun

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun run --bun -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["bun", "run", "src/app.ts"]