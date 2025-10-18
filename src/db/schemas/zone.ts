import {
  date,
  doublePrecision,
  geometry,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  index,
  uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const zoneTypeEnum = pgEnum('zone_type', ['SAFE', 'DANGER'])

export const zones = pgTable(
  'zones',
  {
    id: uuid().defaultRandom().primaryKey(),
    slug: text(),
    date: date().notNull(),
    hour: time().notNull(),
    description: text(),
    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
    geom: geometry('geom', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),

    type: zoneTypeEnum('type'),
    userId: uuid()
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index('zones_spatial_index').using('gist', t.geom)]
)

export const criticalZones = pgTable(
  'critical_zones',
  {
    id: uuid().defaultRandom().primaryKey(),
    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
    geom: geometry('geom', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),
    createdAt: timestamp().defaultNow(),
  },

  (t) => [index('critical_zones_spatial_index').using('gist', t.geom)]
)
