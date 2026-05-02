import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusCircle, MapPin,
  Wallet, ShieldCheck, BookMarked, User,
  LogOut, Settings, ChevronRight, X,
} from 'lucide-react'
import { useAuth } from '../../hooks'
import { useAuthStore } from '../../store/authStore'
import clsx from 'clsx'

// ── Nav items ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard'           },
  { label: 'My Shipments', icon: Package,         to: '/dashboard/shipments' },
  { label: 'Book Shipment',icon: PlusCircle,      to: '/dashboard/book'      },
  { label: 'Track',        icon: MapPin,          to: '/dashboard/track'     },
  { label: 'Wallet',       icon: Wallet,          to: '/dashboard/wallet'    },
  { label: 'KYC',          icon: ShieldCheck,     to: '/dashboard/kyc'       },
  { label: 'Addresses',    icon: BookMarked,      to: '/dashboard/addresses' },
  { label: 'Profile',      icon: User,            to: '/dashboard/profile'   },
]

// ── Logo ──────────────────────────────────────────────────────────
function Logo({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex items-center h-16 px-4 border-b border-white/6 shrink-0">
      <div className="w-9 h-9 rounded-xl bg-brand-sky flex items-center justify-center shrink-0"
        style={{ boxShadow: '0 0 20px rgba(0,191,255,0.3)' }}>
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <polygon points="14,3 26,24 2,24" fill="#0D0D0D" />
        </svg>
      </div>
      <div className={clsx(
        'ml-3 overflow-hidden transition-all duration-300',
        expanded ? 'w-36 opacity-100' : 'w-0 opacity-0'
      )}>
        <span className="font-bold text-[15px] text-white tracking-tight whitespace-nowrap">
          AEROTREK<span className="text-brand-sky">.</span>
        </span>
      </div>
    </div>
  )
}

// ── Nav item ──────────────────────────────────────────────────────
function NavItem({
  item, expanded, onClick,
}: {
  item: typeof NAV_ITEMS[0]
  expanded: boolean
  onClick?: () => void
}) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/dashboard'}
      onClick={onClick}
      className={({ isActive }) => clsx(
        'group relative flex items-center h-11 px-3.5 mx-2 rounded-xl transition-all duration-150 cursor-pointer',
        isActive
          ? 'bg-brand-sky/15 text-brand-sky'
          : 'text-white/50 hover:bg-white/6 hover:text-white'
      )}
    >
      {({ isActive }) => (
        <>
          {/* Active left bar */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-sky rounded-full" />
          )}

          {/* Icon */}
          <item.icon
            size={18}
            strokeWidth={isActive ? 2.5 : 2}
            className="shrink-0"
          />

          {/* Label */}
          <div className={clsx(
            'ml-3 overflow-hidden transition-all duration-300',
            expanded ? 'w-36 opacity-100' : 'w-0 opacity-0'
          )}>
            <span className="text-[13px] font-semibold whitespace-nowrap">
              {item.label}
            </span>
          </div>

          {/* Tooltip — only when collapsed */}
          {!expanded && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-brand-navy-2 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none border border-white/10 z-50">
              {item.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-brand-navy-2" />
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

// ── User section ──────────────────────────────────────────────────
function UserSection({ expanded, onLogout }: { expanded: boolean; onLogout: () => void }) {
  const { user } = useAuthStore()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="border-t border-white/6 p-3 shrink-0">
      <button
        onClick={onLogout}
        className="group w-full flex items-center h-11 px-3.5 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-brand-sky/20 border border-brand-sky/30 flex items-center justify-center shrink-0">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-brand-sky">{initials}</span>
          )}
        </div>

        {/* Name + logout */}
        <div className={clsx(
          'ml-3 overflow-hidden transition-all duration-300 flex items-center justify-between flex-1',
          expanded ? 'w-36 opacity-100' : 'w-0 opacity-0'
        )}>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">{user?.name ?? 'User'}</p>
            <p className="text-[10px] text-white/30 truncate">{user?.email ?? ''}</p>
          </div>
          <LogOut size={14} className="shrink-0 ml-2" />
        </div>
      </button>
    </div>
  )
}

// ── Desktop Sidebar ───────────────────────────────────────────────
export function DesktopSidebar() {
  const [expanded, setExpanded] = useState(false)
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={clsx(
        'hidden lg:flex flex-col h-screen sticky top-0 shrink-0',
        'bg-brand-navy border-r border-white/6',
        'transition-all duration-300 ease-in-out',
        expanded ? 'w-[240px]' : 'w-[68px]'
      )}
      style={{ zIndex: 40 }}
    >
      <Logo expanded={expanded} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} expanded={expanded} />
        ))}
      </nav>

      {/* User + logout */}
      <UserSection expanded={expanded} onLogout={handleLogout} />
    </aside>
  )
}

// ── Mobile Sidebar (overlay drawer) ──────────────────────────────
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          'lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Drawer */}
      <aside className={clsx(
        'lg:hidden fixed top-0 left-0 bottom-0 w-[240px] z-50',
        'bg-brand-navy border-r border-white/6 flex flex-col',
        'transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-sky flex items-center justify-center"
              style={{ boxShadow: '0 0 16px rgba(0,191,255,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                <polygon points="14,3 26,24 2,24" fill="#0D0D0D" />
              </svg>
            </div>
            <span className="font-bold text-[15px] text-white tracking-tight">
              AEROTREK<span className="text-brand-sky">.</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/6 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} expanded={true} onClick={onClose} />
          ))}
        </nav>

        {/* User */}
        <UserSection expanded={true} onLogout={handleLogout} />
      </aside>
    </>
  )
}