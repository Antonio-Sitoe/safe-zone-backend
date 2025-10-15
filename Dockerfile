FROM oven/bun:1.3.0

WORKDIR /app

COPY package.json .
RUN bun install

COPY . .

EXPOSE 3000

USER bun

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun run --bun -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["bun", "run", "src/app.ts"]