import { Star } from 'lucide-react'
import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'

export default function Testimonials() {
  const { data: settings } = useCmsSettings()
  const testimonials = settings?.landing_testimonials ?? DEFAULT_CMS.landing_testimonials

  return (
    <section id="testimonials" className="section-pad bg-brand-cream border-t border-black/6">
      <div className="container-main">
        <div className="text-center mb-14">
          <p className="label mb-3">Reviews</p>
          <h2 className="font-extrabold text-display-sm text-brand-navy">
            Trusted by shippers<br />
            <span className="text-sky-gradient">across India.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-7 flex flex-col gap-5">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} className={s < t.rating ? 'text-brand-sky fill-brand-sky' : 'text-black/10 fill-black/10'} />
                ))}
              </div>

              <p className="text-[14px] text-[#4A4A4A] leading-relaxed flex-1">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-black/6">
                <div className="w-9 h-9 rounded-full bg-brand-sky/15 flex items-center justify-center">
                  <span className="font-bold text-sm text-brand-sky">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-[13px] text-brand-navy">{t.name}</p>
                  <p className="text-xs text-[#888]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}