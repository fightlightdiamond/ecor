// Seed/cập nhật 1 tài khoản admin để đăng nhập AdminJS (/admin).
// Dùng: pnpm --filter @thang-long/api seed:admin
//   Tuỳ biến: ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... node prisma/seed-admin.cjs
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const email = process.env.ADMIN_EMAIL || 'admin@tlcv.test';
const password = process.env.ADMIN_PASSWORD || 'admin12345';
const name = process.env.ADMIN_NAME || 'Administrator';

const prisma = new PrismaClient();

(async () => {
  const hash = await bcrypt.hash(password, 12);
  const now = new Date();
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, isAdmin: true, updatedAt: now },
    create: { name, email, password: hash, isAdmin: true, createdAt: now, updatedAt: now },
  });
  console.log(`✔ Admin sẵn sàng: ${user.email} (mật khẩu: ${password}) → đăng nhập tại /admin`);
  await prisma.$disconnect();
})().catch((e) => {
  console.error('Seed admin lỗi:', e.message);
  prisma.$disconnect();
  process.exit(1);
});
