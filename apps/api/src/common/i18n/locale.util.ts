export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export const DEFAULT_LOCALE = 'vi';

/**
 * Khớp App\Support\StorefrontLocale::translate.
 * Giá trị có thể là chuỗi JSON, object dịch {vi,en}, hoặc chuỗi thuần.
 * Thứ tự fallback: locale yêu cầu → vi → giá trị đầu tiên → ''.
 */
export function translate(value: unknown, locale: string): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    try {
      const decoded = JSON.parse(value);
      if (decoded && typeof decoded === 'object') {
        value = decoded;
      } else {
        return value;
      }
    } catch {
      return value;
    }
  }

  if (value && typeof value === 'object') {
    const map = value as Record<string, unknown>;
    if (locale in map) return map[locale];
    if ('vi' in map) return map['vi'];
    const first = Object.values(map)[0];
    return first ?? '';
  }

  return value;
}

/**
 * Khớp Product::localized($field, $locale):
 * translations[locale][field] ?? translations.vi[field] ?? fallbackField.
 */
export function localizedField(
  translations: unknown,
  field: string,
  locale: string,
  fallback: unknown,
): unknown {
  const t = (translations ?? {}) as Record<string, Record<string, unknown> | undefined>;
  return t[locale]?.[field] ?? t['vi']?.[field] ?? fallback ?? null;
}
