import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, readdirSync, renameSync, statSync, unlinkSync } from 'fs';
import { basename, extname, join, resolve, sep } from 'path';
import { randomUUID } from 'crypto';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif|bmp|heic|heif)$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v|avi|mkv)$/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|aac|flac|oga)$/i;
const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|txt|csv)$/i;

function mediaType(name: string): 'image' | 'video' | 'audio' | 'file' {
  if (IMAGE_EXT.test(name)) return 'image';
  if (VIDEO_EXT.test(name)) return 'video';
  if (AUDIO_EXT.test(name)) return 'audio';
  return 'file';
}
function isMedia(name: string): boolean {
  return IMAGE_EXT.test(name) || VIDEO_EXT.test(name) || AUDIO_EXT.test(name) || DOC_EXT.test(name);
}

/** Base URL công khai cho media (qua reverse proxy nếu có API_PUBLIC_URL). */
function publicBase(): string {
  return process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
}

/**
 * Resolve đường dẫn tương đối bên trong UPLOAD_DIR; trả về abs path hoặc null
 * nếu vượt ra ngoài (chống path traversal). Cho phép cả thư mục lẫn file.
 */
function resolveSafe(rel: string | undefined): string | null {
  const cleaned = String(rel || '').replace(/\\/g, '/');
  if (cleaned.split('/').some((s) => s === '..')) return null;
  const root = resolve(UPLOAD_DIR);
  const abs = resolve(join(UPLOAD_DIR, cleaned));
  if (abs !== root && !abs.startsWith(root + sep)) return null;
  return abs;
}

/** Chuẩn hoá tên 1 thư mục (slug an toàn cho URL, bỏ dấu tiếng Việt). */
function slugSegment(name: string): string {
  return String(name || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@ApiTags('Admin / Media')
@UseGuards(AdminGuard)
@Controller('admin/upload')
export class AdminUploadController {
  // ── Upload 1 file (ảnh/video/media) vào thư mục `folder` ──────────────────
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, _file: any, cb: any) => {
          const dir = resolveSafe(req.query?.folder);
          if (!dir) return cb(new BadRequestException('Thư mục không hợp lệ'), '');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req: any, file: any, cb: any) =>
          cb(null, `${randomUUID()}${extname(file.originalname)}`),
      }),
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (đủ cho video ngắn)
      fileFilter: (_req: any, file: any, cb: any) => {
        const ok = /^(image|video|audio)\//.test(file.mimetype) || isMedia(file.originalname);
        if (ok) return cb(null, true);
        cb(new BadRequestException('Chỉ chấp nhận ảnh/video/media.'));
      },
    }),
  )
  upload(@UploadedFile() file?: any, @Query('folder') folder?: string) {
    if (!file) throw new BadRequestException('Thiếu file hợp lệ');
    const relDir = String(folder || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const urlPath = [relDir, file.filename].filter(Boolean).join('/');
    return { success: true, url: `${publicBase()}/uploads/${urlPath}`, type: mediaType(file.filename) };
  }

  // ── Liệt kê thư mục con + media trong 1 thư mục ───────────────────────────
  @Get()
  list(@Query('folder') folder?: string) {
    const dir = resolveSafe(folder);
    if (!dir) throw new BadRequestException('Thư mục không hợp lệ');
    const relDir = String(folder || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    if (!existsSync(dir)) return { success: true, data: { folder: relDir, folders: [], files: [] } };

    const base = publicBase();
    const entries = readdirSync(dir, { withFileTypes: true });
    const folders = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    const files = entries
      .filter((e) => e.isFile() && isMedia(e.name))
      .map((e) => {
        const st = statSync(join(dir, e.name));
        const urlPath = [relDir, e.name].filter(Boolean).join('/');
        return {
          name: e.name,
          url: `${base}/uploads/${urlPath}`,
          path: urlPath,
          type: mediaType(e.name),
          size: st.size,
          mtime: st.mtimeMs,
        };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .map(({ mtime: _mtime, ...r }) => r);

    return { success: true, data: { folder: relDir, folders, files } };
  }

  // ── Tạo thư mục con ───────────────────────────────────────────────────────
  @Post('folder')
  createFolder(@Body() body: { parent?: string; name?: string }) {
    const seg = slugSegment(body?.name || '');
    if (!seg) throw new BadRequestException('Tên thư mục không hợp lệ');
    const parent = String(body?.parent || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const rel = [parent, seg].filter(Boolean).join('/');
    const dir = resolveSafe(rel);
    if (!dir) throw new BadRequestException('Đường dẫn không hợp lệ');
    mkdirSync(dir, { recursive: true });
    return { success: true, data: { folder: rel } };
  }

  // ── Xoá 1 file media ──────────────────────────────────────────────────────
  @Delete()
  remove(@Query('path') path?: string) {
    const abs = resolveSafe(path);
    if (!abs || !existsSync(abs) || !statSync(abs).isFile()) {
      throw new BadRequestException('File không hợp lệ');
    }
    unlinkSync(abs);
    return { success: true, data: { path } };
  }

  // ── Di chuyển 1 file sang thư mục khác (kéo-thả) ──────────────────────────
  @Post('move')
  move(@Body() body: { from?: string; toFolder?: string }) {
    const src = resolveSafe(body?.from);
    const destDir = resolveSafe(body?.toFolder);
    if (!src || !existsSync(src) || !statSync(src).isFile()) {
      throw new BadRequestException('File nguồn không hợp lệ');
    }
    if (!destDir) throw new BadRequestException('Thư mục đích không hợp lệ');
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

    const name = basename(src);
    const dest = join(destDir, name);
    if (dest === src) return { success: true, data: { path: body.from } }; // cùng chỗ → bỏ qua
    renameSync(src, dest);

    const relDir = String(body.toFolder || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const relPath = [relDir, name].filter(Boolean).join('/');
    return { success: true, data: { path: relPath, url: `${publicBase()}/uploads/${relPath}` } };
  }
}
