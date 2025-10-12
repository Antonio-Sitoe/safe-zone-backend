import { Contact } from '@/@types/community'
import { GroupRepository } from './community.repository'
import { CreateGroupInput } from './community.schema'

export class GroupService {
  constructor(private readonly repository: GroupRepository) {}

  async create(userId: string, data: CreateGroupInput) {
    const group = await this.repository.createGroup(userId, data.name)

    data.contacts.map(async (item) => {
      console.log(item)
      await this.createContact(group.id, item)
    })
    return this.repository.findById(group.id)
  }

  async createContact(groupId: string, contact: Contact) {
    return await this.repository.createContact(groupId, contact)
  }

  async findAll(userId: string) {
    return this.repository.findAll(userId)
  }
  async findGroupsByUserId(userId: string) {
    return this.repository.findGroupsByUserId(userId)
  }
  async findById(id: string) {
    const group = await this.repository.findById(id)
    if (!group) throw new Error('Grupo não encontrado')
    return group
  }

  async update(id: string, name: string) {
    const group = await this.repository.updateGroup(id, name)
    if (!group) throw new Error('Grupo não encontrado')
    return group
  }

  async delete(id: string) {
    await this.repository.deleteGroup(id)
    return { message: 'Grupo removido com sucesso' }
  }
}
