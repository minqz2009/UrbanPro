import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Layout } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import type { BuildingProject } from '../hooks/useContent';

// ─── Project Detail Modal ──────────────────────────────────────────────────────

function ProjectModal({ project, onClose, galleryFont }: { project: BuildingProject; onClose: () => void; galleryFont: string }) {
  const [showBefore, setShowBefore] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [showFloorBefore, setShowFloorBefore] = useState(false);
  const afterPhotos = project.photos?.length > 0 ? project.photos : [project.image];
  const beforePhotos = project.beforePhotos?.length > 0 ? project.beforePhotos : [];
  const currentPhotos = showBefore ? beforePhotos : afterPhotos;
  const hasBefore = beforePhotos.length > 0;
  const hasAfter = afterPhotos.length > 0;
  const hasFloorPlan = !!(project.floorPlanAfter || project.floorPlanBefore);
  const [idx, setIdx] = useState(0);
  const [showPano, setShowPano] = useState(false);
  const hasPano = !!project.pano;

  const prev = () => setIdx(i => (i - 1 + currentPhotos.length) % currentPhotos.length);
  const next = () => setIdx(i => (i + 1) % currentPhotos.length);

  // Reset idx when switching before/after if out of bounds
  const switchSet = (before: boolean) => {
    setShowBefore(before);
    const target = before ? beforePhotos : afterPhotos;
    if (idx >= target.length) setIdx(Math.max(0, target.length - 1));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (showFloorPlan) setShowFloorPlan(false); else onClose(); }
      if (!showFloorPlan) { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, currentPhotos.length, showFloorPlan]);

  // floor plan images
  const fpCurrent = showFloorBefore && project.floorPlanBefore ? project.floorPlanBefore : project.floorPlanAfter;
  const hasFpBefore = !!project.floorPlanBefore;
  const hasFpAfter = !!project.floorPlanAfter;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'fixed', inset: 0, backgroundColor: '#080e1a', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: galleryFont }}
    >
      {/* Close */}
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '2rem', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', zIndex: 1001, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: galleryFont }}>
        Close <X size={22} />
      </button>

      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4.5rem 0 0', overflow: 'hidden' }}
      >
        {showFloorPlan ? (
          /* Floor Plan view */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={(showFloorBefore ? 'before' : 'after')}
                  src={fpCurrent}
                  alt="Floor Plan"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </AnimatePresence>
              {(hasFpBefore && hasFpAfter) && (
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
                  <button onClick={() => setShowFloorBefore(!showFloorBefore)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1.2rem', borderRadius: '2rem',
                      border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
                      fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                      cursor: 'pointer', fontFamily: galleryFont, transition: 'all 0.3s ease',
                    }}
                  >
                    <span style={{ color: showFloorBefore ? 'rgba(255,255,255,0.3)' : 'white', transition: 'color 0.3s' }}>After</span>
                    <span style={{ margin: '0 0.6rem', color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>⇄</span>
                    <span style={{ color: showFloorBefore ? 'white' : 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}>Before</span>
                  </button>
                </div>
              )}
            </div>
            <div style={{ padding: '1.25rem 4vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.2rem', color: 'white', textTransform: 'uppercase' }}>{project.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Floor Plan</p>
              </div>
              <button onClick={() => setShowFloorPlan(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: galleryFont }}>
                ← Back to Photos
              </button>
            </div>
          </div>
        ) : !showPano ? (
          <>
            {/* Before/After toggle — only when both sides have photos */}
            {(hasBefore && hasAfter) && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => switchSet(!showBefore)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1.2rem', borderRadius: '2rem',
                    border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent',
                    fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    cursor: 'pointer', fontFamily: galleryFont, transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ color: showBefore ? 'rgba(255,255,255,0.3)' : 'white', transition: 'color 0.3s' }}>After</span>
                  <span style={{ margin: '0 0.6rem', color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>⇄</span>
                  <span style={{ color: showBefore ? 'white' : 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}>Before</span>
                </button>
              </div>
            )}

            {/* Photo viewer */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
              {currentPhotos.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${showBefore ? 'before' : 'after'}-${idx}`}
                      src={currentPhotos[idx]}
                      alt={project.title}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', userSelect: 'none' }}
                    />
                  </AnimatePresence>

                  {currentPhotos.length > 1 && (
                    <>
                      <button onClick={prev} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={next} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {currentPhotos.length > 1 && (
                    <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                      {currentPhotos.map((_, i) => (
                        <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? '20px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: i === idx ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.2)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  No {showBefore ? 'before' : 'after'} photos
                </div>
              )}
            </div>

            {/* Info bar */}
            <div style={{ padding: '1.5rem 4vw 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.3rem', color: 'white', textTransform: 'uppercase' }}>{project.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{project.location}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '380px', margin: 0 }}>{project.description}</p>
                {hasFloorPlan && (
                  <button onClick={() => setShowFloorPlan(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: galleryFont, flexShrink: 0, whiteSpace: 'nowrap', transition: 'border-color 0.2s' }}>
                    <Layout size={15} /> View Floor Plan
                  </button>
                )}
                {hasPano && (
                  <button onClick={() => setShowPano(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', fontFamily: galleryFont, flexShrink: 0, whiteSpace: 'nowrap', transition: 'border-color 0.2s' }}>
                    <Maximize2 size={15} /> 360° Panorama
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Panorama view */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                title="360 Panorama Viewer"
                allowFullScreen
                src={`https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${project.pano}&autoLoad=true`}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(0,0,0,0.55)', padding: '0.4rem 0.9rem', color: 'white', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none', backdropFilter: 'blur(4px)' }}>
                Interactive 360° View — drag to look around
              </div>
            </div>
            <div style={{ padding: '1.25rem 4vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.2rem', color: 'white', textTransform: 'uppercase' }}>{project.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{project.location}</p>
              </div>
              <button onClick={() => setShowPano(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: galleryFont }}>
                ← Back to Photos
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Case Item ─────────────────────────────────────────────────────────────────

const CaseItem = ({ project, setSelectedProject }: { project: BuildingProject, index?: number, setSelectedProject: (p: BuildingProject | null) => void }) => {
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
          <h3 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--color-text)', margin: 0 }}>{project.title}</h3>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: 'var(--font-size-sm)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{project.location}</p>
        </div>
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: 'var(--font-size-body)', margin: 0 }}>{project.description}</p>
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
            {project.pano ? 'ENTER 360° TOUR' : 'VIEW GALLERY'}
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
  const { content } = useContent();
  const [selectedProject, setSelectedProject] = useState<BuildingProject | null>(null);
  const [activeCategory, setActiveCategory] = useState(content.buildingCategories?.[0] || "New Builds");

  const categories = content.buildingCategories;
  const filteredCases = content.buildingProjects.filter(c => c.category === activeCategory);

  useEffect(() => {
    if (content.buildingCategories?.length > 0) {
      setActiveCategory(content.buildingCategories[0]);
    }
  }, [content.buildingCategories]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const galleryFont = '"Space Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <>
    <Helmet>
      <title>Sydney Building Renovations | New Home Builds & Extensions | UrbanPro</title>
      <meta name="description" content="Premium Sydney builder — new homes, renovations, heritage restorations, extensions. Paddington, Bondi, Vaucluse, Surry Hills, Mosman. Full project management, licensed and insured." />
      <link rel="canonical" href="https://urbanproplumbing.com.au/building-reno" />
      <meta property="og:title" content="Sydney Building Renovations | New Home Builds & Extensions | UrbanPro" />
      <meta property="og:description" content="Premium building renovations and new home builds in Sydney. Serving Paddington, Surry Hills, Bondi, Vaucluse and Greater Sydney." />
      <meta property="og:url" content="https://urbanproplumbing.com.au/building-reno" />
      <meta property="og:image" content="https://urbanproplumbing.com.au/images/building-hero.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Sydney Building Renovations | New Home Builds | UrbanPro" />
      <meta name="twitter:description" content="Premium building renovations and new home builds. Paddington, Bondi, Vaucluse — all Sydney." />
      <meta name="twitter:image" content="https://urbanproplumbing.com.au/images/building-hero.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Building Renovations Sydney",
        "provider": {"@type": "LocalBusiness", "name": "UrbanPro", "telephone": content.settings.phone1, "image": "https://urbanproplumbing.com.au/images/building-hero.jpg", "priceRange": "$$$"},
        "areaServed": ["Sydney CBD", "Eastern Suburbs", "Inner West", "North Shore", "Northern Beaches", "Southern Sydney", "Bondi", "Vaucluse", "Paddington", "Surry Hills", "Double Bay", "Mosman", "Chatswood", "Parramatta"],
        "description": "Sydney builder — new home construction, heritage restorations, extensions, kitchen and bathroom renovations, architectural builds. Licensed (280492C), insured, end-to-end project management across Greater Sydney.",
        "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "25"}
      })}</script>
    </Helmet>
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
            src="images/building-hero.jpg" 
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
              fontSize: 'var(--font-size-h1)',
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.06em',
              margin: 0,
              textTransform: 'uppercase'
            }}>
              <span style={{ color: 'white', display: 'block' }}>Spaces of</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '4rem' }}
          >
            <span style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 800,
              color: 'var(--color-text-muted)',
              lineHeight: 0.9,
              letterSpacing: '-0.06em',
              margin: 0,
              textTransform: 'uppercase',
              marginLeft: '10vw',
              display: 'block'
            }}>
              Distinction
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginLeft: '10vw', maxWidth: '600px' }}
          >
            <p style={{ fontSize: 'var(--font-size-body)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
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
          <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--color-text)', textTransform: 'uppercase', margin: 0 }}>Exhibitions</h2>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 3rem)', marginTop: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'nowrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  background: 'none', border: 'none', color: activeCategory === cat ? 'white' : 'var(--color-text-muted)', fontSize: 'clamp(0.7rem, 2.5vw, 1.25rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', padding: '0 0 1rem 0', position: 'relative', transition: 'color 0.4s ease', whiteSpace: 'nowrap'
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
                <CaseItem key={project.id} project={project} index={index} setSelectedProject={setSelectedProject} />
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
              'images/building-glass-house.jpg',
              'images/building-heritage.jpg',
              'images/building-hero.jpg',
              'images/building-coastal.jpg',
              'images/building-extension.jpg',
              'images/building-acoustic.jpg',
              'images/building-glass-house.jpg',
              'images/building-heritage.jpg',
              'images/building-hero.jpg',
              'images/building-coastal.jpg',
              'images/building-extension.jpg',
              'images/building-acoustic.jpg',
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
        <div style={{
          padding: '8vh 4vw 10vh', textAlign: 'center', position: 'relative',
          backgroundImage: 'linear-gradient(rgba(10, 18, 35, 0.75), rgba(10, 18, 35, 0.88)), url(images/building-cta-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
              Start Your Project
            </p>
            <h2 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', margin: '0 0 1.5rem', lineHeight: 1.1 }}>
              Ready to Build?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-body)', maxWidth: '550px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
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

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} galleryFont={galleryFont} />
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};

export default Building;
