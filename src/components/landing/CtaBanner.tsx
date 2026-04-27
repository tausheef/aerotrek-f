import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'

export default function CtaBanner() {
  const { data: settings } = useCmsSettings()
  const cta = settings?.landing_cta_banner ?? DEFAULT_CMS.landing_cta_banner

  return (
    <section className="bg-brand-navy py-16">
      <div className="container-main">
        <div className="bg-brand-sky rounded-3xl px-10 md:px-14 py-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 bg-dot-cream opacity-10 pointer-events-none" />
          {/* Decorative dots pattern from reference */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          <div className="relative z-10">
            <h2 className="font-extrabold text-display-xs text-white mb-3 leading-tight">
              {cta.headline}
            </h2>
            <p className="text-white/75 text-[15px] max-w-md leading-relaxed">
              {cta.subtext}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-brand-navy font-bold text-sm px-6 py-3 rounded-full hover:bg-brand-sky-light transition-all duration-200 active:scale-[0.97]">
              {cta.cta_primary} <ArrowRight size={15} />
            </Link>
            <Link to="/track" className="inline-flex items-center justify-center gap-2 bg-brand-navy text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-brand-navy-3 transition-all duration-200 active:scale-[0.97]">
              {cta.cta_secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}