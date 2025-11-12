import { errorResponse, successResponse } from '@/utils/response';
import { alertsService } from './alerts.service';
import type { ISendAlertBody } from './alerts.schema';
import { AuthenticatedContext } from '@/@types/auth';
import { HTTP_STATUS } from '@/utils/constants';
export class AlertsController {
	async sendAlert(ctx: AuthenticatedContext) {
		try {
			const body = ctx.body as ISendAlertBody;
			const userId = ctx?.user?.id;
			const username = ctx?.user?.name;

			if (!userId || !username) {
				ctx.set.status = HTTP_STATUS.UNAUTHORIZED;
				return errorResponse('Usuário não autenticado');
			}

			const { success, error } = await alertsService.sendAlert(
				userId,
				username,
				body,
			);

			if (!success) {
				ctx.set.status = HTTP_STATUS.BAD_REQUEST;
				return errorResponse(error || 'Erro ao enviar alerta');
			}

			ctx.set.status = HTTP_STATUS.OK;
			return 'Alertas enviado com sucesso';
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro interno do servidor', errorMessage);
		}
	}
}
export const alertsController = new AlertsController();
