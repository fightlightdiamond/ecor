import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Bọc mọi response thành envelope giống Laravel: `{ success: true, data }`.
 *
 * Quy tắc giữ contract cho apps/web (Nuxt):
 * - Nếu controller đã tự trả object có khoá `success` (ví dụ cần thêm `meta`
 *   phân trang như Laravel), giữ NGUYÊN — không bọc lại.
 * - Ngược lại bọc giá trị trả về vào `{ success: true, data }`.
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'success' in payload) {
          return payload;
        }
        return { success: true, data: payload ?? null };
      }),
    );
  }
}
