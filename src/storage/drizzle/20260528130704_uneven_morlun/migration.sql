-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "migrations" (
	"name" varchar(500) PRIMARY KEY,
	"version" smallint NOT NULL,
	"applied_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY,
	"createdat" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedat" timestamp(3) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"published" boolean DEFAULT false NOT NULL,
	"authorid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY,
	"bio" text,
	"userid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "profile_userid_key" ON "profile" ("userid");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_key" ON "user" ("email");--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
*/