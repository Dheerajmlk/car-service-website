import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Star, Zap, Wrench, TrendingUp, CheckCircle, Settings, Sparkles, Droplets, Battery, CircleDot, PaintBucket, Disc } from 'lucide-react';
import { getFeaturedParts, getBestsellerParts } from '../api/storeApi';
import { getFeaturedBikes, getBestsellerBikes } from '../api/bikeApi';
import CarCard from '../components/bikes/BikeCard';
import PartCard from '../components/parts/PartCard';
import { getActiveServiceTypes } from '../api/serviceApi';
import { PageLoader } from '../components/common/LoadingSpinner';
import instantQuote from '../assets/instant-quote.png';

const serviceIcons = {
  general_service: Settings,
  engine_tuning: Zap,
  brake_service: Disc,
  ac_service: Droplets,
  detailing: Sparkles,
  battery_service: Battery,
  tyre_service: CircleDot,
  body_repair: PaintBucket,
};

const heroSlides = [
  { title: 'Buy & Sell Cars', sub: 'Premium Auto Marketplace', desc: 'Find your perfect luxury car from thousands of certified new & used vehicles across India.', cta: 'Explore Cars', href: '/bikes' },
  { title: 'Premium Service', sub: 'Excellence Guaranteed', desc: 'Expert car technicians at your doorstep. World-class maintenance for your luxury vehicle.', cta: 'Book Service', href: '/services' },
  { title: 'Sell Instantly', sub: 'Maximum Value', desc: 'Get an instant valuation and sell your car at the best market price today.', cta: 'Sell Now', href: '/sell' },
];

const stats = [
  { value: '25K+', label: 'Cars Sold', icon: TrendingUp },
  { value: 'Elite', label: 'Service Quality', icon: Clock },
  { value: '4.9★', label: 'Client Satisfaction', icon: Star },
  { value: '150+', label: 'Hubs Nationwide', icon: MapPin },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [featuredParts, setFeaturedParts] = useState([]);
  const [bestsellerParts, setBestsellerParts] = useState([]);
  const [bestsellerBikes, setBestsellerBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partsLoading, setPartsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const carRef = useRef(null);
  const heroRef = useRef(null);

  // Scroll-linked car rotation — based on hero section visibility only
  useEffect(() => {
    const handleScroll = () => {
      if (!carRef.current || !heroRef.current) return;
      const heroRect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRect.height;
      // How far the hero has scrolled up: 0 = top of page, heroHeight = fully gone
      const scrolled = Math.max(0, -heroRect.top);
      const progress = Math.min(scrolled / heroHeight, 1);
      // Rotate from 0° to -30° (right to left) as hero scrolls out
      const rotation = progress * -30;
      carRef.current.style.transform = `perspective(800px) rotateY(${rotation}deg)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    Promise.all([
      getFeaturedBikes().then(({ data }) => setFeatured(data.bikes || [])),
      getFeaturedParts().then(({ data }) => setFeaturedParts(data.parts || [])),
      getBestsellerParts({ limit: 8 }).then(({ data }) => setBestsellerParts(data.parts || [])),
      getBestsellerBikes().then(({ data }) => setBestsellerBikes(data.bikes || [])),
      getActiveServiceTypes().then(({ data }) => setServiceTypes(data.serviceTypes || []))
    ])
      .catch(() => { })
      .finally(() => {
        setLoading(false);
        setPartsLoading(false);
        setServicesLoading(false);
      });

    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>

      {/* ════════════ HERO SECTION ════════════ */}
      <section ref={heroRef} className="hero-section" style={{ position: 'relative', overflow: 'hidden', background: '#0F172A', minHeight: '88vh' }}>
        <style>{`
          @media (max-width: 1024px) {
            .hero-car-image { width: 400px !important; }
          }
          @media (max-width: 768px) {
            .hero-section-inner { flex-direction: column !important; min-height: auto !important; padding-top: 1rem !important; }
            .hero-left { padding: 1.25rem 1rem !important; max-width: 100% !important; }
            .hero-left h1 { font-size: 1.6rem !important; }
            .hero-left .hero-desc { font-size: 0.78rem !important; }
            .hero-left .hero-extra { display: none !important; }
            .hero-car-wrap { min-height: 140px !important; margin-top: 0.5rem !important; flex: 0 0 auto !important; width: 100% !important; }
            .hero-car-image { width: 320px !important; }
            .hero-section { min-height: auto !important; padding-bottom: 1.5rem !important; }
            .hero-stats-row { gap: 0.5rem !important; padding-top: 0.6rem !important; }
            .hero-stats-row > div > div:first-child { font-size: 0.85rem !important; }
            .hero-stats-row > div > div:last-child { font-size: 0.5rem !important; }
            .hero-cta-wrap { margin-bottom: 1.2rem !important; }
            .hero-cta-wrap a { padding: 0.55rem 1.2rem !important; font-size: 0.78rem !important; }
            .hero-eyebrow { padding: 0.2rem 0.7rem !important; margin-bottom: 0.8rem !important; }
            .hero-eyebrow span { font-size: 0.65rem !important; }
            .hero-dots { margin-top: 1rem !important; }
            .hero-road { bottom: 20px !important; height: 2px !important; }
          }
          @media (max-width: 480px) {
            .hero-left h1 { font-size: 1.35rem !important; }
            .hero-car-wrap { min-height: 100px !important; }
            .hero-car-image { width: 260px !important; }
            .hero-section { padding-top: 0.5rem !important; padding-bottom: 1rem !important; }
          }
        `}</style>

        {/* Subtle gradient glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(30, 58, 138, 0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="hero-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ display: 'flex', alignItems: 'center', minHeight: '88vh', gap: '2rem', position: 'relative', zIndex: 1 }}>

          {/* LEFT CONTENT */}
          <div className="hero-left" style={{ flex: '1 1 50%', maxWidth: 600, paddingTop: '2rem', paddingBottom: '2rem' }}>

            {/* Eyebrow */}
            <div className="hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30, 58, 138, 0.15)', border: '1px solid rgba(30, 58, 138, 0.3)', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1.5rem' }}>
              <Zap size={13} style={{ color: '#93C5FD' }} />
              <span style={{ color: '#93C5FD', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{slide.sub}</span>
            </div>

            {/* Brand */}
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>AUTOXPRESS</p>

            {/* Title */}
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: '1rem' }}>
              <span style={{ color: '#93C5FD' }}>{slide.title.split(' ')[0]}</span>{' '}
              <span style={{ color: 'white' }}>{slide.title.split(' ').slice(1).join(' ')}</span>
            </h1>

            {/* Description */}
            <p className="hero-desc" style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '0.75rem', lineHeight: 1.7, maxWidth: 440 }}>
              {slide.desc}
            </p>

            {/* Extra paragraph — hidden on mobile */}
            <p className="hero-extra" style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.65, maxWidth: 420, marginBottom: '1.8rem' }}>
              Whether you're looking to upgrade to a premium car, sell your elite vehicle at the best market price, or need expert maintenance — AutoXpress delivers excellence.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to={slide.href} style={{
                background: '#1E3A8A', color: 'white', padding: '0.7rem 1.8rem', borderRadius: '8px',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s',
                boxShadow: '0 4px 20px rgba(30,58,138,0.4)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#172554'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {slide.cta} <ArrowRight size={16} />
              </Link>
              <Link to="/services" style={{
                background: 'transparent', color: 'white', padding: '0.7rem 1.8rem', borderRadius: '8px',
                textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                border: '1.5px solid rgba(255,255,255,0.2)', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.color = '#93C5FD'; e.currentTarget.style.background = 'rgba(30,58,138,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'transparent'; }}>
                Book Service
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats-row" style={{ display: 'flex', gap: '1.2rem', flexWrap: 'nowrap', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{ flex: '1 1 0' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem', fontWeight: 900, color: '#93C5FD', lineHeight: 1 }}>{value}</div>
                  <div style={{ color: '#64748B', fontSize: '0.58rem', marginTop: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="hero-dots" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  style={{ width: i === currentSlide ? 28 : 8, height: 6, borderRadius: 3, background: i === currentSlide ? '#1E3A8A' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>

          {/* RIGHT — Animated Moving Car */}
          <div className="hero-car-wrap" style={{ flex: '1 1 50%', position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Road surface */}
            <div className="hero-road" style={{
              position: 'absolute', bottom: '60px', left: 0, right: 0, height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.2) 20%, rgba(148,163,184,0.2) 80%, transparent)',
            }} />

            {/* Car Image — rotates with scroll */}
            <img
              ref={carRef}
              src="/car.png"
              alt="Premium Car"
              className="hero-car-image"
              style={{
                width: '520px',
                maxWidth: '95%',
                height: 'auto',
                position: 'relative',
                zIndex: 2,
                filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.5))',
                transition: 'transform 0.1s linear',
                willChange: 'transform',
              }}
            />

            {/* Ground reflection */}
            <div style={{
              position: 'absolute', bottom: '40px', left: '20%', right: '20%', height: '30px',
              background: 'rgba(30,58,138,0.1)', borderRadius: '50%', filter: 'blur(15px)',
            }} />
          </div>
        </div>
      </section>

      {/* ════════════ LATEST SHOWROOM ════════════ */}
      <section style={{ background: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={{ color: '#1E3A8A', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Our Collection</p>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#0F172A' }}>
                Latest <span className="gradient-text">Showroom</span>
              </h2>
              <p style={{ color: '#64748B', marginTop: '0.25rem', fontWeight: 500, fontSize: '0.9rem' }}>Premium selection for elite drivers</p>
            </div>
            <Link to="/bikes" style={{ padding: '0.55rem 1.3rem', fontSize: '0.82rem', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.25s', boxShadow: '0 4px 15px rgba(30, 58, 138, 0.18)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#172554'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="home-bikes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div style={{ padding: '0.85rem' }}>
                    <div className="skeleton" style={{ height: 16, width: '65%', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="home-bikes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {featured.map((car) => <CarCard key={car._id} car={car} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(30,58,138,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Sparkles size={24} style={{ color: '#1E3A8A' }} />
              </div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.4rem' }}>New Cars Coming Soon!</h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: 380, margin: '0 auto' }}>We're curating the finest vehicles for our showroom. Check back soon for exciting new arrivals.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ SERVICE CATEGORIES — Premium Redesign ════════════ */}
      <section style={{ background: '#0F172A', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background decorative elements */}
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,138,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30,58,138,0.2)', border: '1px solid rgba(30,58,138,0.3)', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1rem' }}>
              <Wrench size={13} style={{ color: '#93C5FD' }} />
              <span style={{ color: '#93C5FD', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Professional Care</span>
            </div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '0.6rem' }}>
              Our Expert <span style={{ color: '#93C5FD' }}>Services</span>
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', fontWeight: 500, maxWidth: 480, margin: '0 auto' }}>
              World-class maintenance and repair services delivered by certified specialists at your doorstep
            </p>
          </div>

          {servicesLoading ? (
            <div className="home-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-dark" style={{ height: 180, borderRadius: '16px' }} />)}
            </div>
          ) : serviceTypes.length > 0 ? (
            <div className="home-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {serviceTypes.map((service, idx) => {
                const IconComponent = serviceIcons[service.value] || Wrench;
                return (
                  <Link to="/services" key={service.value} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(30, 58, 138, 0.08)',
                      border: '1px solid rgba(148,163,184,0.1)',
                      borderRadius: '16px',
                      padding: '1.5rem 1.25rem',
                      textAlign: 'left',
                      transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      display: 'flex', flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      minHeight: '180px',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.background = 'rgba(30, 58, 138, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(147,197,253,0.25)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'rgba(30, 58, 138, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>

                      {/* Decorative number */}
                      <span style={{ position: 'absolute', top: '12px', right: '16px', fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(148,163,184,0.06)', lineHeight: 1 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Icon */}
                      <div style={{
                        width: 44, height: 44, borderRadius: '12px',
                        background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 15px rgba(30,58,138,0.3)',
                      }}>
                        <IconComponent size={20} style={{ color: 'white' }} />
                      </div>

                      {/* Title */}
                      <h3 style={{
                        color: 'white', fontWeight: 800, fontSize: '0.92rem',
                        marginBottom: '0.35rem', fontFamily: 'Rajdhani, sans-serif',
                        textTransform: 'uppercase', letterSpacing: '0.04em'
                      }}>
                        {service.label}
                      </h3>

                      {/* Description */}
                      <p style={{ color: '#94A3B8', fontSize: '0.72rem', lineHeight: 1.5, marginBottom: '0.8rem', fontWeight: 500, flex: 1 }}>
                        {service.desc}
                      </p>

                      {/* Price + Arrow */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <span style={{ color: '#93C5FD', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
                          ₹{Number(service.price).toLocaleString('en-IN')}
                        </span>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(147,197,253,0.1)', border: '1px solid rgba(147,197,253,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.25s',
                        }}>
                          <ArrowRight size={14} style={{ color: '#93C5FD' }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(30,58,138,0.08)', borderRadius: '16px', border: '1px dashed rgba(148,163,184,0.2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(147,197,253,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Wrench size={24} style={{ color: '#93C5FD' }} />
              </div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'white', marginBottom: '0.4rem' }}>Services Coming Soon!</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', maxWidth: 380, margin: '0 auto' }}>Our expert service team is gearing up. Premium car care services will be available shortly.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" style={{
              background: '#1E3A8A', color: 'white', padding: '0.7rem 2rem',
              fontSize: '0.88rem', fontWeight: 700, borderRadius: '8px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(30,58,138,0.3)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#172554'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ FEATURED SHOWCASE ════════════ */}
      <section style={{ background: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={{ color: '#1E3A8A', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Premium Selection</p>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#0F172A' }}>
                Featured <span className="gradient-text">Showcase</span>
              </h2>
              <p style={{ color: '#64748B', marginTop: '0.25rem', fontWeight: 500, fontSize: '0.9rem' }}>Exquisite performance machines</p>
            </div>
            <Link to="/featured" style={{ background: '#1E3A8A', color: 'white', padding: '0.55rem 1.3rem', fontSize: '0.82rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(30,58,138,0.18)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#172554'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {partsLoading ? (
            <div className="home-parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: '14px' }} />)}
            </div>
          ) : (featured.length > 0 || featuredParts.length > 0) ? (
            <div className="home-parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {featured.map((car) => <CarCard key={car._id} car={car} />)}
              {featuredParts.map((part) => <PartCard key={part._id} part={part} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(30,58,138,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Star size={24} style={{ color: '#1E3A8A' }} />
              </div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.4rem' }}>Featured Items Coming Soon!</h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: 380, margin: '0 auto' }}>Our team is hand-picking the best cars and parts for this showcase. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ BESTSELLER COLLECTION ════════════ */}
      <section style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={{ color: '#1E3A8A', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Elite Choice</p>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#0F172A' }}>
                Bestseller <span className="gradient-text">Collection</span>
              </h2>
              <p style={{ color: '#64748B', marginTop: '0.25rem', fontWeight: 500, fontSize: '0.9rem' }}>Our most celebrated vehicles</p>
            </div>
            <Link to="/bestseller" style={{ background: '#1E3A8A', color: 'white', padding: '0.55rem 1.3rem', fontSize: '0.82rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(30,58,138,0.18)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#172554'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="home-parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: '14px' }} />)}
            </div>
          ) : (bestsellerBikes.length > 0 || bestsellerParts.length > 0) ? (
            <div className="home-parts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {bestsellerBikes.map((car) => <CarCard key={car._id} car={car} />)}
              {bestsellerParts.map((part) => <PartCard key={part._id} part={part} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#FFFFFF', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(30,58,138,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <TrendingUp size={24} style={{ color: '#1E3A8A' }} />
              </div>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.4rem' }}>Bestsellers Coming Soon!</h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: 380, margin: '0 auto' }}>Our most popular cars and parts will appear here. Check back for top-rated picks!</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ WHY CHOOSE US ════════════ */}
      <section style={{ background: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#0F172A' }}>Why <span className="gradient-text">AutoXpress?</span></h2>
            <p style={{ color: '#64748B', marginTop: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>India's premier luxury automotive platform</p>
          </div>
          <div className="home-why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            <style>{`
              @media (min-width: 1024px) { .home-why-grid { grid-template-columns: repeat(6, 1fr) !important; } }
              @media (max-width: 768px) {
                .home-why-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
                .home-services-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
                .home-services-grid > a > div { min-height: 155px !important; padding: 1rem 0.85rem !important; }
                .home-services-grid > a > div h3 { font-size: 0.78rem !important; }
                .home-services-grid > a > div p { font-size: 0.65rem !important; }
              }
              @media (max-width: 480px) {
                .home-why-grid, .home-services-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; }
              }
              @media (max-width: 640px) {
                .home-parts-grid, .home-bikes-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
              }
            `}</style>
            {[
              { title: 'Instant Quote', desc: 'Get a free, instant valuation for your car in seconds.', image: instantQuote },
              { title: 'Schedule Inspection', desc: 'Expert mechanics visit your doorstep for full inspection.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop' },
              { title: 'Money Transfer', desc: 'Secure instant payment to your bank within 60 minutes.', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400&auto=format&fit=crop' },
              { title: '1-Hour Service', desc: 'Expert mechanics at your location within 60 minutes.', image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=400&auto=format&fit=crop' },
              { title: 'Verified Sellers', desc: 'Rigorous 150-point check by certified experts.', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=400&auto=format&fit=crop' },
              { title: 'Doorstep Help', desc: 'Free pickup and drop for all your vehicle needs.', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=400&auto=format&fit=crop' },
            ].map(({ title, desc, image }) => (
              <div key={title} style={{ background: '#FFFFFF', overflow: 'hidden', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'rgba(30,58,138,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
                <div style={{ height: '100px', width: '100%', overflow: 'hidden' }}>
                  <img src={image} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1449491073997-d0ce9a901507?q=65&w=400&auto=format&fit=crop'; }} />
                </div>
                <div style={{ padding: '0.7rem 0.65rem' }}>
                  <h3 style={{ color: '#0F172A', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.2rem', fontFamily: 'Rajdhani, sans-serif' }}>{title}</h3>
                  <p style={{ color: '#64748B', fontSize: '0.65rem', lineHeight: 1.4 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '5rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(30,58,138,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="max-w-4xl mx-auto px-4" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', fontWeight: 900, color: 'white', marginBottom: '0.8rem' }}>
            Sell Your Car at the Best Value
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '1.8rem', fontWeight: 500, maxWidth: 460, margin: '0 auto 1.8rem' }}>
            Premium valuation, expert verification, and instant secure payment within the hour.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {['FREE REMOTE VALUATION', 'HOME INSPECTION', 'INSTANT BANK PAYMENT'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={13} style={{ color: '#93C5FD' }} />
                <span style={{ color: '#CBD5E1', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}>{label}</span>
              </div>
            ))}
          </div>
          <Link to="/sell" style={{
            background: '#1E3A8A', color: 'white', padding: '0.8rem 2.2rem',
            borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s',
            boxShadow: '0 8px 25px rgba(30,58,138,0.3)'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = '#172554'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1E3A8A'; }}>
            Sell My Car Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
