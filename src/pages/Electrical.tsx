import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, PhoneCall, Mail, Star } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { Icon } from '../icons';

const Electrical = () => {
  const { content } = useContent();
  const electrical = content.electrical;
  const settings = content.settings;

  const formatPhone = (p: string) => p.replace('+61', '+61 ').replace(/(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3');
  const phoneLinks = [
    content.electrical.phone1 && { tel: content.electrical.phone1, name: content.electrical.phone1Name },
    content.electrical.phone2 && { tel: content.electrical.phone2, name: content.electrical.phone2Name },
  ].filter(Boolean) as { tel: string; name: string }[];

  return (
    <>
    <Helmet>
      <title>Sydney Electrician | 24/7 Emergency Electrical | UrbanPro</title>
      <meta name="description" content="Licensed master electrician Sydney — residential wiring, switchboard upgrades, lighting, EV chargers, fault diagnostics. 24/7 emergency. Bondi, Surry Hills, Chatswood, Parramatta — all Sydney suburbs." />
      <link rel="canonical" href="https://urbanproplumbing.com.au/electrical" />
      <meta property="og:title" content="Sydney Electrician | 24/7 Emergency Electrical | UrbanPro" />
      <meta property="og:description" content="Licensed master electricians. 24/7 emergency service, upfront pricing, lifetime workmanship guarantee." />
      <meta property="og:url" content="https://urbanproplumbing.com.au/electrical" />
      <meta property="og:image" content="https://urbanproplumbing.com.au/images/electrical-hero.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Sydney Electrician | 24/7 Emergency Electrical | UrbanPro" />
      <meta name="twitter:description" content="Licensed master electricians. 24/7 emergency, upfront pricing, lifetime guarantee." />
      <meta name="twitter:image" content="https://urbanproplumbing.com.au/images/electrical-hero.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Electrician Sydney",
        "provider": {"@type": "LocalBusiness", "name": "UrbanPro", "telephone": settings.phone1, "image": "https://urbanproplumbing.com.au/images/electrical-hero.jpg", "priceRange": "$$"},
        "areaServed": ["Sydney CBD", "Eastern Suburbs", "Inner West", "North Shore", "Northern Beaches", "Southern Sydney", "Western Sydney", "Bondi", "Vaucluse", "Paddington", "Surry Hills", "Double Bay", "Mosman", "Chatswood", "Parramatta", "Hurstville", "Liverpool", "Penrith"],
        "description": "Licensed electrician Sydney — switchboard upgrades, rewiring, lighting design, EV charger installation, fault finding, safety inspections. 24/7 emergency service across all Sydney suburbs.",
        "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": String(electrical.reviews.length || 1)}
      })}</script>
    </Helmet>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <section className="hero-section" style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', flexDirection: 'column',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9)), url(images/electrical-hero.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="container hero-container" style={{ textAlign: 'center', position: 'relative', zIndex: 2, width: '100%', padding: '7rem 1rem 2rem' }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <h1 className="hero-title" style={{ fontSize: 'calc(var(--font-size-h1) * 0.85)', fontWeight: 800, marginBottom: '1rem', color: 'white', letterSpacing: '-0.02em' }}>
                {electrical.heroHeading}
              </h1>
              <p className="hero-desc" style={{ fontSize: 'calc(var(--font-size-body) * 0.85)', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                {electrical.heroSubtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="guarantees-wrapper" style={{ maxWidth: '75%', margin: '0 auto', width: '100%' }}
            >
              <div
                className="guarantees-box"
                style={{
                  display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem',
                  backgroundColor: 'rgba(30,41,59,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderBottom: 'none',
                  padding: '2rem', color: 'white', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)',
                  position: 'relative', overflow: 'hidden', backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, var(--color-electrical) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(20px)', pointerEvents: 'none' }} />
                {electrical.guarantees.map((item) => (
                  <div key={item.id} className="guarantee-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', flex: '1 1 160px', position: 'relative', zIndex: 1 }}>
                    <div className="guarantee-icon" style={{ color: 'var(--color-electrical)', backgroundColor: 'rgba(234,179,8,0.08)', padding: '0.9rem', borderRadius: '4px' }}>
                      <Icon name={item.icon} size={28} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span className="guarantee-text" style={{ fontWeight: 800, fontSize: 'var(--font-size-body)', display: 'block', marginBottom: '0.2rem', letterSpacing: '0.02em', color: 'white' }}>{item.title}</span>
                      {item.subtitle && <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em', display: 'block' }}>{item.subtitle}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="emergency-strip"
                style={{
                  display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
                  backgroundColor: 'rgba(15,25,48,0.95)',
                  borderLeft: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)',
                  borderTop: '2px solid var(--color-electrical)', borderBottom: '2px solid var(--color-electrical)',
                  padding: '0.85rem 2rem', backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ color: 'var(--color-electrical)', display: 'flex' }}><AlertTriangle size={18} /></span>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'white', display: 'block', letterSpacing: '0.04em' }}>EMERGENCY 24/7</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>Quick response for blackouts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="elec-cmd-bar" style={{
          background: 'linear-gradient(to right, rgba(2,6,23,0.95), rgba(8,13,26,0.95), rgba(2,6,23,0.95))',
          borderTop: '2px solid var(--color-electrical)',
          padding: '1.1rem 0', position: 'relative', zIndex: 2,
        }}>
          <style>{`
            .access-link-elec {
              display: flex; align-items: center; gap: 0.85rem;
              color: white; text-decoration: none;
              font-weight: 800; font-size: 1rem; letter-spacing: 0.02em;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              padding: 0.7rem 1.5rem;
              background-color: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.1);
            }
            .access-link-elec:hover {
              background-color: var(--color-electrical);
              color: var(--color-bg);
              border-color: var(--color-electrical);
              transform: translateY(-3px);
              box-shadow: 0 8px 20px -8px var(--color-electrical);
            }
            .access-link-elec .link-icon-elec { color: var(--color-electrical); transition: all 0.3s ease; }
            .access-link-elec:hover .link-icon-elec { color: var(--color-bg); }

            @keyframes pulse-glow-elec {
              0% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.4; transform: scale(1); }
            }

            @media (max-width: 900px) {
              .elec-cmd-buttons { gap: 0.5rem !important; }
              .access-link-elec { padding: 0.6rem 1rem !important; font-size: 0.9rem !important; }
            }
            @media (max-width: 768px) {
              .hero-section { min-height: 100svh !important; height: auto !important; }
              .hero-container { padding: 6rem 1rem 1.5rem !important; }
              .hero-title { font-size: calc(var(--font-size-h1) * 0.85) !important; margin-bottom: 0.75rem !important; }
              .hero-desc { font-size: calc(var(--font-size-body) * 0.85) !important; margin-bottom: 1.5rem !important; line-height: 1.5 !important; }
              .guarantees-box {
                padding: 1.25rem 0.5rem !important; gap: 0.5rem !important;
                flex-wrap: nowrap !important; flex-direction: row !important;
                justify-content: space-around !important;
              }
              .guarantee-item { flex: 1 1 0% !important; gap: 0.4rem !important; min-width: 0 !important; }
              .guarantee-icon { display: flex !important; }
              .guarantee-icon svg { width: 20px !important; height: 20px !important; }
              .guarantee-text { font-size: 0.9rem !important; margin-bottom: 0 !important; line-height: 1.2 !important; }
              .guarantee-item span:nth-of-type(2) { display: none !important; }
              .guarantees-wrapper { max-width: 90% !important; margin: 1.5rem auto 0 !important; }
              .emergency-strip { gap: 0.75rem !important; padding: 0.6rem 0.5rem !important; }
              .emergency-strip div span:first-child { font-size: 0.86rem !important; }
              .emergency-strip div span:last-child { font-size: 0.6rem !important; }
              .emergency-strip span svg { width: 16px !important; height: 16px !important; }
              .elec-cmd-label { display: none !important; }
              .elec-cmd-bar { padding: 0.8rem 0 !important; }
              .elec-cmd-buttons { justify-content: center !important; gap: 0.5rem !important; }
              .access-link-elec {
                padding: 0.75rem 1rem !important; font-size: var(--font-size-sm) !important;
                gap: 0.4rem !important; flex: 1 1 auto !important; min-width: 140px !important;
              }
              .access-link-elec span:last-child { display: none !important; }
            }

            @media (max-width: 640px) {
              .benefit-grid {
                display: flex !important; flex-direction: column !important;
                align-items: center !important; gap: 1.25rem !important;
              }
              .benefit-card {
                width: 95% !important; max-width: 400px !important; min-width: 280px !important;
                flex-direction: row !important; text-align: left !important;
                padding: 1rem 0.75rem !important;
                background: rgba(255, 255, 255, 0.03) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2) !important;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
              }
              .benefit-card:hover {
                transform: translateY(-5px) scale(1.02) !important;
                border-color: var(--color-electrical) !important;
                box-shadow: 0 10px 30px -10px var(--color-electrical) !important;
                background: rgba(234, 179, 8, 0.05) !important;
              }
              .benefit-card span {
                white-space: nowrap !important; font-size: var(--font-size-sm) !important;
                color: white !important; letter-spacing: 0.01em !important;
              }
              .benefit-icon-wrapper {
                background: rgba(234, 179, 8, 0.1) !important;
                padding: 0.6rem !important; border-radius: 8px !important;
                display: flex !important; align-items: center !important; justify-content: center !important;
                box-shadow: inset 0 0 12px rgba(234, 179, 8, 0.2) !important;
              }
              .benefit-icon-wrapper svg { width: 22px !important; height: 22px !important; }
              .service-grid-elec { grid-template-columns: repeat(2, 1fr) !important; gap: 0.75rem !important; }
              .service-card-elec { padding: 1rem 0.5rem !important; flex-direction: column !important; text-align: center !important; gap: 0.75rem !important; }
              .service-card-elec h4 { font-size: 0.8rem !important; line-height: 1.3 !important; }
              .service-card-elec div { padding: 0.5rem !important; }
              .elec-services-heading { margin-bottom: 2rem !important; }
              .elec-services-section { padding: 4rem 0 !important; }
            }
          `}</style>

          <div className="container mobile-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className="elec-cmd-label" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 0 14px white', animation: 'pulse-glow-elec 2s infinite' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--color-electrical)', animation: 'pulse-glow-elec 2s infinite linear reverse' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
                  <span style={{ backgroundColor: 'var(--color-electrical)', color: 'var(--color-bg)', padding: '0.15rem 0.5rem', fontSize: '0.6rem', fontWeight: 900, borderRadius: '2px' }}>LIVE</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'white' }}>Command Center</span>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-electrical)', letterSpacing: '0.15em' }}>
                  Sydney Region Techs Online
                </span>
              </div>
            </div>

            <div className="elec-cmd-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {phoneLinks.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="access-link-elec">
                  <PhoneCall size={17} className="link-icon-elec" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Call {p.name}</span>
                    <span style={{ opacity: 0.4, fontSize: '0.65rem', fontWeight: 500 }}>{formatPhone(p.tel)}</span>
                  </div>
                </a>
              ))}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="access-link-elec">
                  <Mail size={17} className="link-icon-elec" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Email Us</span>
                    <span style={{ opacity: 0.4, fontSize: '0.65rem', fontWeight: 500 }}>Instant Response</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section elec-section elec-services-section" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div className="elec-services-heading" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <motion.h2
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--color-text)' }}
            >
              Our Services
            </motion.h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-electrical)', margin: '1.5rem auto' }} />
          </div>

          <div className="service-grid-elec" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {electrical.services.map((service, idx) => (
              <motion.div
                key={service.id}
                className="service-card-elec"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: 'var(--color-electrical)' }}
                style={{
                  backgroundColor: 'var(--color-surface)', padding: '2.5rem 2rem',
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', cursor: 'pointer',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                  transform: 'translateZ(0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div style={{ color: 'var(--color-electrical)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem' }}>
                  <Icon name={service.icon} size={24} />
                </div>
                <h4 style={{ margin: 0, fontSize: 'calc(var(--font-size-h4) * 0.81)', fontWeight: 800, color: 'var(--color-text)', textTransform: 'none' }}>
                  {service.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section elec-section" style={{
        padding: '6rem 0',
        backgroundImage: 'linear-gradient(rgba(10, 18, 35, 0.8), rgba(10, 18, 35, 0.88)), url(images/electrical-why-bg.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, marginBottom: '3rem', color: 'white' }}>Why Choose UrbanPro Electrical?</h2>
          <div className="benefit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {electrical.benefits.map((benefit, i) => (
              <motion.div
                key={benefit.id}
                className="benefit-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.75rem',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px', transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden'
                }}
              >
                <div className="benefit-icon-wrapper" style={{ color: 'var(--color-electrical)', display: 'flex', flexShrink: 0 }}>
                  <Icon name={benefit.icon} size={28} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white', letterSpacing: '-0.01em' }}>{benefit.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      {electrical.reviews.length > 0 && (
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.84-.68z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Google Reviews</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
              {(electrical.reviews.reduce((s, r) => s + r.rating, 0) / electrical.reviews.length).toFixed(1)}
            </span>
            <div>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.4rem' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={22} fill="#FBBC05" color="#FBBC05" />)}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Top-rated by our customers</div>
            </div>
          </div>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-electrical)', margin: '1.5rem auto 0' }} />
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
          <div className="reviews-track-elec">
            {[...electrical.reviews, ...electrical.reviews].map((review, idx) => (
              <div key={`${review.id}-${idx}`} className="review-card-elec">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.1rem' }}>
                  {review.photo ? (
                    <img src={review.photo} alt={review.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-electrical)', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '42px', height: '42px', backgroundColor: 'rgba(234,179,8,0.12)', border: '2px solid var(--color-electrical)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-electrical)', flexShrink: 0 }}>
                      {review.initials}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{review.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{review.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.85rem' }}>
                  {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} fill="#FBBC05" color="#FBBC05" />)}
                </div>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0, fontSize: '0.88rem' }}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {electrical.mapsUrl && (
          <div className="container" style={{ textAlign: 'center' }}>
            <a href={electrical.mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', border: '2px solid rgba(255,255,255,0.2)', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              View All Reviews on Google →
            </a>
          </div>
        )}

        <style>{`
          @keyframes reviews-marquee-elec { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .reviews-track-elec { display: flex; gap: 1.5rem; width: max-content; animation: reviews-marquee-elec 60s linear infinite; }
          .reviews-track-elec:hover { animation-play-state: paused; }
          .review-card-elec { width: 340px; flex-shrink: 0; background-color: var(--color-surface); padding: 1.75rem; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
          @media (max-width: 768px) { .review-card-elec { width: 270px; } .reviews-track-elec { animation-duration: 45s; } }
        `}</style>
      </section>
      )}

      {/* Full-width Contact CTA */}
      <section className="elec-section" style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Need an Electrician?</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-body)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              Call us now for fast, upfront service — or send us an email anytime.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
              {phoneLinks.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-electrical)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <PhoneCall size={22} /> Call {p.name}
                </a>
              ))}
              {settings.email && (
                <a href={`mailto:${settings.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'transparent', color: 'var(--color-text)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: '2px solid var(--color-text-muted)' }}>
                  ✉ Email Us
                </a>
              )}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
              <span>ABN: {settings.abn}</span>
              <span style={{ margin: '0 1.5rem', opacity: 0.3 }}>|</span>
              <span>Contractor Licence NO: {settings.licence}</span>
              <span style={{ margin: '0 1.5rem', opacity: 0.3 }}>|</span>
              <span>{settings.email}</span>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
    </>
  );
};

export default Electrical;
