/**
 * ETL dữ liệu thật: Laravel MySQL  →  NestJS PostgreSQL (giữ cấu trúc 1-1).
 *
 * Tận dụng việc schema giữ NGUYÊN tên bảng/cột (snake_case) giữa hai bên, nên
 * copy theo tên cột; chỉ coerce kiểu: tinyint(1)→boolean, JSON→jsonb, datetime→timestamp.
 *
 * Cấu hình qua ENV:
 *   # Nguồn MySQL (Laravel)
 *   MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_USER=root MYSQL_PASSWORD=secret MYSQL_DATABASE=laravel
 *   # Đích PostgreSQL: dùng DATABASE_URL của apps/api
 *
 * Dùng:
 *   pnpm --filter @thang-long/api etl:import            # chèn (giả định bảng đích trống)
 *   pnpm --filter @thang-long/api etl:import --truncate  # xoá sạch bảng đích trước khi chèn
 *
 * ⚠️ Chạy với DB production cẩn trọng — nên backup trước. Cần cài: mysql2, pg.
 */
const mysql = require('mysql2/promise');
const { Client } = require('pg');

// Thứ tự tôn trọng phụ thuộc khoá ngoại.
const TABLES = [
  'teams', 'users', 'customers',
  'categories', 'products', 'product_variants', 'warehouses', 'media',
  'posts', 'storefront_sections',
  'reviews', 'coupons',
  'carts', 'cart_items', 'orders', 'order_items',
  'appointments', 'appointment_status_histories', 'contact_inquiries',
  'tickets', 'ticket_responses', 'messages',
];

const TRUNCATE = process.argv.includes('--truncate');

async function main() {
  const src = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'laravel',
    dateStrings: false,
  });
  const dst = new Client({ connectionString: process.env.DATABASE_URL });
  await dst.connect();

  let totalRows = 0;
  for (const table of TABLES) {
    // Bỏ qua bảng không tồn tại ở nguồn.
    const [exists] = await src.query(
      'SELECT COUNT(*) c FROM information_schema.tables WHERE table_schema=? AND table_name=?',
      [process.env.MYSQL_DATABASE || 'laravel', table],
    );
    if (!exists[0].c) { console.log(`- bỏ qua ${table} (không có ở MySQL)`); continue; }

    // Kiểu cột ở đích để coerce.
    const meta = await dst.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1`,
      [table],
    );
    if (!meta.rows.length) { console.log(`- bỏ qua ${table} (không có ở Postgres)`); continue; }
    const boolCols = new Set(meta.rows.filter(r => r.data_type === 'boolean').map(r => r.column_name));
    const jsonCols = new Set(meta.rows.filter(r => ['json', 'jsonb'].includes(r.data_type)).map(r => r.column_name));
    const pgCols = new Set(meta.rows.map(r => r.column_name));

    if (TRUNCATE) {
      await dst.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    }

    const [rows] = await src.query(`SELECT * FROM \`${table}\``);
    let n = 0;
    for (const row of rows) {
      const cols = Object.keys(row).filter(c => pgCols.has(c)); // chỉ cột tồn tại ở đích
      const values = cols.map(c => coerce(row[c], boolCols.has(c), jsonCols.has(c)));
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const quoted = cols.map(c => `"${c}"`).join(', ');
      await dst.query(
        `INSERT INTO "${table}" (${quoted}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
        values,
      );
      n++;
    }

    // Reset sequence id để insert sau này không trùng.
    await dst.query(
      `SELECT setval(pg_get_serial_sequence($1, 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM "${table}"),0),1))`,
      [table],
    ).catch(() => {});
    totalRows += n;
    console.log(`✔ ${table}: ${n} dòng`);
  }

  await src.end();
  await dst.end();
  console.log(`\nHoàn tất ETL: ${totalRows} dòng.`);
}

function coerce(value, isBool, isJson) {
  if (value === null || value === undefined) return null;
  if (isBool) return value === 1 || value === true || value === '1';
  if (isJson) return typeof value === 'string' ? value : JSON.stringify(value);
  return value;
}

main().catch((e) => { console.error('ETL lỗi:', e.message); process.exit(1); });
