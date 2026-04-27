// ── User ─────────────────────────────────────────────────────────
export interface User {
  _id:            string
  name:           string
  email:          string
  phone?:         string
  account_type:   'individual' | 'company'
  company_name?:  string
  wallet_balance: number
  kyc_status:     'pending' | 'verified' | 'rejected'
  is_admin:       boolean
  email_verified: boolean
  phone_verified: boolean
  avatar_url?:    string
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

// ── KYC ─────────────────────────────────────────────────────────
export type KycStatus       = 'pending' | 'verified' | 'rejected' | 'auto_verified'
export type KycDocumentType = 'aadhaar' | 'pan' | 'gst' | 'company_pan'

export interface Kyc {
  _id:               string
  user_id:           string
  account_type:      'individual' | 'company'
  document_type:     KycDocumentType
  document_number?:  string
  document_image:    string
  status:            KycStatus
  rejection_reason?: string
  verified_by?:      string
  verified_at?:      string
  created_at:        string
  updated_at:        string
}

export interface KycSubmitPayload {
  document_type:    KycDocumentType
  document_number?: string
  document_image:   File
}

// ── Wallet ───────────────────────────────────────────────────────
export interface Wallet {
  balance:  number
  currency: string
}

export type TransactionType = 'credit' | 'debit'

export interface WalletTransaction {
  _id:           string
  user_id:       string
  type:          TransactionType
  amount:        number
  description:   string
  reference?:    string
  balance_after: number
  created_at:    string
}

export interface RechargePayload { amount: number }

// ── Address ──────────────────────────────────────────────────────
export interface Address {
  _id:            string
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

// ── Shipments ────────────────────────────────────────────────────
export type ShipmentStatus = 'pending' | 'booked' | 'in_transit' | 'delivered' | 'failed'

export interface ShipmentSender {
  name: string; company?: string; phone: string; email?: string
  address_line1: string; address_line2?: string
  city: string; state: string; postcode: string; country: string
}

export interface ShipmentReceiver {
  name: string; company?: string; phone: string; email?: string
  address_line1: string; address_line2?: string
  city: string; state: string; postcode: string; country: string
}

export interface ShipmentPackage {
  weight: number; length: number; breadth: number; height: number
  shipment_type: ShipmentType; package_count: number; goods_description?: string
}

export interface ShipmentProduct {
  name: string; hsn_code?: string; value: number; quantity: number
}

export interface Shipment {
  _id:             string
  user_id:         string

  // ── New platform fields (added 2026-04-23) ──
  aerotrek_id:     string | null  // ATK-YYYYMMDD-XXXXXX — primary display ID
  platform:        string         // 'overseas' | 'shiprocket' | 'delhivery' etc.
  platform_ref_id: string | null  // platform's own reference number
  awb_no:          string | null  // actual carrier AWB (DHL/FedEx/UPS)
  tracking_no:     string | null  // same as awb_no for now

  // ── Legacy field — kept for backward compat ──
  awb?:            string         // old field, use awb_no going forward

  carrier:         CarrierName
  service_code:    string
  status:          ShipmentStatus
  sender:          ShipmentSender
  receiver:        ShipmentReceiver
  package:         ShipmentPackage
  products?:       ShipmentProduct[]
  reason_for_export?: string
  incoterms?:      'DDU' | 'DDP'
  rate:            number
  currency:        string
  label_url?:      string
  invoice_url?:    string         // new — invoice PDF URL
  created_at:      string
  updated_at:      string
}

// Booking response — POST /shipments/book
export interface BookingResponse {
  aerotrek_id:     string
  platform:        string
  platform_ref_id: string
  awb_no:          string
  tracking_no:     string
  label_url:       string
  invoice_url?:    string
  wallet_balance:  number         // updated balance after deduction
  shipment:        Shipment       // full shipment object
}

export interface BookShipmentPayload {
  carrier:            CarrierName
  service_code:       string
  rate:               number
  sender:             ShipmentSender
  receiver:           ShipmentReceiver
  package:            ShipmentPackage
  products?:          ShipmentProduct[]
  reason_for_export?: string
  incoterms?:         'DDU' | 'DDP'
}

// ── Tracking ─────────────────────────────────────────────────────
// GET /tracking/{identifier}
// {identifier} can be: aerotrek_id | awb_no | platform_ref_id

export interface TrackingEvent {
  timestamp:   string
  location?:   string
  status:      string
  description: string
}

export interface TrackingResult {
  // New fields
  aerotrek_id:     string | null  // ATK-YYYYMMDD-XXXXXX
  platform:        string         // 'overseas'
  platform_ref_id: string | null
  awb_no:          string | null  // actual carrier AWB

  // Existing fields
  carrier:             string
  service?:            string     // e.g. 'DHL Express'
  status:              ShipmentStatus
  estimated_delivery?: string
  origin?:             string
  destination?:        string
  events:              TrackingEvent[]
}

// Helper — get the best display ID for a shipment
// aerotrek_id if available, fallback to awb_no, then legacy awb
export function getShipmentDisplayId(shipment: Partial<Shipment>): string {
  return shipment.aerotrek_id ?? shipment.awb_no ?? shipment.awb ?? 'N/A'
}

// Helper — get platform display name
export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    overseas:   'Overseas',
    shiprocket: 'Shiprocket',
    delhivery:  'Delhivery',
  }
  return labels[platform] ?? platform
}

// ── CMS ──────────────────────────────────────────────────────────
export interface Page {
  _id: string; title: string; slug: string; content: string
  meta_title?: string; meta_description?: string
  is_published: boolean; created_at: string
}

export interface BlogCategory { _id: string; name: string; slug: string }

export interface BlogPost {
  _id: string; title: string; slug: string
  content?: string; excerpt?: string; featured_image?: string
  category_id?: string; is_published: boolean
  published_at?: string; created_at: string
}

export interface Faq {
  _id: string; question: string; answer: string
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
export interface LandingStat        { value: string; label: string }
export interface LandingFeature     { icon: string; title: string; desc: string }
export interface LandingDestination { country: string; flag: string; transit: string }
export interface LandingTestimonial { name: string; role: string; text: string; rating: number }
export interface LandingStep        { step: number; icon: string; title: string; desc: string }
export interface LandingCtaBanner   { headline: string; subtext: string; cta_primary: string; cta_secondary: string }

// ── Booking Form State ───────────────────────────────────────────
export interface BookingFormState {
  step:              number
  selectedRate:      Rate | null
  sender:            Partial<ShipmentSender>
  receiver:          Partial<ShipmentReceiver>
  packageDetails:    Partial<ShipmentPackage>
  products:          ShipmentProduct[]
  reason_for_export: string
  incoterms:         'DDU' | 'DDP'
  otp?:              string
}

// ── Admin ────────────────────────────────────────────────────────
export interface AdminStats {
  total_users: number; kyc_pending: number
  total_shipments: number; total_revenue: number
}

export interface SettingItem {
  key: string; value: unknown; type: 'text' | 'image' | 'boolean' | 'json'
}

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