import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { SiteSettingsService } from './site-settings.service';

@ApiTags('Admin / Site Settings')
@UseGuards(AdminGuard)
@Controller('admin/site-settings')
export class SiteSettingsController {
  constructor(private readonly settings: SiteSettingsService) {}

  /** Toàn bộ khối nội dung site (settings/team/services/gallery/testimonials). */
  @Get()
  async getAll() {
    return { success: true, data: await this.settings.getAll() };
  }

  /** Cập nhật nội dung 1 khối. Body: { content: <any JSON> } */
  @Put(':key')
  async put(@Param('key') key: string, @Body() body: { content: any }) {
    return { success: true, data: await this.settings.put(key, body?.content ?? {}) };
  }
}
