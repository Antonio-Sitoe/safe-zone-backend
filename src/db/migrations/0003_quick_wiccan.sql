CREATE TYPE "public"."zone_type" AS ENUM('SAFE', 'DANGER');--> statement-breakpoint
ALTER TABLE "zones" ADD COLUMN "type" "zone_type";