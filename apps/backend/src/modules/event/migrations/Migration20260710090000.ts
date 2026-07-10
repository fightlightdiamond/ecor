import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260710090000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "event" (
        "id" text not null,
        "title" text not null,
        "slug" text not null,
        "content" jsonb not null default '{}',
        "thumbnail" text null,
        "location" text null,
        "start_at" timestamptz null,
        "end_at" timestamptz null,
        "capacity" integer null,
        "registration_open" boolean not null default true,
        "is_active" boolean not null default true,
        "seo_title" text null,
        "seo_description" text null,
        "seo_keywords" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "event_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_event_slug_unique" ON "event" ("slug") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `create table if not exists "event_registration" (
        "id" text not null,
        "event_id" text not null,
        "name" text not null,
        "phone" text not null,
        "email" text null,
        "quantity" integer not null default 1,
        "message" text null,
        "staff_note" text null,
        "status" text check ("status" in ('new', 'contacted', 'confirmed', 'cancelled')) not null default 'new',
        "source" text null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "event_registration_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_event_registration_event_id" ON "event_registration" ("event_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_event_registration_status" ON "event_registration" ("status") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "event_registration" cascade;`)
    this.addSql(`drop table if exists "event" cascade;`)
  }
}
