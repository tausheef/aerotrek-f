import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useFaqs } from '../../hooks'
import clsx from 'clsx'

const CAT_LABELS: Record<string, string> = {
  shipping: 'Shipping', payment: 'Payment', tracking: 'Tracking', general: 'General',
}

const FALLBACKS = [
  { _id: '1', question: 'How are rates calculated?',             answer: 'We pull live rates from DHL, FedEx, UPS and Aramex based on origin, destination, weight and dimensions, then show you a single all-inclusive price including duties.', category: 'shipping' },
  { _id: '2', question: 'Do I need a business account to book?', answer: 'No. Both individual and company accounts can book. A one-time KYC verification is required for compliance.',                                                          category: 'general'  },
  { _id: '3', question: 'What if my parcel is lost or damaged?', answer: 'All shipments are covered up to ₹10,000. For higher-value items, you can purchase additional insurance at checkout.',                                                  category: 'shipping' },
  { _id: '4', question: 'Can I pay in INR?',                     answer: 'Yes — all amounts are in Indian Rupees. Recharge your wallet via UPI, net banking, or card through our PayU integration.',                                              category: 'payment'  },
  { _id: '5', question: 'Do you handle customs paperwork?',      answer: 'Yes. We generate the commercial invoice and customs declaration automatically based on the shipment details you provide at booking.',                                    category: 'shipping' },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-black/7 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-[15px] text-brand-navy">{question}</span>
        <span className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200',
          open ? 'bg-brand-sky text-white' : 'bg-black/7 text-[#888]'
        )}>
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      <div className={clsx(
        'overflow-hidden transition-all duration-300',
        open ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <p className="text-[14px] text-[#4A4A4A] leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const { data: grouped, isLoading } = useFaqs()
  const [tab, setTab] = useState('shipping')

  const cats  = grouped
    ? Object.keys(grouped).filter((k) => (grouped as any)[k]?.length > 0)
    : ['shipping', 'general']

  const items = grouped
    ? ((grouped as any)[tab] ?? [])
    : FALLBACKS.filter((f) => f.category === tab)

  return (
    <section id="faq" className="section-pad bg-brand-cream border-t border-black/6">
      <div className="container-main">

        <div className="text-center mb-12">
          <p className="label mb-3">Frequently Asked</p>
          <h2 className="font-extrabold text-display-sm text-brand-navy">
            Answers, <span className="text-sky-gradient">in plain English.</span>
          </h2>
        </div>

        {cats.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => setTab(cat)}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                  tab === cat
                    ? 'bg-brand-sky text-white'
                    : 'bg-black/6 text-[#4A4A4A] hover:bg-black/10'
                )}
              >
                {CAT_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-black/7 px-8 py-2" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05)' }}>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-2 border-brand-sky/30 border-t-brand-sky rounded-full animate-spin" />
            </div>
          ) : items.length > 0 ? (
            items.map((f: any, i: number) => (
              <FaqItem key={f._id ?? i} question={f.question} answer={f.answer} />
            ))
          ) : (
            FALLBACKS.map((f) => (
              <FaqItem key={f._id} question={f.question} answer={f.answer} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}