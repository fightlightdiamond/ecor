"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250701120000 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20250701120000 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "campaign_post" (
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
      );`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_campaign_post_slug" ON "campaign_post" ("slug") WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_campaign_post_slug_unique" ON "campaign_post" ("slug") WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "campaign_post" cascade;`);
    }
}
exports.Migration20250701120000 = Migration20250701120000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA3MDExMjAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jYW1wYWlnbi9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwNzAxMTIwMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlFQUFvRTtBQUVwRSxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBQ3BELEtBQUssQ0FBQyxFQUFFO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FDVDs7Ozs7Ozs7Ozs7O1NBWUcsQ0FDSixDQUFBO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FDVCwyR0FBMkcsQ0FDNUcsQ0FBQTtRQUNELElBQUksQ0FBQyxNQUFNLENBQ1QseUhBQXlILENBQzFILENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLCtDQUErQyxDQUFDLENBQUE7SUFDOUQsQ0FBQztDQUNGO0FBNUJELDBEQTRCQyJ9