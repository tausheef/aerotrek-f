import api from './axios'

// ── Profile ──────────────────────────────────────────────────────
// GET /api/v1/user/profile → { user: UserResource }
// PUT /api/v1/user/profile → { user: UserResource }
// POST /api/v1/user/profile/avatar → { avatar_url: string }

export const userApi = {
  getProfile: () =>
    api.get('/user/profile'),

  updateProfile: (payload: { name?: string; phone?: string; company_name?: string }) =>
    api.put('/user/profile', payload),

  uploadAvatar: (form: FormData) =>
    api.post('/user/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // ── Addresses ──────────────────────────────────────────────────
  getAddresses: () =>
    api.get('/user/addresses'),

  createAddress: (payload: any) =>
    api.post('/user/addresses', payload),

  updateAddress: (id: string, payload: any) =>
    api.put(`/user/addresses/${id}`, payload),

  deleteAddress: (id: string) =>
    api.delete(`/user/addresses/${id}`),

  setDefaultAddress: (id: string) =>
    api.put(`/user/addresses/${id}/default`),
}