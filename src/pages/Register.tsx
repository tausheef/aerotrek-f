import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2, User, Building2, ShieldCheck, Wallet, Send } from 'lucide-react'
import { useAuth } from '../hooks'
import type { RegisterPayload } from '../types'
import clsx from 'clsx'

const schema = z.object({
  name:                  z.string().min(2, 'Name must be at least 2 characters.').max(100),
  email:                 z.string().min(1, 'Email is required.').email('Please provide a valid email address.'),
  phone:                 z.string().min(10, 'Phone must be at least 10 digits.').max(15, 'Phone must not exceed 15 digits.'),
  password:              z.string().min(8, 'Password must be at least 8 characters.'),
  password_confirmation: z.string().min(1, 'Please confirm your password.'),
  account_type:          z.enum(['individual', 'company']),
  company_name:          z.string().max(150).optional(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Password confirmation does not match.',
  path:    ['password_confirmation'],
}).refine((d) => {
  if (d.account_type === 'company' && !d.company_name?.trim()) return false
  return true
}, {
  message: 'Company name is required for company accounts.',
  path:    ['company_name'],
})

type FormData = z.infer<typeof schema>

// ── Left Panel ───────────────────────────────────────────────────
const STEPS = [
  { icon: <User size={16} />,         title: 'Create Account',  desc: 'Sign up in seconds' },
  { icon: <ShieldCheck size={16} />,  title: 'Verify KYC',      desc: 'One-time verification' },
  { icon: <Wallet size={16} />,       title: 'Recharge Wallet', desc: 'Add INR balance' },
  { icon: <Send size={16} />,         title: 'Book Shipment',   desc: 'Ship anywhere' },
]

function LeftPanel() {
  const [visible,   setVisible]   = useState(false)
  const [activeStep,setActiveStep] = useState(0)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 relative overflow-hidden"
      style={{ background: '#0D0D0D' }}>

      <div className="absolute inset-0 bg-dot-dark pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,191,255,0.1) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,191,255,0.07) 0%, transparent 70%)' }} />

      {/* Animated route lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <svg className="w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <path d="M0 300 Q200 150 400 300 Q550 420 650 280" stroke="#00BFFF" strokeWidth="1.5"
            strokeDasharray="8 6" fill="none">
            <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="5s" repeatCount="indefinite"/>
          </path>
          <path d="M0 500 Q200 350 400 500 Q550 620 650 480" stroke="#00BFFF" strokeWidth="1"
            strokeDasharray="6 8" fill="none">
            <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="7s" repeatCount="indefinite"/>
          </path>
          {[[100,200],[300,300],[500,250],[200,500],[420,420]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="#00BFFF" opacity="0.4">
              <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${2.5+i*0.4}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>
      </div>

      {/* Logo */}
      <div className={clsx('relative z-10 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
        <Link to="/" className="inline-flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,3 26,24 2,24" fill="#00BFFF"/>
          </svg>
          <span className="font-bold text-xl text-white tracking-tight">
            AEROTREK<span className="text-brand-sky">.</span>
          </span>
        </Link>
      </div>

      {/* Main copy */}
      <div className={clsx('relative z-10 transition-all duration-700 delay-150', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
        <p className="text-[11px] font-semibold text-brand-sky uppercase tracking-[0.18em] mb-4">
          Get Started Today
        </p>
        <h2 className="font-extrabold text-4xl text-white leading-[1.1] tracking-tight mb-5">
          Join 50,000+<br />
          <span className="text-sky-gradient">shippers worldwide.</span>
        </h2>
        <p className="text-[14px] text-white/45 leading-relaxed max-w-xs">
          Create your free account and start shipping internationally in under 2 minutes.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {['No monthly fees', 'INR payments', 'KYC once', 'Live tracking'].map((f) => (
            <span key={f} className="text-[11px] font-semibold px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'rgba(0,191,255,0.2)', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,191,255,0.06)' }}>
              ✓ {f}
            </span>
          ))}
        </div>
      </div>

      {/* Animated steps */}
      <div className="relative z-10">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-4">
          How it works
        </p>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={clsx(
                'flex items-center gap-3 p-3 rounded-xl border transition-all duration-500',
                activeStep === i
                  ? 'border-brand-sky/30 scale-[1.02]'
                  : 'border-white/6'
              )}
              style={{
                background: activeStep === i ? 'rgba(0,191,255,0.08)' : 'rgba(255,255,255,0.03)',
              }}
            >
              <div className={clsx(
                'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                activeStep === i ? 'bg-brand-sky text-brand-navy' : 'text-white/30'
              )}
                style={{ background: activeStep === i ? '#00BFFF' : 'rgba(255,255,255,0.06)' }}>
                {step.icon}
              </div>
              <div>
                <p className={clsx('text-xs font-bold transition-colors duration-300', activeStep === i ? 'text-white' : 'text-white/40')}>
                  {step.title}
                </p>
                <p className="text-[11px] text-white/25">{step.desc}</p>
              </div>
              {activeStep === i && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Register page ────────────────────────────────────────────────
export default function Register() {
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [visible,     setVisible]     = useState(false)

  const { register: registerUser, registerPending } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { account_type: 'individual' },
  })

  const accountType = watch('account_type')

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data as RegisterPayload)
      navigate('/dashboard')
    } catch {}
  }

  const fields = [
    { key: 'name',  delay: 100 },
    { key: 'email', delay: 160 },
    { key: 'phone', delay: 220 },
    { key: 'password', delay: 280 },
    { key: 'password_confirmation', delay: 340 },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left — dark panel */}
      <div className="lg:w-[45%] shrink-0">
        <LeftPanel />
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col bg-brand-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-cream opacity-40 pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden relative z-10 p-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <polygon points="14,3 26,24 2,24" fill="#00BFFF"/>
            </svg>
            <span className="font-bold text-[15px] text-brand-navy tracking-tight">
              AEROTREK<span className="text-brand-sky">.</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
          <div className="w-full max-w-[420px]">

            {/* Header */}
            <div className={clsx('mb-7 transition-all duration-600', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
              <h1 className="font-extrabold text-[1.9rem] text-brand-navy tracking-tight mb-1.5">
                Create your account
              </h1>
              <p className="text-[14px] text-[#4A4A4A]">
                Start shipping internationally in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Account type toggle */}
              <div className={clsx('transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '50ms' }}>
                <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">
                  Account type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)' }}>
                  {(['individual', 'company'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue('account_type', type)}
                      className={clsx(
                        'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                        accountType === type
                          ? 'bg-white text-brand-navy shadow-sm'
                          : 'text-[#888] hover:text-brand-navy'
                      )}
                    >
                      {type === 'individual'
                        ? <><User size={14} /> Individual</>
                        : <><Building2 size={14} /> Company</>
                      }
                    </button>
                  ))}
                </div>
              </div>

              {/* Company name */}
              {accountType === 'company' && (
                <div className="transition-all duration-300 animate-fade-up">
                  <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">
                    Company name
                  </label>
                  <input
                    {...register('company_name')}
                    type="text"
                    placeholder="Your company name"
                    className={`input-base py-3.5 ${errors.company_name ? 'border-red-400' : ''}`}
                  />
                  {errors.company_name && <p className="mt-1.5 text-xs text-red-500">{errors.company_name.message}</p>}
                </div>
              )}

              {/* Name */}
              <div className={clsx('transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '100ms' }}>
                <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">
                  Full name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  className={`input-base py-3.5 ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email + Phone side by side */}
              <div className={clsx('grid grid-cols-2 gap-3 transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '160ms' }}>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`input-base py-3.5 text-sm ${errors.email ? 'border-red-400' : ''}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500 leading-tight">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">Phone</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+91 98765..."
                    autoComplete="tel"
                    className={`input-base py-3.5 text-sm ${errors.phone ? 'border-red-400' : ''}`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500 leading-tight">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Password + Confirm side by side */}
              <div className={clsx('grid grid-cols-2 gap-3 transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '220ms' }}>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">Password</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min. 8 chars"
                      autoComplete="new-password"
                      className={`input-base py-3.5 pr-10 text-sm ${errors.password ? 'border-red-400' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-brand-navy transition-colors">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500 leading-tight">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">Confirm</label>
                  <div className="relative">
                    <input
                      {...register('password_confirmation')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat"
                      autoComplete="new-password"
                      className={`input-base py-3.5 pr-10 text-sm ${errors.password_confirmation ? 'border-red-400' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-brand-navy transition-colors">
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="mt-1 text-xs text-red-500 leading-tight">{errors.password_confirmation.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <div className={clsx('transition-all duration-500 mt-1', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '300ms' }}>
                <button
                  type="submit"
                  disabled={registerPending}
                  className="btn-primary w-full py-4 text-[15px] font-bold justify-center rounded-2xl"
                  style={{ boxShadow: '0 4px 20px rgba(0,191,255,0.3)' }}
                >
                  {registerPending
                    ? <><Loader2 size={17} className="animate-spin" /> Creating account...</>
                    : <>Create account <ArrowRight size={17} /></>
                  }
                </button>
              </div>
            </form>

            {/* Login link */}
            <div className={clsx('mt-6 transition-all duration-500', visible ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: '360ms' }}>
              <p className="text-center text-[14px] text-[#4A4A4A]">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-sky font-bold hover:underline">Sign in</Link>
              </p>
            </div>

            {/* Terms */}
            <p className={clsx('text-center text-[11px] text-[#888] mt-4 transition-all duration-500', visible ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: '400ms' }}>
              By creating an account you agree to our{' '}
              <Link to="/p/terms-and-conditions" className="hover:text-brand-sky transition-colors">Terms</Link>
              {' '}&{' '}
              <Link to="/p/privacy-policy" className="hover:text-brand-sky transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}