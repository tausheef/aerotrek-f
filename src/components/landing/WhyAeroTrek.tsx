import { Link } from 'react-router-dom'
import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'
import { Shield, Clock, Globe, ArrowRight, Zap, Tag, MapPin, Layers, Wallet, Package } from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  'tag':     <Tag     size={18} />,
  'map-pin': <MapPin  size={18} />,
  'shield':  <Shield  size={18} />,
  'layers':  <Layers  size={18} />,
  'wallet':  <Wallet  size={18} />,
  'zap':     <Zap     size={18} />,
  'clock':   <Clock   size={18} />,
  'globe':   <Globe   size={18} />,
}

export default function WhyAeroTrek() {
  const { data: settings } = useCmsSettings()
  const features     = settings?.landing_features     ?? DEFAULT_CMS.landing_features
  const destinations = settings?.landing_destinations ?? DEFAULT_CMS.landing_destinations

  return (
    <>
      <section id="why" className="section-pad bg-brand-cream">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="label mb-4">Why Choose AeroTrek</p>
              <h2 className="font-extrabold text-display-sm text-brand-navy mb-5 leading-[1.08]">
                #1 International<br />delivery logistics<br />solution.
              </h2>
              <p className="text-[15px] text-[#4A4A4A] leading-relaxed mb-8 max-w-sm">
                AeroTrek is an India-first courier platform built for individuals and businesses that can't afford a late parcel.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/register" className="btn-primary">Book a Pickup <ArrowRight size={15} /></Link>
                <Link to="/#how-it-works" className="btn-secondary">Learn more</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {features.slice(0, 3).map((feat, i) => (
                <div key={i} className="card p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-brand-sky/10 flex items-center justify-center text-brand-sky shrink-0">
                    {ICONS[feat.icon] ?? <Zap size={18} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] text-brand-navy mb-0.5">{feat.title}</h3>
                    <p className="text-[13px] text-[#4A4A4A] leading-snug">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.slice(3).map((feat, i) => (
              <div key={i} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-sky/10 flex items-center justify-center text-brand-sky shrink-0">
                  {ICONS[feat.icon] ?? <Zap size={18} />}
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-brand-navy mb-0.5">{feat.title}</h3>
                  <p className="text-[12px] text-[#4A4A4A] leading-snug">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking dark section */}
      <section id="track-section" className="bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-dark pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 blur-3xl rounded-full pointer-events-none" style={{ background: 'rgba(0,191,255,0.08)' }} />
        <div className="container-main relative z-10 py-24 lg:py-32">
          <div className="max-w-xl">
            <p className="label mb-4">Live Tracking</p>
            <h2 className="font-extrabold text-display-sm text-white mb-4 leading-[1.08]">
              Track every parcel <span className="text-sky-gradient">in real time.</span>
            </h2>
            <p className="text-[15px] text-white/50 mb-8 leading-relaxed">
              Paste your AWB number to see live events — pickup, customs, out for delivery. No sign-in required.
            </p>
            <div className="flex gap-2 border border-white/10 rounded-2xl p-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2.5 flex-1 px-3">
                <Package size={16} className="text-brand-sky shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Aerotrek ID (ATK-...) or AWB number"
                  className="bg-transparent border-0 outline-none text-sm text-white placeholder:text-white/30 w-full font-mono"
                />
              </div>
              <Link to="/track" className="btn-primary rounded-xl px-5 py-2.5 text-sm">
                Track Package <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-xs text-white/30">Try a sample:</span>
              {['ATK-20260423-000047', 'DHL5521908', 'FEDX-9042', 'UPS-1Z880W'].map((n) => (
                <span key={n} className="px-2.5 py-1 rounded-full border border-white/10 text-xs font-mono text-white/60 cursor-pointer hover:text-white hover:border-brand-sky transition-colors" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="section-pad bg-brand-cream">
        <div className="container-main">
          <div className="text-center mb-12">
            <p className="label mb-3">Global Reach</p>
            <h2 className="font-extrabold text-display-sm text-brand-navy">Ship to 200+ countries.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {destinations.map((dest, i) => (
              <div key={i} className="card p-4 flex items-center gap-3">
                <span className="text-3xl leading-none">{dest.flag}</span>
                <div>
                  <p className="font-bold text-[13px] text-brand-navy">{dest.country}</p>
                  <p className="text-xs text-brand-sky font-semibold">{dest.transit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}