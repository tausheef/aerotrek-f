import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'
import { Plane, Ship, Zap, ArrowRight, UserPlus, ShieldCheck, Wallet, Send } from 'lucide-react'

const SERVICE_CARDS = [
  { icon: <Plane size={22} />, title: 'Air Shipping',     desc: 'Fastest cross-border transit. Ideal for urgent and high-value cargo.',       transit: '2–5 days',   price: 'from ₹450/kg'     },
  { icon: <Ship  size={22} />, title: 'Sea Shipping',     desc: 'Cost-effective for heavy freight. FCL and LCL options available.',           transit: '18–35 days', price: 'from ₹60/kg'      },
  { icon: <Zap   size={22} />, title: 'Express Delivery', desc: 'Same-day and next-day within our network. Live driver tracking.',            transit: '4–24 hours', price: 'from ₹1,200 flat' },
]

const STEP_ICONS: Record<string, React.ReactNode> = {
  'user-plus':    <UserPlus    size={24} />,
  'shield-check': <ShieldCheck size={24} />,
  'wallet':       <Wallet      size={24} />,
  'send':         <Send        size={24} />,
}

export default function HowItWorks() {
  const { data: settings } = useCmsSettings()
  const steps = settings?.landing_how_it_works ?? DEFAULT_CMS.landing_how_it_works

  return (
    <>
      {/* ── Services ──────────────────────────────────────────────── */}
      <section id="services" className="section-pad bg-brand-cream">
        <div className="container-main">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="label mb-3">Shipping & Logistics Services</p>
              <h2 className="font-extrabold text-display-sm text-brand-navy">
                One booking.{' '}
                <span className="text-sky-gradient">Every carrier.</span>
              </h2>
            </div>
            <a href="#how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A4A4A] hover:text-brand-sky transition-colors shrink-0">
              View all services <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICE_CARDS.map((svc, i) => (
              <div key={i} className="card p-6 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-brand-sky/10 flex items-center justify-center text-brand-sky mb-5 group-hover:bg-brand-sky group-hover:text-white transition-all duration-300">
                  {svc.icon}
                </div>
                <h3 className="font-bold text-[17px] text-brand-navy mb-2">{svc.title}</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">{svc.desc}</p>
                <div className="flex items-center justify-between text-xs pt-5 border-t border-black/6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#888] mb-1">Transit</p>
                    <p className="font-bold text-brand-navy text-sm">{svc.transit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#888] mb-1">Price</p>
                    <p className="font-bold text-brand-sky text-sm">{svc.price}</p>
                  </div>
                </div>
                <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A4A4A] group-hover:text-brand-sky transition-colors">
                  Get a quote <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section id="how-it-works" className="section-pad bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-dark pointer-events-none" />
        <div className="container-main relative z-10">
          <div className="text-center mb-16">
            <p className="label mb-3">Simple Process</p>
            <h2 className="font-extrabold text-display-sm text-white">Ship in 4 easy steps.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-[2.6rem] left-[14%] right-[14%] h-px border-t border-dashed border-brand-sky/25" />

            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-sky">
                    {STEP_ICONS[step.icon] ?? <Send size={24} />}
                  </div>
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-brand-sky text-brand-navy font-extrabold text-xs flex items-center justify-center">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-white text-[15px] mb-2">{step.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}