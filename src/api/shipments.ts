import api from './axios'
import type {
  RateCalculatePayload, RechargePayload,
  BookShipmentPayload, KycSubmitPayload, BookingResponse,
} from '../types'

// ── KYC ─────────────────────────────────────────────────────────
export const kycApi = {
  get: () => api.get('/kyc/'),

  submit: (payload: KycSubmitPayload) => {
    const form = new FormData()
    form.append('document_type',  payload.document_type)
    form.append('document_image', payload.document_image)
    if (payload.document_number) form.append('document_number', payload.document_number)
    return api.post('/kyc/submit', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ── Wallet ───────────────────────────────────────────────────────
export const walletApi = {
  getBalance:      ()                         => api.get('/wallet/'),
  getTransactions: (page = 1)                 => api.get('/wallet/transactions', { params: { page } }),
  recharge:        (payload: RechargePayload) => api.post('/wallet/recharge', payload),
}

// ── Rates ────────────────────────────────────────────────────────
export const ratesApi = {
  calculate: (payload: RateCalculatePayload) => api.post('/rates/calculate', payload),
}

// ── Shipments ────────────────────────────────────────────────────
export const shipmentsApi = {
  list: (params?: { status?: string; page?: number }) =>
    api.get('/shipments/', { params }),

  get: (id: string) =>
    api.get(`/shipments/${id}`),

  // Returns BookingResponse with aerotrek_id, awb_no, platform etc.
  book: (payload: BookShipmentPayload) =>
    api.post<{ success: boolean; message: string; data: BookingResponse }>('/shipments/book', payload),

  sendOtp:   (payload: any) => api.post('/shipments/send-otp',   payload),
  verifyOtp: (payload: any) => api.post('/shipments/verify-otp', payload),
}

// ── Tracking ─────────────────────────────────────────────────────
// identifier can be any of:
//   ATK-20260423-000047  (aerotrek_id)
//   1234567890           (awb_no)
//   platform_ref_id      (same as awb_no for now)
export const trackingApi = {
  track: (identifier: string) =>
    api.get(`/tracking/${encodeURIComponent(identifier.trim())}`),
}