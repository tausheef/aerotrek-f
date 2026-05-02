import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopSidebar, MobileSidebar } from './Sidebar'
import Topbar from './Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':           'Dashboard',
  '/dashboard/shipments': 'My Shipments',
  '/dashboard/book':      'Book Shipment',
  '/dashboard/track':     'Track Shipment',
  '/dashboard/wallet':    'Wallet',
  '/dashboard/kyc':       'KYC Verification',
  '/dashboard/addresses': 'Address Book',
  '/dashboard/profile':   'Profile',
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title    = PAGE_TITLES[location.pathname] ?? 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F5F6FA' }}>

      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}