import { Contact } from '@/@types/community';
import { GroupRepository } from './community.repository';
import { CreateGroupInput } from './community.schema';

export class GroupService {
	constructor(private readonly repository: GroupRepository) {}

	async create(userId: string, data: CreateGroupInput) {
		const group = await this.repository.createGroup(userId, data.name);

		data.contacts.map(async (item) => {
			console.log(item);
			await this.createContact(group.id, item);
		});
		return this.repository.findById(group.id);
	}

	async createContact(groupId: string, contact: Contact) {
		return await this.repository.createContact(groupId, contact);
	}

	async findAll(userId: string) {
		return this.repository.findAll(userId);
	}
	async findGroupsByUserId(userId: string) {
		return this.repository.findGroupsByUserId(userId);
	}
	async findById(id: string) {
		const group = await this.repository.findById(id);
		if (!group) throw new Error('Grupo não encontrado');
		return group;
	}

	async update(id: string, name: string) {
		const group = await this.repository.updateGroup(id, name);
		if (!group) throw new Error('Grupo não encontrado');
		return group;
	}

	async updateWithContacts(id: string, data: CreateGroupInput) {
		const group = await this.repository.updateGroup(id, data.name);
		if (!group) throw new Error('Grupo não encontrado');

		const currentContacts = await this.repository.findContactsByGroupId(id);
		const currentContactIds = currentContacts.map((c) => c.id);

		const newContactIds = data.contacts
			.filter((c) => 'id' in c && c.id)
			.map((c) => (c as any).id);

		const contactsToDelete = currentContactIds.filter(
			(id) => !newContactIds.includes(id),
		);
		for (const contactId of contactsToDelete) {
			await this.repository.deleteContact(contactId);
		}

		const contactsToAdd = data.contacts.filter((c) => !('id' in c && c.id));
		for (const contact of contactsToAdd) {
			await this.repository.createContact(id, contact);
		}

		return this.repository.findGroupWithContacts(id);
	}

	async getContactsByGroupId(groupId: string) {
		return await this.repository.findContactsByGroupId(groupId);
	}

	async getContactsByUserId(userId: string) {
		return await this.repository.findAllContactsByUserId(userId);
	}

	async getGroupWithContacts(id: string) {
		const group = await this.repository.findGroupWithContacts(id);
		if (!group) throw new Error('Grupo não encontrado');
		return group;
	}

	async delete(id: string) {
		await this.repository.deleteGroup(id);
		return { message: 'Grupo removido com sucesso' };
	}

	async deleteContact(contactId: string) {
		await this.repository.deleteContact(contactId);
		return { message: 'Contato removido com sucesso' };
	}
}
