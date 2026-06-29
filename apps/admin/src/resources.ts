// Danh sách resource (khớp ADMIN_RESOURCES ở backend apps/api).
export interface ResourceDef {
  name: string;
  label: string; // nhãn trên menu (vd "Danh sách")
  group: string;
  title?: string; // tên đầy đủ cho tiêu đề trang/popup (vd "Bài viết"); mặc định = label
}

export const RESOURCES: ResourceDef[] = [
  { name: 'product', label: 'Danh sách sản phẩm', group: 'product', title: 'Sản phẩm' },
  // { name: 'productVariant', label: 'Biến thể', group: 'product' },
  // { name: 'review', label: 'Đánh giá', group: 'product' },
  // { name: 'warehouse', label: 'Kho', group: 'product' },
  // { name: 'media', label: 'Media', group: 'product' },
  { name: 'category', label: 'Tất cả danh mục', group: 'Danh mục', title: 'Danh mục' },
  { name: 'post', label: 'Danh sách bài viết', group: 'Bài viết', title: 'Bài viết' },
  // { name: 'storefrontSection', label: 'Khối nội dung', group: 'Bài viết' },
  // { name: 'order', label: 'Đơn hàng', group: 'Sales' },
  // { name: 'orderItem', label: 'Dòng đơn', group: 'Sales' },
  // { name: 'coupon', label: 'Mã giảm giá', group: 'Sales' },
  { name: 'cart', label: 'Giỏ hàng', group: 'Sales' },
  // { name: 'cartItem', label: 'Dòng giỏ', group: 'Sales' },
  // { name: 'customer', label: 'Khách hàng', group: 'CRM' },
  // { name: 'appointment', label: 'Lịch hẹn', group: 'CRM' },
  // { name: 'appointmentStatusHistory', label: 'Lịch sử lịch hẹn', group: 'CRM' },
  // { name: 'contactInquiry', label: 'Liên hệ', group: 'CRM' },
  { name: 'ticket', label: 'Ticket', group: 'Support' },
  // { name: 'ticketResponse', label: 'Phản hồi ticket', group: 'Support' },
  // { name: 'message', label: 'Tin nhắn', group: 'Support' },
  // { name: 'user', label: 'Người dùng', group: 'System' }, // ẩn menu người dùng
  // { name: 'team', label: 'Team', group: 'System' },
];

export const RESOURCE_LABEL: Record<string, string> = Object.fromEntries(
  RESOURCES.map((r) => [r.name, r.label]),
);

// Tên đầy đủ cho tiêu đề trang/popup (fallback về label nếu không có title).
export const RESOURCE_TITLE: Record<string, string> = Object.fromEntries(
  RESOURCES.map((r) => [r.name, r.title ?? r.label]),
);
