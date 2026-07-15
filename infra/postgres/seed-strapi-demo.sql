-- =============================================================================
-- Thăng Long Chè Việt — Strapi demo content (schema: strapi)
--
-- Apply (PowerShell):
--   Get-Content infra\postgres\seed-strapi-demo.sql -Raw |
--     docker exec -i tlcv-postgres psql -U postgres -d medusa
--
-- Or:
--   docker exec -i tlcv-postgres psql -U postgres -d medusa < infra/postgres/seed-strapi-demo.sql
--
-- Safe to re-run. Replaces landing pages / articles by slug.
-- Product grids expect Medusa collections: tra-thuong-hang, black-friday-sale
-- (seed those via: cd apps\backend && npx medusa exec ./src/scripts/seed-tea-catalog.ts)
-- =============================================================================

BEGIN;
SET search_path TO strapi, public;

-- -----------------------------------------------------------------------------
-- Remove previous demo content by slug / document_id
-- -----------------------------------------------------------------------------
DELETE FROM landing_pages
WHERE slug IN ('home', 've-chung-toi', 'black-friday-2026')
   OR document_id IN (
     'seedhome0000000000000001',
     'seedabout000000000000001',
     'seedbf000000000000000001'
   );

DELETE FROM articles
WHERE slug IN (
  'nghe-thuat-uop-tra-sen-tay-ho',
  'cach-phan-biet-tra-thai-nguyen-chuan',
  'workshop-pha-tra-cuoi-tuan-ha-noi'
)
OR document_id LIKE 'seedart%';

-- -----------------------------------------------------------------------------
-- Categories (publish existing or create)
-- -----------------------------------------------------------------------------
CREATE TEMP TABLE seed_ctx (
  cat_kien INTEGER,
  cat_tin INTEGER
) ON COMMIT DROP;

DO $$
DECLARE
  cat_kien INTEGER;
  cat_tin INTEGER;
BEGIN
  SELECT id INTO cat_kien FROM categories WHERE slug = 'kien-thuc-tra' ORDER BY id LIMIT 1;
  SELECT id INTO cat_tin FROM categories WHERE slug = 'tin-tuc-su-kien' ORDER BY id LIMIT 1;

  IF cat_kien IS NULL THEN
    INSERT INTO categories (document_id, name, slug, description, created_at, updated_at, published_at)
    VALUES (
      'seedcat00000000000000001',
      'Kiến thức Trà',
      'kien-thuc-tra',
      'Văn hoá thưởng trà, vùng nguyên liệu và bí quyết pha chế.',
      NOW(), NOW(), NOW()
    )
    RETURNING id INTO cat_kien;
  ELSE
    UPDATE categories
    SET name = 'Kiến thức Trà',
        description = 'Văn hoá thưởng trà, vùng nguyên liệu và bí quyết pha chế.',
        published_at = COALESCE(published_at, NOW()),
        updated_at = NOW()
    WHERE id = cat_kien;
  END IF;

  IF cat_tin IS NULL THEN
    INSERT INTO categories (document_id, name, slug, description, created_at, updated_at, published_at)
    VALUES (
      'seedcat00000000000000002',
      'Tin tức & Sự kiện',
      'tin-tuc-su-kien',
      'Tin mới, workshop và chương trình khuyến mãi từ Thăng Long Chè Việt.',
      NOW(), NOW(), NOW()
    )
    RETURNING id INTO cat_tin;
  ELSE
    UPDATE categories
    SET name = 'Tin tức & Sự kiện',
        description = 'Tin mới, workshop và chương trình khuyến mãi từ Thăng Long Chè Việt.',
        published_at = COALESCE(published_at, NOW()),
        updated_at = NOW()
    WHERE id = cat_tin;
  END IF;

  INSERT INTO seed_ctx (cat_kien, cat_tin) VALUES (cat_kien, cat_tin);
END $$;

-- -----------------------------------------------------------------------------
-- Articles
-- -----------------------------------------------------------------------------
WITH a AS (
  INSERT INTO articles (
    document_id, title, slug, seo_description, content, cover_url,
    created_at, updated_at, published_at
  ) VALUES
  (
    'seedart00000000000000001',
    'Nghệ thuật ướp Trà Sen Tây Hồ',
    'nghe-thuat-uop-tra-sen-tay-ho',
    'Khám phá bí quyết ướp trà sen thủ công — hương thơm thanh khiết từ hồ Tây.',
    '<p>Trà sen Tây Hồ từ lâu được coi là <strong>thiên cổ đệ nhất trà</strong> của người Hà Nội. Mỗi lớp cánh sen phải được hái lúc tờ mờ sáng, rồi ướp cùng chè Tân Cương chỉ trong vài giờ.</p><p>Thăng Long Chè Việt giữ quy trình thủ công: một cân trà cần khoảng một nghìn bông sen — nên mỗi hộp đều mang dấu ấn mùa vụ.</p>',
    'https://images.unsplash.com/photo-1571934811356-5cc06116f564?auto=format&fit=crop&w=1600&q=80',
    NOW(), NOW(), NOW()
  ),
  (
    'seedart00000000000000002',
    'Cách phân biệt Trà Thái Nguyên chuẩn',
    'cach-phan-biet-tra-thai-nguyen-chuan',
    'Hướng dẫn nhận biết trà Tân Cương Thái Nguyên ngon: cánh trà, màu nước và hậu vị.',
    '<p>Trà Thái Nguyên chuẩn thường có <strong>cánh săn nhỏ</strong>, màu nõn chuối, nước vàng óng và hậu ngọt lâu.</p><ul><li>Mùi hương cốm non khi khô</li><li>Nước trong, không đục</li><li>Uống xong còn vị ngọt ở cuống lưỡi</li></ul>',
    'https://images.unsplash.com/photo-1594631252845-29fc4cc8c2a1?auto=format&fit=crop&w=1600&q=80',
    NOW(), NOW(), NOW()
  ),
  (
    'seedart00000000000000003',
    'Workshop pha trà cuối tuần tại Hà Nội',
    'workshop-pha-tra-cuoi-tuan-ha-noi',
    'Trải nghiệm pha trà truyền thống — lịch workshop tháng này tại không gian Thăng Long Chè Việt.',
    '<p>Mỗi cuối tuần, chúng tôi mở <strong>workshop 90 phút</strong>: nhận biết vùng trà, pha ấm, và thưởng thức bộ sưu tập theo mùa.</p><p>Giữ chỗ sớm — suất chỉ 12 khách mỗi buổi.</p>',
    'https://images.unsplash.com/photo-1556678727-4f8f6a55e9c1?auto=format&fit=crop&w=1600&q=80',
    NOW(), NOW(), NOW()
  )
  RETURNING id, slug
)
INSERT INTO articles_category_lnk (article_id, category_id, article_ord)
SELECT
  a.id,
  CASE
    WHEN a.slug LIKE 'workshop%' THEN (SELECT cat_tin FROM seed_ctx)
    ELSE (SELECT cat_kien FROM seed_ctx)
  END,
  a.id
FROM a
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- Shared / page-block components
-- -----------------------------------------------------------------------------
INSERT INTO components_shared_cta_buttons (label, url, style) VALUES
  ('Mua sắm ngay', '/store', 'primary'),
  ('Khám phá câu chuyện', '/ve-chung-toi', 'outline'),
  ('Xem ưu đãi', '/collections/tra-thuong-hang', 'primary'),
  ('Liên hệ quà doanh nghiệp', '/store', 'primary');

INSERT INTO components_shared_feature_items (title, description) VALUES
  ('Nguồn gốc rõ ràng', 'Thu hái và chế biến tại Tân Cương — Thái Nguyên, minh bạch từng vụ.'),
  ('Giao hàng toàn quốc', 'Đóng gói giữ hương, giao 2–5 ngày làm việc trên toàn quốc.'),
  ('Quà tặng doanh nghiệp', 'Thiết kế hộp theo yêu cầu cho đối tác và sự kiện.'),
  ('Hậu vị chuẩn Việt', 'Tuyển chọn theo tiêu chí nước trong, hương cốm, ngọt hậu.');

INSERT INTO components_shared_review_items (name, role, content, rating) VALUES
  ('Lan Anh', 'Khách hàng Hà Nội', 'Trà Thái Nguyên thơm cốm, pha hai nước vẫn ngọt hậu. Đóng gói đẹp để biếu.', 5),
  ('Minh Tuấn', 'Doanh nghiệp', 'Đặt hộp quà Tết cho đối tác — giao đúng hẹn, cảm ơn team hỗ trợ.', 5),
  ('Hương Giang', 'Tea lover', 'Trà sen thanh, không bị ngọt gắt. Sẽ mua lại cho gia đình.', 4);

INSERT INTO components_shared_faq_items (question, answer) VALUES
  (
    'Bảo quản trà thế nào để giữ hương?',
    '<p>Để nơi khô, tránh ánh nắng. Dùng hộp kín hoặc túi zip sau khi mở. Không để cạnh đồ nặng mùi.</p>'
  ),
  (
    'Giao hàng mất bao lâu?',
    '<p>Nội thành Hà Nội 1–2 ngày. Các tỉnh khác thường 2–5 ngày làm việc.</p>'
  ),
  (
    'Có hỗ trợ hộp quà theo yêu cầu?',
    '<p>Có. Liên hệ khi đặt hàng — chúng tôi hỗ trợ thiết kế và in ấn theo số lượng.</p>'
  );

INSERT INTO components_shared_seos (meta_title, meta_description) VALUES
  (
    'Thăng Long Chè Việt — Tinh hoa trà Việt Nam',
    'Trà Thái Nguyên, trà sen Tây Hồ và quà tặng cao cấp. Nguồn gốc rõ ràng, hương vị chuẩn Việt.'
  ),
  (
    'Về Thăng Long Chè Việt',
    'Câu chuyện bảo tồn văn hoá trà và hợp tác cùng nông dân vùng chè truyền thống.'
  ),
  (
    'Black Friday 2026 — Sale sốc trà Việt',
    'Ưu đãi trà thượng hạng dịp Black Friday. Freeship, quà tặng kèm, đổi trả 7 ngày.'
  );

INSERT INTO components_page_blocks_heroes (heading, subheading, alignment) VALUES
  (
    'Tinh hoa trà Việt Nam',
    'Từ đồi chè Tân Cương đến sen Tây Hồ — chọn trà sạch, hương chuẩn, trao gửi trọn tình Việt.',
    'Center'
  ),
  (
    'Sale sốc 50% toàn bộ chè',
    'Black Friday 2026 — freeship đơn từ 300.000đ, quà tặng kèm cho set thượng hạng.',
    'Center'
  );

INSERT INTO components_page_blocks_feature_lists (section_title) VALUES
  ('Tại sao chọn chúng tôi?'),
  ('Ưu đãi Black Friday');

INSERT INTO components_page_blocks_product_grids (heading, medusa_collection_handle, "limit", layout) VALUES
  ('Sản phẩm bán chạy', 'tra-thuong-hang', 8, 'Grid'),
  ('Ưu đãi Black Friday', 'black-friday-sale', 8, 'Slider');

INSERT INTO components_page_blocks_testimonials (heading) VALUES
  ('Khách hàng nói gì về chúng tôi');

INSERT INTO components_page_blocks_faqs (title) VALUES
  ('Câu hỏi thường gặp');

INSERT INTO components_page_blocks_cta_banners (
  title, description, button_label, button_link, background_color
) VALUES
  (
    'Trải nghiệm văn hoá trà Việt',
    'Đặt lịch workshop pha trà hoặc tư vấn set quà doanh nghiệp tại Hà Nội.',
    'Xem lịch workshop',
    '/workshop-thang-nay',
    'brand'
  ),
  (
    'Săn deal trước khi hết hàng',
    'Số lượng có hạn trong tuần Black Friday.',
    'Mua ngay',
    '/collections/black-friday-sale',
    'dark'
  ),
  (
    'Black Friday 2026',
    'Ưu đãi trà thượng hạng — freeship, quà kèm, ít ngày cuối.',
    'Vào trang Black Friday',
    '/black-friday-2026',
    'dark'
  );

INSERT INTO components_page_blocks_rich_texts (content, container_width) VALUES
  (
    '<h2>Về Thăng Long Chè Việt</h2><p>Chúng tôi sinh ra với sứ mệnh <strong>bảo tồn và phát triển tinh hoa văn hoá trà Việt Nam</strong>. Hợp tác trực tiếp với nông hộ tại Thái Nguyên và các vùng trà truyền thống.</p><p>Mỗi sản phẩm đều được kiểm soát từ thu hái, sao chè đến đóng gói — để bạn thưởng thức hương vị trung thực nhất.</p>',
    'Narrow'
  ),
  (
    '<h2>Sự kiện &amp; chiến dịch</h2><p>Khám phá các trang landing đang chạy — mỗi trang có hero, ưu đãi và sản phẩm riêng:</p><ul><li><a href="/vn/black-friday-2026">Black Friday 2026</a> — sale sốc trà thượng hạng</li><li><a href="/vn/trung-thu-2026">Trung Thu 2026</a> — hộp quà trà &amp; bánh</li><li><a href="/vn/tet-at-ty-2026">Tết Ất Tỵ 2026</a> — set biếu doanh nghiệp</li><li><a href="/vn/tuan-le-tra-thai-nguyen">Tuần lễ Trà Thái Nguyên</a> — trải nghiệm vùng chè</li><li><a href="/vn/workshop-thang-nay">Workshop tháng này</a> — giữ chỗ pha trà cuối tuần</li></ul>',
    'Narrow'
  );

-- -----------------------------------------------------------------------------
-- Wire components + create published landing pages
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  hero_home INTEGER;
  hero_bf INTEGER;
  feat_home INTEGER;
  feat_bf INTEGER;
  grid_home INTEGER;
  grid_bf INTEGER;
  testi INTEGER;
  faq INTEGER;
  cta_home INTEGER;
  cta_bf INTEGER;
  cta_bf_page INTEGER;
  rich INTEGER;
  rich_campaigns INTEGER;
  seo_home INTEGER;
  seo_about INTEGER;
  seo_bf INTEGER;
  page_home INTEGER;
  page_about INTEGER;
  page_bf INTEGER;
  cta1 INTEGER; cta2 INTEGER; cta3 INTEGER;
  f1 INTEGER; f2 INTEGER; f3 INTEGER; f4 INTEGER;
  r1 INTEGER; r2 INTEGER; r3 INTEGER;
  q1 INTEGER; q2 INTEGER; q3 INTEGER;
BEGIN
  SELECT id INTO hero_home FROM components_page_blocks_heroes WHERE heading = 'Tinh hoa trà Việt Nam' ORDER BY id DESC LIMIT 1;
  SELECT id INTO hero_bf FROM components_page_blocks_heroes WHERE heading LIKE 'Sale sốc%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO feat_home FROM components_page_blocks_feature_lists WHERE section_title = 'Tại sao chọn chúng tôi?' ORDER BY id DESC LIMIT 1;
  SELECT id INTO feat_bf FROM components_page_blocks_feature_lists WHERE section_title = 'Ưu đãi Black Friday' ORDER BY id DESC LIMIT 1;
  SELECT id INTO grid_home FROM components_page_blocks_product_grids WHERE medusa_collection_handle = 'tra-thuong-hang' ORDER BY id DESC LIMIT 1;
  SELECT id INTO grid_bf FROM components_page_blocks_product_grids WHERE medusa_collection_handle = 'black-friday-sale' ORDER BY id DESC LIMIT 1;
  SELECT id INTO testi FROM components_page_blocks_testimonials ORDER BY id DESC LIMIT 1;
  SELECT id INTO faq FROM components_page_blocks_faqs ORDER BY id DESC LIMIT 1;
  SELECT id INTO cta_home FROM components_page_blocks_cta_banners WHERE button_link = '/workshop-thang-nay' ORDER BY id DESC LIMIT 1;
  SELECT id INTO cta_bf FROM components_page_blocks_cta_banners WHERE button_link = '/collections/black-friday-sale' ORDER BY id DESC LIMIT 1;
  SELECT id INTO cta_bf_page FROM components_page_blocks_cta_banners WHERE button_link = '/black-friday-2026' ORDER BY id DESC LIMIT 1;
  SELECT id INTO rich FROM components_page_blocks_rich_texts WHERE content LIKE '%Về Thăng Long Chè Việt%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO rich_campaigns FROM components_page_blocks_rich_texts WHERE content LIKE '%Sự kiện &amp; chiến dịch%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO seo_home FROM components_shared_seos WHERE meta_title LIKE 'Thăng Long Chè Việt —%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO seo_about FROM components_shared_seos WHERE meta_title LIKE 'Về Thăng Long%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO seo_bf FROM components_shared_seos WHERE meta_title LIKE 'Black Friday%' ORDER BY id DESC LIMIT 1;

  SELECT id INTO cta1 FROM components_shared_cta_buttons WHERE label = 'Mua sắm ngay' ORDER BY id DESC LIMIT 1;
  SELECT id INTO cta2 FROM components_shared_cta_buttons WHERE label = 'Khám phá câu chuyện' ORDER BY id DESC LIMIT 1;
  SELECT id INTO cta3 FROM components_shared_cta_buttons WHERE label = 'Xem ưu đãi' ORDER BY id DESC LIMIT 1;

  SELECT id INTO f1 FROM components_shared_feature_items WHERE title = 'Nguồn gốc rõ ràng' ORDER BY id DESC LIMIT 1;
  SELECT id INTO f2 FROM components_shared_feature_items WHERE title = 'Giao hàng toàn quốc' ORDER BY id DESC LIMIT 1;
  SELECT id INTO f3 FROM components_shared_feature_items WHERE title = 'Quà tặng doanh nghiệp' ORDER BY id DESC LIMIT 1;
  SELECT id INTO f4 FROM components_shared_feature_items WHERE title = 'Hậu vị chuẩn Việt' ORDER BY id DESC LIMIT 1;

  SELECT id INTO r1 FROM components_shared_review_items WHERE name = 'Lan Anh' ORDER BY id DESC LIMIT 1;
  SELECT id INTO r2 FROM components_shared_review_items WHERE name = 'Minh Tuấn' ORDER BY id DESC LIMIT 1;
  SELECT id INTO r3 FROM components_shared_review_items WHERE name = 'Hương Giang' ORDER BY id DESC LIMIT 1;

  SELECT id INTO q1 FROM components_shared_faq_items WHERE question LIKE 'Bảo quản%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO q2 FROM components_shared_faq_items WHERE question LIKE 'Giao hàng%' ORDER BY id DESC LIMIT 1;
  SELECT id INTO q3 FROM components_shared_faq_items WHERE question LIKE 'Có hỗ trợ%' ORDER BY id DESC LIMIT 1;

  INSERT INTO components_page_blocks_heroes_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (hero_home, cta1, 'shared.cta-button', 'cta_buttons', 1),
    (hero_home, cta2, 'shared.cta-button', 'cta_buttons', 2),
    (hero_bf, cta3, 'shared.cta-button', 'cta_buttons', 1);

  INSERT INTO components_page_blocks_feature_lists_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (feat_home, f1, 'shared.feature-item', 'features', 1),
    (feat_home, f2, 'shared.feature-item', 'features', 2),
    (feat_home, f3, 'shared.feature-item', 'features', 3),
    (feat_home, f4, 'shared.feature-item', 'features', 4),
    (feat_bf, f2, 'shared.feature-item', 'features', 1),
    (feat_bf, f3, 'shared.feature-item', 'features', 2),
    (feat_bf, f1, 'shared.feature-item', 'features', 3);

  INSERT INTO components_page_blocks_testimonials_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (testi, r1, 'shared.review-item', 'reviews', 1),
    (testi, r2, 'shared.review-item', 'reviews', 2),
    (testi, r3, 'shared.review-item', 'reviews', 3);

  INSERT INTO components_page_blocks_faqs_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (faq, q1, 'shared.faq-item', 'questions', 1),
    (faq, q2, 'shared.faq-item', 'questions', 2),
    (faq, q3, 'shared.faq-item', 'questions', 3);

  INSERT INTO landing_pages (document_id, title, slug, seo_description, created_at, updated_at, published_at)
  VALUES (
    'seedhome0000000000000001',
    'Trang chủ',
    'home',
    'Thăng Long Chè Việt — tinh hoa trà Việt Nam.',
    NOW(), NOW(), NOW()
  )
  RETURNING id INTO page_home;

  INSERT INTO landing_pages (document_id, title, slug, seo_description, created_at, updated_at, published_at)
  VALUES (
    'seedabout000000000000001',
    'Về Thăng Long Chè Việt',
    've-chung-toi',
    'Câu chuyện về hành trình mang hương vị trà truyền thống đến mọi nhà.',
    NOW(), NOW(), NOW()
  )
  RETURNING id INTO page_about;

  INSERT INTO landing_pages (document_id, title, slug, seo_description, created_at, updated_at, published_at)
  VALUES (
    'seedbf000000000000000001',
    'Black Friday 2026',
    'black-friday-2026',
    'Ưu đãi trà thượng hạng dịp Black Friday.',
    NOW(), NOW(), NOW()
  )
  RETURNING id INTO page_bf;

  INSERT INTO landing_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (page_home, seo_home, 'shared.seo', 'seo', NULL),
    (page_home, hero_home, 'page-blocks.hero', 'blocks', 1),
    (page_home, feat_home, 'page-blocks.feature-list', 'blocks', 2),
    (page_home, grid_home, 'page-blocks.product-grid', 'blocks', 3),
    (page_home, rich_campaigns, 'page-blocks.rich-text', 'blocks', 4),
    (page_home, cta_bf_page, 'page-blocks.cta-banner', 'blocks', 5),
    (page_home, testi, 'page-blocks.testimonials', 'blocks', 6),
    (page_home, faq, 'page-blocks.faq', 'blocks', 7),
    (page_home, cta_home, 'page-blocks.cta-banner', 'blocks', 8);

  INSERT INTO landing_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (page_about, seo_about, 'shared.seo', 'seo', NULL),
    (page_about, rich, 'page-blocks.rich-text', 'blocks', 1),
    (page_about, cta_home, 'page-blocks.cta-banner', 'blocks', 2);

  INSERT INTO landing_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (page_bf, seo_bf, 'shared.seo', 'seo', NULL),
    (page_bf, hero_bf, 'page-blocks.hero', 'blocks', 1),
    (page_bf, feat_bf, 'page-blocks.feature-list', 'blocks', 2),
    (page_bf, grid_bf, 'page-blocks.product-grid', 'blocks', 3),
    (page_bf, cta_bf, 'page-blocks.cta-banner', 'blocks', 4);

  RAISE NOTICE 'OK — home=%, about=%, black-friday=%', page_home, page_about, page_bf;
END $$;

COMMIT;

SELECT slug, title, (published_at IS NOT NULL) AS published
FROM strapi.landing_pages
WHERE slug IN ('home', 've-chung-toi', 'black-friday-2026')
ORDER BY slug;

SELECT slug, title FROM strapi.articles
WHERE document_id LIKE 'seedart%'
ORDER BY slug;
