ALTER TABLE "task" DROP CONSTRAINT "task_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "user_id";