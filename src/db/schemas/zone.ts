import {
	date,
	pgTable,
	text,
	time,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const zones = pgTable("zones", {
	id: uuid().defaultRandom().primaryKey(),
	slug: text(),
	date: date().notNull(),
	hour: time().notNull(),
	description: text(),
	coordinates: text(),
	userId: uuid()
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type Zone = typeof zones.$inferSelect;
export type NewZone = typeof zones.$inferInsert;
