import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260708090000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "card_media" (
        "id" text not null,
        "url" text not null,
        "filename" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "card_media_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_card_media_created_at" ON "card_media" ("created_at") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "card_media" cascade;`)
  }
}
