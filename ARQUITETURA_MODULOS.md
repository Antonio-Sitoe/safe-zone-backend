# 🏗️ Arquitetura Baseada em Módulos - Safe Zone

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Módulos](#-estrutura-de-módulos)
3. [Algoritmo de Desenvolvimento](#-algoritmo-de-desenvolvimento)
4. [Padrões e Convenções](#-padrões-e-convenções)
5. [Base de Dados](#-base-de-dados)
6. [Exemplos Práticos](#-exemplos-práticos)
7. [Checklist Completo](#-checklist-completo)
8. [Como Começar](#-como-começar)

---

## 🎯 Visão Geral

Este projeto utiliza uma **arquitetura baseada em módulos** que organiza o código por funcionalidades específicas. Cada módulo é responsável por uma área de negócio bem definida, seguindo princípios de **Separação de Responsabilidades** e **Modularidade**.

### Tecnologias Utilizadas

- **Framework**: Elysia (TypeScript)
- **ORM**: Drizzle ORM
- **Base de Dados**: PostgreSQL com PostGIS
- **Validação**: zod
- **Autenticação**: Better Auth

---

## 📁 Estrutura de Módulos

### Estrutura Padrão

```
src/modules/[nome-do-modulo]/
├── [nome].controller.ts    # Controladores (lógica de requisições HTTP)
├── [nome].routes.ts        # Definição das rotas (Elysia)
├── [nome].service.ts       # Lógica de negócio
├── [nome].schemas.ts       # Validação de dados (Zod)
├── [nome].types.ts         # Interfaces e tipos TypeScript
├── [nome]-queries.ts       # Queries específicas do módulo (opcional)
├── [nome]-usage.ts         # Exemplos de uso (opcional)
└── [arquivos-auxiliares]   # Utilitários específicos do módulo
```

### Exemplo: Módulo Zone

```
src/modules/zone/
├── zone.controller.ts      # LocationController
├── zone.routes.ts          # locationRoutes
├── LocationService.ts      # Lógica de negócio
├── zone.types.ts          # IZoneRepository interface
├── zone-queries.ts        # Queries PostGIS
├── zone-usage.ts          # Exemplos de uso
└── geography.ts           # Utilitários geográficos
```

---

## 🔄 Algoritmo de Desenvolvimento

### Passo 1: Definir o Domínio

- **O que fazer**: Identificar qual funcionalidade o módulo vai gerenciar
- **Exemplo**: Zone (gerenciar zonas seguras no mapa)
- **Pergunta**: "O que este módulo precisa fazer?"

### Passo 2: Criar Types e Interfaces

- **Arquivo**: `[nome].types.ts`
- **O que fazer**: Definir todas as interfaces e tipos TypeScript
- **Exemplo**:

```typescript
export interface IZone {
  id: string
  name: string
  coordinates: Coordinates
  userId: string
  createdAt: Date
}

export interface IZoneRepository {
  create(zone: IZone): Promise<IZone>
  getById(id: string): Promise<IZone | null>
  getAll(): Promise<IZone[]>
  update(id: string, zone: Partial<IZone>): Promise<IZone>
  delete(id: string): Promise<void>
}
```

### Passo 3: Criar Schemas de Validação

- **Arquivo**: `[nome].schemas.ts`
- **O que fazer**: Definir validação de entrada/saída usando Zod
- **Exemplo**:

```typescript
import { z } from 'zod'

export const CreateZoneSchema = z.object({
  name: z.string().min(1).max(100),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  description: z.string().max(500).optional(),
})

export const ZoneResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    createdAt: z.string().datetime(),
  }),
})

// Inferir tipos TypeScript dos schemas Zod
export type CreateZoneRequest = z.infer<typeof CreateZoneSchema>
export type ZoneResponse = z.infer<typeof ZoneResponseSchema>
```

### Passo 4: Implementar Service (Lógica de Negócio)

- **Arquivo**: `[nome].service.ts`
- **O que fazer**: Implementar toda a lógica de negócio
- **Padrão**: Classe com métodos para cada operação
- **Exemplo**:

```typescript
export class ZoneService {
  async createZone(zoneData: CreateZoneRequest): Promise<Zone> {
    // Validações de negócio
    // Chamadas para queries/repository
    // Processamento de dados
  }

  async getZoneById(id: string): Promise<Zone> {
    // Busca no banco
    // Validações
    // Retorno de dados
  }
}

export const zoneService = new ZoneService()
```

### Passo 5: Criar Controller

- **Arquivo**: `[nome].controller.ts`
- **O que fazer**: Orquestrar requisições HTTP e respostas
- **Padrão**: Métodos que chamam o service e formatam respostas
- **Exemplo**:

```typescript
export class ZoneController {
  async createZone(ctx: Context) {
    try {
      const body = ctx.body as CreateZoneRequest
      const zone = await zoneService.createZone(body)
      return successResponse(
        zone,
        'Zona criada com sucesso',
        HTTP_STATUS.CREATED
      )
    } catch (error) {
      // Error handling padronizado
    }
  }
}

export const zoneController = new ZoneController()
```

### Passo 6: Definir Rotas

- **Arquivo**: `[nome].routes.ts`
- **O que fazer**: Configurar endpoints HTTP usando Elysia
- **Padrão**: Usar prefix, bind do controller, validações
- **Exemplo**:

```typescript
export const zoneRoutes = new Elysia({ prefix: '/zones' })
  .get('/', zoneController.getAllZones.bind(zoneController), {
    response: ZoneListResponseSchema,
    detail: {
      tags: ['Zones'],
      summary: 'Listar zonas',
      description: 'Lista todas as zonas disponíveis',
    },
  })
  .post('/', zoneController.createZone.bind(zoneController), {
    body: CreateZoneSchema,
    response: ZoneResponseSchema,
    detail: {
      tags: ['Zones'],
      summary: 'Criar zona',
      description: 'Cria uma nova zona no sistema',
    },
  })
```

### Passo 7: Registrar no App Principal

- **Arquivo**: `src/app.ts`
- **O que fazer**: Importar e usar as rotas do módulo
- **Exemplo**:

```typescript
import { zoneRoutes } from '@/modules/zone'

export const app = new Elysia()
  .use(authRoutes)
  .use(zoneRoutes) // ← Registrar aqui
  .use(errorHandler)
```

---

## 🎨 Padrões e Convenções

### A. Padrão de Nomenclatura

- **Arquivos**: `kebab-case` (ex: `zone-routes.ts`, `zone-queries.ts`)
- **Classes**: `PascalCase` (ex: `ZoneController`, `ZoneService`)
- **Instâncias**: `camelCase` (ex: `zoneController`, `zoneService`)
- **Interfaces**: `I + PascalCase` (ex: `IZoneRepository`, `IZone`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `HTTP_STATUS`)

### B. Padrão de Response

```typescript
// Sucesso
{
  success: true,
  message: string,
  data: T
}

// Erro
{
  success: false,
  message: string,
  error?: string
}
```

### C. Padrão de Error Handling

- Sempre usar try/catch nos controllers
- Logs estruturados com `logger`
- Status codes específicos (400, 404, 409, 500)
- Funções utilitárias: `successResponse`, `errorResponse`, `notFoundResponse`

### D. Padrão de Validação

- Usar Zod para schemas
- Validação de entrada (body, query, params)
- Inferência de tipos TypeScript com `z.infer<>`
- Validação de saída (response schemas)
- Documentação OpenAPI automática

#### Vantagens do Zod

- **Type Safety**: Inferência automática de tipos TypeScript
- **Runtime Validation**: Validação em tempo de execução
- **Error Messages**: Mensagens de erro detalhadas
- **Composable**: Schemas podem ser compostos e reutilizados
- **Elysia Integration**: Integração nativa com Elysia

#### Exemplo de Uso com Elysia

```typescript
// Schema de validação
const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18).optional(),
})

// Inferir tipo TypeScript
type User = z.infer<typeof UserSchema>

// Usar no Elysia
app.post(
  '/users',
  ({ body }) => {
    // Elysia valida automaticamente com Zod
    const user = body // TypeScript sabe que é do tipo User
    return { success: true, data: user }
  },
  {
    body: UserSchema, // Zod schema para validação
  }
)
```

---

## 🗄️ Base de Dados

### Estrutura de Schemas (Drizzle ORM)

#### Configuração (drizzle.config.ts)

```typescript
import { defineConfig } from 'drizzle-kit'
import { env } from './src/lib/env'

export default defineConfig({
  schema: './src/db/schemas/**/*.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
```

#### Exemplo de Schema (zone.ts)

```typescript
import { date, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const zones = pgTable('zones', {
  id: uuid().defaultRandom().primaryKey(),
  slug: text(),
  date: date().notNull(),
  hour: time().notNull(),
  description: text(),
  coordinates: text(), // PostGIS POINT como string
  userId: uuid()
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
})

export type Zone = typeof zones.$inferSelect
export type NewZone = typeof zones.$inferInsert
```

### PostGIS Integration

#### Utilitários Geográficos (geography.ts)

```typescript
export interface Coordinates {
  latitude: number
  longitude: number
}

// Criar POINT PostGIS
export function createPoint(lat: number, lng: number): string {
  return `POINT(${lng} ${lat})`
}

// Converter POINT para Coordinates
export function parsePoint(point: string): Coordinates | null {
  const match = point.match(/POINT\(([\d.-]+)\s+([\d.-]+)\)/)
  if (match) {
    return {
      longitude: Number.parseFloat(match[1]),
      latitude: Number.parseFloat(match[2]),
    }
  }
  return null
}

// Calcular distância
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): string {
  const p1 = createPoint(point1.latitude, point1.longitude)
  const p2 = createPoint(point2.latitude, point2.longitude)
  return `ST_Distance('${p1}'::geography, '${p2}'::geography)`
}
```

### Queries Específicas (zone-queries.ts)

#### Operações CRUD com PostGIS

```typescript
import { sql } from 'drizzle-orm'
import { db } from '../../db/db'
import { zones } from '../../db/schemas/zone'
import { createPointFromCoords } from './geography'

// Criar zona com coordenadas
export async function createZoneWithCoordinates(zoneData: {
  location?: string
  date: string
  hour: string
  description?: string
  coordinates: Coordinates
  userId: string
}) {
  const point = createPointFromCoords(zoneData.coordinates)

  return await db
    .insert(zones)
    .values({
      ...zoneData,
      coordinates: sql`${point}::geography`,
    })
    .returning()
}

// Buscar zonas próximas (com PostGIS)
export async function findZonesNearby(
  center: Coordinates,
  radius: number,
  limit = 10
) {
  const point = createPointFromCoords(center)

  return await db
    .select({
      ...zones,
      distance: sql<number>`ST_Distance(coordinates, ${point}::geography)`,
    })
    .from(zones)
    .where(sql`ST_DWithin(coordinates, ${point}::geography, ${radius})`)
    .orderBy(sql`ST_Distance(coordinates, ${point}::geography)`)
    .limit(limit)
}

// Buscar zonas em bounding box
export async function findZonesInBoundingBox(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
  limit = 50
) {
  return await db
    .select()
    .from(zones)
    .where(
      sql`ST_Intersects(
        coordinates, 
        ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)::geography
      )`
    )
    .orderBy(desc(zones.createdAt))
    .limit(limit)
}
```

### Migrations

```bash
# Gerar migration
npx drizzle-kit generate

# Executar migration
npx drizzle-kit migrate

# Reset database
npx drizzle-kit drop
```

---

## 📝 Exemplos Práticos

### Exemplo Completo: Módulo "Reports"

#### 1. Types (reports.types.ts)

```typescript
export interface IReport {
  id: string
  title: string
  content: string
  category: ReportCategory
  userId: string
  createdAt: Date
  updatedAt: Date
}

export enum ReportCategory {
  SAFETY = 'safety',
  INCIDENT = 'incident',
  MAINTENANCE = 'maintenance',
}

export interface IReportRepository {
  create(report: IReport): Promise<IReport>
  getById(id: string): Promise<IReport | null>
  getByCategory(category: ReportCategory): Promise<IReport[]>
  getByUser(userId: string): Promise<IReport[]>
  update(id: string, updates: Partial<IReport>): Promise<IReport>
  delete(id: string): Promise<void>
}
```

#### 2. Schemas (reports.schemas.ts)

```typescript
import { z } from 'zod'

export const CreateReportSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  category: z.enum(['safety', 'incident', 'maintenance']),
})

export const ReportResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    category: z.string(),
    userId: z.string(),
    createdAt: z.string().datetime(),
  }),
})

// Inferir tipos TypeScript dos schemas Zod
export type CreateReportRequest = z.infer<typeof CreateReportSchema>
export type ReportResponse = z.infer<typeof ReportResponseSchema>
```

#### 3. Service (reports.service.ts)

```typescript
import { ReportCategory } from './reports.types'
import { db } from '../../db/db'
import { reports } from '../../db/schemas/reports'

export class ReportService {
  async createReport(reportData: CreateReportRequest): Promise<IReport> {
    const newReport = await db
      .insert(reports)
      .values({
        title: reportData.title,
        content: reportData.content,
        category: reportData.category,
        userId: reportData.userId,
      })
      .returning()

    return newReport[0]
  }

  async getReportById(id: string): Promise<IReport | null> {
    const report = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1)

    return report[0] || null
  }

  async getReportsByCategory(category: ReportCategory): Promise<IReport[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.category, category))
      .orderBy(desc(reports.createdAt))
  }
}

export const reportService = new ReportService()
```

#### 4. Controller (reports.controller.ts)

```typescript
export class ReportController {
  async createReport(ctx: Context) {
    try {
      const body = ctx.body as CreateReportRequest

      logger.info('Creating report', {
        title: body.title,
        category: body.category,
      })

      const report = await reportService.createReport(body)

      return successResponse(
        report,
        'Relatório criado com sucesso',
        HTTP_STATUS.CREATED
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error creating report', {
        error: errorMessage,
        body: ctx.body,
      })

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getReportById(ctx: Context) {
    try {
      const { id } = ctx.params as { id: string }

      logger.info('Getting report by ID', { id })

      const report = await reportService.getReportById(id)

      if (!report) {
        return notFoundResponse('Relatório não encontrado')
      }

      return successResponse(report, 'Relatório encontrado com sucesso')
    } catch (error: unknown) {
      // Error handling...
    }
  }
}

export const reportController = new ReportController()
```

#### 5. Routes (reports.routes.ts)

```typescript
import { z } from 'zod'

export const reportRoutes = new Elysia({ prefix: '/reports' })
  .get('/', reportController.getAllReports.bind(reportController), {
    response: ReportListResponseSchema,
    detail: {
      tags: ['Reports'],
      summary: 'Listar relatórios',
      description: 'Lista todos os relatórios disponíveis',
    },
  })
  .get('/:id', reportController.getReportById.bind(reportController), {
    params: z.object({ id: z.string() }),
    response: ReportResponseSchema,
    detail: {
      tags: ['Reports'],
      summary: 'Obter relatório por ID',
      description: 'Obtém um relatório específico pelo ID',
    },
  })
  .post('/', reportController.createReport.bind(reportController), {
    body: CreateReportSchema,
    response: ReportResponseSchema,
    detail: {
      tags: ['Reports'],
      summary: 'Criar relatório',
      description: 'Cria um novo relatório no sistema',
    },
  })
```

#### 6. App Registration (app.ts)

```typescript
import { reportRoutes } from '@/modules/reports'

export const app = new Elysia()
  .use(authRoutes)
  .use(zoneRoutes)
  .use(reportRoutes) // ← Novo módulo registrado
  .use(errorHandler)
```

---

## ✅ Checklist Completo

### 📋 Checklist para Novos Módulos

#### 🔧 Setup Inicial

- [ ] Criar pasta do módulo em `src/modules/[nome]`
- [ ] Definir responsabilidades do módulo
- [ ] Identificar entidades principais
- [ ] Mapear relacionamentos com outros módulos

#### 📝 Desenvolvimento - Ordem Obrigatória

- [ ] **Types**: Criar interfaces e tipos (`[nome].types.ts`)
- [ ] **Schemas**: Validação de entrada/saída (`[nome].schemas.ts`)
- [ ] **Database Schema**: Definir tabela no Drizzle (`src/db/schemas/[nome].ts`)
- [ ] **Service**: Lógica de negócio (`[nome].service.ts`)
- [ ] **Controller**: Orquestração HTTP (`[nome].controller.ts`)
- [ ] **Routes**: Definição de endpoints (`[nome].routes.ts`)
- [ ] **Queries**: Queries específicas (se necessário) (`[nome]-queries.ts`)

#### 🔗 Integração

- [ ] Registrar rotas no `app.ts`
- [ ] Criar migration do banco de dados
- [ ] Testar endpoints com Postman/Thunder Client
- [ ] Verificar documentação OpenAPI
- [ ] Validar logs e error handling

#### 🧪 Validação

- [ ] Testes unitários (se aplicável)
- [ ] Validação de schemas Zod
- [ ] Teste de error cases (400, 404, 500)
- [ ] Verificar padrões de resposta
- [ ] Testar com dados reais

#### 📚 Documentação

- [ ] Comentários JSDoc nos métodos públicos
- [ ] README do módulo (se complexo)
- [ ] Exemplos de uso (`[nome]-usage.ts`)
- [ ] Atualizar documentação OpenAPI

---

## 🚀 Como Começar

### 1. Preparação

```bash
# 1. Criar estrutura de arquivos
mkdir src/modules/[nome-do-modulo]
cd src/modules/[nome-do-modulo]

# 2. Criar arquivos básicos
touch [nome].types.ts
touch [nome].schemas.ts
touch [nome].service.ts
touch [nome].controller.ts
touch [nome].routes.ts
```

### 2. Ordem de Desenvolvimento (CRÍTICA)

1. **Types** - Sempre primeiro (outros arquivos dependem)
2. **Schemas** - Validações (dependem dos types)
3. **Database Schema** - Tabela no banco (se necessário)
4. **Service** - Lógica de negócio (usa types e schemas)
5. **Controller** - HTTP layer (usa service)
6. **Routes** - Endpoints (usa controller e schemas)
7. **App Registration** - Integração final

### 3. Comandos Úteis

```bash
# Gerar migration
npx drizzle-kit generate

# Executar migration
npx drizzle-kit migrate

# Ver documentação OpenAPI
# http://localhost:3000/openapi

# Testar endpoints
# Use Postman, Thunder Client ou curl
```

### 4. Debugging

```bash
# Ver logs estruturados
# Logs aparecem no console com formato JSON

# Verificar erros
# Sempre verificar status codes e mensagens de erro

# Validar schemas
# Zod valida automaticamente, verificar erros 400
```

---

## 🎯 Resumo - Por Onde Começar

### ✅ **SEMPRE COMECE PELOS TYPES** 📝

- Defina as interfaces primeiro
- Pense na estrutura de dados
- Use o módulo `zone` como referência

### ✅ **SEGUIR A ORDEM LÓGICA** 🔄

- Types → Schemas → Database → Service → Controller → Routes → App
- Cada arquivo depende do anterior

### ✅ **MANTER CONSISTÊNCIA** 🎨

- Use os mesmos padrões do módulo `auth` e `zone`
- Error handling padronizado
- Logs estruturados
- Responses consistentes

### ✅ **TESTAR E VALIDAR** ✅

- Verificar OpenAPI docs
- Testar endpoints
- Validar schemas
- Executar migrations

---

## 📚 Referências

### Arquivos de Exemplo no Projeto

- **Módulo Auth**: `src/modules/auth/`
- **Módulo Zone**: `src/modules/zone/`
- **Database Schemas**: `src/db/schemas/`
- **Queries**: `src/modules/zone/zone-queries.ts`
- **PostGIS**: `src/modules/zone/geography.ts`

### Documentação Externa

- [Elysia Framework](https://elysiajs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostGIS](https://postgis.net/)
- [Zod](https://zod.dev/)

---

**🎉 Agora você tem tudo que precisa para criar novos módulos seguindo a arquitetura do projeto!**

**💡 Dica**: Use este documento como referência sempre que criar um novo módulo. Mantenha a consistência e siga os padrões estabelecidos.
