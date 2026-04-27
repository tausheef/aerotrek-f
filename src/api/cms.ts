import api from './axios'
import type { SiteSettings, Page, BlogPost, BlogCategory, FaqsGrouped, SettingItem } from '../types'

// Backend response shape:
// { success: true, message: "Success.", settings: { ... } }
// NOT { data: { settings: { ... } } }

export const cmsApi = {
  // ── Public ──────────────────────────────────────────────────────
  getSettings: () =>
    api.get<{ success: boolean; settings: SiteSettings }>('/cms/settings'),

  getPage: (slug: string) =>
    api.get<{ success: boolean; page: Page }>(`/cms/pages/${slug}`),

  getBlogPosts: (params?: { category?: string; page?: number }) =>
    api.get<{ success: boolean; posts: any }>('/cms/blog', { params }),

  getBlogPost: (slug: string) =>
    api.get<{ success: boolean; post: BlogPost }>(`/cms/blog/${slug}`),

  getBlogCategories: () =>
    api.get<{ success: boolean; categories: BlogCategory[] }>('/cms/blog/categories'),

  getFaqs: (category?: string) =>
    api.get<{ success: boolean; faqs: FaqsGrouped }>('/cms/faqs', {
      params: category ? { category } : undefined,
    }),

  // ── Admin ────────────────────────────────────────────────────────
  admin: {
    getSettings: () =>
      api.get<{ success: boolean; settings: SiteSettings }>('/admin/cms/settings'),

    updateSettings: (settings: SettingItem[]) =>
      api.post<{ success: boolean }>('/admin/cms/settings', { settings }),

    getPages: () =>
      api.get<{ success: boolean; pages: Page[] }>('/admin/cms/pages'),

    createPage: (payload: Partial<Page>) =>
      api.post<{ success: boolean; page: Page }>('/admin/cms/pages', payload),

    updatePage: (id: string, payload: Partial<Page>) =>
      api.put<{ success: boolean; page: Page }>(`/admin/cms/pages/${id}`, payload),

    deletePage: (id: string) =>
      api.delete<{ success: boolean }>(`/admin/cms/pages/${id}`),

    getPosts: () =>
      api.get<{ success: boolean; posts: BlogPost[] }>('/admin/cms/blog'),

    createPost: (payload: Partial<BlogPost>) =>
      api.post<{ success: boolean; post: BlogPost }>('/admin/cms/blog', payload),

    updatePost: (id: string, payload: Partial<BlogPost>) =>
      api.put<{ success: boolean; post: BlogPost }>(`/admin/cms/blog/${id}`, payload),

    deletePost: (id: string) =>
      api.delete<{ success: boolean }>(`/admin/cms/blog/${id}`),

    getCategories: () =>
      api.get<{ success: boolean; categories: BlogCategory[] }>('/admin/cms/blog/categories'),

    createCategory: (name: string) =>
      api.post<{ success: boolean; category: BlogCategory }>('/admin/cms/blog/categories', { name }),

    getFaqs: () =>
      api.get<{ success: boolean; faqs: any[] }>('/admin/cms/faqs'),

    createFaq: (payload: any) =>
      api.post<{ success: boolean }>('/admin/cms/faqs', payload),

    updateFaq: (id: string, payload: any) =>
      api.put<{ success: boolean }>(`/admin/cms/faqs/${id}`, payload),

    deleteFaq: (id: string) =>
      api.delete<{ success: boolean }>(`/admin/cms/faqs/${id}`),
  },
}