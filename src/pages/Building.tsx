import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { X } from 'lucide-react';

const casesData = [
  {
    title: "The Glass House",
    location: "Vaucluse, NSW",
    description: "A modern architectural masterpiece featuring floor-to-ceiling glass and minimalist steel framing. Seamlessly blending indoor and outdoor living.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=100&w=3000&auto=format&fit=crop",
    category: "New Builds",
    pano: "https://pannellum.org/images/alma.jpg"
  },
  {
    title: "Coastal Retreat",
    location: "Bondi Beach, NSW",
    description: "Open-concept beachside home utilizing natural timber and raw concrete to create an organic, serene atmosphere.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=3000&auto=format&fit=crop",
    category: "New Builds",
    pano: "https://pannellum.org/images/bma-1.jpg"
  },
  {
    title: "Heritage Restoration",
    location: "Paddington, NSW",
    description: "Careful preservation of a 19th-century facade coupled with a stunningly modern interior extension and custom lightwell.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=100&w=3000&auto=format&fit=crop",
    category: "Renovations",
    pano: "https://pannellum.org/images/jfk.jpg"
  },
  {
    title: "Minimalist Extension",
    location: "Surry Hills, NSW",
    description: "A compact yet breathtaking geometric rear extension maximizing natural light in a dense urban plot.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=3000&auto=format&fit=crop",
    category: "Renovations",
    pano: "https://pannellum.org/images/cerro-toco.jpg"
  },
  {
    title: "Acoustic Ceilings",
    location: "Sydney CBD",
    description: "Custom suspended acoustic ceilings installed in a high-end commercial lobby for sound dampening and aesthetic edge.",
    image: "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=100&w=3000&auto=format&fit=crop",
    category: "Small Projects",
    pano: "https://pannellum.org/images/alma.jpg"
  }
];

const CaseItem = ({ project, setSelectedProject }: { project: any, index?: number, setSelectedProject: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ width: '100%' }}
    >
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
          style={{ height: '100%', cursor: 'pointer', overflow: 'hidden' }} 
          onClick={() => setSelectedProject(project)}
        >
          <motion.img 
            initial={{ filter: 'grayscale(100%)' }}
            whileInView={{ filter: 'grayscale(0%)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            src={project.image} 
            alt={project.title} 
            style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'cover', transform: 'translateZ(0)' }}
          />
        </motion.div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '2rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--color-text)', margin: 0 }}>{project.title}</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{project.location}</p>
        </div>
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '1rem', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', margin: 0 }}>{project.description}</p>
          <button 
            onClick={() => setSelectedProject(project)}
            style={{ 
              marginTop: '2rem',
              fontSize: '0.875rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em', 
              fontWeight: 700,
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
            className="exhibition-btn"
          >
            ENTER 360° TOUR
            <motion.div className="btn-line" style={{ height: '2px', backgroundColor: 'var(--color-text)', width: '0%', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Building = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const yHero = useTransform(springScroll, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(springScroll, [0, 0.2], [1, 0]);
  const [selectedProject, setSelectedProject] = useState<typeof casesData[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("New Builds");

  const categories = ["New Builds", "Renovations", "Small Projects"];
  const filteredCases = casesData.filter(c => c.category === activeCategory);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const galleryFont = '"Space Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: galleryFont, overflowX: 'hidden' }}
    >
      <style>{`
        .exhibition-btn:hover .btn-line { width: 100% !important; }
        .tab-btn {
          opacity: 0.5;
          transition: all 0.4s ease;
        }
        .tab-btn:hover {
          opacity: 0.8;
          color: white !important;
        }
        .tab-btn.active {
          opacity: 1;
        }
      `}</style>
      
      {/* Avant-Garde Minimalist Hero with Spring Parallax */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '10vh' }}>
        <motion.div style={{ y: yHero, opacity: opacityHero, position: 'absolute', inset: -50, zIndex: 0 }}>
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=100&w=3000&auto=format&fit=crop" 
            alt="Luxury Home" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0) 100%)', zIndex: 1 }} />
        
        <div style={{ padding: '0 4vw', zIndex: 2, width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 10vw, 12rem)',
              fontWeight: 700, 
              color: 'white',
              lineHeight: 0.9,
              letterSpacing: '-0.06em',
              margin: 0,
              textTransform: 'uppercase'
            }}>
              Spaces of
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '4rem' }}
          >
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 10vw, 12rem)',
              fontWeight: 700, 
              color: 'var(--color-text-muted)',
              lineHeight: 0.9,
              letterSpacing: '-0.06em',
              margin: 0,
              textTransform: 'uppercase',
              marginLeft: '10vw'
            }}>
              Distinction
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginLeft: '10vw', maxWidth: '600px' }}
          >
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              We don't just build walls. We construct lifestyles. From full-scale New Home Builds, to masterly executed Renovations, and precise Small Projects (carpentry, ceilings, specialized fixes). We handle everything end-to-end.
            </p>
          </motion.div>
        </div>
      </section>



      {/* Cases Showcase - Tabbed Interface */}
      <section style={{ padding: '5vh 4vw 8vh', backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ paddingBottom: '3rem' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.05em', color: 'var(--color-text)', textTransform: 'uppercase', margin: 0 }}>Exhibitions</h2>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  background: 'none', border: 'none', color: activeCategory === cat ? 'white' : 'var(--color-text-muted)', fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', padding: '0 0 1rem 0', position: 'relative', transition: 'color 0.4s ease'
                }}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div layoutId="underline" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'white' }} />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div style={{ minHeight: '800px', marginTop: '8vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13.2vh' }}>
            <AnimatePresence mode="wait">
              {filteredCases.map((project, index) => (
                <CaseItem key={project.title} project={project} index={index} setSelectedProject={setSelectedProject} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Infinite scrolling photo strip */}
        <style>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div style={{ height: '30vh', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            display: 'flex',
            animation: 'marqueeScroll 60s linear infinite',
            width: 'max-content',
            height: '100%'
          }}>
            {[
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=800&auto=format&fit=crop',
            ].map((src, i) => (
              <div key={i} style={{ height: '100%', width: '40vw', minWidth: '300px', flexShrink: 0, position: 'relative' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '10vw', background: 'linear-gradient(to right, rgba(15, 23, 42, 1), transparent)', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '10vw', background: 'linear-gradient(to left, rgba(15, 23, 42, 1), transparent)', pointerEvents: 'none', zIndex: 1 }} />
        </div>

        {/* CTA content */}
        <div style={{ backgroundColor: 'var(--color-bg)', padding: '8vh 4vw 10vh', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
              Start Your Project
            </p>
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, color: 'white', letterSpacing: '-0.04em', margin: '0 0 1.5rem', lineHeight: 1.1 }}>
              Ready to Build?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', fontFamily: '"Helvetica Neue", Helvetica, sans-serif', maxWidth: '550px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
              Transform your vision into reality with Sydney's most trusted architects and builders.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a href="mailto:info@urbanpro.com.au" style={{
              display: 'inline-block',
              padding: '1.25rem 3.5rem',
              backgroundColor: 'white',
              color: 'black',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              transition: 'all 0.3s'
            }}>
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      {/* Minimalist 360 Pano Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--color-bg)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <button 
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '4vw',
                backgroundColor: 'transparent',
                color: 'var(--color-text)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                zIndex: 1001,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: galleryFont
              }}
            >
              Close <X size={32} />
            </button>

            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10vh 4vw 4vw' }}
            >
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'black' }}>
                {/* Embedded 360 Panorama Iframe */}
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  title="360 Panorama Viewer"
                  allowFullScreen
                  src={`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${selectedProject.pano}&autoLoad=true`}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', color: 'white', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>
                  Interactive 360° View
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase' }}>
                    {selectedProject.title}
                  </h3>
                </div>
                <div style={{ maxWidth: '400px' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Building;
