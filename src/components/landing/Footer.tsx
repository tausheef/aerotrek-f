import { Link } from 'react-router-dom'
import { Package, Mail, Phone } from 'lucide-react'
import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'

const SocialSVG = ({ type }: { type: string }) => {
  const d: Record<string, string> = {
    facebook:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    twitter:   'M22 4s-.7 2.1-2 3.4c1.6 14.3-9.4 22.2-18 17.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
    linkedin:  'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919z',
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d[type] ?? ''} />
    </svg>
  )
}

export default function Footer() {
  const { data: settings } = useCmsSettings()
  const siteName = settings?.site_name     ?? DEFAULT_CMS.site_name
  const email    = settings?.contact_email ?? DEFAULT_CMS.contact_email
  const phone    = settings?.contact_phone ?? DEFAULT_CMS.contact_phone
  const social   = (settings?.social_links ?? {}) as Record<string, string>
  const year     = new Date().getFullYear()

  const cols = [
    { label: 'Services', links: [{ l: 'Air Shipping', h: '/#services' }, { l: 'Sea Shipping', h: '/#services' }, { l: 'Express', h: '/#services' }, { l: 'Warehousing', h: '/#services' }, { l: 'Customs', h: '/#services' }] },
    { label: 'Company',  links: [{ l: 'About', h: '/p/about' }, { l: 'Careers', h: '/p/careers' }, { l: 'Press', h: '/p/press' }, { l: 'Contact', h: '/p/contact' }, { l: 'Partners', h: '/p/partners' }] },
    { label: 'Resources',links: [{ l: 'Blog', h: '/blog' }, { l: 'Help center', h: '/p/help' }, { l: 'API docs', h: '/p/api' }, { l: 'Pricing', h: '/#pricing' }, { l: 'Status', h: '/p/status' }] },
  ]

  return (
    <footer className="bg-brand-navy">
      <div className="container-main pt-14 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <polygon points="14,3 26,24 2,24" fill="#00BFFF" />
              </svg>
              <span className="font-bold text-[16px] text-white tracking-tight">
                {siteName.toUpperCase()}<span className="text-brand-sky">.</span>
              </span>
            </Link>
            <p className="text-[13px] text-white/35 leading-relaxed mb-5 max-w-[200px]">
              India's fastest international courier booking platform.
            </p>
            {/* Contact */}
            <div className="flex flex-col gap-2 mb-5 text-[13px] text-white/40">
              {phone && <a href={`tel:${phone}`}    className="hover:text-white transition-colors flex items-center gap-1.5"><Phone size={12} />{phone}</a>}
              {email && <a href={`mailto:${email}`} className="hover:text-white transition-colors flex items-center gap-1.5"><Mail  size={12} />{email}</a>}
            </div>
            {/* Social */}
            <div className="flex gap-2">
              {['facebook','twitter','linkedin','instagram'].map((type) => (
                <a key={type} href={social[type] ?? '#'} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:border-brand-sky hover:text-brand-sky transition-all">
                  <SocialSVG type={type} />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.label} className="col-span-1">
              <p className="text-[11px] font-semibold text-brand-sky uppercase tracking-[0.14em] mb-4">{col.label}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.l}>
                    <Link to={link.h} className="text-[13px] text-white/40 hover:text-white transition-colors">{link.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact col */}
          <div className="col-span-1">
            <p className="text-[11px] font-semibold text-brand-sky uppercase tracking-[0.14em] mb-4">Contact</p>
            <div className="flex flex-col gap-2.5 text-[13px]">
              {phone && <a href={`tel:${phone}`} className="text-white/40 hover:text-white transition-colors">{phone}</a>}
              {email && <a href={`mailto:${email}`} className="text-white/40 hover:text-white transition-colors">{email}</a>}
              <p className="text-white/40">Press inquiries</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/25">© {year} {siteName} Courier. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy','Terms','Cookies'].map((l) => (
              <Link key={l} to={`/p/${l.toLowerCase()}`} className="text-[12px] text-white/25 hover:text-white/50 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}