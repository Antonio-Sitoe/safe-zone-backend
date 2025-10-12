import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { zones } from './zone';

export const zoneFeatureDetails = pgTable('zone_feature_details', {
	id: uuid('id').defaultRandom().primaryKey(),
	zoneId: uuid('zone_id')
		.notNull()
		.references(() => zones.id, { onDelete: 'cascade' }),
	zoneType: text('zone_type', { enum: ['SAFE', 'DANGER'] }).notNull(),
	goodLighting: boolean('good_lighting'),
	policePresence: boolean('police_presence'),
	publicTransport: boolean('public_transport'),
	insufficientLighting: boolean('insufficient_lighting'),
	lackOfPolicing: boolean('lack_of_policing'),
	abandonedHouses: boolean('abandoned_houses'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});
