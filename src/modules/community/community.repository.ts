import { eq, sql } from 'drizzle-orm';
import { db } from '@/db/db';
import { groupContacts, groups } from '@/db/schemas/community';

export class GroupRepository {
	async createGroup(userId: string, name: string) {
		const [group] = await db
			.insert(groups)
			.values({ name, userId })
			.returning();
		return group;
	}

	async createContact(
		groupId: string,
		contact: { name: string; phone: string },
	) {
		return db
			.insert(groupContacts)
			.values({
				groupId,
				name: contact.name,
				phone: contact.phone,
			})
			.returning();
	}

	async findAll(userId: string) {
		const groupsWithContacts = await db
			.select({
				id: sql`g.id`,
				name: sql`g.name`,
				userId: sql`g.user_id`,
				contactsTotal: sql`COUNT(gc.id)`,
				contacts: sql`COALESCE(
        json_agg(json_build_object(
          'id', gc.id,
          'name', gc.name,
          'phone', gc.phone
        )) FILTER (WHERE gc.id IS NOT NULL), '[]'
      )`,
			})
			.from(sql`groups g LEFT JOIN group_contacts gc ON gc.group_id = g.id`)
			.where(sql`g.user_id = ${userId}`)
			.groupBy(sql`g.id`)
			.execute();

		return groupsWithContacts;
	}

	async findGroupsByUserId(userId: string) {
		return await db.select().from(groups).where(eq(groups.userId, userId));
	}
	async findById(id: string) {
		const [group] = await db.select().from(groups).where(eq(groups.id, id));
		return group || null;
	}

	async updateGroup(id: string, name: string) {
		const [group] = await db
			.update(groups)
			.set({ name })
			.where(eq(groups.id, id))
			.returning();
		return group;
	}

	async deleteGroup(id: string) {
		await db.delete(groups).where(eq(groups.id, id));
	}
}
