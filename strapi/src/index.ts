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

    // Seeding logic cho Landing Page
    const landingCount = await strapi.db.query('api::landing-page.landing-page').count();
    if (landingCount === 0) {
      console.log('Seeding landing pages...');
      await strapi.db.query('api::landing-page.landing-page').create({
        data: {
          title: 'Về Thăng Long Chè Việt',
          slug: 've-chung-toi',
          seoDescription: 'Câu chuyện về hành trình mang hương vị trà truyền thống đến mọi nhà.',
          content: 'Thăng Long Chè Việt được sinh ra với sứ mệnh bảo tồn và phát triển tinh hoa văn hoá trà Việt Nam...',
          publishedAt: new Date()
        }
      });
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
  },
};
