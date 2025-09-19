import { Elysia, t } from 'elysia'

export const health = new Elysia().get(
  '/',
  ({ params, user }) => ({
    message: 'Safe Zone API',
    version: '1.0.0',
    documentation: '/swagger',
    health: '/health',
    user: user?.name,
  }),
  {
    auth: true,
    response: {
      200: t.Object({
        message: t.String(),
        version: t.String(),
        documentation: t.String(),
        health: t.String(),
      }),
    },
    detail: {
      tags: ['System'],
      summary: 'Informações da API',
      description: 'Retorna informações básicas sobre a API',
    },
  }
)
