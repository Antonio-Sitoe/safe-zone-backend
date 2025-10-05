import { zones } from './zone'
import { pgEnum, pgTable, timestamp, uuid, text } from 'drizzle-orm/pg-core'

export const mediaTypeEnum = pgEnum('media_type', ['image', 'video'])

export const mediaZones = pgTable('media_zones', {
  id: uuid().defaultRandom().primaryKey(),
  url: text().notNull(),
  zoneId: uuid().references(() => zones.id),
  type: mediaTypeEnum('type').default('image').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().notNull(),
})

export type MediaZone = typeof mediaZones.$inferSelect
export type NewMediaZone = typeof mediaZones.$inferInsert
export type MediaType = (typeof mediaTypeEnum.enumValues)[number]
