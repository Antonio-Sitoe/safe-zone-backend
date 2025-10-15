import { z } from 'zod';

export const ContactSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	phone: z.string().min(5, 'Telefone inválido'),
});

export const CreateGroupBodySchema = z.object({
	name: z.string().min(2, 'Nome do grupo é obrigatório'),
	contacts: z.array(ContactSchema).optional().default([]),
});

export const GroupResponseSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	contacts: z
		.array(
			z.object({
				id: z.uuid(),
				name: z.string(),
				phone: z.string(),
				groupId: z.uuid(),
			}),
		)
		.optional(),
});

export type CreateGroupInput = z.infer<typeof CreateGroupBodySchema>;
export type GroupResponse = z.infer<typeof GroupResponseSchema>;
