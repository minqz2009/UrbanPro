import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hammer, Droplets, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
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
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=100&w=1200"
    },
    {
      title: "Plumbing Services",
      description: "Fast, reliable plumbing solutions. 24/7 emergencies. Upfront pricing and guaranteed fixes.",
      icon: <Droplets size={40} style={{ color: '#3b82f6' }} />,
      link: "/plumbing",
      color: "#3b82f6",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=100&w=1200"
    },
    {
      title: "Electrical Services",
      description: "Safe, efficient electrical work for residential and commercial properties. Licensed Master Electricians.",
      icon: <Zap size={40} style={{ color: 'var(--color-electrical)' }} />,
      link: "/electrical",
      color: "var(--color-electrical)",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=100&w=1200"
    }
  ];

  return (
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
              backgroundImage: 'url(https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=100&w=3000&auto=format&fit=crop)',
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
              <h1 style={{ fontSize: 'clamp(3.25rem, 8vw, 6.5rem)', marginBottom: '1.5rem', letterSpacing: '-0.04em', color: 'white', fontWeight: 800, lineHeight: 1.05 }}>
                Build. <span style={{ color: 'var(--color-plumbing)' }}>Plumb.</span><br/>
                <span style={{ color: 'var(--color-electrical)' }}>Power.</span>
              </h1>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7, fontWeight: 400, fontFamily: '"Helvetica Neue", Helvetica, sans-serif' }}>
                Sydney's all-in-one property specialists — architecture, plumbing & electrical under one uncompromising standard.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'clamp(2rem, 4vh, 4rem)' }}>
              <a href="#services" onClick={(e) => { e.preventDefault(); const el = document.getElementById('services'); if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: 'smooth' }); } }} style={{ padding: '1.1rem 3rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, backgroundColor: 'white', color: '#0f172a', textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                Explore Services
              </a>
              <a href="mailto:service@urbanproplumbing.com.au" style={{ padding: '1.1rem 3rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, backgroundColor: 'transparent', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s ease' }}>
                Get in Touch
              </a>
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
      <section id="services" ref={servicesRef} style={{ padding: '6vh 0 15vh', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-80px", amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: '4rem', y: servicesHeadingY }}
          >
            <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '-0.04em' }}>Our Capabilities</h2>
            <div style={{ width: '100px', height: '2px', backgroundColor: 'var(--color-text-muted)', margin: '0 auto' }} />
          </motion.div>

          <style>{`
            @media (max-width: 768px) {
              .services-container { gap: 1rem !important; }
              .service-card-wrapper { flex: 1 1 100% !important; }
              .service-img-container { height: 240px !important; }
              .service-content { padding: 2rem 1.25rem !important; }
              .service-title { fontSize: 1.5rem !important; }
              .service-icon-box { width: 60px !important; height: 60px !important; margin-top: -50px !important; }
            }
          `}</style>
          <motion.div className="services-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', y: servicesCardsY }}>
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
                    <div className="service-img-container" style={{ height: '350px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--color-bg)', opacity: 0.4, zIndex: 1, transition: 'opacity 0.8s ease' }} className="service-overlay" />
                      <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }} className="service-img" />
                    </div>
                    <div className="service-content" style={{ padding: '3rem 2.5rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                      <div className="service-icon-box" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', backgroundColor: 'var(--color-surface)', marginTop: '-70px', position: 'relative', zIndex: 2 }}>
                        {service.icon}
                      </div>
                      <h3 className="service-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{service.title}</h3>
                      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', flex: 1, fontSize: '1.125rem', lineHeight: 1.8, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
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
      </section>
    </motion.div>
  );
};

export default Home;
