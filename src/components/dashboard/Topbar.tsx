import { Menu, Bell, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { walletApi } from '../../api/shipments'

interface TopbarProps {
  onMenuClick: () => void
  title?: string
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user } = useAuthStore()

  // ── Wallet — direct React Query, no custom hook ───────────────
  // Using direct useQuery here avoids any hook composition issues
  // staleTime: 5min means it won't refetch on every render
  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn:  () => walletApi.getBalance().then((r: any) => r.data),
    staleTime:            5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount:       false,
    enabled: !!user,     // only fetch when user is logged in
  })

  const balance     = walletData?.wallet_balance ?? 0
  const kycVerified = user?.kyc_status === 'verified'

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="h-16 bg-white border-b border-black/6 flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="font-bold text-[15px] text-brand-navy hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Wallet balance pill */}
        <Link
          to="/dashboard/wallet"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-brand-sky/5 border-brand-sky/20 hover:bg-brand-sky/10 transition-all duration-200"
        >
          <Wallet size={14} className="text-brand-sky" />
          <span className="text-[13px] font-bold text-brand-navy">
            {formatINR(balance)}
          </span>
        </Link>

        {/* KYC pending badge */}
        {!kycVerified && (
          <Link
            to="/dashboard/kyc"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            KYC Pending
          </Link>
        )}

        {/* Notifications */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <Link to="/dashboard/profile" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-brand-sky transition-colors">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-sky/10 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-sky">{initials}</span>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-semibold text-brand-navy leading-tight">
              {user?.name?.split(' ')[0]}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight capitalize">
              {user?.account_type}
            </p>
          </div>
        </Link>
      </div>
    </header>
  )
}