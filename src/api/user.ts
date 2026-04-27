import api from './axios'
import type { ApiResponse, User, Address, AddressPayload } from '../types'

export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>('/user/profile'),

  updateProfile: (payload: Partial<Pick<User, 'name' | 'phone' | 'company_name'>>) =>
    api.put<ApiResponse<{ user: User }>>('/user/profile', payload),

  // Addresses
  getAddresses: () =>
    api.get<ApiResponse<{ addresses: Address[] }>>('/user/addresses'),

  createAddress: (payload: AddressPayload) =>
    api.post<ApiResponse<{ address: Address }>>('/user/addresses', payload),

  updateAddress: (id: string, payload: Partial<AddressPayload>) =>
    api.put<ApiResponse<{ address: Address }>>(`/user/addresses/${id}`, payload),

  deleteAddress: (id: string) =>
    api.delete<ApiResponse>(`/user/addresses/${id}`),

  setDefaultAddress: (id: string) =>
    api.put<ApiResponse<{ address: Address }>>(`/user/addresses/${id}/default`),
}
