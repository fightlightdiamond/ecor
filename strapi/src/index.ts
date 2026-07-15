import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seeding logic cho Category
    const categoryCount = await strapi.db.query('api::category.category').count();
    let catKienThuc, catTinTuc;
    
    if (categoryCount === 0) {
      console.log('Seeding categories...');
      catKienThuc = await strapi.db.query('api::category.category').create({
        data: { name: 'Kiến thức Trà', slug: 'kien-thuc-tra', description: 'Các bài viết về văn hoá và nghệ thuật thưởng trà' }
      });
      catTinTuc = await strapi.db.query('api::category.category').create({
        data: { name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien', description: 'Tin tức mới nhất về Thăng Long Chè Việt' }
      });
    }

    // Seeding logic cho Article
    const articleCount = await strapi.db.query('api::article.article').count();
    if (articleCount === 0 && catKienThuc && catTinTuc) {
      console.log('Seeding articles...');
      await strapi.db.query('api::article.article').create({
        data: {
          title: 'Nghệ thuật ướp Trà Sen Tây Hồ',
          slug: 'nghe-thuat-uop-tra-sen-tay-ho',
          seoDescription: 'Khám phá bí quyết ướp trà sen Tây Hồ thủ công truyền thống.',
          content: 'Trà sen Tây Hồ từ lâu đã được coi là thiên cổ đệ nhất trà...',
          coverUrl: 'https://images.unsplash.com/photo-1571934811356-5cc06116f564',
          category: catKienThuc.id,
          publishedAt: new Date()
        }
      });

      await strapi.db.query('api::article.article').create({
        data: {
          title: 'Cách phân biệt Trà Thái Nguyên chuẩn',
          slug: 'cach-phan-biet-tra-thai-nguyen-chuan',
          seoDescription: 'Hướng dẫn cách nhận biết trà Tân Cương Thái Nguyên ngon và chuẩn.',
          content: 'Trà Thái Nguyên ngon thường có cánh săn nhỏ, màu mốc đặc trưng...',
          coverUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8c2a1',
          category: catKienThuc.id,
          publishedAt: new Date()
        }
      });
    }

    // Seeding logic cho Landing Page (dynamic blocks)
    const homeLanding = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { slug: 'home' },
    });

    if (!homeLanding) {
      console.log('Seeding homepage landing blocks...');
      try {
        await strapi.documents('api::landing-page.landing-page').create({
          data: {
            title: 'Trang chủ',
            slug: 'home',
            seoDescription: 'Thăng Long Chè Việt — tinh hoa trà Việt Nam.',
            seo: {
              metaTitle: 'Thăng Long Chè Việt',
              metaDescription: 'Khám phá trà Việt Nam chất lượng cao — từ Thái Nguyên đến sen Tây Hồ.',
            },
            blocks: [
              {
                __component: 'page-blocks.hero',
                heading: 'Tinh hoa trà Việt Nam',
                subheading: 'Khám phá bộ sưu tập trà Thái Nguyên, trà sen và quà tặng cao cấp.',
                alignment: 'Center',
                cta_buttons: [
                  { label: 'Mua sắm ngay', url: '/store', style: 'primary' },
                  { label: 'Tìm hiểu thêm', url: '/blog', style: 'outline' },
                ],
              },
              {
                __component: 'page-blocks.feature-list',
                section_title: 'Tại sao chọn chúng tôi?',
                features: [
                  {
                    title: 'Nguồn gốc rõ ràng',
                    description: 'Trà được thu hái và chế biến tại vùng nguyên liệu truyền thống.',
                  },
                  {
                    title: 'Giao hàng nhanh',
                    description: 'Đóng gói cẩn thận, giao toàn quốc trong 2–5 ngày.',
                  },
                  {
                    title: 'Quà tặng doanh nghiệp',
                    description: 'Thiết kế hộp quà theo yêu cầu cho sự kiện và đối tác.',
                  },
                ],
              },
              {
                __component: 'page-blocks.cta-banner',
                title: 'Trải nghiệm văn hóa trà Việt',
                description: 'Đặt lịch tham quan vườn trà và workshop pha trà tại Hà Nội.',
                button_label: 'Liên hệ ngay',
                button_link: '/store',
                background_color: 'brand',
              },
            ],
            publishedAt: new Date(),
          },
        });
      } catch (error) {
        console.warn('Homepage landing seed skipped:', error);
      }
    }

    const aboutLanding = await strapi.db.query('api::landing-page.landing-page').findOne({
      where: { slug: 've-chung-toi' },
    });

    if (!aboutLanding) {
      console.log('Seeding about landing page...');
      try {
        await strapi.documents('api::landing-page.landing-page').create({
          data: {
            title: 'Về Thăng Long Chè Việt',
            slug: 've-chung-toi',
            seoDescription: 'Câu chuyện về hành trình mang hương vị trà truyền thống đến mọi nhà.',
            blocks: [
              {
                __component: 'page-blocks.rich-text',
                container_width: 'Narrow',
                content:
                  '<p>Thăng Long Chè Việt được sinh ra với sứ mệnh bảo tồn và phát triển tinh hoa văn hoá trà Việt Nam.</p><p>Chúng tôi hợp tác trực tiếp với nông dân và nghệ nhân tại các vùng trà truyền thống.</p>',
              },
            ],
            publishedAt: new Date(),
          },
        });
      } catch (error) {
        console.warn('About landing seed skipped:', error);
      }
    }
    // Seeding logic cho Public Permissions
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (publicRole) {
      const permissionsToCreate = [
        { action: 'api::article.article.find', role: publicRole.id },
        { action: 'api::article.article.findOne', role: publicRole.id },
        { action: 'api::category.category.find', role: publicRole.id },
        { action: 'api::category.category.findOne', role: publicRole.id },
        { action: 'api::landing-page.landing-page.find', role: publicRole.id },
        { action: 'api::landing-page.landing-page.findOne', role: publicRole.id }
      ];
      for (const perm of permissionsToCreate) {
        const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action: perm.action, role: perm.role } });
        if (!exists) {
          await strapi.db.query('plugin::users-permissions.permission').create({ data: perm });
        }
      }
      console.log('Public permissions seeded successfully.');
    }

    // Warm hot API paths so the first storefront SSR request is not ~2s cold.
    warmStrapiApis(strapi);
  },
};

async function warmStrapiApis(strapi: Core.Strapi) {
  const port = strapi.config.get<number>('server.port', 1337);
  const host = strapi.config.get<string>('server.host', '0.0.0.0');
  const base =
    host === '0.0.0.0' || host === '::' ? `http://127.0.0.1:${port}` : `http://${host}:${port}`;

  const paths = [
    '/api/landing-pages?filters[slug][$eq]=home&status=published',
    '/api/articles?pagination[limit]=1&status=published',
  ];

  const deadline = Date.now() + 60_000;
  for (const path of paths) {
    while (Date.now() < deadline) {
      try {
        const start = Date.now();
        const res = await fetch(`${base}${path}`);
        if (res.ok) {
          console.log(`API warm-up ${path}: ${res.status} (${Date.now() - start}ms)`);
          break;
        }
      } catch {
        // Server not listening yet
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}
