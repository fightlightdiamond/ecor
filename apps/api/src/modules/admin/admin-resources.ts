/**
 * Khai báo các resource admin (thay auto-CRUD của Filament/AdminJS).
 * model = tên delegate của Prisma client (camelCase).
 */
export interface AdminResourceDef {
  model: string; // prisma delegate, vd prisma.product
  label: string;
  group: string;
  searchable: string[]; // field string để search `q`
  hidden: string[]; // field ẩn khỏi response (vd password)
  hash: string[]; // field cần bcrypt khi tạo/sửa
  slugFrom?: string; // field nguồn để tự sinh `slug` khi bỏ trống (vd 'name' | 'title')
}

export const ADMIN_RESOURCES: Record<string, AdminResourceDef> = {
  product: { model: 'product', label: 'Sản phẩm', group: 'Catalog', searchable: ['name', 'slug', 'sku'], hidden: [], hash: [], slugFrom: 'name' },
  productVariant: { model: 'productVariant', label: 'Biến thể', group: 'Catalog', searchable: ['name', 'sku'], hidden: [], hash: [] },
  category: { model: 'category', label: 'Danh mục', group: 'Catalog', searchable: ['slug'], hidden: [], hash: [], slugFrom: 'name' },
  review: { model: 'review', label: 'Đánh giá', group: 'Catalog', searchable: ['comment'], hidden: [], hash: [] },
  warehouse: { model: 'warehouse', label: 'Kho', group: 'Catalog', searchable: ['name', 'location'], hidden: [], hash: [] },
  media: { model: 'media', label: 'Media', group: 'Catalog', searchable: ['name', 'path'], hidden: [], hash: [] },
  post: { model: 'post', label: 'Bài viết', group: 'Content', searchable: ['slug'], hidden: [], hash: [], slugFrom: 'title' },
  storefrontSection: { model: 'storefrontSection', label: 'Khối nội dung', group: 'Content', searchable: ['key', 'label'], hidden: [], hash: [] },
  order: { model: 'order', label: 'Đơn hàng', group: 'Sales', searchable: ['number', 'customerName', 'customerPhone'], hidden: [], hash: [] },
  orderItem: { model: 'orderItem', label: 'Dòng đơn', group: 'Sales', searchable: [], hidden: [], hash: [] },
  coupon: { model: 'coupon', label: 'Mã giảm giá', group: 'Sales', searchable: ['code'], hidden: [], hash: [] },
  cart: { model: 'cart', label: 'Giỏ hàng', group: 'Sales', searchable: ['sessionId'], hidden: [], hash: [] },
  cartItem: { model: 'cartItem', label: 'Dòng giỏ', group: 'Sales', searchable: [], hidden: [], hash: [] },
  customer: { model: 'customer', label: 'Khách hàng', group: 'CRM', searchable: ['name', 'phone', 'email'], hidden: ['password'], hash: ['password'] },
  appointment: { model: 'appointment', label: 'Lịch hẹn', group: 'CRM', searchable: ['customerName', 'customerPhone', 'service'], hidden: [], hash: [] },
  appointmentStatusHistory: { model: 'appointmentStatusHistory', label: 'Lịch sử lịch hẹn', group: 'CRM', searchable: [], hidden: [], hash: [] },
  contactInquiry: { model: 'contactInquiry', label: 'Liên hệ', group: 'CRM', searchable: ['name', 'phone', 'email'], hidden: [], hash: [] },
  ticket: { model: 'ticket', label: 'Ticket', group: 'Support', searchable: ['subject'], hidden: [], hash: [] },
  ticketResponse: { model: 'ticketResponse', label: 'Phản hồi ticket', group: 'Support', searchable: [], hidden: [], hash: [] },
  message: { model: 'message', label: 'Tin nhắn', group: 'Support', searchable: ['content'], hidden: [], hash: [] },
  user: { model: 'user', label: 'Người dùng', group: 'System', searchable: ['name', 'email'], hidden: ['password', 'rememberToken', 'twoFactorSecret', 'twoFactorRecoveryCodes'], hash: ['password'] },
  team: { model: 'team', label: 'Team', group: 'System', searchable: ['name', 'slug'], hidden: [], hash: [] },
};

export function getResourceDef(resource: string): AdminResourceDef | undefined {
  return ADMIN_RESOURCES[resource];
}
