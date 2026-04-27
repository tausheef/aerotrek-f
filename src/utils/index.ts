// ── Currency ─────────────────────────────────────────────────────
export function formatINR(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

// ── Date ─────────────────────────────────────────────────────────
export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', opts ?? {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(dateStr: string): string {
  const now  = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800)return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateStr)
}

// ── Weight & Dimensions ──────────────────────────────────────────
export function calcVolumetricWeight(
  length: number,
  breadth: number,
  height: number,
  divisor = 5000
): number {
  return parseFloat(((length * breadth * height) / divisor).toFixed(2))
}

export function calcChargeableWeight(
  actualWeight: number,
  length: number,
  breadth: number,
  height: number
): number {
  const vol = calcVolumetricWeight(length, breadth, height)
  return Math.max(actualWeight, vol)
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(2)} kg`
}

// ── String ───────────────────────────────────────────────────────
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}

export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugToTitle(slug: string): string {
  return slug.split('-').map(capitalize).join(' ')
}

// ── Shipment status ──────────────────────────────────────────────
export const STATUS_LABELS: Record<string, string> = {
  pending:    'Pending',
  booked:     'Booked',
  in_transit: 'In Transit',
  delivered:  'Delivered',
  failed:     'Failed',
}

export const STATUS_CLASSES: Record<string, string> = {
  pending:    'badge-pending',
  booked:     'badge-booked',
  in_transit: 'badge-in_transit',
  delivered:  'badge-delivered',
  failed:     'badge-failed',
}

// ── Countries (common for India-origin shipments) ─────────────────
export const POPULAR_COUNTRIES = [
  { code: 'US', name: 'United States',   flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom',  flag: '🇬🇧' },
  { code: 'CA', name: 'Canada',          flag: '🇨🇦' },
  { code: 'AU', name: 'Australia',       flag: '🇦🇺' },
  { code: 'AE', name: 'UAE',             flag: '🇦🇪' },
  { code: 'NZ', name: 'New Zealand',     flag: '🇳🇿' },
  { code: 'DE', name: 'Germany',         flag: '🇩🇪' },
  { code: 'FR', name: 'France',          flag: '🇫🇷' },
  { code: 'SG', name: 'Singapore',       flag: '🇸🇬' },
  { code: 'JP', name: 'Japan',           flag: '🇯🇵' },
  { code: 'NL', name: 'Netherlands',     flag: '🇳🇱' },
  { code: 'IT', name: 'Italy',           flag: '🇮🇹' },
  { code: 'ES', name: 'Spain',           flag: '🇪🇸' },
  { code: 'CH', name: 'Switzerland',     flag: '🇨🇭' },
  { code: 'SA', name: 'Saudi Arabia',    flag: '🇸🇦' },
]

export const ALL_COUNTRIES = [
  ...POPULAR_COUNTRIES,
  { code: 'AF', name: 'Afghanistan',     flag: '🇦🇫' },
  { code: 'AL', name: 'Albania',         flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria',         flag: '🇩🇿' },
  { code: 'AR', name: 'Argentina',       flag: '🇦🇷' },
  { code: 'AT', name: 'Austria',         flag: '🇦🇹' },
  { code: 'BD', name: 'Bangladesh',      flag: '🇧🇩' },
  { code: 'BE', name: 'Belgium',         flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil',          flag: '🇧🇷' },
  { code: 'CN', name: 'China',           flag: '🇨🇳' },
  { code: 'EG', name: 'Egypt',           flag: '🇪🇬' },
  { code: 'GH', name: 'Ghana',           flag: '🇬🇭' },
  { code: 'HK', name: 'Hong Kong',       flag: '🇭🇰' },
  { code: 'ID', name: 'Indonesia',       flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland',         flag: '🇮🇪' },
  { code: 'IL', name: 'Israel',          flag: '🇮🇱' },
  { code: 'KE', name: 'Kenya',           flag: '🇰🇪' },
  { code: 'KW', name: 'Kuwait',          flag: '🇰🇼' },
  { code: 'MY', name: 'Malaysia',        flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico',          flag: '🇲🇽' },
  { code: 'NG', name: 'Nigeria',         flag: '🇳🇬' },
  { code: 'NO', name: 'Norway',          flag: '🇳🇴' },
  { code: 'OM', name: 'Oman',            flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan',        flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines',     flag: '🇵🇭' },
  { code: 'PL', name: 'Poland',          flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal',        flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar',           flag: '🇶🇦' },
  { code: 'RU', name: 'Russia',          flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa',    flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea',     flag: '🇰🇷' },
  { code: 'SE', name: 'Sweden',          flag: '🇸🇪' },
  { code: 'TH', name: 'Thailand',        flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey',          flag: '🇹🇷' },
  { code: 'UA', name: 'Ukraine',         flag: '🇺🇦' },
  { code: 'VN', name: 'Vietnam',         flag: '🇻🇳' },
  { code: 'ZW', name: 'Zimbabwe',        flag: '🇿🇼' },
].sort((a, b) => a.name.localeCompare(b.name))

// ── CMS defaults ─────────────────────────────────────────────────
export const DEFAULT_CMS = {
  site_name:    'AeroTrek',
  contact_email:'hello@aerotrek.in',
  contact_phone:'+91 98765 43210',

  landing_hero: {
    headline:      'Ship Globally.\nPay in INR.',
    subtext:       'Compare live rates from DHL, FedEx, UPS, Aramex and our own network. Book in minutes, track in real time.',
    cta_primary:   'Get Started',
    cta_secondary: 'Track Package',
  },

  landing_stats: [
    { value: '200+',  label: 'Countries served'   },
    { value: '12M+',  label: 'Parcels delivered'  },
    { value: '99.4%', label: 'On-time rate'        },
    { value: '4.8/5', label: 'Avg. review score'  },
  ],

  landing_carriers: ['DHL', 'FedEx', 'UPS', 'Aramex', 'BlueDart', 'DTDC'],

  landing_features: [
    { icon: 'tag',        title: 'Competitive Rates',   desc: 'Live rates from 5+ carriers. Always the best price for your shipment.' },
    { icon: 'map-pin',    title: 'Real-time Tracking',  desc: 'Track every parcel live — pickup, customs, out for delivery.' },
    { icon: 'shield',     title: 'KYC-secured',         desc: 'One-time KYC verification for secure, compliant international shipping.' },
    { icon: 'layers',     title: 'Multiple Carriers',   desc: 'DHL, FedEx, UPS, Aramex, and our own network in one platform.' },
    { icon: 'wallet',     title: 'INR Wallet',          desc: 'Recharge in rupees. No foreign exchange surprises on your bill.' },
    { icon: 'zap',        title: 'Fast Booking',        desc: 'Book a shipment and print your label in under 2 minutes.' },
  ],

  landing_destinations: [
    { country: 'United States', flag: '🇺🇸', transit: '5–7 days'  },
    { country: 'UK',            flag: '🇬🇧', transit: '4–6 days'  },
    { country: 'Canada',        flag: '🇨🇦', transit: '6–9 days'  },
    { country: 'UAE',           flag: '🇦🇪', transit: '2–4 days'  },
    { country: 'Australia',     flag: '🇦🇺', transit: '5–8 days'  },
    { country: 'Germany',       flag: '🇩🇪', transit: '5–7 days'  },
    { country: 'Singapore',     flag: '🇸🇬', transit: '3–5 days'  },
    { country: 'New Zealand',   flag: '🇳🇿', transit: '7–10 days' },
  ],

  landing_testimonials: [
    { name: 'Priya Sharma',    role: 'Individual Sender',    rating: 5, text: 'Sent a parcel to my sister in London. The whole process took less than 5 minutes and tracking was perfect throughout.' },
    { name: 'Rajan Mehta',     role: 'Small Business Owner', rating: 5, text: 'We ship handmade products to the US and Canada every week. AeroTrek gives us the best rates and the KYC was a one-time thing.' },
    { name: 'Zara Exports Pvt', role: 'E-commerce Seller',  rating: 4, text: 'Moved from a big aggregator to AeroTrek. Rates are 15-20% cheaper and the wallet system makes billing so much easier.' },
  ],

  landing_how_it_works: [
    { step: 1, icon: 'user-plus',    title: 'Create Account',   desc: 'Sign up in seconds. Individual or company — both welcome.' },
    { step: 2, icon: 'shield-check', title: 'Verify KYC',       desc: 'One-time document verification. Aadhaar, PAN, or GST.' },
    { step: 3, icon: 'wallet',       title: 'Recharge Wallet',  desc: 'Add INR balance via UPI, net banking, or card through PayU.' },
    { step: 4, icon: 'send',         title: 'Book Shipment',    desc: 'Compare rates, fill details, print label. Done.' },
  ],

  landing_cta_banner: {
    headline:      'Ready to ship worldwide?',
    subtext:       'Create a free account and book your first pickup in under 2 minutes.',
    cta_primary:   'Create Account',
    cta_secondary: 'Book a Pickup',
  },
}
