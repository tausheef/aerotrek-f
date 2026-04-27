import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Package, Search } from 'lucide-react'
import { useCmsSettings } from '../../hooks'
import { DEFAULT_CMS } from '../../utils'

// ── CSS 3D Tilt Container ────────────────────────────────────────
function Container3D() {
  const ref        = useRef<HTMLDivElement>(null)
  const frameRef   = useRef<number>(0)
  const currentRot = useRef({ x: 0, y: 0 })
  const targetRot  = useRef({ x: 0, y: 0 })

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) / (rect.width  / 2)
    const dy   = (e.clientY - cy) / (rect.height / 2)
    targetRot.current = { x: -dy * 18, y: dx * 22 }
  }, [])

  const onMouseLeave = useCallback(() => {
    targetRot.current = { x: 0, y: 0 }
  }, [])

  const animate = useCallback(() => {
    const el = ref.current
    if (!el) return
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    currentRot.current.x = lerp(currentRot.current.x, targetRot.current.x, 0.08)
    currentRot.current.y = lerp(currentRot.current.y, targetRot.current.y, 0.08)
    el.style.transform = `perspective(900px) rotateX(${currentRot.current.x}deg) rotateY(${currentRot.current.y}deg)`
    frameRef.current = requestAnimationFrame(animate)
  }, [])

  const startLoop = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(animate)
  }, [animate])

  return (
    <div
      className="relative w-full max-w-2xl mx-auto cursor-pointer select-none"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={startLoop}
      style={{ perspective: '900px' }}
    >
      {/* Glow underneath */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'rgba(0,191,255,0.18)' }} />

      {/* 3D tilt wrapper */}
      <div ref={ref} style={{ transformStyle: 'preserve-3d', transition: 'transform 0.05s linear', willChange: 'transform' }}>
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" className="w-full"
          style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.35))' }}>
          <defs>
            <linearGradient id="topFace"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%"   stopColor="#2A3340"/><stop offset="100%" stopColor="#1A2230"/></linearGradient>
            <linearGradient id="frontFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"   stopColor="#1E2A38"/><stop offset="40%"  stopColor="#162030"/><stop offset="100%" stopColor="#0E1820"/></linearGradient>
            <linearGradient id="sideFace"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#0A1220"/><stop offset="100%" stopColor="#162030"/></linearGradient>
            <pattern id="corrugation" x="0" y="0" width="28" height="260" patternUnits="userSpaceOnUse">
              <rect x="0"  y="0" width="2" height="260" fill="rgba(255,255,255,0.04)"/>
              <rect x="14" y="0" width="2" height="260" fill="rgba(0,0,0,0.15)"/>
              <rect x="26" y="0" width="2" height="260" fill="rgba(255,255,255,0.02)"/>
            </pattern>
            <pattern id="sideCorrugation" x="0" y="0" width="14" height="220" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="1" height="220" fill="rgba(255,255,255,0.03)"/>
              <rect x="7" y="0" width="1" height="220" fill="rgba(0,0,0,0.1)"/>
            </pattern>
          </defs>
          {/* Top face */}
          <polygon points="80,30 680,30 760,80 160,80" fill="url(#topFace)"/>
          <polygon points="80,30 680,30 760,80 160,80" fill="rgba(255,255,255,0.03)"/>
          <line x1="80"  y1="30" x2="680" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
          <line x1="680" y1="30" x2="760" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          {/* Side face */}
          <polygon points="760,80 760,300 680,340 680,80" fill="url(#sideFace)"/>
          <polygon points="760,80 760,300 680,340 680,80" fill="url(#sideCorrugation)" opacity="0.6"/>
          <line x1="760" y1="80"  x2="760" y2="300" stroke="rgba(0,0,0,0.4)"       strokeWidth="1"/>
          <line x1="760" y1="300" x2="680" y2="340" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          {/* Front face */}
          <polygon points="160,80 760,80 680,340 80,340" fill="url(#frontFace)"/>
          <polygon points="160,80 760,80 680,340 80,340" fill="url(#corrugation)" opacity="0.9"/>
          <line x1="80"  y1="340" x2="680" y2="340" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          <line x1="160" y1="80"  x2="80"  y2="340" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          {/* Horizontal rails */}
          {[130,180,280,330].map((y,i) => <line key={i} x1={160-(y-80)*0.133} y1={y} x2={760-(y-80)*0.133} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>)}
          {/* Door panels */}
          <polygon points="220,95 410,95 390,330 195,330" fill="rgba(0,0,0,0.12)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <polygon points="420,95 610,95 595,330 400,330" fill="rgba(0,0,0,0.08)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <line x1="413" y1="95"  x2="393" y2="330" stroke="rgba(255,255,255,0.1)"  strokeWidth="2"/>
          <rect x="390" y="190" width="8" height="30" rx="3" fill="rgba(255,255,255,0.15)"/>
          <rect x="404" y="190" width="8" height="30" rx="3" fill="rgba(255,255,255,0.12)"/>
          <line x1="310" y1="95"  x2="293" y2="330" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
          <line x1="510" y1="95"  x2="497" y2="330" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
          {/* AEROTREK sky blue stripe */}
          <polygon points="160,148 760,148 748,178 148,178" fill="#00BFFF" opacity="0.92"/>
          <text x="415" y="170" textAnchor="middle" fill="#0D0D0D" fontSize="22" fontWeight="900" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="8">AEROTREK</text>
          {/* Container ID */}
          <text x="200" y="118" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" fontWeight="600">ATK-8  4421  887</text>
          <text x="200" y="132" fill="rgba(255,255,255,0.2)" fontSize="9"  fontFamily="monospace">TARE: 2,200 KG   MAX: 28,800 KG</text>
          {/* ISO code */}
          <text x="610" y="118" fill="rgba(255,255,255,0.25)" fontSize="10" fontFamily="monospace" fontWeight="600" textAnchor="middle">45G1</text>
          {/* Corner castings */}
          {[[160,80],[680,80],[80,340],[620,340]].map(([x,y],i) => (
            <rect key={i} x={x-8} y={y-6} width="16" height="12" rx="2" fill="#2A3A4A" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
          ))}
          {/* Shine */}
          <polygon points="160,80 420,80 410,95 150,95" fill="rgba(255,255,255,0.04)"/>
        </svg>
      </div>

      {/* AWB badge */}
      <div className="absolute bottom-8 right-4 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2.5" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.09)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,191,255,0.1)' }}>
          <Package size={14} className="text-brand-sky" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#888] uppercase tracking-wide">AWB 8429-1044-77</p>
          <p className="text-xs font-bold text-brand-navy">In transit · Dubai</p>
        </div>
      </div>

      {/* ETA badge */}
      <div className="absolute top-4 right-4 rounded-full px-3 py-1.5 flex items-center gap-2 border"
        style={{ background: 'rgba(13,13,13,0.85)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse" />
        <span className="text-white text-xs font-semibold">ETA Apr 22 · 14:30</span>
      </div>

      {/* 360 badge */}
      <div className="absolute bottom-8 left-4 w-11 h-11 rounded-full bg-brand-sky flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0,191,255,0.4)' }}>
        <span className="text-[9px] font-black text-brand-navy">360°</span>
      </div>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────
export default function Hero() {
  const { data: settings } = useCmsSettings()
  const stats              = settings?.landing_stats ?? DEFAULT_CMS.landing_stats
  const navigate           = useNavigate()
  const [awb, setAwb]      = useState('')

  const handleTrack = () => {
    if (awb.trim()) navigate(`/track?awb=${encodeURIComponent(awb.trim())}`)
    else navigate('/track')
  }

  return (
    <section className="relative bg-brand-cream overflow-hidden pt-[68px]">
      <div className="absolute inset-0 bg-dot-cream pointer-events-none opacity-50" />

      {/* Route lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full opacity-[0.035]" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <path d="M-100 400 Q360 150 720 400 Q1080 650 1540 400" stroke="#00BFFF" strokeWidth="2" strokeDasharray="8 6" fill="none"/>
          <path d="M-100 500 Q360 250 720 500 Q1080 750 1540 500" stroke="#00BFFF" strokeWidth="1.5" strokeDasharray="5 8" fill="none"/>
          <circle cx="720" cy="400" r="4" fill="#00BFFF" opacity="0.5"/>
          <circle cx="360" cy="275" r="3" fill="#00BFFF" opacity="0.3"/>
          <circle cx="1080" cy="525" r="3" fill="#00BFFF" opacity="0.3"/>
        </svg>
      </div>

      <div className="container-main relative z-10">

        {/* Pill */}
        <div className="flex justify-center pt-10 mb-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse" />
            <span className="text-xs font-semibold text-brand-navy tracking-wide">Trusted in 214 countries</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-5">
          <h1 className="font-extrabold text-display-lg text-brand-navy leading-[1.02] tracking-[-0.03em] mb-5">
            Delivering your cargo
            <br className="hidden sm:block" />
            <span className="text-sky-gradient"> ⊕ Worldwide</span>
          </h1>
          <p className="text-[17px] text-[#4A4A4A] max-w-lg mx-auto leading-relaxed font-medium">
            Book once, ship anywhere. Compare live rates from DHL, FedEx, UPS and Aramex — print your label in 30 seconds.
          </p>
        </div>

        {/* Tracking search bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white rounded-2xl border border-black/8 p-2 flex flex-col sm:flex-row gap-2" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl sm:w-36 shrink-0" style={{ background: 'rgba(240,237,232,0.7)' }}>
              <MapPin size={14} className="text-brand-sky shrink-0" />
              <span className="text-sm font-medium text-[#4A4A4A] truncate">🇮🇳 India</span>
            </div>
            <div className="flex items-center gap-2.5 flex-1 px-4 rounded-xl" style={{ background: 'rgba(240,237,232,0.7)' }}>
              <Package size={14} className="text-brand-sky shrink-0" />
              <input
                type="text"
                placeholder="Enter AWB / tracking number"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="bg-transparent border-0 outline-none text-sm font-medium text-brand-navy placeholder:text-[#888] w-full py-2.5"
              />
            </div>
            <button onClick={handleTrack} className="btn-primary px-6 py-3 rounded-xl text-sm shrink-0 flex items-center gap-2">
              <Search size={15} /> Track Package
            </button>
          </div>

          {/* Sample AWBs */}
          <div className="flex items-center gap-2 mt-3 justify-center flex-wrap">
            <span className="text-xs text-[#888]">Try a sample:</span>
            {['8429-1044-77', 'DHL5521908', 'FEDX-9042'].map((n) => (
              <button key={n} onClick={() => setAwb(n)}
                className="px-2.5 py-1 rounded-full border border-black/10 text-xs font-mono text-[#4A4A4A] hover:border-brand-sky hover:text-brand-sky transition-colors bg-white">
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Container */}
        <Container3D />

        {/* ── Stats bar with texture ── */}
        <div
          className="rounded-3xl mt-6 px-8 py-7 grid grid-cols-2 sm:grid-cols-4 gap-6 relative overflow-hidden"
          style={{ background: '#0D0D0D' }}
        >
          {/* Dot grid texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize:  '20px 20px',
          }} />
          {/* Sky glow top-left */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(0,191,255,0.1) 0%, transparent 70%)',
          }} />
          {/* Sky glow bottom-right */}
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(0,191,255,0.06) 0%, transparent 70%)',
          }} />
          {/* Horizontal line across top */}
          <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {stats.map((s, i) => (
            <div key={i} className="text-center sm:text-left relative z-10">
              <p className="font-extrabold text-3xl tracking-tight" style={{ color: '#C6F135' }}>
                {s.value}
              </p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="h-8" />
      </div>
    </section>
  )
}