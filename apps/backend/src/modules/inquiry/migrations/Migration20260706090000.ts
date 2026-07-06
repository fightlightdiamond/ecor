import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260706090000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "inquiry" (
        "id" text not null,
        "type" text check ("type" in ('contact', 'booking')) not null default 'contact',
        "name" text not null,
        "phone" text not null,
        "email" text null,
        "service" text null,
        "message" text null,
        "source" text null,
        "preferred_date" text null,
        "preferred_time" text null,
        "status" text check ("status" in ('new', 'confirmed', 'completed', 'cancelled')) not null default 'new',
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "inquiry_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_inquiry_phone" ON "inquiry" ("phone") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_inquiry_type_date" ON "inquiry" ("type", "preferred_date") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "inquiry" cascade;`)
  }
}
