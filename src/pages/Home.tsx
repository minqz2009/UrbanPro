import { useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hammer, Droplets, Zap, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../hooks/useContent';

const Home = () => {
  const { content } = useContent();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Hero background: slow parallax + subtle zoom as you scroll
  const bgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(heroScroll, [0, 1], [1, 1.15]);
  // Text: rises faster and fades out, stays gone
  const textY = useTransform(heroScroll, [0, 1], ["0%", "-40%"]);
  const textOpacity = useTransform(heroScroll, [0, 0.4, 0.7], [1, 1, 0]);
  // Overlay darkens as you scroll, blending hero into the next section
  const overlayOpacity = useTransform(heroScroll, [0, 0.6, 1], [0, 0, 0.6]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('scrollToServices')) {
      sessionStorage.removeItem('scrollToServices');
      const t = setTimeout(() => {
        const el = document.getElementById('services');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const update = () => {
      setShowLeft(el.scrollLeft > 20);
      setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
    };
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, []);

  const servicesRef = useRef(null);
  const { scrollYProgress: servicesScrollProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"]
  });
  const servicesHeadingY = useTransform(servicesScrollProgress, [0, 1], ["0px", "-30px"]);
  const servicesCardsY = useTransform(servicesScrollProgress, [0, 1], ["20px", "-20px"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.8 } }
  };

  const itemVariants: any = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  const services = [
    {
      title: "Building & Renovation",
      description: "Artisan craftsmanship for your dream home. Expert design and impeccable execution from master builders.",
      icon: <Hammer size={40} className="text-text" />,
      link: "/building-reno",
      color: "var(--color-text)",
      image: "images/building-glass-house.jpg"
    },
    {
      title: "Plumbing Services",
      description: "Fast, reliable plumbing solutions. 24/7 emergencies. Upfront pricing and guaranteed fixes.",
      icon: <Droplets size={40} style={{ color: '#3b82f6' }} />,
      link: "/plumbing",
      color: "#3b82f6",
      image: "images/plumbing-hero.jpg"
    },
    {
      title: "Electrical Services",
      description: "Safe, efficient electrical work for residential and commercial properties. Licensed Master Electricians.",
      icon: <Zap size={40} style={{ color: 'var(--color-electrical)' }} />,
      link: "/electrical",
      color: "var(--color-electrical)",
      image: "images/electrical-card.jpg"
    }
  ];

  return (
    <>
    <Helmet>
      <title>UrbanPro Sydney | Plumber, Electrician & Building Renovations</title>
      <meta name="description" content="UrbanPro — Sydney's trusted plumber, electrician and builder. 24/7 emergency service, no call-out fee, no fix no pay guarantee. Serving Bondi, Surry Hills, Parramatta, North Shore and all of Greater Sydney." />
      <link rel="canonical" href="https://urbanproplumbing.com.au/" />
      <meta property="og:title" content="UrbanPro Sydney | Plumber, Electrician & Building Renovations" />
      <meta property="og:description" content="Sydney's trusted trade specialists. 24/7 emergency service across Greater Sydney." />
      <meta property="og:url" content="https://urbanproplumbing.com.au/" />
      <meta property="og:image" content="https://urbanproplumbing.com.au/images/hero-bg.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="UrbanPro Sydney | Plumber, Electrician & Building Renovations" />
      <meta name="twitter:description" content="Sydney's trusted trade specialists. 24/7 emergency service across Greater Sydney." />
      <meta name="twitter:image" content="https://urbanproplumbing.com.au/images/hero-bg.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UrbanPro",
        "image": "https://urbanproplumbing.com.au/images/hero-bg.jpg",
        "telephone": content.settings.phone1,
        "email": content.settings.email,
        "address": {"@type": "PostalAddress", "addressLocality": "Sydney", "addressRegion": "NSW", "addressCountry": "AU"},
        "areaServed": ["Sydney CBD", "Eastern Suburbs", "Inner West", "North Shore", "Northern Beaches", "Southern Sydney", "Western Sydney", "Bondi", "Vaucluse", "Paddington", "Surry Hills", "Double Bay", "Mosman", "Chatswood", "Parramatta", "Hurstville", "Liverpool", "Penrith", "Campbelltown", "Cronulla"],
        "priceRange": "$$",
        "openingHours": "Mo-Su 00:00-23:59",
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Trade Services", "itemListElement": [
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Emergency Plumbing Sydney"}, "description": "24/7 plumber Sydney — blocked drains, hot water, burst pipes"},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Electrical Services Sydney"}, "description": "Licensed electrician Sydney — switchboard upgrades, rewiring, fault finding"},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Building Renovations Sydney"}, "description": "Sydney builder — new builds, renovations, extensions, heritage restoration"}
        ]}
      })}</script>
    </Helmet>
    <motion.div
      className="page-enter-active"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ overflowX: 'hidden' }}
    >
      {/* Hero wrapper — extra height gives scroll room for the sticky hero to live in */}
      <div ref={heroRef} style={{ height: '120vh', position: 'relative' }}>
        <section style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0f172a'
        }}>
          {/* Background image with parallax + zoom */}
          <motion.div
            style={{
              y: bgY,
              scale: bgScale,
              position: 'absolute',
              inset: '-10%',
              backgroundImage: 'url(images/home-hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          />
          {/* Static gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.5) 50%, rgba(15, 23, 42, 0.85) 100%)',
            zIndex: 1
          }} />
          {/* Scroll-driven darkening overlay — blends hero into services bg */}
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0f172a',
            opacity: overlayOpacity,
            zIndex: 2
          }} />

          {/* Hero content */}
          <motion.div style={{ y: textY, opacity: textOpacity, position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 1rem' }}>
            <motion.div variants={itemVariants}>
              <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: '1.5rem', letterSpacing: '-0.04em', color: 'white', fontWeight: 800, lineHeight: 1.05 }}>
                <Link to="/building-reno" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Build.</Link>{' '}
                <Link to="/plumbing" style={{ color: 'var(--color-plumbing)', textDecoration: 'none', cursor: 'pointer' }}>Plumb.</Link><br/>
                <Link to="/electrical" style={{ color: 'var(--color-electrical)', textDecoration: 'none', cursor: 'pointer' }}>Power.</Link>
              </h1>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p style={{ fontSize: 'var(--font-size-body)', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7, fontWeight: 400 }}>
                {content.home.heroSubtitle}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'clamp(2rem, 4vh, 4rem)' }}>
              <a href="#services" onClick={(e) => { e.preventDefault(); const el = document.getElementById('services'); if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: 'smooth' }); } }} style={{ padding: '1.1rem 3rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, backgroundColor: 'white', color: '#0f172a', textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                Explore Services
              </a>
              {content.settings.email && (
              <a href={`mailto:${content.settings.email}`} style={{ padding: '1.1rem 3rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, backgroundColor: 'transparent', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s ease' }}>
                Get in Touch
              </a>
              )}
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1rem, 3vw, 2.5rem)', flexWrap: 'wrap' }}>
              {['Licensed Professionals', 'Fully Insured', 'Satisfaction Guaranteed'].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  <CheckCircle2 size={15} />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>


        </section>
      </div>

      {/* Services Section */}
      <section id="services" ref={servicesRef} style={{ padding: '2rem 0 15vh', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-80px", amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: '4rem', y: servicesHeadingY }}
          >
            <h2 style={{ fontSize: 'var(--font-size-h2)', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '-0.04em' }}>{content.home.servicesHeading}</h2>
            <div style={{ width: '100px', height: '2px', backgroundColor: 'var(--color-text-muted)', margin: '0 auto' }} />
          </motion.div>

          <style>{`
            .scroll-hint {
              display: none;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 10;
              pointer-events: none;
              width: 3rem;
              height: 7rem;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.35s ease;
            }
            .scroll-hint.visible { opacity: 1; }
            .scroll-hint-left {
              left: 0;
              background: linear-gradient(to right, rgba(15,23,42,0.9) 0%, transparent 100%);
            }
            .scroll-hint-right {
              right: 0;
              background: linear-gradient(to left, rgba(15,23,42,0.9) 0%, transparent 100%);
            }

            @media (max-width: 768px) {
              .scroll-hint { display: flex !important; }

              .services-container {
                gap: 1rem !important;
                flex-wrap: nowrap !important;
                overflow-x: auto !important;
                scroll-snap-type: x mandatory !important;
                padding: 1rem 9vw !important;
                width: 100vw !important;
                margin-left: -1.25rem !important;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
              }
              .services-container::-webkit-scrollbar { display: none; }

              .service-card-wrapper {
                flex: 0 0 82vw !important;
                max-width: 82vw !important;
                scroll-snap-align: center !important;
              }
              .service-img-container { height: 140px !important; }
              .service-content { padding: 1rem 1.25rem 1.25rem !important; }
              .service-title { font-size: 1.1rem !important; margin-bottom: 0.5rem !important; }
              .service-content p { font-size: 0.88rem !important; line-height: 1.55 !important; margin-bottom: 1rem !important; }
              .service-icon-box { width: 40px !important; height: 40px !important; margin-top: -28px !important; margin-bottom: 0.75rem !important; padding: 0.5rem !important; }
              .service-icon-box svg { width: 20px !important; height: 20px !important; }
            }
          `}</style>
          <div style={{ position: 'relative' }}>
            <div className={`scroll-hint scroll-hint-left${showLeft ? ' visible' : ''}`}>
              <ChevronLeft size={22} color="rgba(255,255,255,0.8)" />
            </div>
            <div className={`scroll-hint scroll-hint-right${showRight ? ' visible' : ''}`}>
              <ChevronRight size={22} color="rgba(255,255,255,0.8)" />
            </div>
          <motion.div className="services-container" ref={scrollContainerRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', y: servicesCardsY }}>
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px", amount: 0.2 }}
                transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ flex: '1 1 300px', maxWidth: '100%' }}
                className="service-card-wrapper"
              >
                <Link to={service.link} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  className="service-card"
                  >
                    <div className="service-img-container" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--color-bg)', opacity: 0.4, zIndex: 1, transition: 'opacity 0.8s ease' }} className="service-overlay" />
                      <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }} className="service-img" />
                    </div>
                    <div className="service-content" style={{ padding: '1.75rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                      <div className="service-icon-box" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '58px', height: '58px', backgroundColor: 'var(--color-surface)', marginTop: '-46px', position: 'relative', zIndex: 2 }}>
                        {service.icon}
                      </div>
                      <h3 className="service-title" style={{ fontSize: 'var(--font-size-h3)', marginBottom: '0.75rem', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{service.title}</h3>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.75rem', flex: 1, fontSize: 'var(--font-size-sm)', lineHeight: 1.7 }}>
                        {service.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: service.color, fontWeight: 700, marginTop: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Learn More <ArrowRight size={20} style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} className="service-arrow" />
                      </div>
                    </div>
                  </div>
                </Link>
                <style>{`
                  .service-card:hover .service-img {
                    transform: scale(1.08);
                  }
                  .service-card:hover .service-overlay {
                    opacity: 0.1;
                  }
                  .service-card:hover .service-arrow {
                    transform: translateX(10px);
                  }
                `}</style>
              </motion.div>
            ))}
          </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
    </>
  );
};

export default Home;
