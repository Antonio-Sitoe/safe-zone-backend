import { Zone } from '@/db/schemas/zone';
import { IZoneBodyRequest } from './zone.schema';

export interface IZoneRepository {
	create(zone: IZoneBodyRequest): Promise<Zone>;
	update(id: string, zone: Zone): Promise<Zone>;
	getAll(): Promise<Zone[]>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<Zone>;
	getByUserId(userId: string): Promise<Zone[]>;
	getByLocation(location: string): Promise<Zone[]>;
	getByDate(date: string): Promise<Zone[]>;
}
