// ── User — MySQL + HasUuids ───────────────────────────────────────
export interface User {
  id:             string        // UUID (HasUuids trait)
  name:           string
  email:          string
  phone?:         string
  account_type:   'individual' | 'company'
  company_name?:  string
  kyc_status:     'pending' | 'verified' | 'rejected'
  is_admin:       boolean
  email_verified: boolean
  phone_verified: boolean
  avatar_url?:    string | null
  created_at:     string
  updated_at:     string
}

// ── Auth ─────────────────────────────────────────────────────────
export interface LoginPayload {
  email:    string
  password: string
}

export interface RegisterPayload {
  name:                  string
  email:                 string
  phone:                 string
  password:              string
  password_confirmation: string
  account_type:          'individual' | 'company'
  company_name?:         string
}

export interface AuthResponse {
  success:      boolean
  message:      string
  user:         User
  access_token: string
  token_type:   'bearer'
  expires_in:   number
}

// ── KYC — MySQL ──────────────────────────────────────────────────
export type KycStatus       = 'pending' | 'verified' | 'rejected'
export type KycDocumentType = 'aadhaar' | 'pan' | 'gst' | 'company_pan'

export interface Kyc {
  id:                string    // UUID
  user_id:           string
  account_type:      'individual' | 'company'
  document_type:     KycDocumentType
  document_number:   string    // required in MySQL version
  document_image:    string
  status:            KycStatus
  rejection_reason?: string
  verified_by?:      string
  verified_at?:      string
  created_at:        string
  updated_at:        string
}

// GET /kyc response
export interface KycStatusResponse {
  kyc_status:        KycStatus
  account_type:      'individual' | 'company'
  kyc:               Kyc | null
  allowed_documents: KycDocumentType[]
}

// document_number is REQUIRED in MySQL version
export interface KycSubmitPayload {
  document_type:   KycDocumentType
  document_number: string        // required (min:5, max:30)
  document_image:  File
}

// ── Wallet — Bavix ───────────────────────────────────────────────
// GET /wallet response
export interface WalletBalance {
  wallet_balance: number   // in rupees (already divided by 100)
  currency:       'INR'
}

// Transaction type from Bavix
export type TransactionType = 'deposit' | 'withdraw'

// GET /wallet/transactions — formatted by controller
export interface WalletTransaction {
  id:           string    // UUID
  type:         TransactionType
  amount:       number    // in rupees (already divided by 100)
  description:  string | null
  reference_id: string | null
  gateway:      string | null
  status:       'completed' | 'pending'
  created_at:   string
}

export interface RechargePayload {
  amount: number  // min: 100, max: 100000
}

// POST /wallet/recharge response
export interface RechargeResponse {
  payment_url:    string
  transaction_id?: string
  [key: string]:  unknown
}

// ── Address ──────────────────────────────────────────────────────
export interface Address {
  id:             string    // UUID
  user_id:        string
  name:           string
  company?:       string
  phone:          string
  address_line1:  string
  address_line2?: string
  city:           string
  state:          string
  postcode:       string
  country:        string
  is_default:     boolean
  created_at:     string
}

export interface AddressPayload {
  name:           string
  company?:       string
  phone:          string
  address_line1:  string
  address_line2?: string
  city:           string
  state:          string
  postcode:       string
  country:        string
  is_default?:    boolean
}

// ── Rates ────────────────────────────────────────────────────────
export type ShipmentType = 'Document' | 'Non-Document'
export type CarrierName  = 'DHL' | 'FedEx' | 'UPS' | 'Aramex' | 'SELF'

export interface RateCalculatePayload {
  country:       string
  actual_weight: number
  length:        number
  breadth:       number
  height:        number
  shipment_type: ShipmentType
  postcode:      string
  package_count: number
}

export interface Rate {
  carrier:             CarrierName
  service_name:        string
  service_code:        string
  rate:                number
  currency:            string
  transit_days?:       number
  estimated_delivery?: string
  chargeable_weight:   number
  volumetric_weight:   number
}

// ── Shipment Types ───────────────────────────────────────────────
export type BookingType = 'auto' | 'manual'

export type ShipmentStatus =
  | 'pending_acceptance'
  | 'accepted'
  | 'rejected'
  | 'pending'
  | 'booked'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'

export interface ShipmentPackageItem {
  length: number
  width:  number
  height: number
  weight: number
}

export interface ShipmentProductItem {
  description: string
  hsn_code:    string
  qty:         number
  unit_rate:   number
}

export interface TrackingEvent {
  timestamp:   string
  status:      string
  description: string
  location?:   string
}

// ── Shipment ─────────────────────────────────────────────────────
export interface Shipment {
  id:          string       // UUID (MySQL + HasUuids)
  aerotrek_id: string       // ATK-YYYYMMDD-XXXXXX

  // Platform fields — ADMIN ONLY, never show to users
  platform?:        string
  platform_ref_id?: string

  booking_type: BookingType
  user_id:      string
  status:       ShipmentStatus
  goods_type:   'Document' | 'Non-Document'

  // Carrier info
  carrier?:      string
  service_code?: string
  service_name?: string
  awb_no?:       string
  tracking_no?:  string
  label_url?:    string
  invoice_url?:  string
  price?:        number

  // Sender & Receiver
  sender:   Record<string, string>
  receiver: Record<string, string>

  // Packages & Products
  packages: ShipmentPackageItem[]
  products: ShipmentProductItem[]

  // Details
  invoice_no?:        string
  invoice_date?:      string
  duty_tax?:          string
  reason_for_export?: string
  notes?:             string
  rejection_reason?:  string

  // Tracking
  tracking_events:      TrackingEvent[]
  tracking_updated_at?: string

  created_at: string
  updated_at: string

  // Embedded user — admin view only
  user?: {
    id:     string
    name:   string
    email:  string
    phone?: string
  }
}

// ── Manual Booking ───────────────────────────────────────────────
export interface ManualBookingPayload {
  goods_type:             'Document' | 'Non-Document'
  reason_for_export:      'GIFT' | 'SALE' | 'SAMPLE' | 'RETURN' | 'PERSONAL_USE'
  duty_tax:               'DDU' | 'DDP'
  sender_name:            string
  sender_address_line1:   string
  sender_address_line2?:  string
  sender_city:            string
  sender_state:           string
  sender_pincode:         string
  sender_phone:           string
  receiver_name:          string
  receiver_address_line1: string
  receiver_address_line2?: string
  receiver_city:          string
  receiver_state:         string
  receiver_zipcode:       string
  receiver_country_code:  string
  receiver_phone:         string
  packages:               ShipmentPackageItem[]
  products?:              ShipmentProductItem[]
  invoice_no?:            string
  invoice_date?:          string
  notes?:                 string
}

export interface ManualBookingResponse {
  success:     boolean
  aerotrek_id: string
  status:      'pending_acceptance'
  message:     string
}

// ── Auto Booking ─────────────────────────────────────────────────
export interface BookShipmentPayload {
  carrier:            CarrierName
  service_code:       string
  rate:               number
  sender:             Record<string, string>
  receiver:           Record<string, string>
  package:            Partial<ShipmentPackageItem>
  products?:          ShipmentProductItem[]
  reason_for_export?: string
  incoterms?:         'DDU' | 'DDP'
}

export interface BookingResponse {
  aerotrek_id:     string
  platform:        string
  platform_ref_id: string
  awb_no:          string
  tracking_no:     string
  label_url:       string
  invoice_url?:    string
  wallet_balance:  number
  shipment:        Shipment
}

// ── Admin Payloads ───────────────────────────────────────────────
export interface UpdateBookingPayload {
  awb_no:           string
  carrier:          string
  service_name:     string
  platform:         'overseas' | 'shiprocket'
  platform_ref_id?: string
  label_url?:       string
}

export interface TrackingEventPayload {
  status:      string
  description: string
  location?:   string
}

export interface AdminManualOrdersStats {
  pending_acceptance: number
  accepted:           number
  rejected:           number
  booked_today:       number
}

// ── Tracking Result ──────────────────────────────────────────────
export interface TrackingResult {
  aerotrek_id?:        string | null
  platform?:           string
  platform_ref_id?:    string | null
  awb_no?:             string | null
  carrier:             string
  service?:            string
  status:              ShipmentStatus
  estimated_delivery?: string
  origin?:             string
  destination?:        string
  events:              TrackingEvent[]
}

// ── CMS ──────────────────────────────────────────────────────────
export interface Page {
  id: string; title: string; slug: string; content: string
  meta_title?: string; meta_description?: string
  is_published: boolean; created_at: string
}

export interface BlogCategory { id: string; name: string; slug: string }

export interface BlogPost {
  id: string; title: string; slug: string
  content?: string; excerpt?: string; featured_image?: string
  category_id?: string; is_published: boolean
  published_at?: string; created_at: string
}

export interface Faq {
  id: string; question: string; answer: string
  category: 'shipping' | 'payment' | 'tracking' | 'general'
  order: number; is_published: boolean
}

export interface FaqsGrouped {
  shipping?: Faq[]; payment?: Faq[]; tracking?: Faq[]; general?: Faq[]
}

// ── Site Settings ────────────────────────────────────────────────
export interface SiteSettings {
  site_name?: string; site_email?: string; site_phone?: string
  site_address?: string; site_logo?: string | null; site_favicon?: string | null
  maintenance_mode?: string; meta_title?: string; meta_description?: string
  social_facebook?: string; social_instagram?: string
  social_twitter?: string; social_linkedin?: string
  contact_email?: string; contact_phone?: string; contact_address?: string
  social_links?: { facebook?: string; instagram?: string; twitter?: string; linkedin?: string }
  landing_hero?: LandingHero; landing_stats?: LandingStat[]
  landing_carriers?: string[]; landing_features?: LandingFeature[]
  landing_destinations?: LandingDestination[]; landing_testimonials?: LandingTestimonial[]
  landing_how_it_works?: LandingStep[]; landing_cta_banner?: LandingCtaBanner
  [key: string]: unknown
}

export interface LandingHero        { headline: string; subtext: string; cta_primary: string; cta_secondary: string }
export interface LandingHero        { headline: string; subtext: string; cta_primary: string; cta_secondary: string }
export interface LandingStat        { value: string; label: string }
export interface LandingFeature     { icon: string; title: string; desc: string }
export interface LandingDestination { country: string; flag: string; transit: string }
export interface LandingTestimonial { name: string; role: string; text: string; rating: number }
export interface LandingStep        { step: number; icon: string; title: string; desc: string }
export interface LandingCtaBanner   { headline: string; subtext: string; cta_primary: string; cta_secondary: string }

// ── Pagination ───────────────────────────────────────────────────
export interface PaginatedData<T> {
  data:         T[]
  current_page: number
  last_page:    number
  per_page:     number
  total:        number
  from:         number
  to:           number
}

// ── Admin ────────────────────────────────────────────────────────
export interface AdminStats {
  total_users: number; kyc_pending: number
  total_shipments: number; total_revenue: number
}

export interface SettingItem {
  key: string; value: unknown; type: 'text' | 'image' | 'boolean' | 'json'
}

// ── Status config ────────────────────────────────────────────────
export const STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: string }> = {
  pending_acceptance: { label: 'Awaiting Review',   color: 'bg-yellow-100 text-yellow-700'  },
  accepted:           { label: 'Accepted',           color: 'bg-blue-100 text-blue-700'     },
  rejected:           { label: 'Rejected',           color: 'bg-red-100 text-red-700'       },
  pending:            { label: 'Pending',            color: 'bg-gray-100 text-gray-600'     },
  booked:             { label: 'Booked',             color: 'bg-indigo-100 text-indigo-700' },
  picked_up:          { label: 'Picked Up',          color: 'bg-teal-100 text-teal-700'    },
  in_transit:         { label: 'In Transit',         color: 'bg-blue-100 text-blue-700'    },
  out_for_delivery:   { label: 'Out for Delivery',   color: 'bg-orange-100 text-orange-700'},
  delivered:          { label: 'Delivered',          color: 'bg-green-100 text-green-700'  },
  failed:             { label: 'Failed',             color: 'bg-red-100 text-red-700'      },
}

// ── Helpers ──────────────────────────────────────────────────────
export function getShipmentDisplayId(s: Partial<Shipment>): string {
  return s.aerotrek_id ?? s.awb_no ?? s.id ?? 'N/A'
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    overseas: 'Overseas', shiprocket: 'Shiprocket', delhivery: 'Delhivery',
  }
  return labels[platform] ?? platform
}