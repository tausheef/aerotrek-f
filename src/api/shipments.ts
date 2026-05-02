import api from './axios'
import type {
  RateCalculatePayload, RechargePayload,
  BookShipmentPayload, KycSubmitPayload,
  BookingResponse, ManualBookingPayload,
  UpdateBookingPayload, TrackingEventPayload,
} from '../types'

// ── KYC ─────────────────────────────────────────────────────────
export const kycApi = {
  // Returns: { kyc_status, account_type, kyc, allowed_documents }
  get: () => api.get('/kyc'),

  // document_number is REQUIRED in MySQL version
  submit: (payload: KycSubmitPayload) => {
    const form = new FormData()
    form.append('document_type',   payload.document_type)
    form.append('document_number', payload.document_number)
    form.append('document_image',  payload.document_image)
    return api.post('/kyc/submit', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ── Wallet — Bavix ───────────────────────────────────────────────
export const walletApi = {
  // Returns: { wallet_balance: number (rupees), currency: 'INR' }
  getBalance: () => api.get('/wallet'),

  // Returns: { transactions: PaginatedData, wallet_balance: number }
  getTransactions: (params?: { type?: string; page?: number }) =>
    api.get('/wallet/transactions', { params }),

  // Returns: { payment_url, ... }
  recharge: (payload: RechargePayload) => api.post('/wallet/recharge', payload),
}

// ── Rates ────────────────────────────────────────────────────────
export const ratesApi = {
  calculate: (payload: RateCalculatePayload) => api.post('/rates/calculate', payload),
}

// ── Shipments — User ─────────────────────────────────────────────
export const manualBook = (payload: ManualBookingPayload) =>
  api.post('/shipments/manual-book', payload)

export const getShipments = (params?: { status?: string; page?: number }) =>
  api.get('/shipments', { params })

export const getShipment = (id: string) =>
  api.get(`/shipments/${id}`)

export const shipmentsApi = {
  list:      (params?: { status?: string; page?: number }) => api.get('/shipments', { params }),
  get:       (id: string)                                   => api.get(`/shipments/${id}`),
  book:      (payload: BookShipmentPayload)                 =>
    api.post<{ success: boolean; message: string; data: BookingResponse }>('/shipments/book', payload),
  sendOtp:   (payload: any) => api.post('/shipments/send-otp',   payload),
  verifyOtp: (payload: any) => api.post('/shipments/verify-otp', payload),
}

// ── Shipments — Admin ────────────────────────────────────────────
// Returns: { shipments: PaginatedData, stats: AdminManualOrdersStats }
export const adminGetManualOrders = (params?: { status?: string; page?: number }) =>
  api.get('/admin/shipments/manual', { params })

export const adminAcceptOrder = (id: string) =>
  api.post(`/admin/shipments/${id}/accept`)

export const adminRejectOrder = (id: string, reason: string) =>
  api.post(`/admin/shipments/${id}/reject`, { reason })

export const adminUpdateBooking = (id: string, data: UpdateBookingPayload) =>
  api.put(`/admin/shipments/${id}/update-booking`, data)

export const adminAddTrackingEvent = (id: string, data: TrackingEventPayload) =>
  api.post(`/admin/shipments/${id}/add-tracking-event`, data)

// ── Tracking ─────────────────────────────────────────────────────
export const trackingApi = {
  track: (identifier: string) =>
    api.get(`/tracking/${encodeURIComponent(identifier.trim())}`),
}