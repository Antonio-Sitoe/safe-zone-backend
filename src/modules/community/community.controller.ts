import { Contact } from '@/@types/community';
import { HTTP_STATUS } from '@/utils/constants';
import { logger } from '@/utils/logger';
import { errorResponse, successResponse } from '@/utils/response';
import { CreateGroupInput } from './community.schema';
import { GroupService } from './community.service';

export class GroupController {
	constructor(private readonly service: GroupService) {}

	async createGroup(ctx: any) {
		try {
			const params = ctx.params as { userId: string };
			const body = ctx.body as CreateGroupInput;
			const group = await this.service.create(params.userId, body);
			ctx.set.status = HTTP_STATUS.CREATED;
			return successResponse(group, 'Grupo criado com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error creating group', {
				error: errorMessage,
				userId: ctx.params?.userId,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao criar grupo', errorMessage);
		}
	}

	async createContact(ctx: any) {
		try {
			const params = ctx.params as { groupId: string };
			const body = ctx.body as Contact;

			const group = await this.service.findById(params.groupId);
			if (!group) {
				ctx.set.status = HTTP_STATUS.NOT_FOUND;
				return errorResponse('Grupo não encontrado', 'GROUP_NOT_FOUND');
			}

			const contact = await this.service.createContact(params.groupId, body);
			ctx.set.status = HTTP_STATUS.CREATED;
			return successResponse(contact, 'Contacto criado com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error creating contact', {
				error: errorMessage,
				groupId: ctx.params?.groupId,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao criar contacto', errorMessage);
		}
	}

	async getGroups(ctx: any) {
		const params = ctx.params as { userId: string };
		return await this.service.findAll(params.userId);
	}

	async getGroupsByUserId(ctx: any) {
		const params = ctx.params as { userId: string };
		return await this.service.findGroupsByUserId(params.userId);
	}

	async getGroupById(ctx: any) {
		const params = ctx.params as { id: string };
		return await this.service.findById(params.id);
	}

	async updateGroup(ctx: any) {
		const params = ctx.params as { id: string };
		const body = ctx.body as { name: string };
		return await this.service.update(params.id, body.name);
	}

	async updateGroupWithContacts(ctx: any) {
		try {
			const params = ctx.params as { id: string };
			const body = ctx.body as CreateGroupInput;

			const cleanedContacts = body.contacts.map((contact) => {
				const { id, ...rest } = contact as {
					id: string;
					name: string;
					phone: string;
				};
				const uuidRegex =
					/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
				if (id && uuidRegex.test(id)) {
					return { id, ...rest };
				}
				return rest;
			});

			const cleanedBody = {
				...body,
				contacts: cleanedContacts,
			};

			const group = await this.service.updateWithContacts(
				params.id,
				cleanedBody,
			);
			ctx.set.status = HTTP_STATUS.OK;
			return successResponse(group, 'Grupo atualizado com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error updating group with contacts', {
				error: errorMessage,
				groupId: ctx.params?.id,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao atualizar grupo', errorMessage);
		}
	}

	async getContactsByGroupId(ctx: any) {
		try {
			const params = ctx.params as { groupId: string };
			const contacts = await this.service.getContactsByGroupId(params.groupId);
			ctx.set.status = HTTP_STATUS.OK;
			return successResponse(contacts, 'Contatos encontrados');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error getting contacts by group', {
				error: errorMessage,
				groupId: ctx.params?.groupId,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao buscar contatos', errorMessage);
		}
	}

	async getContactsByUserId(ctx: any) {
		try {
			const params = ctx.params as { userId: string };
			const contacts = await this.service.getContactsByUserId(params.userId);
			ctx.set.status = HTTP_STATUS.OK;
			return successResponse(contacts, 'Contatos encontrados');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error getting contacts by user', {
				error: errorMessage,
				userId: ctx.params?.userId,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao buscar contatos', errorMessage);
		}
	}

	async getGroupWithContacts(ctx: any) {
		try {
			const params = ctx.params as { id: string };
			const group = await this.service.getGroupWithContacts(params.id);
			ctx.set.status = HTTP_STATUS.OK;
			return successResponse(group, 'Grupo encontrado');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error getting group with contacts', {
				error: errorMessage,
				groupId: ctx.params?.id,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao buscar grupo', errorMessage);
		}
	}

	async deleteGroup(ctx: any) {
		try {
			const params = ctx.params as { id: string };
			const result = await this.service.delete(params.id);
			ctx.set.status = HTTP_STATUS.OK;
			return successResponse(result, 'Grupo removido com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error deleting group', {
				error: errorMessage,
				groupId: ctx.params?.id,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao remover grupo', errorMessage);
		}
	}

	async deleteContact(ctx: any) {
		try {
			const params = ctx.params as { contactId: string };
			const result = await this.service.deleteContact(params.contactId);
			ctx.set.status = HTTP_STATUS.OK;
			return successResponse(result, 'Contato removido com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error deleting contact', {
				error: errorMessage,
				contactId: ctx.params?.contactId,
			});
			ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
			return errorResponse('Erro ao remover contato', errorMessage);
		}
	}
}
