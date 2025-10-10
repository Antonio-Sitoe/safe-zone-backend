import { db } from '@/db/db'
import { groups, groupContacts } from '@/db/schemas/community'
import { eq } from 'drizzle-orm'

export class GroupRepository {
  async createGroup(name: string) {
    const [group] = await db.insert(groups).values({ name }).returning()
    return group
  }

  async createContact(
    groupId: string,
    contact: { name: string; phone: string }
  ) {
    return db
      .insert(groupContacts)
      .values({
        groupId,
        name: contact.name,
        phone: contact.phone,
      })
      .returning()
  }

  async findAll() {
    return db.select().from(groups)
  }

  async findById(id: string) {
    const [group] = await db.select().from(groups).where(eq(groups.id, id))
    return group || null
  }

  async updateGroup(id: string, name: string) {
    const [group] = await db
      .update(groups)
      .set({ name })
      .where(eq(groups.id, id))
      .returning()
    return group
  }

  async deleteGroup(id: string) {
    await db.delete(groups).where(eq(groups.id, id))
  }
}
