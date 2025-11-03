import { z } from 'zod';

export const ContactSchema = z
	.object({
		id: z.uuid().optional().or(z.literal('').optional()),
		name: z.string().min(1, 'Nome é obrigatório'),
		phone: z.string().min(5, 'Telefone inválido'),
	})
	.refine(
		(data) => {
			if (data.id && data.id !== '') {
				return z.uuid().safeParse(data.id).success;
			}
			return true;
		},
		{
			message: 'ID deve ser um UUID válido se fornecido',
		},
	)
	.transform((data) => {
		if (
			data.id &&
			(data.id === '' || !z.string().uuid().safeParse(data.id).success)
		) {
			const { id, ...rest } = data;
			return rest;
		}
		return data;
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

export const ContactResponseSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	phone: z.string(),
	groupId: z.uuid(),
});

export const ContactsByGroupResponseSchema = z.object({
	groupId: z.string(),
	groupName: z.string(),
	contacts: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			phone: z.string(),
		}),
	),
});

export const UpdateGroupResponseSchema = z.object({
	message: z.string(),
});

export type CreateGroupInput = z.infer<typeof CreateGroupBodySchema>;
export type GroupResponse = z.infer<typeof GroupResponseSchema>;
export type ContactResponse = z.infer<typeof ContactResponseSchema>;
export type ContactsByGroupResponse = z.infer<
	typeof ContactsByGroupResponseSchema
>;
