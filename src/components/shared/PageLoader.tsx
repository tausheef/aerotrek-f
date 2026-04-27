// PageLoader.tsx
export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-brand-cream flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-brand-sky/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-sky animate-spin" />
        </div>
        <span className="font-sans text-sm text-brand-sky font-semibold tracking-widest uppercase">
          AeroTrek
        </span>
      </div>
    </div>
  )
}
