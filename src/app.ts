import { Elysia } from 'elysia'
import { authRoutes } from '@/modules/auth'
import { health } from '@/modules/health'
import { zoneRoutes } from '@/modules/zone'
import { corsPlugin as cors } from './lib/cors'
import { env } from './lib/env'
import { openapiConfig as openapi } from './lib/openapi'
import { staticFilesPlugin as staticFiles } from './lib/static-files'
import { betterAuthPlugin } from './middleware/better-auth'
import { errorHandler } from './middleware/errorHandler'
import { communityRoutes } from './modules/community/community.routes'
import { logger } from './utils/logger'

// Rota de redirecionamento para reset de senha
const resetPasswordRedirectRoute = new Elysia().get(
  '/auth/reset-password/redirect',
  ({ query, set }) => {
    const token = query.token as string

    if (!token) {
      set.status = 400
      return '<html><body><h1>Token inválido</h1></body></html>'
    }

    const deepLink = `safezone://auth/reset-password?token=${encodeURIComponent(token)}`

    // HTML que tenta abrir o deep link automaticamente
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Redefinir Senha - Safe Zone</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			margin: 0;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			padding: 20px;
		}
		.container {
			background: white;
			border-radius: 16px;
			padding: 40px;
			text-align: center;
			box-shadow: 0 20px 60px rgba(0,0,0,0.3);
			max-width: 400px;
		}
		h1 {
			color: #1e293b;
			margin-bottom: 16px;
		}
		p {
			color: #64748b;
			margin-bottom: 24px;
			line-height: 1.6;
		}
		.button {
			display: inline-block;
			background: #2563eb;
			color: white;
			padding: 14px 32px;
			border-radius: 8px;
			text-decoration: none;
			font-weight: 600;
			margin-top: 16px;
			transition: background 0.2s;
		}
		.button:hover {
			background: #1d4ed8;
		}
		.spinner {
			border: 3px solid #f3f4f6;
			border-top: 3px solid #2563eb;
			border-radius: 50%;
			width: 40px;
			height: 40px;
			animation: spin 1s linear infinite;
			margin: 20px auto;
		}
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>🛡️ Redefinir Senha</h1>
		<p>Abrindo o aplicativo Safe Zone...</p>
		<div class="spinner"></div>
		<p style="font-size: 14px; margin-top: 24px;">
			Se o app não abrir automaticamente, 
			<a href="${deepLink}" class="button">Clique aqui</a>
		</p>
	</div>
	<script>
		// Tentar abrir o deep link automaticamente
		const deepLink = '${deepLink}';
		
		// Tentar abrir imediatamente
		window.location.href = deepLink;
		
		// Fallback: se não abrir em 2 segundos, mostrar botão
		setTimeout(() => {
			document.querySelector('.spinner').style.display = 'none';
		}, 2000);
		
		// Para iOS: tentar com window.location primeiro
		// Para Android: usar intent://
		if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
			window.location.href = deepLink;
		} else {
			// Android: tentar intent
			const intentLink = 'intent://auth/reset-password?token=${encodeURIComponent(token)}#Intent;scheme=safezone;package=com.antoniositoe533.safezone;end';
			window.location.href = intentLink;
			
			// Fallback para deep link normal
			setTimeout(() => {
				window.location.href = deepLink;
			}, 500);
		}
	</script>
</body>
</html>
		`
  },
  {
    detail: {
      tags: ['Auth'],
      summary: 'Redirect to reset password',
      description:
        'Página de redirecionamento que abre o app para redefinir senha',
    },
  }
)

export const app = new Elysia()
  .use(cors)
  .use(staticFiles)
  .use(openapi)
  .use(health)
  .use(authRoutes)
  .use(resetPasswordRedirectRoute)
  .use(betterAuthPlugin)
  .use(zoneRoutes)
  .use(communityRoutes)
  .use(errorHandler)
  .listen(
    {
      port: env.PORT,
      hostname: env.HOST,
    },
    (app) => {
      logger.info(
        `🦊 Elysia is running at ${app.hostname}:${app.port} ${app.id}`
      )
      logger.info(
        `📚 Documentação disponível em: http://${app?.hostname}:${app?.port}/openapi`
      )
    }
  )
