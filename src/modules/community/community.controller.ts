import { Contact } from '@/@types/community';
import { CreateGroupInput } from './community.schema';
import { GroupService } from './community.service';

export class GroupController {
	constructor(private readonly service: GroupService) {}

	async createGroup({
		params,
		body,
	}: {
		params: { userId: string };
		body: CreateGroupInput;
	}) {
		return await this.service.create(params.userId, body);
	}
	async createContact({
		params,
		body,
	}: {
		params: { groupId: string };
		body: Contact;
	}) {
		return await this.service.createContact(params.groupId, body);
	}

	async getGroups({ params }: { params: { userId: string } }) {
		return await this.service.findAll(params.userId);
	}
	async getGroupsByUserId({ params }: { params: { userId: string } }) {
		return await this.service.findGroupsByUserId(params.userId);
	}

	async getGroupById({ params }: { params: { id: string } }) {
		return await this.service.findById(params.id);
	}

	async updateGroup({
		params,
		body,
	}: {
		params: { id: string };
		body: { name: string };
	}) {
		return await this.service.update(params.id, body.name);
	}

	async deleteGroup({ params }: { params: { id: string } }) {
		return await this.service.delete(params.id);
	}
}
