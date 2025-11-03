import { Elysia } from 'elysia';
import { GroupController } from './community.controller';
import { GroupRepository } from './community.repository';
import { ContactSchema, CreateGroupBodySchema } from './community.schema';
import { GroupService } from './community.service';

const repository = new GroupRepository();
const service = new GroupService(repository);
const controller = new GroupController(service);

export const communityRoutes = new Elysia({ prefix: '/groups' })
	.post('/contact/:groupId', (ctx) => controller.createContact(ctx as any), {
		body: ContactSchema,
		detail: {
			tags: ['Contact'],
			summary: 'Create Contact',
			description: 'Cria um novo contato associado a um grupo',
		},
	})
	.get('/contacts/:groupId', (ctx) => controller.getContactsByGroupId(ctx), {
		detail: {
			tags: ['Contacts'],
			summary: 'Get Contacts by Group',
			description: 'Lista todos os contatos de um grupo',
		},
	})
	.get(
		'/contacts/user/:userId',
		controller.getContactsByUserId.bind(controller),
		{
			detail: {
				tags: ['Contacts'],
				summary: 'Get All Contacts by User',
				description: 'Lista todos os contatos do usuário de todos os grupos',
			},
		},
	)
	.get('/group/:id', controller.getGroupById.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Group by ID',
			description: 'Busca um grupo por ID',
		},
	})
	.get('/user/:userId', controller.getGroupsByUserId.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Groups by User ID',
			description: 'Lista todos os grupos do usuário',
		},
	})
	.put(
		'/group/:id/contacts',
		(ctx) => controller.updateGroupWithContacts(ctx),
		{
			body: CreateGroupBodySchema,
			detail: {
				tags: ['Groups'],
				summary: 'Update Group with Contacts',
				description: 'Atualiza o grupo com nome e contatos',
			},
		},
	)
	.get(
		'/group/:id/contacts',
		controller.getGroupWithContacts.bind(controller),
		{
			detail: {
				tags: ['Groups'],
				summary: 'Get Group with Contacts',
				description: 'Busca um grupo com seus contatos',
			},
		},
	)
	.post('/:userId', controller.createGroup.bind(controller), {
		body: CreateGroupBodySchema,
		detail: {
			tags: ['Groups'],
			summary: 'Create Group',
			description: 'Cria um novo grupo com contatos associados',
		},
	})
	.get('/:userId', controller.getGroups.bind(controller), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Groups',
			description: 'Lista todos os grupos com seus contatos',
		},
	})
	.put('/:id', controller.updateGroup.bind(controller), {
		body: CreateGroupBodySchema.pick({ name: true }),
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
