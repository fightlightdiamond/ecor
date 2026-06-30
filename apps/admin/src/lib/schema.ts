// Field-schema cho form admin: nhãn tiếng Việt + loại input phù hợp cho từng
// field/resource. Thay cách render JSON thô bằng input đúng kiểu.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'datetime'
  | 'select'
  | 'richtext'
  | 'localized' // { vi, en } — text
  | 'localizedRich' // { vi, en } — rich text
  | 'image' // 1 URL ảnh
  | 'images' // mảng URL ảnh
  | 'color' // mã màu (color picker)
  | 'icon' // chọn icon từ danh sách trực quan (lưu tên icon)
  | 'relation' // chọn bản ghi từ resource khác (vd danh mục)
  | 'tags' // nhập text cách nhau bởi dấu phẩy → lưu mảng JSON
  | 'json'
  | 'hidden';

export interface FieldConfig {
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  readonly?: boolean;
  required?: boolean;
  hint?: string; // tooltip hướng dẫn
  relation?: { resource: string; for?: string }; // cho type 'relation'
  col?: 'left' | 'right'; // ép cột bố cục (override mặc định theo type)
  defaultValue?: any; // giá trị điền sẵn khi TẠO MỚI (vd status = 'published')
}

/** Trường ảo (không phải cột) — map vào path lồng của 1 cột JSON. */
export interface VirtualField {
  key: string;
  label: string;
  type: FieldType;
  path: string; // vd 'meta.image'
  required?: boolean;
  hint?: string;
  defaultValue?: any;
  readonly?: boolean;
}

/** Cột text-nhiều (trái 2/3) vs cấu hình (phải 1/3). */
export function column(type: FieldType): 'left' | 'right' {
  return ['richtext', 'localizedRich', 'localized', 'textarea', 'json', 'images'].includes(type)
    ? 'left'
    : 'right';
}

export function getPath(obj: any, path: string): any {
  return path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);
}
export function setPath(obj: any, path: string, val: any) {
  const ks = path.split('.');
  let cur = obj;
  for (let i = 0; i < ks.length - 1; i++) {
    if (typeof cur[ks[i]] !== 'object' || cur[ks[i]] == null) cur[ks[i]] = {};
    cur = cur[ks[i]];
  }
  cur[ks[ks.length - 1]] = val;
}

const opts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

// Nhãn tiếng Việt dùng chung (fix việc label = tên cột DB).
const LABELS: Record<string, string> = {
  id: 'ID', name: 'Tên', slug: 'Slug', title: 'Tiêu đề', description: 'Mô tả',
  shortDescription: 'Mô tả ngắn', body: 'Nội dung', price: 'Giá', stock: 'Tồn kho',
  sku: 'Mã sản phẩm (SKU)', status: 'Trạng thái', categoryId: 'Danh mục (ID)', images: 'Hình ảnh',
  customFields: 'Thông tin thêm', translations: 'Bản dịch', email: 'Email', phone: 'Điện thoại',
  phoneDisplay: 'SĐT hiển thị', mobile: 'Di động', address: 'Địa chỉ', isPublished: 'Đã xuất bản',
  isTrend: 'Nổi bật', isActive: 'Kích hoạt', isApproved: 'Đã duyệt', isRead: 'Đã đọc',
  isAdmin: 'Quản trị viên', showInMenu: 'Hiện trên menu', publishedAt: 'Ngày xuất bản',
  createdAt: 'Ngày tạo', updatedAt: 'Ngày cập nhật', deletedAt: 'Ngày xoá', rating: 'Số sao',
  comment: 'Bình luận', code: 'Mã', type: 'Loại', value: 'Giá trị', startsAt: 'Bắt đầu',
  expiresAt: 'Hết hạn', quantity: 'Số lượng', qty: 'Số lượng', totalPrice: 'Tổng tiền',
  shippingFee: 'Phí ship', taxFee: 'Thuế', customerName: 'Tên khách', customerPhone: 'SĐT khách',
  customerEmail: 'Email khách', paymentMethod: 'Phương thức TT', paymentStatus: 'Trạng thái TT',
  paymentMeta: 'Dữ liệu TT', shippingAddress: 'Địa chỉ giao', number: 'Mã đơn', notes: 'Ghi chú', note: 'Ghi chú',
  scheduledAt: 'Thời gian hẹn', service: 'Dịch vụ', metadata: 'Thông tin thêm', source: 'Nguồn',
  preferredAt: 'Thời gian mong muốn', subject: 'Tiêu đề', message: 'Nội dung', priority: 'Ưu tiên',
  key: 'Khoá', label: 'Nhãn', content: 'Nội dung', meta: 'Meta', keywords: 'Từ khoá',
  metaUrl: 'Meta URL', metaRedirect: 'Meta redirect', likes: 'Lượt thích', views: 'Lượt xem',
  location: 'Vị trí', userId: 'Người dùng (ID)', customerId: 'Khách (ID)', productId: 'Sản phẩm (ID)',
  productVariantId: 'Biến thể (ID)', orderId: 'Đơn (ID)', cartId: 'Giỏ (ID)', ticketId: 'Ticket (ID)',
  appointmentId: 'Lịch hẹn (ID)', sessionId: 'Phiên', staffId: 'Nhân viên (ID)', teamId: 'Team (ID)',
  parentId: 'Cha (ID)', senderId: 'Người gửi (ID)', receiverId: 'Người nhận (ID)', changedBy: 'Người đổi (ID)',
  avatarUrl: 'Avatar', icon: 'Icon', color: 'Màu', tagline: 'Slogan', authorId: 'Tác giả (ID)',
  authorType: 'Loại tác giả', trackingNumber: 'Mã vận đơn', carrier: 'Đơn vị VC', for: 'Dùng cho',
  // Cấu hình website (settings)
  site: 'Website', contact: 'Liên hệ', social: 'Mạng xã hội', hours: 'Giờ mở cửa', hero: 'Hero (banner)',
  promo: 'Khuyến mãi', skills: 'Kỹ năng', discoverServices: 'Dịch vụ nổi bật', days: 'Ngày', time: 'Giờ',
  eyebrow: 'Nhãn trên', commitment: 'Cam kết', slides: 'Slide', heading: 'Tiêu đề', subheading: 'Mô tả',
  badge: 'Nhãn', percent: 'Phần trăm', overlayOpacity: 'Độ mờ lớp phủ', discount: 'Giảm giá', expiry: 'Hết hạn',
  backgroundImage: 'Ảnh nền', backgroundColor: 'Màu nền', coordinates: 'Toạ độ', lat: 'Vĩ độ', lng: 'Kinh độ',
  mapEmbed: 'Bản đồ nhúng', phoneDisplay: 'SĐT hiển thị', imageAlt: 'Alt ảnh', active: 'Kích hoạt',
  image: 'Ảnh', members: 'Thành viên', items: 'Mục', category: 'Nhóm', duration: 'Thời lượng',
  featured: 'Nổi bật', specialties: 'Chuyên môn', role: 'Vai trò', bio: 'Tiểu sử', quote: 'Trích dẫn',
  author: 'Tác giả', position: 'Vị trí',
};

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function labelOf(key: string): string {
  return LABELS[key] ?? humanize(key);
}

// Cấu hình riêng theo resource (chỉ nơi cần override loại input/options).
const SCHEMA: Record<string, Record<string, Partial<FieldConfig>>> = {
  post: {
    title: { type: 'localized', required: true },
    shortDescription: { type: 'localized' },
    body: { type: 'localizedRich' },
    type: { type: 'select', options: opts(['post', 'page', 'news', 'guide']) },
    categoryId: { type: 'relation', label: 'Danh mục', relation: { resource: 'category', for: 'posts' } },
    isPublished: { type: 'boolean' },
    isTrend: { type: 'boolean' },
    publishedAt: { type: 'datetime' },
    likes: { type: 'number' },
    views: { type: 'number' },
    keywords: { type: 'tags', hint: 'Nhập từ khoá SEO, cách nhau bởi dấu phẩy (vd: trà, quà tặng).' },
    meta: { type: 'json', hint: 'Dữ liệu phụ dạng JSON (ảnh, SEO…). Thường không cần sửa tay.' },
    metaUrl: { type: 'text', hint: 'Đường dẫn tuỳ chỉnh (canonical/permalink) cho bài viết.' },
    metaRedirect: { type: 'text', hint: 'Chuyển hướng (301) bài viết này sang URL khác.' },
    authorId: { type: 'hidden' },
    authorType: { type: 'hidden' },
  },
  product: {
    images: { type: 'images', required: true, hint: 'Ảnh đầu tiên là ảnh đại diện. Bắt buộc ≥ 1 ảnh.' },
    name: { type: 'text', required: true },
    description: { type: 'richtext' },
    translations: { type: 'hidden' }, // ẩn bản dịch
    customFields: { type: 'json' },
    sku: { type: 'text', hint: 'Mã định danh sản phẩm để quản lý kho (tự đặt, không trùng nhau). Có thể để trống.' },
    price: { type: 'number' },
    priceUnit: {
      type: 'select',
      label: 'Đơn vị tiền tệ',
      options: [
        { value: 'k', label: 'k (nghìn — ×1.000)' },
        { value: 'M', label: 'M (triệu — ×1.000.000)' },
        { value: 'B', label: 'B (tỷ — ×1.000.000.000)' },
        { value: '$', label: '$ (USD)' },
        { value: 'VND', label: 'VND (đồng)' },
      ],
      defaultValue: 'VND',
      hint: 'Đơn vị/định dạng tiền cho giá. k/M/B là bội số nghìn/triệu/tỷ; $ là USD; VND là đồng.',
    },
    stock: { type: 'number' },
    status: { type: 'select', options: opts(['draft', 'published']), defaultValue: 'published' },
    categoryId: { type: 'relation', label: 'Danh mục', relation: { resource: 'category', for: 'products' } },
  },
  productVariant: { price: { type: 'number' }, stock: { type: 'number' } },
  category: {
    // Cột trái (thông tin chính)
    name: { type: 'localized', col: 'left', required: true },
    slug: { type: 'text', col: 'left', hint: 'Định danh duy nhất trên URL (vd: tra-xanh), không dấu, dùng gạch ngang.' },
    description: { type: 'localized', col: 'left' },
    parentId: {
      type: 'relation',
      label: 'Danh mục cha',
      relation: { resource: 'category' },
      col: 'right',
      hint: 'Chọn danh mục cha để tạo cấu trúc cây. Để trống nếu là danh mục gốc.',
    },
    for: {
      type: 'select',
      label: 'Dùng cho',
      options: [
        { value: 'posts', label: 'Bài viết' },
        { value: 'products', label: 'Sản phẩm' },
      ],
      col: 'right',
    },
    // Cột phải (hiển thị / phân loại)
    teamId: {
      type: 'relation',
      label: 'Nhóm (Team)',
      relation: { resource: 'team' },
      col: 'right',
      hint: 'Nhóm/đơn vị sở hữu danh mục. Có thể để trống.',
    },
    color: { type: 'color', col: 'right', },
    icon: { type: 'icon' },
    type: { type: 'hidden' },
    isActive: { type: 'boolean' },
    showInMenu: { type: 'boolean' },
  },
  review: { rating: { type: 'number' }, isApproved: { type: 'boolean' } },
  coupon: {
    type: { type: 'select', options: opts(['fixed', 'percent']) },
    value: { type: 'number' },
    startsAt: { type: 'datetime' },
    expiresAt: { type: 'datetime' },
    isActive: { type: 'boolean' },
  },
  order: {
    status: { type: 'select', options: opts(['new', 'processing', 'shipped', 'delivered', 'cancelled']) },
    paymentMethod: { type: 'select', options: opts(['cod', 'vnpay']) },
    paymentStatus: { type: 'select', options: opts(['pending', 'paid', 'failed']) },
    totalPrice: { type: 'number' },
    shippingFee: { type: 'number' },
    taxFee: { type: 'number' },
    paymentMeta: { type: 'json' },
    shippingAddress: { type: 'textarea' },
  },
  orderItem: { qty: { type: 'number' }, price: { type: 'number' } },
  appointment: {
    scheduledAt: { type: 'datetime' },
    status: { type: 'select', options: opts(['pending', 'confirmed', 'completed', 'cancelled']) },
    metadata: { type: 'json' },
    notes: { type: 'textarea' },
  },
  contactInquiry: {
    // ── Thông tin do KHÁCH điền → chỉ đọc (admin không sửa) ──
    name: { readonly: true },
    phone: { readonly: true },
    email: { readonly: true },
    service: { readonly: true },
    type: {
      type: 'select',
      label: 'Loại',
      readonly: true,
      options: [
        { value: 'contact', label: 'Liên hệ' },
        { value: 'booking', label: 'Đặt lịch' },
      ],
    },
    // ── Admin quản lý ──
    status: {
      type: 'select',
      label: 'Trạng thái xử lý',
      options: [
        { value: 'new', label: 'Mới' },
        { value: 'contacted', label: 'Đã liên hệ' },
        { value: 'consulting', label: 'Đang tư vấn' },
        { value: 'done', label: 'Hoàn tất' },
        { value: 'cancelled', label: 'Huỷ' },
      ],
      defaultValue: 'new',
      hint: 'Trạng thái xử lý của liên hệ này (cập nhật khi đã liên hệ/tư vấn xong).',
    },
    source: { type: 'text', label: 'Nguồn', readonly: true, hint: 'Nguồn phát sinh liên hệ (vd: website, booking-form, facebook…).' },
    preferredAt: { type: 'datetime', readonly: false },
    message: { type: 'textarea', label: 'Nội dung liên hệ', readonly: true, hint: 'Nội dung khách gửi qua form liên hệ/đặt lịch.' },
    note: {
      type: 'textarea',
      label: 'Ghi chú sau tư vấn',
      hint: 'Ghi lại nội dung/diễn biến sau khi đã liên hệ và tư vấn cho khách.',
    },
    // metadata được nhập qua các trường ảo bên dưới → tự gói thành JSON khi lưu.
    metadata: { type: 'hidden' },
  },
  ticket: {
    status: { type: 'select', options: opts(['open', 'pending', 'resolved', 'closed']) },
    priority: { type: 'select', options: opts(['low', 'normal', 'high']) },
    message: { type: 'textarea' },
  },
  ticketResponse: { message: { type: 'textarea' } },
  message: { content: { type: 'textarea' }, isRead: { type: 'boolean' } },
  customer: { password: { type: 'text' } },
  user: { isAdmin: { type: 'boolean' }, password: { type: 'text' }, avatarUrl: { type: 'image' } },
  storefrontSection: { content: { type: 'json' } },
};

/** Trường ảo theo resource (vd thumbnail bài viết lưu trong meta.image). */
const VIRTUAL: Record<string, VirtualField[]> = {
  post: [
    {
      key: '__thumbnail',
      label: 'Ảnh đại diện (thumbnail)',
      type: 'image',
      path: 'meta.image',
      hint: 'Ảnh hiển thị ở danh sách/bài viết. Lưu vào meta.image.',
    },
  ],
  // "Thông tin thêm" của liên hệ → các trường rõ ràng, lưu gói vào metadata (JSON).
  contactInquiry: [
    { key: '__preferredTime', label: 'Giờ khách mong muốn', type: 'text', path: 'metadata.preferred_time', readonly: true },
    { key: '__staffId', label: 'Nhân viên phụ trách (ID)', type: 'number', path: 'metadata.staff_id', readonly: true },
    { key: '__staffName', label: 'Nhân viên phụ trách', type: 'text', path: 'metadata.staff_name', },
    {
      key: '__appointmentId',
      label: 'Mã lịch hẹn liên kết',
      type: 'text',
      path: 'metadata.appointment_id',
      hint: 'ID lịch hẹn tạo từ form đặt lịch (nếu có). Thường không cần sửa.',
      // defaultValue: get ramdom string
      defaultValue: Math.random().toString(36).substring(2, 10),
    },
  ],
};

export function getVirtual(resource: string): VirtualField[] {
  return VIRTUAL[resource] ?? [];
}

/** URL ảnh thumbnail của 1 bản ghi (ưu tiên images[0] → image → meta.image → avatarUrl). */
export function rowThumbnail(row: any): string | null {
  if (Array.isArray(row?.images) && typeof row.images[0] === 'string') return row.images[0];
  if (typeof row?.image === 'string' && row.image) return row.image;
  if (row?.meta && typeof row.meta.image === 'string') return row.meta.image;
  if (typeof row?.avatarUrl === 'string' && row.avatarUrl) return row.avatarUrl;
  return null;
}

/** Resource có cột ảnh thumbnail trên danh sách không (dựa trên field image/images/virtual). */
export function listShowsThumbnail(resource: string): boolean {
  const fields = SCHEMA[resource];
  if (fields && Object.values(fields).some((f) => f.type === 'image' || f.type === 'images')) return true;
  return getVirtual(resource).some((v) => v.type === 'image');
}

// ── Cột hiển thị trên BẢNG DANH SÁCH theo resource ────────────────────────
// Khai báo đúng cột + thứ tự muốn hiện (tên = key trường trong bản ghi).
// KHÔNG khai báo → tự suy ra (7 cột đầu, bỏ field 'hidden').
const LIST_COLUMNS: Record<string, string[]> = {
  product: ['name', 'price', 'priceUnit', 'stock', 'status', 'sku'],
  contactInquiry: ['name', 'phone', 'type', 'source', 'status', 'createdAt'],
};

export function getListColumns(resource: string): string[] | undefined {
  return LIST_COLUMNS[resource];
}

// Resource KHÔNG cho tạo mới từ admin (vd liên hệ — chỉ phát sinh từ khách).
const NO_CREATE = new Set<string>(['contactInquiry']);
export function canCreate(resource: string): boolean {
  return !NO_CREATE.has(resource);
}

// ── Bố cục tuỳ biến theo resource ─────────────────────────────────────────
// Mỗi hàng (Row) là mảng field key (1 hoặc 2 ô/hàng). Token '__options' = hộp
// các trường boolean (Tuỳ chọn).
//  - Dạng Row[]        → 1 cột full, các ô ghép theo hàng.
//  - Dạng { left,right } → 2 cột: trái 2/3 (nội dung) + phải 1/3 (cấu hình).
export const OPTIONS_TOKEN = '__options';
export type LayoutRow = string[];
export type ResourceLayout = LayoutRow[] | { left: LayoutRow[]; right: LayoutRow[] };

const LAYOUT: Record<string, ResourceLayout> = {
  category: {
    left: [
      ['name', 'slug'],
      ['description'],
      [OPTIONS_TOKEN],
    ],
    right: [['for'], ['parentId'], ['teamId', 'color'], ['icon'],],
  },
  // Giống trang chi tiết sản phẩm: trái = ảnh (gallery) + mô tả; phải = thông tin.
  product: {
    left: [['images'], ['description']],
    right: [['name'], ['sku'], ['categoryId', 'status'], ['price', 'priceUnit'], ['stock'],],
  },
  post: {
    left: [['title'], ['shortDescription', 'keywords'], ['body']],
    right: [ ['__thumbnail'], ['isPublished', 'isTrend'], ['type'], ['categoryId'], ['likes', 'views'], ['publishedAt'], ['metaUrl'], ['metaRedirect']],
  },
  contactInquiry: {
    left: [['name'], ['phone', 'email'], ['message'], ['note']],
    right: [[ 'source', 'type'], ['status'], ['preferredAt'], ['__staffName'], ['__appointmentId']],
  },
};

export function getLayout(resource: string): ResourceLayout | undefined {
  return LAYOUT[resource];
}

export function resolveField(resource: string, key: string, value: unknown): FieldConfig {
  const o = SCHEMA[resource]?.[key];
  return {
    label: o?.label ?? labelOf(key),
    type: o?.type ?? infer(value),
    options: o?.options,
    readonly: o?.readonly,
    required: o?.required,
    hint: o?.hint,
    relation: o?.relation,
    col: o?.col,
    defaultValue: o?.defaultValue,
  };
}

function isLocalized(v: any): boolean {
  return v && typeof v === 'object' && !Array.isArray(v) && ('vi' in v || 'en' in v);
}
function infer(v: unknown): FieldType {
  if (typeof v === 'boolean') return 'boolean';
  if (typeof v === 'number') return 'number';
  if (v && typeof v === 'object') return isLocalized(v) ? 'localized' : 'json';
  if (typeof v === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(v)) return 'datetime';
  return 'text';
}

// ── init / compose giá trị theo loại ──────────────────────────────────────
export function initValue(type: FieldType, raw: any): any {
  switch (type) {
    case 'localized':
    case 'localizedRich':
      return raw && typeof raw === 'object' ? { vi: raw.vi ?? '', en: raw.en ?? '' } : { vi: '', en: '' };
    case 'richtext':
    case 'image':
    case 'color':
    case 'relation':
      return raw ?? '';
    case 'images':
      return Array.isArray(raw) ? raw.map((x) => String(x)) : [];
    case 'tags':
      // mảng → "a, b, c"; chuỗi (vd JSON string) → thử parse rồi nối, fallback giữ nguyên
      if (Array.isArray(raw)) return raw.map((x) => String(x)).join(', ');
      if (typeof raw === 'string' && raw.trim().startsWith('[')) {
        try {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) return arr.map((x) => String(x)).join(', ');
        } catch {
          /* giữ nguyên chuỗi */
        }
      }
      return raw ?? '';
    case 'datetime':
      return raw ?? ''; // ISO — VueDatePicker (model-type="iso")
    case 'boolean':
      return !!raw;
    case 'number':
      return raw ?? '';
    case 'json':
      return raw != null ? JSON.stringify(raw, null, 2) : '';
    default:
      return raw ?? '';
  }
}

/** Kiểm tra 1 giá trị có "rỗng" theo loại field (dùng cho validate bắt buộc). */
export function isFieldEmpty(type: FieldType, val: any): boolean {
  if (type === 'images') return !(Array.isArray(val) && val.filter(Boolean).length);
  if (type === 'localized' || type === 'localizedRich') {
    return !(val && (String(val.vi ?? '').trim() || String(val.en ?? '').trim()));
  }
  if (type === 'boolean') return false; // boolean luôn có giá trị
  if (type === 'tags') return !String(val ?? '').trim();
  return val === '' || val == null;
}

export function composeValue(type: FieldType, val: any): any {
  switch (type) {
    case 'localized':
    case 'localizedRich':
      return { vi: val?.vi ?? '', en: val?.en ?? '' };
    case 'richtext':
    case 'image':
    case 'color':
      return val === '' ? null : val;
    case 'images':
      return Array.isArray(val) ? val.map((x) => String(x).trim()).filter(Boolean) : [];
    case 'tags':
      // "trà, quà tặng" → ["trà","quà tặng"] (mảng JSON). Rỗng → [].
      if (Array.isArray(val)) return val.map((x) => String(x).trim()).filter(Boolean);
      return String(val ?? '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
    case 'datetime':
      return val ? new Date(val).toISOString() : null;
    case 'boolean':
      return !!val;
    case 'number':
    case 'relation':
      return val === '' || val == null ? null : Number(val);
    case 'json':
      return val === '' || val == null ? null : JSON.parse(val);
    default:
      return val === '' ? null : val;
  }
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Giá trị tự gán khi TẠO mới (vd tác giả = người đang đăng nhập). */
export function autofill(resource: string, identity: { id?: number } | null | undefined): Record<string, any> {
  if (resource === 'post') {
    return { authorId: identity?.id ?? null, authorType: 'App\\Models\\User' };
  }
  return {};
}
