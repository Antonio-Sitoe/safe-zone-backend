import { z } from 'zod';

export const zoneFeatureDetailsSchema = z.object({
	goodLighting: z.boolean().optional().default(false),
	policePresence: z.boolean().optional().default(false),
	publicTransport: z.boolean().optional().default(false),
	insufficientLighting: z.boolean().optional().default(false),
	lackOfPolicing: z.boolean().optional().default(false),
	abandonedHouses: z.boolean().optional().default(false),
});

export const zoneParamsSchema = z.object({
	id: z.string().min(1),
});

export const zoneTypeParamsSchema = z.object({
	type: z.enum(['SAFE', 'DANGER']),
});

export const updateCoordinatesSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
});

export const CreateZoneSchema = z.object({
	slug: z.string().min(1),
	date: z.string().min(1),
	hour: z.string().min(1),
	description: z.string().min(1),
	type: z.enum(['SAFE', 'DANGER']).default('SAFE'),
	coordinates: z.object({
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180),
	}),
	geom: z.object({
		x: z.number().min(-180).max(180),
		y: z.number().min(-90).max(90),
	}),
});
export const ZoneBodySchema = CreateZoneSchema.extend({
	featureDetails: zoneFeatureDetailsSchema,
});

export const UpdateZoneBodySchema = CreateZoneSchema.partial().extend({
	featureDetails: zoneFeatureDetailsSchema.optional(),
});

export const CreateZoneWithUserSchema = CreateZoneSchema.extend({
	userId: z.string().min(1),
	featureDetails: zoneFeatureDetailsSchema,
});

export const ZoneResponseSchema = {
	201: z.object({
		success: z.boolean(),
		message: z.string(),
		data: ZoneBodySchema,
	}),
	400: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
	401: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
	500: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
};

export const getAllResponse = {
	...ZoneResponseSchema,
	200: z.object({
		success: z.boolean(),
		message: z.string(),
		data: z.array(
			ZoneBodySchema.extend({
				id: z.string(),
			}),
		),
	}),
};

export const updateZoneResponseSchema = {
	200: z.object({
		success: z.boolean(),
		message: z.string(),
		data: ZoneBodySchema.extend({
			id: z.string(),
		}),
	}),
	400: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
	404: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
	409: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
	500: z.object({
		success: z.boolean(),
		message: z.string(),
		error: z.string().optional(),
	}),
};

export type IZoneFeatureDetails = z.infer<typeof zoneFeatureDetailsSchema>;

export type IZoneRequest = z.infer<typeof CreateZoneSchema>;
export type IZoneWithUserIdBodyRequest = z.infer<
	typeof CreateZoneWithUserSchema
>;

export type IZoneBodyRequest = z.infer<typeof ZoneBodySchema>;
export type IUpdateZoneBodyRequest = z.infer<typeof UpdateZoneBodySchema>;
export type IZoneResponse = z.infer<typeof ZoneResponseSchema>;
