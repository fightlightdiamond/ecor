// Nạp các khối nội dung storefront (settings/team/services/gallery/testimonials)
// từ file JSON vào bảng storefront_sections — tương đương Laravel
// StorefrontContent::importFromFiles. Dữ liệu sau đó sửa được trong Admin (/admin).
//
// Dùng: pnpm --filter @thang-long/api seed:content
//   (UPSERT — GHI ĐÈ nội dung section bằng file. Đừng chạy sau khi đã sửa trong Admin
//    nếu không muốn mất chỉnh sửa.)
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const LABELS = {
  settings: 'Site settings',
  team: 'Team members',
  services: 'Services menu',
  gallery: 'Gallery',
  testimonials: 'Testimonials',
};
const DIR = path.join(__dirname, '..', 'resources', 'storefront');
const prisma = new PrismaClient();

(async () => {
  const done = [];
  const now = new Date();
  for (const [key, label] of Object.entries(LABELS)) {
    const file = path.join(DIR, `${key}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`bỏ qua: thiếu ${file}`);
      continue;
    }
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    await prisma.storefrontSection.upsert({
      where: { key },
      update: { label, content, updatedAt: now },
      create: { key, label, content, createdAt: now, updatedAt: now },
    });
    done.push(key);
  }
  console.log(`✔ Đã nạp section: ${done.join(', ')}`);
  await prisma.$disconnect();
})().catch((e) => {
  console.error('Seed content lỗi:', e.message);
  prisma.$disconnect();
  process.exit(1);
});
