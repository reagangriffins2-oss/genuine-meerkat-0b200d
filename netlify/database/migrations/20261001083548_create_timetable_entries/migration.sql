CREATE TABLE "timetable_entries" (
	"id" serial PRIMARY KEY,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"code" text DEFAULT '' NOT NULL,
	"place_id" text DEFAULT '' NOT NULL,
	"room" text DEFAULT '' NOT NULL,
	"day" integer NOT NULL,
	"start_minutes" integer NOT NULL,
	"end_minutes" integer NOT NULL,
	"color" text DEFAULT 'cardinal' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "timetable_owner_idx" ON "timetable_entries" ("owner_id");