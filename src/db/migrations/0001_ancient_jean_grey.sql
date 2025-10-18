ALTER TABLE "zones" ADD COLUMN "latitude" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "zones" ADD COLUMN "longitude" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "zones" ADD COLUMN "geom" geometry(point) NOT NULL;--> statement-breakpoint
CREATE INDEX "spatial_index" ON "zones" USING gist ("geom");--> statement-breakpoint
ALTER TABLE "zones" DROP COLUMN "coordinates";