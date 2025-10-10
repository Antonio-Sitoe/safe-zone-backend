import { pgTable, varchar, integer, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const groups = pgTable('groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
})

export const groupContacts = pgTable('group_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  groupId: varchar('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
})

export const groupsRelations = relations(groups, ({ many }) => ({
  contacts: many(groupContacts),
}))

export const groupContactsRelations = relations(groupContacts, ({ one }) => ({
  group: one(groups, {
    fields: [groupContacts.groupId],
    references: [groups.id],
  }),
}))
