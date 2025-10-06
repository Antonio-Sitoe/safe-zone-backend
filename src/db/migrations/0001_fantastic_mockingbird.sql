-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TABLE "media_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "media_type" DEFAULT 'image' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"date" date NOT NULL,
	"hour" time NOT NULL,
	"description" text,
	"coordinates" text,
	"user_id" uuid NOT NULL,
	"media_zone_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zones" ADD CONSTRAINT "zones_media_zone_id_media_zones_id_fk" FOREIGN KEY ("media_zone_id") REFERENCES "public"."media_zones"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
-- Convert coordinates column to PostGIS geography type
ALTER TABLE "zones" ALTER COLUMN "coordinates" TYPE geography(Point, 4326) USING coordinates::geography;
--> statement-breakpoint
-- Create spatial index for better performance
CREATE INDEX "idx_zones_coordinates" ON "zones" USING GIST ("coordinates");