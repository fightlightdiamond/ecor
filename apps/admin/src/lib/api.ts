import { API_URL, apiFetch, getToken, handleUnauthorized, setToken } from './http';

const BASE = '/admin/resources';

export interface ListParams {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  q?: string;
}

export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body?.token) {
      throw { message: body?.message || 'Email hoặc mật khẩu không đúng', statusCode: res.status };
    }
    setToken(body.token);
    return body.user;
  },

  me() {
    return apiFetch('/admin/auth/me').then((b) => b.data);
  },

  list(resource: string, params: ListParams = {}) {
    const qs = new URLSearchParams({
      page: String(params.page ?? 1),
      perPage: String(params.perPage ?? 25),
      sort: params.sort ?? 'id',
      order: params.order ?? 'desc',
    });
    if (params.q) qs.set('q', params.q);
    return apiFetch(`${BASE}/${resource}?${qs.toString()}`) as Promise<{ data: any[]; total: number }>;
  },

  getOne(resource: string, id: string | number) {
    return apiFetch(`${BASE}/${resource}/${id}`).then((b) => b.data);
  },

  create(resource: string, values: Record<string, any>) {
    return apiFetch(`${BASE}/${resource}`, { method: 'POST', body: JSON.stringify(values) }).then((b) => b.data);
  },

  update(resource: string, id: string | number, values: Record<string, any>) {
    return apiFetch(`${BASE}/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(values) }).then((b) => b.data);
  },

  remove(resource: string, id: string | number) {
    return apiFetch(`${BASE}/${resource}/${id}`, { method: 'DELETE' }).then((b) => b.data);
  },

  // ── Cấu hình website (StorefrontSection) ────────────────────────────────
  getSiteSettings() {
    return apiFetch('/admin/site-settings').then(
      (b) => b.data as { key: string; label: string; content: any }[],
    );
  },
  putSiteSection(key: string, content: any) {
    return apiFetch(`/admin/site-settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }).then((b) => b.data);
  },

  // Upload 1 file (ảnh/video/media) vào thư mục `folder` → trả { url, type }.
  async upload(file: File, folder = ''): Promise<{ url: string; type: string }> {
    const fd = new FormData();
    fd.append('file', file);
    const token = getToken();
    const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    const res = await fetch(`${API_URL}/admin/upload${qs}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) handleUnauthorized();
      throw { message: body?.message || 'Tải lên thất bại', statusCode: res.status };
    }
    return { url: body.url as string, type: (body.type as string) || 'file' };
  },

  // Liệt kê media + thư mục con trong 1 thư mục.
  listMedia(folder = '') {
    const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    return apiFetch(`/admin/upload${qs}`).then(
      (b) =>
        b.data as {
          folder: string;
          folders: string[];
          files: { name: string; url: string; path: string; type: string; size: number }[];
        },
    );
  },

  // Tạo thư mục con.
  createFolder(parent: string, name: string) {
    return apiFetch('/admin/upload/folder', {
      method: 'POST',
      body: JSON.stringify({ parent, name }),
    }).then((b) => b.data as { folder: string });
  },

  // Xoá 1 file media theo path tương đối (vd 'tra/abc.png').
  deleteMedia(path: string) {
    return apiFetch(`/admin/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' }).then(
      (b) => b.data,
    );
  },
};
