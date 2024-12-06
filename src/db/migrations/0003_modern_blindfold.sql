ALTER TABLE "task" RENAME TO "tasks_table";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users_table";--> statement-breakpoint
ALTER TABLE "tasks_table" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "users_table" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "tasks_table" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks_table" ADD CONSTRAINT "tasks_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_email_unique" UNIQUE("email");