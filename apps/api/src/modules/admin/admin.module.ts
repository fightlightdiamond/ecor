import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminCrudController } from './admin-crud.controller';
import { AdminCrudService } from './admin-crud.service';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';
import { AdminUploadController } from './admin-upload.controller';

/**
 * Admin REST API (/api/admin/*) — thay AdminJS. Phục vụ SPA Vue `apps/admin`.
 * Auth qua bảng User (is_admin) + JWT type='admin'.
 */
@Module({
  controllers: [AdminAuthController, AdminCrudController, SiteSettingsController, AdminUploadController],
  providers: [AdminAuthService, AdminCrudService, SiteSettingsService],
})
export class AdminModule {}
