CREATE TABLE "zone_feature_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone_id" uuid NOT NULL,
	"zone_type" text NOT NULL,
	"good_lighting" boolean,
	"police_presence" boolean,
	"public_transport" boolean,
	"insufficient_lighting" boolean,
	"lack_of_policing" boolean,
	"abandoned_houses" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "zones" RENAME COLUMN "name" TO "slug";--> statement-breakpoint
ALTER TABLE "zones" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "zones" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "zones" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "zones" DROP CONSTRAINT "zones_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "zones" DROP CONSTRAINT "zones_media_zone_id_media_zones_id_fk";
--> statement-breakpoint
ALTER TABLE "media_zones" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media_zones" ADD COLUMN "zoneId" uuid;--> statement-breakpoint
ALTER TABLE "media_zones" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "media_zones" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "zone_feature_details" ADD CONSTRAINT "zone_feature_details_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_zones" ADD CONSTRAINT "media_zones_zoneId_zones_id_fk" FOREIGN KEY ("zoneId") REFERENCES "public"."zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_zones" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "media_zones" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "zones" DROP COLUMN "media_zone_id";