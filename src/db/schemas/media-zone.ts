import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

export const mediaTypeEnum = pgEnum('media_type', ['image', 'video'])

export const mediaZones = pgTable('media_zones', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: mediaTypeEnum('type').default('image').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type MediaZone = typeof mediaZones.$inferSelect
export type NewMediaZone = typeof mediaZones.$inferInsert
export type MediaType = (typeof mediaTypeEnum.enumValues)[number]
