import api from './axios'

// Backend returns: { success, message, user, access_token }
// NOT wrapped in { data: { ... } }

export const authApi = {
  register: (payload: any) =>
    api.post('/auth/register', payload),

  login: (payload: any) =>
    api.post('/auth/login', payload),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get('/auth/me'),

  refresh: () =>
    api.post('/auth/refresh'),
}