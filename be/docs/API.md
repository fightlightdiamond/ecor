# Storefront API Reference

Base URL (local Docker): `http://localhost:8000/api`  
Nuxt proxy (FE): `http://localhost:3000/api/storefront/*` → BE

**Interactive docs (Swagger UI):** [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)  
**OpenAPI JSON:** `storage/api-docs/api-docs.json`

## Conventions

| Topic | Rule |
|-------|------|
| Response envelope | `{ "success": true, "data": ... }` or `{ "success": false, "message": "..." }` |
| i18n | Query `?lang=vi\|en` or header `Accept-Language: vi` |
| Cart session | Header `X-Session-ID: <uuid>` (FE sets cookie `api_session_id`) |
| Cache | GET cached 120s (Redis recommended); invalidated on checkout / admin publish |
| Rate limits | cart 30/min, checkout 10/min, contact & booking 20/min |

---

## Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Service status |

---

## Site & SEO

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/storefront/site` | Settings, team, services, gallery, testimonials (JSON bundle) |
| `GET` | `/storefront/sitemap` | Product & post slugs for sitemap.xml |

---

## Products

| Method | Path | Query / Body |
|--------|------|----------------|
| `GET` | `/storefront/categories` | `lang` |
| `GET` | `/storefront/products` | `search`, `category_id`, `page`, `per_page` (max 100) |
| `GET` | `/storefront/products/featured` | `lang` |
| `GET` | `/storefront/products/{slug}` | `lang` — includes `related[]` |
| `GET` | `/storefront/products/{slug}/reviews` | `per_page` (max 50) — approved only |

---

## Blog

| Method | Path | Query |
|--------|------|-------|
| `GET` | `/storefront/posts` | `page`, `per_page` (max 50), `lang` |
| `GET` | `/storefront/posts/latest` | `lang` |
| `GET` | `/storefront/posts/{slug}` | `lang` |

---

## Cart & Checkout

| Method | Path | Headers | Body |
|--------|------|---------|------|
| `GET` | `/storefront/cart` | `X-Session-ID` | — |
| `POST` | `/storefront/cart/add` | `X-Session-ID` | `{ product_id, quantity? }` |
| `POST` | `/storefront/cart/update` | `X-Session-ID` | `{ item_id, quantity }` (0 = remove) |
| `POST` | `/storefront/cart/remove` | `X-Session-ID` | `{ item_id }` |
| `POST` | `/storefront/checkout` | `X-Session-ID` | `{ name, phone, address, coupon_code? }` |

Checkout response includes `order_number`, `subtotal`, `discount`, `total_price`.

---

## Coupons

| Method | Path | Body |
|--------|------|------|
| `POST` | `/storefront/coupons/validate` | `{ code, cart_total }` |

Returns `{ valid, code?, type?, value?, discount?, message? }`.

---

## Orders

| Method | Path | Query |
|--------|------|-------|
| `GET` | `/storefront/orders/lookup` | `number`, `phone` |

Guest order tracking (no auth).

---

## Contact & Booking

| Method | Path | Body |
|--------|------|------|
| `POST` | `/storefront/contact` | `{ name, phone, email?, service?, message?, source? }` |
| `GET` | `/storefront/booking/availability` | `date` (YYYY-MM-DD) |
| `POST` | `/storefront/booking` | `{ name, phone, email?, service?, staff_id?, preferred_date?, preferred_time?, note? }` |

Both save to `contact_inquiries` (admin: **Customer Support → Contact Inquiries**).  
Booking records use `type=booking` and optional `preferred_at`.

---

## Customer portal (CRM Phase 5)

Bearer token from `/customer/login` or `/customer/register`. **Not** the admin Sanctum token.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/customer/register` | — | `{ name, phone, password, email? }` |
| `POST` | `/customer/login` | — | `{ phone, password }` |
| `POST` | `/customer/logout` | Bearer | Revoke token |
| `GET` | `/customer/profile` | Bearer | Profile |
| `GET` | `/customer/appointments` | Bearer | My appointments |
| `DELETE` | `/customer/appointments/{id}` | Bearer | Cancel (>24h before) |
| `GET` | `/customer/orders` | Bearer | My orders (linked by phone) |

Booking form (`POST /storefront/booking`) also creates an `appointments` row (admin: **Appointments**).

---

## Regenerate OpenAPI spec

```bash
docker exec tl_che_viet_app php artisan l5-swagger:generate
```

Set in `.env`:

```env
L5_SWAGGER_CONST_HOST=http://localhost:8000
```
