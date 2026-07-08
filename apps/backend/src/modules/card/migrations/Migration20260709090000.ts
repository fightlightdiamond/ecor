import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260709090000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "media_folder" (
        "id" text not null,
        "name" text not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "media_folder_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `alter table "card_media" add column if not exists "folder_id" text null;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_card_media_folder_id" ON "card_media" ("folder_id") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "media_folder" cascade;`)
    this.addSql(`alter table "card_media" drop column if exists "folder_id";`)
    this.addSql(`drop index if exists "IDX_card_media_folder_id";`)
  }
}
