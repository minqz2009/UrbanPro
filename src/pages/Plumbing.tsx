import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, BadgeDollarSign, Wrench, AlertTriangle, CheckCircle, PhoneCall, Mail, ChevronDown, Star } from 'lucide-react';

const MAPS_URL = 'https://www.google.com/maps/place/UrbanPro+Plumbing+Sydney/@-33.8461026,150.3081854,10z/data=!4m15!1m8!3m7!1s0xaa99133edb90a697:0xe93f25ae63342f5d!2sUrbanPro+Plumbing+Sydney!8m2!3d-33.8482439!4d150.9319747!10e1!16s%2Fg%2F11n4td_svt!3m5!1s0xaa99133edb90a697:0xe93f25ae63342f5d!8m2!3d-33.8482439!4d150.9319747!16s%2Fg%2F11n4td_svt?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D';

const reviews = [
  { name: 'Sarah M.', initials: 'SM', rating: 5, date: '2 weeks ago', text: "Called John at 11pm for a burst pipe — he arrived within 45 minutes. Fixed it cleanly and honestly, no surprise charges. Won't use anyone else." },
  { name: 'James T.', initials: 'JT', rating: 5, date: '1 month ago', text: "Leo came out the same day for a blocked drain. $250 fixed rate as advertised, zero hidden extras. Refreshing to deal with tradesmen this upfront." },
  { name: 'Michelle K.', initials: 'MK', rating: 5, date: '1 month ago', text: "Replaced our hot water system quickly and at a great price. Professional, friendly, and they cleaned up after themselves. Couldn't ask for more." },
  { name: 'David R.', initials: 'DR', rating: 5, date: '2 months ago', text: "Used UrbanPro for our office bathroom renovation. On time, on budget, and the finish was exceptional. These guys are the real deal for commercial work." },
  { name: 'Tom W.', initials: 'TW', rating: 5, date: '3 months ago', text: "Had a leak under the kitchen sink two other plumbers couldn't find. John traced and fixed it in under an hour. The No Fix No Pay guarantee gave me the confidence to call." },
  { name: 'Amy L.', initials: 'AL', rating: 5, date: '3 months ago', text: "Emergency on a Sunday morning — Leo was there in under an hour. Fair price, explained everything clearly. Best plumbers in Sydney, hands down." },
  { name: 'Chris B.', initials: 'CB', rating: 5, date: '4 months ago', text: "Got quotes from three other plumbers before calling UrbanPro. Not only were they most competitive, the quality of work was streets ahead. Will absolutely use again." },
  { name: 'Priya S.', initials: 'PS', rating: 5, date: '4 months ago', text: "Hot water system packed up on a Saturday morning. John was there within two hours and replaced the whole unit same day. Unbelievably smooth from start to finish." },
  { name: 'Mark D.', initials: 'MD', rating: 5, date: '5 months ago', text: "Called for a gas leak inspection — thorough, careful, explained everything clearly. Real peace of mind knowing it was done properly by fully licensed professionals." },
];

const Plumbing = () => {
  const guarantees = [
    { text: "NO CALL OUT FEE", subtext: "Transparent honest pricing", icon: <BadgeDollarSign size={28} /> },
    { text: "$250 FIXED RATE", subtext: "Drain cleaning special", icon: <Wrench size={28} /> },
    { text: "NO FIX NO PAY", subtext: "Our ultimate guarantee", icon: <ShieldCheck size={28} /> },
  ];

  const emergencyInfo = [
    { text: "EMERGENCY 24/7", subtext: "Covering all Sydney area", icon: <AlertTriangle size={18} /> },
    { text: "EMERGENCY 7 DAYS", subtext: "Ready when you need us most", icon: <Clock size={18} /> },
  ];

  const servicesBreakdown = [
    { title: "GENERAL PLUMBING", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/technician-rhtn80s1xnpu86dtmlwtjefkv73ps41h86f41rvv2c.png" },
    { title: "HOT WATER", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/shower-rhtnh04j8o0h61c56hohd4u57qtzbzp54mu54ykflw.png" },
    { title: "GAS HEATING", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/boiler-rhtnm2h82iy3qdz9loi3sutkghv6t9t2hpec8n222s.png" },
    { title: "BLOCKAGES", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/appliances-rhtnvyq20qhryllstghpjux9lj3auk3c6ond4idukk.png" },
    { title: "WATER LEAK DETECTION", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/leak-rhtoa46kwxv6r91s6kpi3ad3kdc8qi9usq8j8hegw4.png" }
  ];


  return (
    <>
    <Helmet>
      <title>Sydney Plumber | 24/7 Emergency Plumbing | UrbanPro</title>
      <meta name="description" content="Licensed Sydney plumber available 24/7. No call-out fee, $250 fixed drain cleaning, no fix no pay. Serving Bondi, Surry Hills, Paddington, Parramatta, North Shore and all Greater Sydney suburbs." />
      <link rel="canonical" href="https://urbanproplumbing.com.au/plumbing" />
      <meta property="og:title" content="Sydney Plumber | 24/7 Emergency Plumbing | UrbanPro" />
      <meta property="og:description" content="Licensed Sydney plumber available 24/7. No call-out fee, $250 fixed drain cleaning, no fix no pay." />
      <meta property="og:url" content="https://urbanproplumbing.com.au/plumbing" />
      <meta property="og:image" content="https://urbanproplumbing.com.au/images/plumbing-hero.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Emergency Plumbing Sydney",
        "provider": {"@type": "LocalBusiness", "name": "UrbanPro", "telephone": "+61412242997"},
        "areaServed": "Sydney, NSW, Australia",
        "description": "24/7 emergency plumbing, blocked drains, hot water systems, gas heating, water leak detection across Greater Sydney.",
        "offers": {"@type": "Offer", "price": "250", "priceCurrency": "AUD", "description": "Fixed $250 drain cleaning"}
      })}</script>
    </Helmet>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: 'var(--color-plumbing-bg)', color: 'var(--color-text)' }}
    >
      {/* Hero — full viewport, everything above the fold */}
      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'linear-gradient(rgba(17, 26, 46, 0.55), rgba(17, 26, 46, 0.88)), url(images/plumbing-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>

        {/* ── Title + description + guarantees (grows to fill space) ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="container hero-container" style={{ textAlign: 'center', position: 'relative', zIndex: 2, width: '100%', padding: '7rem 1rem 2rem' }}>
            <motion.div
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title" style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, marginBottom: '1rem', color: 'white', letterSpacing: '-0.02em' }}>
                Expert Plumbing Solutions
              </h1>
              <p className="hero-desc" style={{ fontSize: 'var(--font-size-body)', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                Fast, reliable, and upfront pricing. From emergency blockages to full renovations, we solve your plumbing problems without the guesswork.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="guarantees-wrapper"
              style={{ maxWidth: '75%', margin: '0 auto', width: '100%' }}
            >
              {/* Main guarantees card */}
              <div
                className="guarantees-box"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  backgroundColor: 'rgba(30,41,59,0.9)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderBottom: 'none',
                  padding: '2rem 2rem',
                  color: 'white',
                  boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, var(--color-plumbing) 0%, transparent 70%)', opacity: 0.12, filter: 'blur(20px)', pointerEvents: 'none' }} />
                {guarantees.map((item, idx) => (
                  <div key={idx} className="guarantee-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', flex: '1 1 160px', position: 'relative', zIndex: 1 }}>
                    <div className="guarantee-icon" style={{ color: 'var(--color-plumbing)', backgroundColor: 'rgba(59,130,246,0.1)', padding: '0.9rem', borderRadius: '4px' }}>
                      {item.icon}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span className="guarantee-text" style={{ fontWeight: 800, fontSize: 'var(--font-size-body)', display: 'block', marginBottom: '0.25rem', letterSpacing: '0.02em', color: 'white' }}>{item.text}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-plumbing-steel)', letterSpacing: '0.1em', display: 'block' }}>{item.subtext}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency strip — flush below the card, same width */}
              <div
                className="emergency-strip"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  flexWrap: 'wrap',
                  backgroundColor: 'rgba(15,25,48,0.95)',
                  borderLeft: '1px solid rgba(255,255,255,0.07)',
                  borderRight: '1px solid rgba(255,255,255,0.07)',
                  borderTop: '2px solid var(--color-plumbing)',
                  borderBottom: '2px solid var(--color-plumbing)',
                  padding: '0.85rem 2rem',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {emergencyInfo.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ color: 'var(--color-plumbing)', display: 'flex' }}>{item.icon}</span>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'white', display: 'block', letterSpacing: '0.04em' }}>{item.text}</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-plumbing-steel)', letterSpacing: '0.1em' }}>{item.subtext}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Command Center ── */}
        <div className="plumb-cmd-bar" style={{
          background: 'linear-gradient(to right, rgba(2,6,23,0.95), rgba(8,13,26,0.95), rgba(2,6,23,0.95))',
          borderTop: '2px solid var(--color-plumbing)',
          padding: '1.1rem 0',
          position: 'relative',
          zIndex: 2,
        }}>
          <style>{`
            .access-link {
              display: flex; align-items: center; gap: 0.85rem;
              color: white; text-decoration: none;
              font-weight: 800; font-size: 1rem; letter-spacing: 0.02em;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              padding: 0.7rem 1.5rem;
              background-color: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.1);
            }
            .access-link:hover {
              background-color: var(--color-plumbing);
              color: var(--color-bg);
              border-color: var(--color-plumbing);
              transform: translateY(-3px);
              box-shadow: 0 8px 20px -8px var(--color-plumbing);
            }
            .access-link .link-icon { color: var(--color-plumbing); transition: all 0.3s ease; }
            .access-link:hover .link-icon { color: var(--color-bg); }

            @keyframes pulse-glow {
              0% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.4; transform: scale(1); }
            }

            @media (max-width: 900px) {
              .hero-cmd-buttons { gap: 0.5rem !important; }
              .access-link { padding: 0.6rem 1rem !important; font-size: 0.9rem !important; }
            }

            @media (max-width: 768px) {
              .hero-section { min-height: 100svh !important; height: auto !important; }
              .hero-container { padding: 6rem 1rem 1.5rem !important; }
              .hero-title { font-size: var(--font-size-h1) !important; margin-bottom: 0.75rem !important; }
              .hero-desc { font-size: var(--font-size-body) !important; margin-bottom: 1.5rem !important; line-height: 1.5 !important; }
              .guarantees-box {
                padding: 1.25rem 0.5rem !important;
                gap: 0.5rem !important;
                flex-wrap: nowrap !important;
                flex-direction: row !important;
                justify-content: space-around !important;
              }
              .guarantee-item {
                flex: 1 1 0% !important;
                gap: 0.4rem !important;
                align-items: center !important;
                min-width: 0 !important;
              }
              .guarantee-icon { display: flex !important; }
              .guarantee-icon svg { width: 16px !important; height: 16px !important; }
              .guarantee-text { font-size: var(--font-size-xs) !important; margin-bottom: 0 !important; line-height: 1.2 !important; }
              .guarantee-item span:nth-of-type(2) { display: none !important; }
              .guarantees-wrapper { max-width: 90% !important; margin: 1.5rem auto 0 !important; }
              .emergency-strip { gap: 0.75rem !important; padding: 0.6rem 0.5rem !important; }
              .emergency-strip div span:first-child { font-size: 0.7rem !important; }
              .emergency-strip div span:last-child { font-size: 0.5rem !important; }
              .emergency-strip span svg { width: 14px !important; height: 14px !important; }
              .hero-cmd-label { display: none !important; }
              .plumb-cmd-bar { padding: 0.8rem 0 !important; }
              .hero-cmd-buttons { justify-content: center !important; gap: 0.5rem !important; }
              .access-link {
                padding: 0.75rem 1rem !important;
                font-size: var(--font-size-sm) !important;
                gap: 0.4rem !important;
                flex: 1 1 auto !important;
                min-width: 140px !important;
              }
              .access-link span:last-child { display: none !important; }
              .scroll-indicator { display: none !important; }
            }

            @media (max-width: 640px) {
              .benefit-grid {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 1.25rem !important;
              }
              .benefit-card {
                width: 95% !important;
                max-width: 400px !important;
                min-width: 280px !important;
                flex-direction: row !important;
                text-align: left !important;
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
                border-color: var(--color-plumbing) !important;
                box-shadow: 0 10px 30px -10px var(--color-plumbing) !important;
                background: rgba(59, 130, 246, 0.05) !important;
              }
              .benefit-card span {
                white-space: nowrap !important;
                font-size: var(--font-size-sm) !important;
                color: white !important;
                letter-spacing: 0.01em !important;
              }
              .benefit-icon-wrapper {
                background: rgba(59, 130, 246, 0.1) !important;
                padding: 0.6rem !important;
                border-radius: 8px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: inset 0 0 12px rgba(59, 130, 246, 0.2) !important;
              }
              .benefit-icon-wrapper svg {
                width: 22px !important;
                height: 22px !important;
              }
              .service-grid-plumb {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 0.75rem !important;
              }
              .service-card-plumb {
                padding: 1rem 0.5rem !important;
                gap: 0.75rem !important;
              }
              .service-card-plumb h4 {
                font-size: 0.8rem !important;
                padding: 0 0.25rem !important;
                line-height: 1.3 !important;
              }
              .service-card-plumb div {
                padding: 0.5rem !important;
              }
              .service-card-plumb img {
                width: 36px !important;
                height: 36px !important;
              }
              .plumbing-services-heading {
                margin-bottom: 2rem !important;
              }
              .plumbing-services-section {
                padding: 4rem 0 !important;
              }
            }
          `}</style>

          <div className="container mobile-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className="hero-cmd-label" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 0 14px white', animation: 'pulse-glow 2s infinite' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--color-plumbing)', animation: 'pulse-glow 2s infinite linear reverse' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
                  <span style={{ backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', padding: '0.15rem 0.5rem', fontSize: '0.6rem', fontWeight: 900, borderRadius: '2px' }}>LIVE</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'white' }}>Command Center</span>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-plumbing)', letterSpacing: '0.15em' }}>
                  Sydney Region Techs Online
                </span>
              </div>
            </div>

            <div className="hero-cmd-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { href: 'tel:+61412242997', label: 'Call John', sub: '+61 412 242 997', icon: <PhoneCall size={17} className="link-icon" /> },
                { href: 'tel:+61426051275', label: 'Call Leo', sub: '+61 426 051 275', icon: <PhoneCall size={17} className="link-icon" /> },
                { href: 'mailto:service@urbanproplumbing.com.au', label: 'Email Us', sub: 'Instant Response', icon: <Mail size={17} className="link-icon" /> }
              ].map((item) => (
                <a key={item.href} href={item.href} className="access-link">
                  {item.icon}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{item.label}</span>
                    <span style={{ opacity: 0.4, fontSize: '0.65rem', fontWeight: 500 }}>{item.sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '3.5rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', zIndex: 3 }}
        >
          <ChevronDown size={26} />
        </motion.div>
      </section>

      {/* Services List */}
      <section className="section plumbing-section plumbing-services-section" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div className="plumbing-services-heading" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--color-text)' }}
            >
              Here's how our plumbers can help
            </motion.h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-plumbing)', margin: '1.5rem auto' }} />
          </div>

          <div className="service-grid-plumb" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {servicesBreakdown.map((service, idx) => (
              <motion.div 
                key={idx}
                className="service-card-plumb"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: 'var(--color-plumbing)' }}
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  padding: '2.5rem 1rem', 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-plumbing-steel)' }}>
                  <img src={service.img} alt={service.title} style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'brightness(0.9)' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: 'var(--font-size-h4)', fontWeight: 800, color: 'white', letterSpacing: '-0.01em', padding: '0 1rem' }}>
                  {service.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section plumbing-section" style={{
        padding: '6rem 0',
        backgroundImage: 'linear-gradient(rgba(10, 18, 35, 0.8), rgba(10, 18, 35, 0.88)), url(images/plumbing-sydney-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, marginBottom: '3rem', color: 'white' }}>Serving Greater Sydney Since 2015</h2>
          <div className="benefit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {[
              'Fully Licensed & Insured Plumbers', 
              'No Call Out Fees', 
              'Fixed $250 limit for Drain Cleaning', 
              'No Fix No Pay Guarantee',
              'Fast Emergency 24/7 Deployment',
              'Commercial & Domestic Coverage'
            ].map((benefit, i) => (
              <motion.div 
                key={i} 
                className="benefit-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                style={{ 
                  display: 'flex', 
                  gap: '1.25rem', 
                  alignItems: 'center', 
                  padding: '1.75rem', 
                  backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="benefit-icon-wrapper" style={{ color: 'var(--color-plumbing)', display: 'flex', flexShrink: 0 }}>
                  <CheckCircle size={28} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white', letterSpacing: '-0.01em' }}>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="plumbing-section" style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
        {/* Header */}
        <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Official Google G icon */}
            <div style={{ width: '44px', height: '44px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.84-.68z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <motion.h2
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}
            >
              Google Reviews
            </motion.h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>4.9</span>
            <div>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.4rem' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={22} fill="#FBBC05" color="#FBBC05" />)}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Top-rated by our customers</div>
            </div>
          </div>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-plumbing)', margin: '1.5rem auto 0' }} />
        </div>

        {/* Marquee track — duplicated for seamless loop */}
        <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
          <div className="reviews-track">
            {[...reviews, ...reviews].map((review, idx) => (
              <div key={idx} className="review-card-marquee">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.1rem' }}>
                  <div style={{
                    width: '42px', height: '42px',
                    backgroundColor: 'rgba(96,165,250,0.12)',
                    border: '2px solid var(--color-plumbing)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-plumbing)',
                    flexShrink: 0,
                  }}>
                    {review.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{review.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{review.date}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ opacity: 0.5, flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.84-.68z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.85rem' }}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#FBBC05" color="#FBBC05" />
                  ))}
                </div>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.65, margin: 0, fontSize: '0.88rem' }}>
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="container" style={{ textAlign: 'center' }}>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem 2.5rem',
              border: '2px solid rgba(255,255,255,0.2)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 700, fontSize: '0.95rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}
          >
            View All Reviews on Google →
          </a>
        </div>

        <style>{`
          @keyframes reviews-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .reviews-track {
            display: flex;
            gap: 1.5rem;
            width: max-content;
            animation: reviews-marquee 60s linear infinite;
          }
          .reviews-track:hover {
            animation-play-state: paused;
          }
          .review-card-marquee {
            width: 340px;
            flex-shrink: 0;
            background-color: var(--color-surface);
            padding: 1.75rem;
            border: 1px solid rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
          }
          @media (max-width: 768px) {
            .review-card-marquee { width: 270px; }
            .reviews-track { animation-duration: 45s; }
          }
        `}</style>
      </section>

      {/* Full-width Contact CTA */}
      <section className="plumbing-section" style={{ padding: '6rem 0', backgroundColor: 'var(--color-plumbing-bg)', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Need a Plumber?</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              Call us now for fast, upfront service — or send us an email anytime.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
              <a href="tel:+61412242997" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call John
              </a>
              <a href="tel:+61426051275" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call Leo
              </a>
              <a href="mailto:service@urbanproplumbing.com.au" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'transparent', color: 'var(--color-text)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: '2px solid var(--color-text-muted)' }}>
                ✉ Email Us
              </a>
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 2 }}>
              <span>ABN: 48 694 251 888</span>
              <span style={{ margin: '0 1.5rem', opacity: 0.3 }}>|</span>
              <span>Contractor Licence NO: 280492C</span>
              <span style={{ margin: '0 1.5rem', opacity: 0.3 }}>|</span>
              <span>service@urbanproplumbing.com.au</span>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
    </>
  );
};

export default Plumbing;
