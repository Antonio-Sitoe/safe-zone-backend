import { Elysia } from 'elysia';
import { GroupController } from './community.controller';
import { GroupRepository } from './community.repository';
import { ContactSchema, CreateGroupBodySchema } from './community.schema';
import { GroupService } from './community.service';
import { betterAuthPlugin } from '../../middleware/better-auth';

const repository = new GroupRepository();
const service = new GroupService(repository);
const controller = new GroupController(service);

export const communityRoutes = new Elysia({ prefix: '/groups' })
	.use(betterAuthPlugin)
	.post('/contact/:groupId', (ctx) => controller.createContact(ctx as any), {
		body: ContactSchema,
		detail: {
			tags: ['Contact'],
			summary: 'Create Contact',
			description: 'Cria um novo contato associado a um grupo',
		},
		auth: true,
	})
	.get(
		'/contacts/:groupId',
		(ctx) => controller.getContactsByGroupId(ctx as any),
		{
			detail: {
				tags: ['Contacts'],
				summary: 'Get Contacts by Group',
				description: 'Lista todos os contatos de um grupo',
			},
			auth: true,
		},
	)
	.get(
		'/contacts/user/:userId',
		(ctx) => controller.getContactsByUserId(ctx as any),
		{
			detail: {
				tags: ['Contacts'],
				summary: 'Get All Contacts by User',
				description: 'Lista todos os contatos do usuário de todos os grupos',
			},
			// auth: true,
		},
	)
	.get('/group/:id', (ctx) => controller.getGroupById(ctx as any), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Group by ID',
			description: 'Busca um grupo por ID',
		},
		auth: true,
	})
	.get('/user/:userId', (ctx) => controller.getGroupsByUserId(ctx as any), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Groups by User ID',
			description: 'Lista todos os grupos do usuário',
		},
		auth: true,
	})
	.put(
		'/group/:id/contacts',
		(ctx) => controller.updateGroupWithContacts(ctx as any),
		{
			body: CreateGroupBodySchema,
			detail: {
				tags: ['Groups'],
				summary: 'Update Group with Contacts',
				description: 'Atualiza o grupo com nome e contatos',
			},
			auth: true,
		},
	)
	.get(
		'/group/:id/contacts',
		(ctx) => controller.getGroupWithContacts(ctx as any),
		{
			detail: {
				tags: ['Groups'],
				summary: 'Get Group with Contacts',
				description: 'Busca um grupo com seus contatos',
			},
			auth: true,
		},
	)
	.post('/:userId', (ctx) => controller.createGroup(ctx as any), {
		body: CreateGroupBodySchema,
		detail: {
			tags: ['Groups'],
			summary: 'Create Group',
			description: 'Cria um novo grupo com contatos associados',
		},
		auth: true,
	})
	.get('/:userId', (ctx) => controller.getGroups(ctx as any), {
		detail: {
			tags: ['Groups'],
			summary: 'Get Groups',
			description: 'Lista todos os grupos com seus contatos',
		},
		auth: true,
	})
	.put('/:id', (ctx) => controller.updateGroup(ctx as any), {
		body: CreateGroupBodySchema.pick({ name: true }),
		detail: {
			tags: ['Groups'],
			summary: 'Update Group',
			description: 'Atualiza o nome de um grupo',
		},
		auth: true,
	})
	.delete('/:id', (ctx) => controller.deleteGroup(ctx as any), {
		detail: {
			tags: ['Groups'],
			summary: 'Delete Group',
			description: 'Remove um grupo e seus contatos',
		},
		auth: true,
	})
	.delete(
		'/contact/:contactId',
		(ctx) => controller.deleteContact(ctx as any),
		{
			detail: {
				tags: ['Contact'],
				summary: 'Delete Contact',
				description: 'Remove um contato de um grupo',
			},
			auth: true,
		},
	);
