// Mặc định gọi API cùng origin qua đường dẫn tương đối '/api' (hợp với reverse
// proxy 1 domain). Có thể override bằng VITE_API_URL (vd domain API riêng).
export const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';
export const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Handler điều hướng khi gặp 401 (đăng ký từ main.ts để tránh vòng import router↔http).
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

/** Xử lý phiên hết hạn / chưa đăng nhập: xoá token và điều hướng về login. */
export function handleUnauthorized() {
  clearToken();
  onUnauthorized?.();
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    throw { message: body?.message || 'Có lỗi xảy ra', statusCode: res.status, errors: body?.errors };
  }
  return body;
}
