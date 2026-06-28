import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { AdminCrudService } from './admin-crud.service';

@ApiTags('Admin / CRUD')
@UseGuards(AdminGuard)
@Controller('admin/resources')
export class AdminCrudController {
  constructor(private readonly crud: AdminCrudService) {}

  /** Danh sách resource cho menu admin. */
  @Get()
  resources() {
    return { success: true, data: this.crud.resources() };
  }

  @Get(':resource')
  async list(
    @Param('resource') resource: string,
    @Query('page') page = '1',
    @Query('perPage') perPage = '25',
    @Query('sort') sort = 'id',
    @Query('order') order = 'desc',
    @Query('q') q?: string,
  ) {
    const result = await this.crud.list(resource, {
      page: Math.max(1, parseInt(page, 10) || 1),
      perPage: Math.min(200, Math.max(1, parseInt(perPage, 10) || 25)),
      sort: sort || 'id',
      order: order === 'asc' ? 'asc' : 'desc',
      q: q || undefined,
    });
    return { success: true, ...result };
  }

  @Get(':resource/:id')
  async getOne(@Param('resource') resource: string, @Param('id', ParseIntPipe) id: number) {
    return { success: true, ...(await this.crud.getOne(resource, id)) };
  }

  @Post(':resource')
  async create(@Param('resource') resource: string, @Body() body: Record<string, any>) {
    return { success: true, ...(await this.crud.create(resource, body)) };
  }

  @Patch(':resource/:id')
  async update(
    @Param('resource') resource: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, any>,
  ) {
    return { success: true, ...(await this.crud.update(resource, id, body)) };
  }

  @Delete(':resource/:id')
  async remove(@Param('resource') resource: string, @Param('id', ParseIntPipe) id: number) {
    return { success: true, ...(await this.crud.remove(resource, id)) };
  }
}
