-- Patch homepage so it mentions campaign landing pages.
-- Safe to re-run.
BEGIN;
SET search_path TO strapi;
SET client_encoding TO 'UTF8';

DO $$
DECLARE
  page_home INT;
  rich_id INT;
  cta_bf_id INT;
  cta_workshop_id INT;
  max_ord INT;
BEGIN
  SELECT id INTO page_home FROM landing_pages WHERE slug = 'home' ORDER BY id DESC LIMIT 1;
  IF page_home IS NULL THEN
    RAISE EXCEPTION 'landing page home not found';
  END IF;

  -- Point existing brand CTA at workshop landing (was /store)
  UPDATE components_page_blocks_cta_banners c
  SET
    title = 'Trải nghiệm văn hoá trà Việt',
    description = 'Đặt lịch workshop pha trà hoặc tư vấn set quà doanh nghiệp tại Hà Nội.',
    button_label = 'Xem lịch workshop',
    button_link = '/workshop-thang-nay'
  FROM landing_pages_cmps lpc
  WHERE lpc.entity_id = page_home
    AND lpc.field = 'blocks'
    AND lpc.component_type = 'page-blocks.cta-banner'
    AND lpc.cmp_id = c.id
    AND c.background_color = 'brand';

  -- Remove previous campaign blocks if re-run
  DELETE FROM landing_pages_cmps
  WHERE entity_id = page_home
    AND field = 'blocks'
    AND component_type IN ('page-blocks.rich-text')
    AND cmp_id IN (
      SELECT id FROM components_page_blocks_rich_texts
      WHERE content LIKE '%Sự kiện & chiến dịch%'
    );

  DELETE FROM landing_pages_cmps
  WHERE entity_id = page_home
    AND field = 'blocks'
    AND component_type = 'page-blocks.cta-banner'
    AND cmp_id IN (
      SELECT id FROM components_page_blocks_cta_banners
      WHERE button_link = '/black-friday-2026'
        AND title = 'Black Friday 2026'
    );

  INSERT INTO components_page_blocks_rich_texts (content, container_width)
  VALUES (
    '<h2>Sự kiện &amp; chiến dịch</h2><p>Khám phá các trang landing đang chạy — mỗi trang có hero, ưu đãi và sản phẩm riêng:</p><ul><li><a href="/vn/black-friday-2026">Black Friday 2026</a> — sale sốc trà thượng hạng</li><li><a href="/vn/trung-thu-2026">Trung Thu 2026</a> — hộp quà trà &amp; bánh</li><li><a href="/vn/tet-at-ty-2026">Tết Ất Tỵ 2026</a> — set biếu doanh nghiệp</li><li><a href="/vn/tuan-le-tra-thai-nguyen">Tuần lễ Trà Thái Nguyên</a> — trải nghiệm vùng chè</li><li><a href="/vn/workshop-thang-nay">Workshop tháng này</a> — giữ chỗ pha trà cuối tuần</li></ul>',
    'Narrow'
  )
  RETURNING id INTO rich_id;

  INSERT INTO components_page_blocks_cta_banners (
    title, description, button_label, button_link, background_color
  ) VALUES (
    'Black Friday 2026',
    'Ưu đãi trà thượng hạng — freeship, quà kèm, ít ngày cuối.',
    'Vào trang Black Friday',
    '/black-friday-2026',
    'dark'
  )
  RETURNING id INTO cta_bf_id;

  -- Shift: put campaigns after product grid (order 3), before testimonials
  -- Current: 1 hero, 2 features, 3 grid, 4 testimonials, 5 faq, 6 cta
  UPDATE landing_pages_cmps
  SET "order" = "order" + 2
  WHERE entity_id = page_home
    AND field = 'blocks'
    AND "order" >= 4;

  INSERT INTO landing_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
    (page_home, rich_id, 'page-blocks.rich-text', 'blocks', 4),
    (page_home, cta_bf_id, 'page-blocks.cta-banner', 'blocks', 5);

  RAISE NOTICE 'Home campaigns patched: rich=%, cta_bf=%', rich_id, cta_bf_id;
END $$;

COMMIT;

SELECT lpc."order", lpc.component_type
FROM strapi.landing_pages lp
JOIN strapi.landing_pages_cmps lpc ON lpc.entity_id = lp.id AND lpc.field = 'blocks'
WHERE lp.slug = 'home'
ORDER BY lpc."order";
