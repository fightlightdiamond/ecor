import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminCrudController } from './admin-crud.controller';
import { AdminCrudService } from './admin-crud.service';

/**
 * Admin REST API (/api/admin/*) — thay AdminJS. Phục vụ app React `apps/admin`
 * (Refine + Tailwind). Auth qua bảng User (is_admin) + JWT type='admin'.
 */
@Module({
  controllers: [AdminAuthController, AdminCrudController],
  providers: [AdminAuthService, AdminCrudService],
})
export class AdminModule {}
