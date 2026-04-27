import Navbar        from '../components/landing/Navbar'
import Hero          from '../components/landing/Hero'
import CarriersStrip from '../components/landing/CarriersStrip'
import HowItWorks    from '../components/landing/HowItWorks'
import WhyAeroTrek   from '../components/landing/WhyAeroTrek'
import Testimonials  from '../components/landing/Testimonials'
import BlogPreview   from '../components/landing/BlogPreview'
import FaqSection    from '../components/landing/FaqSection'
import CtaBanner     from '../components/landing/CtaBanner'
import Footer        from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <CarriersStrip />
        <HowItWorks />
        <WhyAeroTrek />
        <Testimonials />
        <BlogPreview />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}