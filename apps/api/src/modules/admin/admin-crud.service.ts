import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { ADMIN_RESOURCES, AdminResourceDef, getResourceDef } from './admin-resources';

export interface ListParams {
  page: number;
  perPage: number;
  sort: string;
  order: 'asc' | 'desc';
  q?: string;
}

@Injectable()
export class AdminCrudService {
  constructor(private readonly prisma: PrismaService) {}

  /** Danh sách resource cho menu admin. */
  resources() {
    return Object.entries(ADMIN_RESOURCES).map(([name, def]) => ({
      name,
      label: def.label,
      group: def.group,
    }));
  }

  async list(resource: string, params: ListParams) {
    const def = this.def(resource);
    const delegate = this.delegate(def);
    const where =
      params.q && def.searchable.length
        ? { OR: def.searchable.map((f) => ({ [f]: { contains: params.q, mode: 'insensitive' } })) }
        : {};

    const [total, rows] = await this.prisma.$transaction([
      delegate.count({ where }),
      delegate.findMany({
        where,
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [params.sort]: params.order },
      }),
    ]);
    return { data: rows.map((r: any) => this.strip(def, r)), total };
  }

  async getOne(resource: string, id: number) {
    const def = this.def(resource);
    const row = await this.delegate(def).findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy bản ghi');
    return { data: this.strip(def, row) };
  }

  async create(resource: string, body: Record<string, any>) {
    const def = this.def(resource);
    const data = await this.prepare(def, body);
    const row = await this.delegate(def).create({ data });
    return { data: this.strip(def, row) };
  }

  async update(resource: string, id: number, body: Record<string, any>) {
    const def = this.def(resource);
    const data = await this.prepare(def, body, true);
    delete data.id;
    const row = await this.delegate(def).update({ where: { id }, data });
    return { data: this.strip(def, row) };
  }

  async remove(resource: string, id: number) {
    const def = this.def(resource);
    await this.delegate(def).delete({ where: { id } });
    return { data: { id } };
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private def(resource: string): AdminResourceDef {
    const def = getResourceDef(resource);
    if (!def) throw new NotFoundException(`Resource không hợp lệ: ${resource}`);
    return def;
  }

  private delegate(def: AdminResourceDef): any {
    const d = (this.prisma as any)[def.model];
    if (!d) throw new BadRequestException(`Model không tồn tại: ${def.model}`);
    return d;
  }

  private strip(def: AdminResourceDef, row: any) {
    if (!def.hidden.length) return row;
    const clone = { ...row };
    for (const f of def.hidden) delete clone[f];
    return clone;
  }

  /** Hash field nhạy cảm; bỏ field rỗng khi update (vd password để trống). */
  private async prepare(def: AdminResourceDef, body: Record<string, any>, isUpdate = false) {
    const data: Record<string, any> = { ...body };
    for (const f of def.hash) {
      if (data[f]) {
        data[f] = await bcrypt.hash(String(data[f]), 12);
      } else if (isUpdate) {
        delete data[f]; // không đổi mật khẩu nếu để trống
      }
    }
    return data;
  }
}
