import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260707120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "card" (
        "id" text not null,
        "type" text check ("type" in ('link', 'contact', 'map', 'promotions')) not null default 'link',
        "title" jsonb null,
        "image" text null,
        "path" text null,
        "rank" integer not null default 0,
        "is_active" boolean not null default true,
        "locked" boolean not null default false,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "card_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_card_rank" ON "card" ("rank") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "card" cascade;`)
  }
}
