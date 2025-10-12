import { zoneFeatureDetails } from '@/db/schemas';

export type ZoneFeatureDetails = typeof zoneFeatureDetails.$inferSelect;
export type NewZoneFeatureDetails = typeof zoneFeatureDetails.$inferInsert;
