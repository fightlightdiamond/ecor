import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250701120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "campaign_post" (
        "id" text not null,
        "title" text not null,
        "slug" text not null,
        "content" jsonb not null default '{}',
        "is_active" boolean not null default true,
        "publish_at" timestamptz null,
        "unpublish_at" timestamptz null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "campaign_post_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_campaign_post_slug" ON "campaign_post" ("slug") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_campaign_post_slug_unique" ON "campaign_post" ("slug") WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "campaign_post" cascade;`)
  }
}
