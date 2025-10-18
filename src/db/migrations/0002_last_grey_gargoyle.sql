CREATE TABLE "critical_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"geom" geometry(point) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP INDEX "spatial_index";--> statement-breakpoint
CREATE INDEX "critical_zones_spatial_index" ON "critical_zones" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "zones_spatial_index" ON "zones" USING gist ("geom");