import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260709100000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "campaign_topic" (
        "id" text not null,
        "name" text not null,
        "slug" text not null,
        "description" text null,
        "image" text null,
        "is_active" boolean not null default true,
        "rank" integer not null default 0,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "campaign_topic_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_campaign_topic_slug_unique" ON "campaign_topic" ("slug") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `alter table "campaign_post" add column if not exists "thumbnail" text null;`
    )
    this.addSql(
      `alter table "campaign_post" add column if not exists "topic_id" text null;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_campaign_post_topic_id" ON "campaign_post" ("topic_id") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "IDX_campaign_post_topic_id";`)
    this.addSql(`alter table "campaign_post" drop column if exists "topic_id";`)
    this.addSql(`alter table "campaign_post" drop column if exists "thumbnail";`)
    this.addSql(`drop table if exists "campaign_topic" cascade;`)
  }
}
