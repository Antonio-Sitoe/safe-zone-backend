import { Contact } from '@/@types/community'
import { CreateGroupInput } from './community.schema'
import { GroupService } from './community.service'

export class GroupController {
  constructor(private readonly service: GroupService) {}

  async createGroup({ body }: { body: CreateGroupInput }) {
    return await this.service.create(body)
  }
  async createContact({
    params,
    body,
  }: {
    params: { groupId: string }
    body: Contact
  }) {
    return await this.service.createContact(params.groupId, body)
  }

  async getGroups() {
    return await this.service.findAll()
  }

  async getGroupById({ params }: { params: { id: string } }) {
    return await this.service.findById(params.id)
  }

  async updateGroup({
    params,
    body,
  }: {
    params: { id: string }
    body: { name: string }
  }) {
    return await this.service.update(params.id, body.name)
  }

  async deleteGroup({ params }: { params: { id: string } }) {
    return await this.service.delete(params.id)
  }
}
