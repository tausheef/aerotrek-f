import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Package, MapPin, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks'
import type { LoginPayload } from '../types'
import clsx from 'clsx'

const schema = z.object({
  email:    z.string().min(1, 'Email is required').email('Please provide a valid email address.'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

// ── Animated left panel ──────────────────────────────────────────
const FLOATING_CARDS = [
  { awb: 'AWB 8429-1044-77', status: 'In transit · Dubai',    carrier: 'DHL',   delay: 0    },
  { awb: 'AWB FEDX-9042',    status: 'Delivered · London',    carrier: 'FedEx', delay: 1200 },
  { awb: 'AWB UPS-1Z880W',   status: 'Out for delivery · NYC',carrier: 'UPS',   delay: 2400 },
]

const STATS = [
  { value: '200+', label: 'Countries' },
  { value: '12M+', label: 'Parcels'   },
  { value: '99.4%',label: 'On-time'   },
]

function LeftPanel() {
  const [activeCard, setActiveCard] = useState(0)
  const [visible,    setVisible]    = useState(false)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % FLOATING_CARDS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 relative overflow-hidden"
      style={{ background: '#0D0D0D' }}>

      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-dark pointer-events-none" />

      {/* Sky glow orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,191,255,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,191,255,0.08) 0%, transparent 70%)' }} />

      {/* Animated route lines SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <svg className="w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <path d="M-50 400 Q150 200 300 400 Q450 600 650 400" stroke="#00BFFF" strokeWidth="1.5"
            strokeDasharray="8 6" fill="none" opacity="0.6">
            <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="4s" repeatCount="indefinite"/>
          </path>
          <path d="M-50 500 Q150 300 300 500 Q450 700 650 500" stroke="#00BFFF" strokeWidth="1"
            strokeDasharray="6 8" fill="none" opacity="0.4">
            <animate attributeName="stroke-dashoffset" from="0" to="-200" dur="6s" repeatCount="indefinite"/>
          </path>
          <path d="M100 100 Q300 50 500 200" stroke="#00BFFF" strokeWidth="1"
            strokeDasharray="5 8" fill="none" opacity="0.3">
            <animate attributeName="stroke-dashoffset" from="0" to="-150" dur="5s" repeatCount="indefinite"/>
          </path>
          {/* City dots */}
          {[[80,280],[300,400],[520,320],[150,560],[420,180]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#00BFFF" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
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
      <div className={clsx('relative z-10 transition-all duration-700 delay-200', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
        <p className="text-[11px] font-semibold text-brand-sky uppercase tracking-[0.18em] mb-4">
          International Shipping Platform
        </p>
        <h2 className="font-extrabold text-4xl text-white leading-[1.1] tracking-tight mb-6">
          Ship globally.<br />
          <span className="text-sky-gradient">Pay in INR.</span>
        </h2>
        <p className="text-[15px] text-white/50 leading-relaxed max-w-xs">
          Compare live rates from DHL, FedEx, UPS and Aramex. Book in minutes, track in real time.
        </p>

        {/* Stats */}
        <div className="flex gap-6 mt-8">
          {STATS.map((s, i) => (
            <div key={i} className={clsx('transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
              style={{ transitionDelay: `${400 + i * 100}ms` }}>
              <p className="font-extrabold text-2xl text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating tracking cards */}
      <div className="relative z-10 space-y-3">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-3">
          Live Shipments
        </p>
        {FLOATING_CARDS.map((card, i) => (
          <div
            key={i}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-2xl border transition-all duration-500',
              activeCard === i
                ? 'border-brand-sky/30 scale-[1.02]'
                : 'border-white/8 scale-100'
            )}
            style={{
              background: activeCard === i ? 'rgba(0,191,255,0.08)' : 'rgba(255,255,255,0.04)',
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,191,255,0.12)' }}>
              <Package size={14} className="text-brand-sky" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{card.awb}</p>
              <p className="text-[11px] text-white/40 truncate">{card.status}</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: 'rgba(0,191,255,0.15)', color: '#00BFFF' }}>
              {card.carrier}
            </span>
          </div>
        ))}

        {/* Carrier strip */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/6 mt-4">
          <span className="text-[10px] text-white/25 uppercase tracking-wide">Powered by</span>
          {['DHL', 'FedEx', 'UPS', 'Aramex'].map((c) => (
            <span key={c} className="text-xs font-bold text-white/30">{c}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Login page ───────────────────────────────────────────────────
export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [visible,  setVisible]  = useState(false)
  const { login, loginPending } = useAuth()
  const navigate                = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data as LoginPayload)
      navigate('/dashboard')
    } catch {}
  }

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

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
          <div className="w-full max-w-[400px]">

            {/* Header */}
            <div className={clsx('mb-8 transition-all duration-600', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
              <h1 className="font-extrabold text-[2rem] text-brand-navy tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-[15px] text-[#4A4A4A]">
                Sign in to continue shipping
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Email */}
              <div className={clsx('transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '100ms' }}>
                <label className="block text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em] mb-2">
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-base text-[15px] py-3.5 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className={clsx('transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '180ms' }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#4A4A4A] uppercase tracking-[0.12em]">
                    Password
                  </label>
                  <Link to="/p/forgot-password" className="text-xs text-brand-sky hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`input-base text-[15px] py-3.5 pr-12 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-brand-navy transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <div className={clsx('transition-all duration-500 mt-2', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '260ms' }}>
                <button
                  type="submit"
                  disabled={loginPending}
                  className="btn-primary w-full py-4 text-[15px] font-bold justify-center rounded-2xl"
                  style={{ boxShadow: '0 4px 20px rgba(0,191,255,0.3)' }}
                >
                  {loginPending
                    ? <><Loader2 size={17} className="animate-spin" /> Signing in...</>
                    : <>Sign in <ArrowRight size={17} /></>
                  }
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className={clsx('flex items-center gap-3 my-6 transition-all duration-500', visible ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: '320ms' }}>
              <div className="flex-1 h-px bg-black/8" />
              <span className="text-xs text-[#888] font-medium">or</span>
              <div className="flex-1 h-px bg-black/8" />
            </div>

            {/* Register link */}
            <div className={clsx('transition-all duration-500', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')}
              style={{ transitionDelay: '360ms' }}>
              <p className="text-center text-[14px] text-[#4A4A4A]">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-sky font-bold hover:underline">
                  Create account
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className={clsx('text-center text-[11px] text-[#888] mt-6 transition-all duration-500', visible ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: '400ms' }}>
              By signing in you agree to our{' '}
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