import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { ADMIN_RESOURCES, AdminResourceDef, getResourceDef } from './admin-resources';

/**
 * Tập tên các cột BẮT BUỘC (non-null) của 1 model — gồm cả khoá ngoại vô hướng,
 * KHÔNG gồm quan hệ object/list. Dùng để không gửi `null` cho cột non-null
 * (vd price/stock/status có default) → để DB áp default thay vì lỗi ràng buộc.
 */
const REQUIRED_FIELDS_CACHE = new Map<string, Set<string>>();
function requiredFields(modelDelegate: string): Set<string> {
  const cached = REQUIRED_FIELDS_CACHE.get(modelDelegate);
  if (cached) return cached;
  const model = Prisma.dmmf.datamodel.models.find(
    (m) => m.name.toLowerCase() === modelDelegate.toLowerCase(),
  );
  const set = new Set<string>();
  for (const f of model?.fields ?? []) {
    if (f.relationName || f.isList) continue; // bỏ quan hệ object/mảng
    if (f.isRequired) set.add(f.name);
  }
  REQUIRED_FIELDS_CACHE.set(modelDelegate, set);
  return set;
}

/** Chuẩn hoá chuỗi (kể cả tiếng Việt có dấu) thành slug an toàn cho URL. */
function slugify(input: string): string {
  return String(input || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // bỏ dấu tổ hợp
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // ký tự lạ → gạch ngang
    .replace(/^-+|-+$/g, ''); // bỏ gạch ngang đầu/cuối
}

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
    await this.applySlug(def, data);
    const row = await this.delegate(def).create({ data });
    return { data: this.strip(def, row) };
  }

  async update(resource: string, id: number, body: Record<string, any>) {
    const def = this.def(resource);
    const data = await this.prepare(def, body, true);
    delete data.id;
    await this.applySlug(def, data, id);
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

  /**
   * Tự sinh `slug` (duy nhất) khi bỏ trống, lấy từ field nguồn def.slugFrom.
   * Nguồn có thể là chuỗi hoặc object đa ngôn ngữ ({ vi, en }).
   */
  private async applySlug(def: AdminResourceDef, data: Record<string, any>, currentId?: number) {
    if (!def.slugFrom) return;
    if (data.slug != null && String(data.slug).trim() !== '') return; // đã có slug → giữ nguyên
    const src = data[def.slugFrom];
    const base =
      src && typeof src === 'object' ? (src.vi ?? src.en ?? Object.values(src)[0]) : src;
    const root = slugify(String(base ?? '')) || 'muc';

    // đảm bảo duy nhất: thêm hậu tố -2, -3… nếu trùng (bỏ qua chính bản ghi đang sửa)
    const delegate = this.delegate(def);
    let slug = root;
    let n = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await delegate.findFirst({ where: { slug }, select: { id: true } });
      if (!existing || existing.id === currentId) break;
      n += 1;
      slug = `${root}-${n}`;
    }
    data.slug = slug;
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

    // Không gửi `null` cho cột BẮT BUỘC (non-null): bỏ key đó đi để
    //  - create: DB dùng giá trị default (vd price=0, stock=0, status='draft')
    //  - update: giữ nguyên giá trị cũ
    // Cột cho phép null vẫn nhận `null` bình thường.
    const required = requiredFields(def.model);
    for (const key of Object.keys(data)) {
      if (data[key] == null && required.has(key)) delete data[key];
    }

    return data;
  }
}
