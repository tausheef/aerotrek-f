import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/uiStore'
import { authApi } from '../api/auth'
import { userApi } from '../api/user'
import { kycApi, walletApi, ratesApi, shipmentsApi, trackingApi, manualBook } from '../api/shipments'
import { cmsApi } from '../api/cms'
import type {
  LoginPayload, RegisterPayload,
  AddressPayload, KycSubmitPayload,
  RechargePayload, RateCalculatePayload,
  BookShipmentPayload, ManualBookingPayload,
} from '../types'
import { DEFAULT_CMS } from '../utils'

// ── useAuth ──────────────────────────────────────────────────────
export function useAuth() {
  const { setAuth, clearAuth, isAuthenticated, isAdmin, user, token } = useAuthStore()
  const toast = useToastStore()
  const qc    = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res: any) => {
      const data = res.data
      setAuth(data.user, data.access_token ?? data.token)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Login failed.')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (res: any) => {
      const data = res.data
      setAuth(data.user, data.access_token ?? data.token)
      toast.success('Account created! Welcome to AeroTrek.')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Registration failed.')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => { clearAuth(); qc.clear(); toast.info('Signed out.') },
    onError:   () => { clearAuth(); qc.clear() },
  })

  return {
    user, token,
    isAuthenticated: isAuthenticated(),
    isAdmin:         isAdmin(),
    login:           loginMutation.mutateAsync,
    register:        registerMutation.mutateAsync,
    logout:          logoutMutation.mutate,
    loginPending:    loginMutation.isPending,
    registerPending: registerMutation.isPending,
  }
}

// ── useProfile ───────────────────────────────────────────────────
export function useProfile() {
  const qc      = useQueryClient()
  const toast   = useToastStore()
  const setUser = useAuthStore((s) => s.setUser)

  const query = useQuery({
    queryKey: ['profile'],
    queryFn:  () => userApi.getProfile().then((r: any) => r.data.user),
    staleTime: 5 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: (payload: any) => userApi.updateProfile(payload),
    onSuccess: (res: any) => {
      setUser(res.data.user)
      qc.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated.')
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to update.'),
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.append('avatar', file)
      return userApi.uploadAvatar(form)
    },
    onSuccess: (res: any) => {
      const avatarUrl = res.data.avatar_url
      const currentUser = useAuthStore.getState().user
      if (currentUser) setUser({ ...currentUser, avatar_url: avatarUrl })
      toast.success('Avatar updated.')
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to upload avatar.'),
  })

  return {
    ...query,
    update:       updateMutation.mutateAsync,
    updating:     updateMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    uploading:    uploadAvatarMutation.isPending,
  }
}

// ── useAddresses ─────────────────────────────────────────────────
export function useAddresses() {
  const qc    = useQueryClient()
  const toast = useToastStore()

  const query = useQuery({
    queryKey: ['addresses'],
    queryFn:  () => userApi.getAddresses().then((r: any) => r.data.addresses),
    staleTime: 5 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: (p: AddressPayload) => userApi.createAddress(p),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['addresses'] }); toast.success('Address added.') },
    onError:   (err: any) => toast.error(err.response?.data?.message ?? 'Failed.'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...p }: { id: string } & Partial<AddressPayload>) =>
      userApi.updateAddress(id, p),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['addresses'] }); toast.success('Address updated.') },
    onError:   (err: any) => toast.error(err.response?.data?.message ?? 'Failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteAddress(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['addresses'] }); toast.success('Address deleted.') },
    onError:   (err: any) => toast.error(err.response?.data?.message ?? 'Failed.'),
  })

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => userApi.setDefaultAddress(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['addresses'] }); toast.success('Default updated.') },
  })

  return {
    ...query,
    create:     createMutation.mutateAsync,
    update:     updateMutation.mutateAsync,
    remove:     deleteMutation.mutateAsync,
    setDefault: setDefaultMutation.mutateAsync,
    creating:   createMutation.isPending,
    updating:   updateMutation.isPending,
    deleting:   deleteMutation.isPending,
  }
}

// ── useKyc ───────────────────────────────────────────────────────
export function useKyc() {
  const qc    = useQueryClient()
  const toast = useToastStore()

  const query = useQuery({
    queryKey: ['kyc'],
    queryFn:  () => kycApi.get().then((r: any) => r.data),
    staleTime: 60 * 1000,
  })

  const submitMutation = useMutation({
    mutationFn: (p: KycSubmitPayload) => kycApi.submit(p),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ['kyc'] })
      const user    = useAuthStore.getState().user
      const setUser = useAuthStore.getState().setUser
      if (user) setUser({ ...user, kyc_status: res.data.kyc?.status ?? user.kyc_status })
      toast.success(res.data.message ?? 'KYC submitted.')
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'KYC submission failed.'),
  })

  const data       = query.data
  const kycStatus  = data?.kyc_status
  const isVerified = kycStatus === 'verified'
  const isPending  = kycStatus === 'pending'
  const isRejected = kycStatus === 'rejected'

  return {
    ...query,
    kycData:          data,
    kyc:              data?.kyc ?? null,
    kycStatus,
    allowedDocuments: data?.allowed_documents ?? [],
    accountType:      data?.account_type ?? 'individual',
    isVerified,
    isPending,
    isRejected,
    submit:           submitMutation.mutateAsync,
    submitting:       submitMutation.isPending,
  }
}

// ── useWallet ────────────────────────────────────────────────────
export function useWallet() {
  const qc    = useQueryClient()
  const toast = useToastStore()

  const balanceQuery = useQuery({
    queryKey: ['wallet'],
    queryFn:  () => walletApi.getBalance().then((r: any) => r.data),
    staleTime: 30 * 1000,
  })

  const transactionsQuery = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn:  () => walletApi.getTransactions().then((r: any) => r.data),
    staleTime: 30 * 1000,
  })

  const rechargeMutation = useMutation({
    mutationFn: (p: RechargePayload) => walletApi.recharge(p),
    onSuccess: (res: any) => {
      const url = res.data.payment_url
      if (url) window.location.href = url
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Recharge failed.'),
  })

  return {
    balance:       balanceQuery.data?.wallet_balance ?? 0,
    currency:      balanceQuery.data?.currency ?? 'INR',
    transactions:  transactionsQuery.data?.transactions,
    walletLoading: balanceQuery.isLoading,
    txLoading:     transactionsQuery.isLoading,
    recharge:      rechargeMutation.mutateAsync,
    recharging:    rechargeMutation.isPending,
    refresh:       () => qc.invalidateQueries({ queryKey: ['wallet'] }),
  }
}

// ── useRates ─────────────────────────────────────────────────────
export function useRates() {
  const toast = useToastStore()

  const mutation = useMutation({
    mutationFn: (p: RateCalculatePayload) => ratesApi.calculate(p),
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to get rates.'),
  })

  return {
    calculate:   mutation.mutateAsync,
    rates:       (mutation.data as any)?.data?.rates ?? [],
    calculating: mutation.isPending,
    reset:       mutation.reset,
  }
}

// ── useShipments ─────────────────────────────────────────────────
export function useShipments(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['shipments', params],
    queryFn:  () => shipmentsApi.list(params).then((r: any) => r.data.shipments),
    staleTime: 30 * 1000,
  })
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn:  () => shipmentsApi.get(id).then((r: any) => r.data.shipment),
    enabled:  !!id,
  })
}

export function useManualBook() {
  const qc    = useQueryClient()
  const toast = useToastStore()

  return useMutation({
    mutationFn: (p: ManualBookingPayload) => manualBook(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Booking failed.'),
  })
}

export function useBookShipment() {
  const qc    = useQueryClient()
  const toast = useToastStore()

  return useMutation({
    mutationFn: (p: BookShipmentPayload) => shipmentsApi.book(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] })
      qc.invalidateQueries({ queryKey: ['wallet'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Booking failed.'),
  })
}

// ── useTracking ──────────────────────────────────────────────────
export function useTracking(identifier: string, enabled = true) {
  return useQuery({
    queryKey: ['tracking', identifier],
    queryFn:  () => trackingApi.track(identifier).then((r: any) => r.data),
    enabled:  !!identifier && enabled,
    staleTime: 60 * 1000,
  })
}

// ── CMS Settings — with JSON parse fix ───────────────────────────
// Backend (MySQL) stores JSON values as strings sometimes
// This function safely parses any value that should be array/object
function safeParse(value: any, fallback: any): any {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed
    } catch {
      return fallback
    }
  }
  // Already an object/array
  if (typeof value === 'object') return value
  return fallback
}

function normalizeSettings(raw: Record<string, any>) {
  return {
    ...raw,

    // Text fields — direct
    site_name:    raw.site_name    ?? DEFAULT_CMS.site_name,
    contact_email:   raw.site_email,
    contact_phone:   raw.site_phone,
    contact_address: raw.site_address,

    // Social links
    social_links: {
      facebook:  raw.social_facebook,
      instagram: raw.social_instagram,
      twitter:   raw.social_twitter,
      linkedin:  raw.social_linkedin,
    },

    // Landing JSON sections — parse if string, fallback to defaults
    landing_hero:         safeParse(raw.landing_hero,         DEFAULT_CMS.landing_hero),
    landing_stats:        safeParse(raw.landing_stats,        DEFAULT_CMS.landing_stats),
    landing_carriers:     safeParse(raw.landing_carriers,     DEFAULT_CMS.landing_carriers),
    landing_features:     safeParse(raw.landing_features,     DEFAULT_CMS.landing_features),
    landing_destinations: safeParse(raw.landing_destinations, DEFAULT_CMS.landing_destinations),
    landing_testimonials: safeParse(raw.landing_testimonials, DEFAULT_CMS.landing_testimonials),
    landing_how_it_works: safeParse(raw.landing_how_it_works, DEFAULT_CMS.landing_how_it_works),
    landing_cta_banner:   safeParse(raw.landing_cta_banner,   DEFAULT_CMS.landing_cta_banner),
  }
}

export function useCmsSettings() {
  return useQuery({
    queryKey: ['cms-settings'],
    queryFn:  () =>
      cmsApi.getSettings().then((r: any) => normalizeSettings(r.data.settings ?? {})),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useFaqs(category?: string) {
  return useQuery({
    queryKey: ['faqs', category],
    queryFn:  () => cmsApi.getFaqs(category).then((r: any) => r.data.faqs),
    staleTime: 10 * 60 * 1000,
  })
}

export function useBlogPosts(params?: { category?: string; page?: number }) {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn:  () => cmsApi.getBlogPosts(params).then((r: any) => r.data.posts),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn:  () => cmsApi.getBlogPost(slug).then((r: any) => r.data.post),
    enabled:  !!slug,
    staleTime: 5 * 60 * 1000,
  })
}