// Danh sách resource (khớp ADMIN_RESOURCES ở backend apps/api).
export interface ResourceDef {
  name: string;
  label: string;
  group: string;
}

export const RESOURCES: ResourceDef[] = [
  { name: 'product', label: 'Sản phẩm', group: 'Catalog' },
  { name: 'productVariant', label: 'Biến thể', group: 'Catalog' },
  { name: 'category', label: 'Danh mục', group: 'Catalog' },
  { name: 'review', label: 'Đánh giá', group: 'Catalog' },
  { name: 'warehouse', label: 'Kho', group: 'Catalog' },
  { name: 'media', label: 'Media', group: 'Catalog' },
  { name: 'post', label: 'Bài viết', group: 'Content' },
  { name: 'storefrontSection', label: 'Khối nội dung', group: 'Content' },
  { name: 'order', label: 'Đơn hàng', group: 'Sales' },
  { name: 'orderItem', label: 'Dòng đơn', group: 'Sales' },
  { name: 'coupon', label: 'Mã giảm giá', group: 'Sales' },
  { name: 'cart', label: 'Giỏ hàng', group: 'Sales' },
  { name: 'cartItem', label: 'Dòng giỏ', group: 'Sales' },
  { name: 'customer', label: 'Khách hàng', group: 'CRM' },
  { name: 'appointment', label: 'Lịch hẹn', group: 'CRM' },
  { name: 'appointmentStatusHistory', label: 'Lịch sử lịch hẹn', group: 'CRM' },
  { name: 'contactInquiry', label: 'Liên hệ', group: 'CRM' },
  { name: 'ticket', label: 'Ticket', group: 'Support' },
  { name: 'ticketResponse', label: 'Phản hồi ticket', group: 'Support' },
  { name: 'message', label: 'Tin nhắn', group: 'Support' },
  { name: 'user', label: 'Người dùng', group: 'System' },
  { name: 'team', label: 'Team', group: 'System' },
];

export const RESOURCE_LABEL: Record<string, string> = Object.fromEntries(
  RESOURCES.map((r) => [r.name, r.label]),
);
