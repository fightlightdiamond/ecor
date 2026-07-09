import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260709120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `alter table "campaign_post" add column if not exists "source" text null;`
    )
    this.addSql(
      `alter table "campaign_post" add column if not exists "seo_title" text null;`
    )
    this.addSql(
      `alter table "campaign_post" add column if not exists "seo_description" text null;`
    )
    this.addSql(
      `alter table "campaign_post" add column if not exists "seo_keywords" text null;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`alter table "campaign_post" drop column if exists "seo_keywords";`)
    this.addSql(`alter table "campaign_post" drop column if exists "seo_description";`)
    this.addSql(`alter table "campaign_post" drop column if exists "seo_title";`)
    this.addSql(`alter table "campaign_post" drop column if exists "source";`)
  }
}
