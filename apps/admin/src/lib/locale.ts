import { ref } from 'vue';

// Ngôn ngữ hiển thị của admin (mặc định Tiếng Việt), lưu localStorage.
const KEY = 'admin_locale';
export const currentLocale = ref<string>(localStorage.getItem(KEY) || 'vi');
export function setLocale(l: string) {
  currentLocale.value = l;
  localStorage.setItem(KEY, l);
}

/** Object đa ngôn ngữ? (vd { vi, en } hoặc nhiều hơn). */
export function isLocalizedObj(v: any): boolean {
  return v && typeof v === 'object' && !Array.isArray(v) && ('vi' in v || 'en' in v);
}

/** Lấy giá trị theo ngôn ngữ hiện tại, fallback vi → en → giá trị đầu. */
export function localeText(v: any, locale: string = currentLocale.value): any {
  if (!isLocalizedObj(v)) return v;
  return v[locale] ?? v.vi ?? v.en ?? Object.values(v)[0] ?? '';
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Hiển thị 1 ô (bảng/chi tiết) dễ đọc:
 * - localized → text theo ngôn ngữ hiện tại (không phải JSON)
 * - mảng → "N mục"
 * - object phức tạp → "—" (không dump JSON)
 * - rich text → bỏ thẻ HTML
 */
export function cellText(v: any, locale: string = currentLocale.value): string {
  if (v == null) return '';
  if (isLocalizedObj(v)) {
    const t = localeText(v, locale);
    return typeof t === 'object' ? cellText(t, locale) : stripHtml(String(t ?? ''));
  }
  if (Array.isArray(v)) return v.length ? `${v.length} mục` : '';
  if (typeof v === 'object') return '—';
  return stripHtml(String(v));
}
