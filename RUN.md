# Run the project (native + seed)

**Stack:** Postgres (Docker) · Medusa `:9000` · Strapi `:1337` · Storefront `:8000`

---

## Quick start (easiest)

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp

# 1) Install once (skip if node_modules already exists)
npm install
cd strapi; npm install; cd ..

# 2) Start everything (opens 3 windows: Medusa / Strapi / Storefront)
.\start-all.ps1

# First time or empty database? Also seed CMS + products:
.\start-all.ps1 -Seed
```

Then open: **http://localhost:8000/vn**

| App | URL | Login |
|-----|-----|--------|
| Storefront | http://localhost:8000/vn | — |
| Medusa Admin | http://localhost:9000/app | `admin@medusa.local` / `supersecret123` |
| Strapi Admin | http://localhost:1337/admin | your user (reset tip below) |

---

## Prerequisites

- Node.js **>= 20**
- Docker Desktop **running**

---

## What `-Seed` does

When you run `.\start-all.ps1 -Seed`:

1. **Strapi SQL** (UTF-8 safe via `docker cp`)
   - `infra/postgres/seed-strapi-demo.sql` — home, about, Black Friday, blocks, sample blog
   - `infra/postgres/seed-strapi-bulk.sql` — many articles + event landing pages
   - `infra/postgres/seed-home-campaigns.sql` — homepage campaign links
2. **Medusa scripts** (after Medusa is up)
   - `seed-tea-catalog.ts` — core tea collections + products
   - `seed-tea-bulk.ts` — 50+ products + more collections
   - `unpublish-demo-apparel.ts` — hides Medusa clothing demo (Size/Color clutter)

**Windows tip:** never pipe SQL with `Get-Content` (breaks Vietnamese → `???`). The scripts use `docker cp`.

---

## Manual start (if you prefer separate terminals)

### 1. Postgres

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp
.\start-native.ps1
# or: docker compose -f infra\docker-compose.db.yml --env-file .env.dev up -d
```

Wait for: `docker inspect tlcv-postgres --format "{{.State.Health.Status}}"` → `healthy`

### 2. Seed Strapi (optional if you used `-Seed`)

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp

docker cp infra\postgres\seed-strapi-demo.sql tlcv-postgres:/tmp/seed-strapi-demo.sql
docker exec tlcv-postgres psql -U postgres -d medusa -f /tmp/seed-strapi-demo.sql

docker cp infra\postgres\seed-strapi-bulk.sql tlcv-postgres:/tmp/seed-strapi-bulk.sql
docker exec tlcv-postgres psql -U postgres -d medusa -f /tmp/seed-strapi-bulk.sql

docker cp infra\postgres\seed-home-campaigns.sql tlcv-postgres:/tmp/seed-home-campaigns.sql
docker exec tlcv-postgres psql -U postgres -d medusa -f /tmp/seed-home-campaigns.sql
```

### 3. Medusa — Terminal 1

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp\apps\backend
npm run dev
```

Wait for: `Server is ready on port: 9000`

```powershell
npx medusa exec ./src/scripts/seed-tea-catalog.ts
npx medusa exec ./src/scripts/seed-tea-bulk.ts
npx medusa exec ./src/scripts/unpublish-demo-apparel.ts
```

Optional fixes:

```powershell
npx medusa exec ./src/scripts/fix-missing-prices.ts
npx medusa exec ./src/scripts/fix-tea-product-media.ts
```

If Medusa admin login form keeps clearing, add to `apps/backend/.env`:

```env
DISABLE_ADMIN_HMR=true
```

### 4. Strapi — Terminal 2

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp\strapi
npm run start:api
# or: npm run start   (if already built)
# develop only when editing content-type schemas
```

Reset admin password:

```powershell
npx strapi admin:reset-user-password -e YOU@email.com -p "Supersecret123"
```

### 5. Storefront — Terminal 3

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp\apps\storefront
npm run dev
```

### 6. Warm APIs (optional)

```powershell
cd C:\Users\msitr\OneDrive\Desktop\studio\ecor-temp
node scripts\warm-apis.mjs
```

---

## Seed file cheat sheet

### SQL — `infra/postgres/`

| File | Creates |
|------|---------|
| `seed-strapi-demo.sql` | `home`, `ve-chung-toi`, `black-friday-2026` + CMS blocks + sample articles |
| `seed-strapi-bulk.sql` | ~24 articles + `trung-thu-2026`, `tet-at-ty-2026`, `tuan-le-tra-thai-nguyen`, `workshop-thang-nay` |
| `seed-home-campaigns.sql` | Homepage “Sự kiện & chiến dịch” section + CTAs |

### Medusa — `apps/backend/src/scripts/`

| Script | Creates |
|--------|---------|
| `seed-tea-catalog.ts` | `tra-thuong-hang`, `black-friday-sale` + core teas |
| `seed-tea-bulk.ts` | `qua-tang`, `tra-sen-hoa`, `tra-everyday` + 50+ SKUs |
| `unpublish-demo-apparel.ts` | Drafts starter clothing products |
| `fix-missing-prices.ts` | Repair missing VND prices |
| `fix-tea-product-media.ts` | Repair tea thumbnails |

After full seed: **~8 landing pages**, **~27 articles**, **5 collections**, **~55–60 tea/gift products**.

---

## URLs to test

| Page | URL |
|------|-----|
| Homepage (all blocks) | http://localhost:8000/vn |
| About | http://localhost:8000/vn/ve-chung-toi |
| Black Friday | http://localhost:8000/vn/black-friday-2026 |
| Trung Thu | http://localhost:8000/vn/trung-thu-2026 |
| Tết Ất Tỵ | http://localhost:8000/vn/tet-at-ty-2026 |
| Tuần lễ Trà | http://localhost:8000/vn/tuan-le-tra-thai-nguyen |
| Workshop | http://localhost:8000/vn/workshop-thang-nay |
| Blog | http://localhost:8000/vn/blog |
| Store | http://localhost:8000/vn/store |
| Trà thượng hạng | http://localhost:8000/vn/collections/tra-thuong-hang |
| Black Friday sale | http://localhost:8000/vn/collections/black-friday-sale |
| Quà tặng | http://localhost:8000/vn/collections/qua-tang |
| Trà sen & hoa | http://localhost:8000/vn/collections/tra-sen-hoa |
| Trà Everyday | http://localhost:8000/vn/collections/tra-everyday |

Blog posts: `http://localhost:8000/vn/blog/{slug}`

### CMS blocks on homepage

Hero · Feature list · Product grid · Rich text · Testimonials · FAQ · CTA — all on http://localhost:8000/vn

---

## Env (Windows)

Use `127.0.0.1` to avoid IPv6 stalls from `localhost`:

```env
# apps/storefront/.env.local
MEDUSA_BACKEND_URL=http://127.0.0.1:9000
STRAPI_API_URL_SERVER=http://127.0.0.1:1337
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000
NEXT_PUBLIC_STRAPI_API_URL=http://127.0.0.1:1337
NEXT_PUBLIC_DEFAULT_REGION=vn
```

---

## Stop

- Close the 3 app windows, or `Ctrl+C` in each  
- Postgres:

```powershell
docker compose -f infra\docker-compose.db.yml --env-file .env.dev down
```
