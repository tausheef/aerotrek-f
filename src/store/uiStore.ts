import { create } from 'zustand'
import type { BookingFormState, Rate, ShipmentSender, ShipmentReceiver, ShipmentPackage, ShipmentProduct } from '../types'

// ── Toast Store ──────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id:      string
  type:    ToastType
  title?:  string
  message: string
}

interface ToastState {
  toasts: Toast[]
  add:    (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
  clear:  () => void

  // Shorthand helpers
  success: (message: string, title?: string) => void
  error:   (message: string, title?: string) => void
  info:    (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  add: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    // Auto-remove after 4s
    setTimeout(() => get().remove(id), 4000)
  },

  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),

  success: (message, title) => get().add({ type: 'success', message, title }),
  error:   (message, title) => get().add({ type: 'error',   message, title }),
  info:    (message, title) => get().add({ type: 'info',    message, title }),
  warning: (message, title) => get().add({ type: 'warning', message, title }),
}))

// ── Booking Store (multi-step form state) ─────────────────────────
const INITIAL_BOOKING: BookingFormState = {
  step:              1,
  selectedRate:      null,
  sender:            {},
  receiver:          {},
  packageDetails:    {},
  products:          [],
  reason_for_export: '',
  incoterms:         'DDU',
  otp:               undefined,
}

interface BookingState extends BookingFormState {
  setStep:          (step: number) => void
  nextStep:         () => void
  prevStep:         () => void
  setSelectedRate:  (rate: Rate) => void
  setSender:        (data: Partial<ShipmentSender>) => void
  setReceiver:      (data: Partial<ShipmentReceiver>) => void
  setPackage:       (data: Partial<ShipmentPackage>) => void
  setProducts:      (products: ShipmentProduct[]) => void
  setExportDetails: (reason: string, incoterms: 'DDU' | 'DDP') => void
  setOtp:           (otp: string) => void
  reset:            () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  ...INITIAL_BOOKING,

  setStep:         (step)    => set({ step }),
  nextStep:        ()        => set((s) => ({ step: s.step + 1 })),
  prevStep:        ()        => set((s) => ({ step: Math.max(1, s.step - 1) })),
  setSelectedRate: (rate)    => set({ selectedRate: rate }),
  setSender:       (data)    => set((s) => ({ sender: { ...s.sender, ...data } })),
  setReceiver:     (data)    => set((s) => ({ receiver: { ...s.receiver, ...data } })),
  setPackage:      (data)    => set((s) => ({ packageDetails: { ...s.packageDetails, ...data } })),
  setProducts:     (products)=> set({ products }),
  setExportDetails:(reason, incoterms) => set({ reason_for_export: reason, incoterms }),
  setOtp:          (otp)     => set({ otp }),
  reset:           ()        => set(INITIAL_BOOKING),
}))
