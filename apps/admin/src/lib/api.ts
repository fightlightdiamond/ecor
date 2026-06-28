import { API_URL, apiFetch, setToken } from './http';

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
};
