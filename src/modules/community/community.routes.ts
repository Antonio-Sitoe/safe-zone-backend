import { Elysia } from 'elysia';
import { GroupRepository } from './community.repository';
import { GroupService } from './community.service';
import { GroupController } from './community.controller';

import {
	ContactSchema,
	CreateGroupBodySchema,
	GroupResponseSchema,
} from './community.schema';

const repository = new GroupRepository();
const service = new GroupService(repository);
const controller = new GroupController(service);

export const communityRoutes = new Elysia({ prefix: '/groups' })
	.post('/:userId', controller.createGroup.bind(controller), {
		body: CreateGroupBodySchema,
		response: GroupResponseSchema,
		detail: {
			tags: ['Groups'],
			summary: 'Create Group',
			description: 'Cria um novo grupo com contatos associados',
		},
	})
	.post('/contact/:groupId', controller.createContact.bind(controller), {
		body: ContactSchema,
		response: { message: 'Contacto criado com sucesso' },
		detail: {
			tags: ['Contact'],
			summary: 'Create COntact',
			description: 'Cria um novo contatos associado a um grupo',
		},
	})

	.get('/:userId', controller.getGroups.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Groups',
			description: 'Lista todos os grupos com seus contatos',
		},
	})
	.get('/user/:userId', controller.getGroupsByUserId.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Groups',
			description: 'Lista todos os grupos com seus contatos',
		},
	})

	.get('/group/:id', controller.getGroupById.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Group by ID',
		},
	})

	.put('/:id', controller.updateGroup.bind(controller), {
		body: CreateGroupBodySchema.pick({ name: true }),
		response: GroupResponseSchema,
		detail: {
			tags: ['Groups'],
			summary: 'Update Group',
			description: 'Atualiza o nome de um grupo',
		},
	})

	.delete('/:id', controller.deleteGroup.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Delete Group',
			description: 'Remove um grupo e seus contatos',
		},
	});
