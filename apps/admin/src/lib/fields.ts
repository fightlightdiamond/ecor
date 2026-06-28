export type FieldKind = 'bool' | 'number' | 'json' | 'date' | 'text';

export const READONLY = new Set(['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at', 'deletedAt']);

export function kindOf(v: unknown): FieldKind {
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number') return 'number';
  if (v && typeof v === 'object') return 'json';
  if (typeof v === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(v)) return 'date';
  return 'text';
}

export function editableKeys(row: Record<string, unknown>): string[] {
  return Object.keys(row).filter((k) => !READONLY.has(k));
}

export function displayCell(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  const s = String(v);
  return s.length > 80 ? s.slice(0, 80) + '…' : s;
}

/** Ép giá trị form về kiểu phù hợp trước khi gửi API. */
export function coerce(value: any, kind: FieldKind): any {
  if (kind === 'bool') return Boolean(value);
  if (kind === 'number') return value === '' || value == null ? null : Number(value);
  if (kind === 'json') {
    if (value === '' || value == null) return null;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return value; // để backend báo lỗi nếu sai
    }
  }
  return value === '' ? null : value;
}
