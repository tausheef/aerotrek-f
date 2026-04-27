import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'
import clsx from 'clsx'

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { token }               = useAuthStore()
  const navigate                = useNavigate()
  const { data: settings }      = useCmsSettings()
  const siteName = settings?.site_name ?? DEFAULT_CMS.site_name

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Track Package', href: '/track'         },
    { label: 'Services',      href: '/#services'     },
    { label: 'Locations',     href: '/#destinations' },
    { label: 'Reviews',       href: '/#testimonials' },
  ]

  return (
    <header className={clsx(
      'fixed inset-x-0 top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-brand-cream/95 backdrop-blur-lg border-b border-black/8 shadow-sm'
        : 'bg-brand-cream'
    )}>
      <div className="container-main">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Triangle logo mark — like reference */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,3 26,24 2,24" fill="#00BFFF" />
            </svg>
            <span className="font-bold text-[17px] tracking-tight text-brand-navy">
              {siteName.toUpperCase()}<span className="text-brand-sky">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="px-4 py-2 rounded-full text-[13.5px] font-medium text-[#4A4A4A] hover:text-brand-navy hover:bg-black/5 transition-all duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {token ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary text-[13.5px] px-5 py-2.5">
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-[13.5px] font-medium text-brand-navy hover:text-brand-sky transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-[13.5px] px-5 py-2.5">
                  Contact Us →
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx(
        'md:hidden overflow-hidden transition-all duration-300 border-t border-black/6',
        open ? 'max-h-80' : 'max-h-0'
      )}>
        <div className="container-main py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#4A4A4A] hover:bg-black/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 pb-1">
            {token ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1 text-sm">Dashboard</button>
            ) : (
              <>
                <Link to="/login"    className="btn-secondary flex-1 text-sm text-center">Sign in</Link>
                <Link to="/register" className="btn-primary  flex-1 text-sm text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}