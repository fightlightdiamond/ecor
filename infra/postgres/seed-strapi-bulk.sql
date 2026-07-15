-- =============================================================================
-- Bulk Strapi demo content for testing (UTF-8)
-- Apply:
--   docker cp infra/postgres/seed-strapi-bulk.sql tlcv-postgres:/tmp/seed-strapi-bulk.sql
--   docker exec tlcv-postgres psql -U postgres -d medusa -f /tmp/seed-strapi-bulk.sql
-- =============================================================================

BEGIN;
SET search_path TO strapi, public;

-- Cleanup previous bulk runs
DELETE FROM landing_pages WHERE document_id LIKE 'bulkpage%';
DELETE FROM articles WHERE document_id LIKE 'bulkart%';
DELETE FROM categories WHERE document_id LIKE 'bulkcat%';

-- Extra categories
INSERT INTO categories (document_id, name, slug, description, created_at, updated_at, published_at) VALUES
  ('bulkcat0000000000000001', 'Hướng dẫn pha trà', 'huong-dan-pha-tra', 'Cách pha trà đúng chuẩn cho từng loại.', NOW(), NOW(), NOW()),
  ('bulkcat0000000000000002', 'Quà tặng & Doanh nghiệp', 'qua-tang-doanh-nghiep', 'Set quà trà cho đối tác và sự kiện.', NOW(), NOW(), NOW()),
  ('bulkcat0000000000000003', 'Vùng trà Việt Nam', 'vung-tra-viet-nam', 'Khám phá các vùng chè nổi tiếng.', NOW(), NOW(), NOW());

CREATE TEMP TABLE bulk_cats (slug TEXT, id INT) ON COMMIT DROP;
INSERT INTO bulk_cats (slug, id)
SELECT slug, id FROM categories WHERE slug IN (
  'kien-thuc-tra', 'tin-tuc-su-kien', 'huong-dan-pha-tra', 'qua-tang-doanh-nghiep', 'vung-tra-viet-nam'
);

-- 24 blog articles
WITH arts AS (
  INSERT INTO articles (document_id, title, slug, seo_description, content, cover_url, created_at, updated_at, published_at)
  VALUES
    ('bulkart0000000000000001', 'Bí quyết pha Trà Thái Nguyên ngon', 'bi-quyet-pha-tra-thai-nguyen-ngon', 'Nhiệt độ nước, thời gian và tỉ lệ trà cho nước vàng óng.', '<p>Dùng nước khoảng <strong>85–90°C</strong>, 3–5g trà / 150ml. Lần đầu tráng nhanh 5 giây, các lần sau 20–40 giây.</p>', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000002', 'Cách chọn ấm pha trà cho người mới', 'cach-chon-am-pha-tra-cho-nguoi-moi', 'Ấm tử sa, ấm sứ hay ấm thuỷ tinh — nên bắt đầu từ đâu?', '<p>Người mới nên bắt đầu với <strong>ấm sứ hoặc thuỷ tinh</strong> để quan sát màu nước, rồi chuyển sang tử sa khi đã quen.</p>', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000003', 'Trà sen: từ hồ Tây đến tách trà', 'tra-sen-tu-ho-tay-den-tach-tra', 'Quy trình ướp sen thủ công và cách thưởng thức.', '<p>Mỗi cân trà cần hàng trăm bông sen. Hương thanh, không gắt — pha nhẹ để giữ hương hoa.</p>', 'https://images.unsplash.com/photo-1571934811356-5cc06116f564?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000004', 'Ô long Việt Nam khác Ô long Đài Loan thế nào?', 'o-long-viet-nam-khac-o-long-dai-loan', 'So sánh hương, vị và mức lên men.', '<p>Ô long Việt thường <strong>thanh hơn</strong>, ít đậm rang; phù hợp uống hàng ngày và uống lạnh.</p>', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8c2a1?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000005', 'Set quà Tết trà Việt cho doanh nghiệp', 'set-qua-tet-tra-viet-cho-doanh-nghiep', 'Gợi ý hộp quà theo ngân sách và cách in logo.', '<p>Từ set 300k đến 1.5tr — kết hợp trà thượng hạng + hộp cứng + thiệp theo thương hiệu bạn.</p>', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000006', 'Lịch thu hoạch chè Tân Cương theo mùa', 'lich-thu-hoach-che-tan-cuong-theo-mua', 'Chè vụ xuân, vụ hè — hương vị khác nhau ra sao?', '<p><strong>Vụ xuân</strong> thường thơm cốm và ngọt hậu nhất. Vụ hè đậm đà hơn, thích hợp pha đặc.</p>', 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000007', 'Uống trà đúng cách theo văn hoá Việt', 'uong-tra-dung-cach-theo-van-hoa-viet', 'Nghi thức đơn giản cho bàn trà tại gia.', '<p>Tráng ấm, tráng trà, pha nhanh lần đầu. Mời trà theo thứ tự khách trước chủ sau.</p>', 'https://images.unsplash.com/photo-1556678727-4f8f6a55e9c1?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000008', 'Trà xanh bảo quản bao lâu?', 'tra-xanh-bao-quan-bao-lau', 'Thời hạn và điều kiện giữ hương tốt nhất.', '<p>Ẩn trong hộp kín, tránh nắng và ẩm. Dùng tốt nhất trong <strong>6–12 tháng</strong> sau khi mở.</p>', 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000009', '5 lỗi thường gặp khi pha trà', '5-loi-thuong-gap-khi-pha-tra', 'Nước quá sôi, trà quá nhiều, ngâm quá lâu…', '<ul><li>Nước sôi già làm trà đắng</li><li>Ngâm quá lâu</li><li>Dùng ấm bẩn mùi</li></ul>', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000010', 'Trải nghiệm workshop pha trà cuối tuần', 'trai-nghiem-workshop-pha-tra-cuoi-tuan', 'Lịch workshop và những gì bạn sẽ học.', '<p>90 phút: vùng trà — pha ấm — thưởng thức. Suất 12 khách. Đăng ký sớm.</p>', 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000011', 'Chè shan tuyết Hà Giang có gì đặc biệt?', 'che-shan-tuyet-ha-giang-co-gi-dac-biet', 'Cây chè cổ thụ và hương núi.', '<p>Cánh to, hương núi ngọt hậu. Thích hợp pha ấm lớn, uống chậm.</p>', 'https://images.unsplash.com/photo-1563822249366-3efb219d5bf8?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000012', 'Trà hoa nhài: chọn loại nào?', 'tra-hoa-nhai-chon-loai-nao', 'Trà ướp nhài tự nhiên khác trà hương liệu.', '<p>Chọn trà ướp hoa thật: hương vẫn ngọt, hương hoa không chua.</p>', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000013', 'Pha trà lạnh (cold brew) tại nhà', 'pha-tra-lanh-cold-brew-tai-nha', 'Công thức đơn giản không bị đắng.', '<p>6–8g trà / 500ml nước lọc, ngâm tủ lạnh 6–8 giờ. Lọc và thưởng thức.</p>', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000014', 'Quà trung thu trà và bánh', 'qua-trung-thu-tra-va-banh', 'Gợi ý set trà + bánh tinh tế.', '<p>Ghép trà sen hoặc ô long với hộp bánh nhỏ — thanh và không ngấy.</p>', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000015', 'Cách nhận biết trà kém chất lượng', 'cach-nhan-biet-tra-kem-chat-luong', 'Màu nước, mùi và hậu vị đáng ngờ.', '<p>Mùi hơi chua, nước đục, đắng gắt không hậu ngọt — tránh mua.</p>', 'https://images.unsplash.com/photo-1523906630133-f7388cea5484?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000016', 'Trà đạo Việt trong đời sống hiện đại', 'tra-dao-viet-trong-doi-song-hien-dai', 'Giữ nếp trà giữa nhịp sống bận rộn.', '<p>Chỉ cần 10 phút buổi sáng với một ấm trà — đủ để chậm lại.</p>', 'https://images.unsplash.com/photo-1523920290227-c9e918efda64?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000017', 'Kết hợp trà và món ăn Việt', 'ket-hop-tra-va-mon-an-viet', 'Gợi ý pairing đơn giản.', '<p>Trà sen với bánh cốm; trà thái nguyên với bánh đậu xanh; ô long với hải sản hấp.</p>', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000018', 'Mở bàn trà tại nhà với ngân sách nhỏ', 'mo-ban-tra-tai-nha-ngan-sach-nho', 'Dụng cụ cơ bản dưới 500.000đ.', '<p>Ấm nhỏ, chén, khay, cân trà — bắt đầu đơn giản trước khi nâng cấp.</p>', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000019', 'Black Friday: mẹo chọn trà sale thật chất', 'black-friday-meo-chon-tra-sale-that-chat', 'Đừng chỉ nhìn giá — xem nguồn gốc và vụ chè.', '<p>Sale tốt vẫn phải còn nguồn gốc rõ, hạn dùng dài, hương không ẩm mốc.</p>', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000020', 'Câu chuyện nông hộ chè tại Tân Cương', 'cau-chuyen-nong-ho-che-tai-tan-cuong', 'Từ đồi chè đến hộp trà trên bàn bạn.', '<p>Chúng tôi làm việc trực tiếp với hộ gia đình — từng vụ chè đều được ghi nhận.</p>', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000021', 'Trà cho người mới bắt đầu', 'tra-cho-nguoi-moi-bat-dau', '3 loại trà dễ uống nhất.', '<p>Bắt đầu với trà Thái Nguyên nhẹ, trà sen thanh, hoặc ô long hương hoa.</p>', 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000022', 'Checklist mua trà online an toàn', 'checklist-mua-tra-online-an-toan', 'Hình ảnh, hạn dùng, chính sách đổi trả.', '<p>Ưu tiên shop có ảnh thật, mô tả vùng nguyên liệu và hỗ trợ đổi trả rõ ràng.</p>', 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000023', 'Trà và sức khoẻ: hiểu đúng', 'tra-va-suc-khoe-hieu-dung', 'Không thần thánh hoá — uống vừa đủ.', '<p>Trà chứa chất chống oxy hoá; uống vừa phải, tránh quá đặc trước khi ngủ.</p>', 'https://images.unsplash.com/photo-1505576399279-565b52d4acb1?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW()),
    ('bulkart0000000000000024', 'Xu hướng quà trà doanh nghiệp 2026', 'xu-huong-qua-tra-doanh-nghiep-2026', 'Hộp tối giản, truy xuất nguồn gốc, trải nghiệm workshop.', '<p>Khách B2B thích set tối giản + QR kể câu chuyện vùng chè.</p>', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=80', NOW(), NOW(), NOW())
  RETURNING id, slug
)
INSERT INTO articles_category_lnk (article_id, category_id, article_ord)
SELECT
  a.id,
  CASE
    WHEN a.slug LIKE '%qua%' OR a.slug LIKE '%doanh-nghiep%' OR a.slug LIKE '%trung-thu%' OR a.slug LIKE '%tet%'
      THEN (SELECT id FROM bulk_cats WHERE slug = 'qua-tang-doanh-nghiep')
    WHEN a.slug LIKE '%pha%' OR a.slug LIKE '%loi%' OR a.slug LIKE '%cold%' OR a.slug LIKE '%am-%'
      THEN (SELECT id FROM bulk_cats WHERE slug = 'huong-dan-pha-tra')
    WHEN a.slug LIKE '%tan-cuong%' OR a.slug LIKE '%ha-giang%' OR a.slug LIKE '%vung%' OR a.slug LIKE '%nong-ho%'
      THEN (SELECT id FROM bulk_cats WHERE slug = 'vung-tra-viet-nam')
    WHEN a.slug LIKE '%workshop%' OR a.slug LIKE '%black-friday%' OR a.slug LIKE '%xu-huong%'
      THEN (SELECT id FROM bulk_cats WHERE slug = 'tin-tuc-su-kien')
    ELSE (SELECT id FROM bulk_cats WHERE slug = 'kien-thuc-tra')
  END,
  a.id
FROM arts a;

-- Extra shared reviews + FAQ for homepage reuse components (orphans OK for CMS tests)
INSERT INTO components_shared_review_items (name, role, content, rating) VALUES
  ('Hoàng Nam', 'Giám đốc marketing', 'Đặt 50 hộp quà — in logo đẹp, giao đúng hạn.', 5),
  ('Thu Hà', 'Giáo viên', 'Trà sen thơm thật, pha đãi khách rất được khen.', 5),
  ('Đức Anh', 'Freelancer', 'Gói hàng cẩn thận, trà không bị bể vụn.', 4),
  ('Mai Phương', 'Chủ quán cà phê', 'Dùng làm trà lạnh bán kèm — khách phản hồi tốt.', 5),
  ('Quốc Bảo', 'Kỹ sư', 'Hương cốm rõ, không đắng gắt. Sẽ mua lại.', 5),
  ('Ngọc Trâm', 'Nội trợ', 'Biếu bố mẹ — hộp đẹp, uống dễ.', 5),
  ('Văn Khoa', 'Sinh viên', 'Giá hợp lý cho trà thử loại 100g.', 4),
  ('Hải Yến', 'HR Manager', 'Workshop team building vui và chuyên nghiệp.', 5);

INSERT INTO components_shared_faq_items (question, answer) VALUES
  ('Có ship COD không?', '<p>Có hỗ trợ COD nội thành và một số tỉnh. Chi tiết khi thanh toán.</p>'),
  ('Đổi trả trong bao lâu?', '<p>Trong 7 ngày nếu sản phẩm lỗi do vận chuyển hoặc sai loại trà.</p>'),
  ('Có xuất hoá đơn VAT không?', '<p>Có — vui lòng cung cấp thông tin công ty khi đặt hàng.</p>'),
  ('Trà có cafein không?', '<p>Trà xanh và ô long đều có cafein tự nhiên, ít hơn cà phê nếu pha nhẹ.</p>'),
  ('Mua số lượng lớn có chiết khấu?', '<p>Có bảng giá sỉ từ 10 hộp. Liên hệ kênh doanh nghiệp để báo giá.</p>'),
  ('Làm sao theo dõi đơn hàng?', '<p>Bạn nhận mã vận đơn qua email/SMS sau khi đơn được xác nhận.</p>');

-- More event landing pages with rich text + CTA
INSERT INTO components_shared_seos (meta_title, meta_description) VALUES
  ('Trung Thu Trà Việt 2026', 'Set quà trung thu trà sen và ô long — đặt sớm.'),
  ('Tết Ất Tỵ — Hộp quà trà', 'Quà Tết tinh tế cho đối tác và người thân.'),
  ('Tuần lễ Trà Thái Nguyên', 'Ưu đãi vùng chè Tân Cương trong tuần lễ đặc biệt.'),
  ('Workshop tháng này', 'Lịch workshop pha trà cuối tuần tại Hà Nội.');

INSERT INTO components_page_blocks_rich_texts (content, container_width) VALUES
  ('<h2>Trung Thu Trà Việt</h2><p>Set trà sen + ô long trong hộp cứng tối giản. Phù hợp biếu đối tác.</p><ul><li>Freeship đơn từ 500k</li><li>In thiệp theo yêu cầu</li></ul>', 'Narrow'),
  ('<h2>Tết Ất Tỵ</h2><p>Bộ quà trà thượng hạng — từ đồi chè đến bàn trà ngày xuân.</p>', 'Narrow'),
  ('<h2>Tuần lễ Thái Nguyên</h2><p>Giảm giá chọn lọc trên các dòng chè Tân Cương vụ xuân.</p>', 'Narrow'),
  ('<h2>Workshop</h2><p>Học pha trà, nhận bộ trà nhỏ mang về. Đăng ký trước 48 giờ.</p>', 'Narrow');

INSERT INTO components_page_blocks_cta_banners (title, description, button_label, button_link, background_color) VALUES
  ('Đặt set Trung Thu ngay', 'Số lượng có hạn mỗi tuần.', 'Xem sản phẩm', '/collections/qua-tang', 'amber'),
  ('Sắm quà Tết sớm', 'Ưu đãi đặt trước 15/01.', 'Mua sắm', '/collections/qua-tang', 'brand'),
  ('Săn deal tuần chè', 'Giảm đến 30% dòng Thái Nguyên.', 'Xem ưu đãi', '/collections/tra-thuong-hang', 'green'),
  ('Giữ chỗ workshop', 'Suất tối đa 12 khách.', 'Xem lịch workshop', '/workshop-thang-nay', 'dark');

INSERT INTO components_page_blocks_heroes (heading, subheading, alignment) VALUES
  ('Trung Thu tròn đầy hương trà', 'Set quà thanh nhã — sen và ô long cho đêm rằm.', 'Center'),
  ('Tết ấm với trà Việt', 'Hộp quà Tân Cương & sen Tây Hồ cho ngày đầu năm.', 'Center'),
  ('Tuần lễ Trà Thái Nguyên', 'Chạm hương cốm non từ đồi chè Tân Cương.', 'Center'),
  ('Workshop pha trà cuối tuần', '90 phút chậm lại cùng tách trà.', 'Left');

INSERT INTO components_shared_cta_buttons (label, url, style) VALUES
  ('Xem set Trung Thu', '/trung-thu-2026', 'primary'),
  ('Đặt quà Tết', '/tet-at-ty-2026', 'primary'),
  ('Mua trà tuần này', '/tuan-le-tra-thai-nguyen', 'primary'),
  ('Đăng ký workshop', '/workshop-thang-nay', 'primary');

DO $$
DECLARE
  i INT;
  page_id INT;
  rich_id INT;
  cta_id INT;
  hero_id INT;
  btn_id INT;
  seo_id INT;
  slugs TEXT[] := ARRAY['trung-thu-2026', 'tet-at-ty-2026', 'tuan-le-tra-thai-nguyen', 'workshop-thang-nay'];
  titles TEXT[] := ARRAY['Trung Thu 2026', 'Tết Ất Tỵ 2026', 'Tuần lễ Trà Thái Nguyên', 'Workshop tháng này'];
BEGIN
  FOR i IN 1..4 LOOP
    SELECT id INTO rich_id FROM components_page_blocks_rich_texts ORDER BY id DESC OFFSET (4-i) LIMIT 1;
    SELECT id INTO cta_id FROM components_page_blocks_cta_banners ORDER BY id DESC OFFSET (4-i) LIMIT 1;
    SELECT id INTO hero_id FROM components_page_blocks_heroes ORDER BY id DESC OFFSET (4-i) LIMIT 1;
    SELECT id INTO btn_id FROM components_shared_cta_buttons ORDER BY id DESC OFFSET (4-i) LIMIT 1;
    SELECT id INTO seo_id FROM components_shared_seos ORDER BY id DESC OFFSET (4-i) LIMIT 1;

    INSERT INTO components_page_blocks_heroes_cmps (entity_id, cmp_id, component_type, field, "order")
    VALUES (hero_id, btn_id, 'shared.cta-button', 'cta_buttons', 1);

    INSERT INTO landing_pages (document_id, title, slug, seo_description, created_at, updated_at, published_at)
    VALUES (
      'bulkpage00000000000000' || i,
      titles[i],
      slugs[i],
      titles[i] || ' — Thăng Long Chè Việt',
      NOW(), NOW(), NOW()
    )
    RETURNING id INTO page_id;

    INSERT INTO landing_pages_cmps (entity_id, cmp_id, component_type, field, "order") VALUES
      (page_id, seo_id, 'shared.seo', 'seo', NULL),
      (page_id, hero_id, 'page-blocks.hero', 'blocks', 1),
      (page_id, rich_id, 'page-blocks.rich-text', 'blocks', 2),
      (page_id, cta_id, 'page-blocks.cta-banner', 'blocks', 3);
  END LOOP;
END $$;

COMMIT;

SELECT COUNT(*) AS articles FROM strapi.articles WHERE published_at IS NOT NULL;
SELECT COUNT(*) AS landing_pages FROM strapi.landing_pages WHERE published_at IS NOT NULL;
SELECT slug, title FROM strapi.landing_pages WHERE document_id LIKE 'bulkpage%' ORDER BY slug;
SELECT COUNT(*) AS categories FROM strapi.categories WHERE published_at IS NOT NULL;
