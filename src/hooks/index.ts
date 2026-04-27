import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/uiStore'
import { authApi } from '../api/auth'
import { userApi } from '../api/user'
import { kycApi, walletApi, ratesApi, shipmentsApi, trackingApi } from '../api/shipments'
import { cmsApi } from '../api/cms'
import type {
  LoginPayload, RegisterPayload,
  AddressPayload, KycSubmitPayload,
  RechargePayload, RateCalculatePayload,
  BookShipmentPayload, SiteSettings,
} from '../types'

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
    isAdmin: isAdmin(),
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

  return { ...query, update: updateMutation.mutateAsync, updating: updateMutation.isPending }
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
    queryFn:  () => kycApi.get().then((r: any) => r.data.kyc),
    staleTime: 60 * 1000,
  })

  const submitMutation = useMutation({
    mutationFn: (p: KycSubmitPayload) => kycApi.submit(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kyc'] })
      toast.success('KYC submitted successfully.')
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'KYC submission failed.'),
  })

  const kyc        = query.data
  const isVerified = kyc?.status === 'verified' || kyc?.status === 'auto_verified'
  const isPending  = kyc?.status === 'pending'
  const isRejected = kyc?.status === 'rejected'

  return {
    ...query,
    kyc, isVerified, isPending, isRejected,
    submit:     submitMutation.mutateAsync,
    submitting: submitMutation.isPending,
  }
}

// ── useWallet ────────────────────────────────────────────────────
export function useWallet() {
  const qc    = useQueryClient()
  const toast = useToastStore()

  const balanceQuery = useQuery({
    queryKey: ['wallet'],
    queryFn:  () => walletApi.getBalance().then((r: any) => r.data.wallet),
    staleTime: 30 * 1000,
  })

  const transactionsQuery = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn:  () => walletApi.getTransactions().then((r: any) => r.data.transactions),
    staleTime: 30 * 1000,
  })

  const rechargeMutation = useMutation({
    mutationFn: (p: RechargePayload) => walletApi.recharge(p),
    onSuccess:  (res: any) => { window.location.href = res.data.payment_url },
    onError:    (err: any) => toast.error(err.response?.data?.message ?? 'Recharge failed.'),
  })

  return {
    wallet:        balanceQuery.data,
    transactions:  transactionsQuery.data,
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
export function useTracking(awb: string, enabled = true) {
  return useQuery({
    queryKey: ['tracking', awb],
    queryFn:  () => trackingApi.track(awb).then((r: any) => r.data.tracking),
    enabled:  !!awb && enabled,
    staleTime: 60 * 1000,
  })
}

// ── useCmsSettings ───────────────────────────────────────────────
function normalizeSettings(raw: Record<string, any>): SiteSettings {
  return {
    ...raw,
    contact_email:   raw.site_email,
    contact_phone:   raw.site_phone,
    contact_address: raw.site_address,
    social_links: {
      facebook:  raw.social_facebook,
      instagram: raw.social_instagram,
      twitter:   raw.social_twitter,
      linkedin:  raw.social_linkedin,
    },
    landing_hero:         raw.landing_hero,
    landing_stats:        raw.landing_stats,
    landing_carriers:     raw.landing_carriers,
    landing_features:     raw.landing_features,
    landing_destinations: raw.landing_destinations,
    landing_testimonials: raw.landing_testimonials,
    landing_how_it_works: raw.landing_how_it_works,
    landing_cta_banner:   raw.landing_cta_banner,
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