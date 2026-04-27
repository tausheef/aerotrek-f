import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'

export default function CarriersStrip() {
  const { data: settings } = useCmsSettings()
  const carriers = settings?.landing_carriers ?? DEFAULT_CMS.landing_carriers
  const doubled  = [...carriers, ...carriers, ...carriers]

  return (
    <section className="bg-brand-navy border-t border-white/5 py-8 overflow-hidden">
      <div className="container-main mb-5">
        <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.2em] text-center">
          Trusted Carrier Network
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((c, i) => (
            <span key={i} className="inline-block mx-12 font-bold text-[22px] text-white/60 tracking-tight hover:text-white transition-colors cursor-default shrink-0">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}