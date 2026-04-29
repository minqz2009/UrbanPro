import { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, MessageCircle, Send, Mail, Phone } from 'lucide-react';
import { useContent } from './hooks/useContent';

// Pages
import Home from './pages/Home';
import Building from './pages/Building';
import Plumbing from './pages/Plumbing';
import Electrical from './pages/Electrical';
import About from './pages/About';
import Admin from './pages/Admin';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  let urbanColor = 'var(--color-text)';
  let proColor = 'var(--color-accent)';

  if (path === '/building-reno') {
    proColor = 'var(--color-text-muted)';
  } else if (path === '/electrical') {
    proColor = '#eab308';
  } else if (path === '/plumbing' || path === '/about') {
    urbanColor = 'var(--color-plumbing)';
    proColor = 'var(--color-electrical)';
  }

  const headerBg = isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent';
  const headerBorder = isScrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent';
  const headerPadding = isScrolled ? '1rem 0' : '2rem 0';
  const headerBackdrop = isScrolled ? 'blur(10px)' : 'none';

  return (
    <>
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100, 
        padding: headerPadding, 
        backgroundColor: headerBg,
        borderBottom: headerBorder,
        backdropFilter: headerBackdrop, 
        WebkitBackdropFilter: headerBackdrop, 
        transition: 'all 0.4s ease',
        transform: 'translateZ(0)',
        willChange: 'padding, background-color'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', zIndex: 101 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, transition: 'color 0.8s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 101 }}>
              <span style={{ color: urbanColor, transition: 'color 0.8s ease' }}>URBAN</span>
              <span style={{ color: proColor, transition: 'color 0.8s ease' }}>PRO</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '3rem', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/building-reno" className="nav-link">Building</Link>
            <Link to="/plumbing" className="nav-link">Plumbing</Link>
            <Link to="/electrical" className="nav-link">Electrical</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>

          {/* Mobile Navigation Toggle */}
          <button 
            className="mobile-nav-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 101, display: 'none' }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'rgba(15, 23, 42, 0.98)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}
            >
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Link to="/" className="nav-link" style={{ fontSize: '1rem' }}>Home</Link>
                <Link to="/building-reno" className="nav-link" style={{ fontSize: '1rem' }}>Building & Reno</Link>
                <Link to="/plumbing" className="nav-link" style={{ fontSize: '1rem' }}>Plumbing</Link>
                <Link to="/electrical" className="nav-link" style={{ fontSize: '1rem' }}>Electrical</Link>
                <Link to="/about" className="nav-link" style={{ fontSize: '1rem' }}>About</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .nav-link {
            color: rgba(255,255,255,0.6);
            text-decoration: none;
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .nav-link:hover {
            color: white;
            opacity: 1;
          }
          
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-nav-toggle {
              display: block !important;
            }
          }
        `}</style>
      </header>
    </>
  );
};

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;
  const { content } = useContent();
  
  let urbanColor = 'var(--color-text)';
  let proColor = 'var(--color-accent)';

  if (path === '/building-reno') {
    proColor = 'var(--color-text-muted)';
  } else if (path === '/electrical') {
    proColor = 'var(--color-electrical)';
  } else if (path === '/plumbing' || path === '/about') {
    urbanColor = 'var(--color-plumbing)';
    proColor = 'var(--color-electrical)';
  }

  return (
    <footer style={{ backgroundColor: 'var(--color-bg)', color: 'white', padding: '6rem 0 3rem', marginTop: 'auto', borderTop: '1px solid var(--color-border)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            <span style={{ color: urbanColor }}>URBAN</span>
            <span style={{ color: proColor }}>PRO</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '300px', lineHeight: 1.8, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
            Your trusted architectural, plumbing, and electrical master craftsmen across Greater Sydney.
          </p>
          <div style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 2 }}>
            <div>ABN: {content.settings.abn}</div>
            <div>Contractor Licence NO: {content.settings.licence}</div>
          </div>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Services</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)', padding: 0 }}>
            <li><Link to="/building-reno" style={{ color: 'inherit', textDecoration: 'none' }}>Building & Renovation</Link></li>
            <li><Link to="/plumbing" style={{ color: 'inherit', textDecoration: 'none' }}>Plumbing Services</Link></li>
            <li><Link to="/electrical" style={{ color: 'inherit', textDecoration: 'none' }}>Electrical Services</Link></li>
          </ul>
        </div>
        <div style={{ flex: '1 1 250px' }}>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contact</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={16} style={{ flexShrink: 0, color: (path === '/plumbing' || path === '/about') ? 'var(--color-plumbing)' : 'var(--color-accent)' }} />
              <a href={`tel:${content.settings.phone1}`} style={{ color: 'inherit', textDecoration: 'none' }}>{content.settings.phone1} (John)</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={16} style={{ flexShrink: 0, color: (path === '/plumbing' || path === '/about') ? 'var(--color-plumbing)' : 'var(--color-accent)' }} />
              <a href={`tel:${content.settings.phone2}`} style={{ color: 'inherit', textDecoration: 'none' }}>{content.settings.phone2} (Leo)</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={16} style={{ flexShrink: 0, color: (path === '/plumbing' || path === '/about') ? 'var(--color-plumbing)' : 'var(--color-accent)' }} />
              <a href={`mailto:${content.settings.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{content.settings.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} UrbanPro. All rights reserved.
      </div>
    </footer>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/building-reno" element={<Building />} />
        <Route path="/plumbing" element={<Plumbing />} />
        <Route path="/electrical" element={<Electrical />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
};

const FloatingContact = () => {
  const location = useLocation();
  const path = location.pathname;
  const { content } = useContent();

  // Page-aware theming
  const getTheme = () => {
    if (path === '/building-reno') return { accent: '#ffffff', text: '#0f172a', headerBg: '#151e2d', headerText: 'white', headerSub: 'rgba(255,255,255,0.8)', btnBg: '#ffffff', btnText: '#0f172a' };
    if (path === '/electrical') return { accent: 'var(--color-electrical)', text: 'var(--color-bg)', headerBg: '#facc15', headerText: 'var(--color-bg)', headerSub: 'rgba(15,23,42,0.7)', btnBg: 'var(--color-electrical)', btnText: 'var(--color-bg)' };
    if (path === '/plumbing' || path === '/about') return { accent: 'var(--color-plumbing)', text: 'white', headerBg: '#1e3a8a', headerText: 'white', headerSub: 'rgba(255,255,255,0.8)', btnBg: 'var(--color-plumbing)', btnText: 'white' };
    // Home Page: Blue Top, Yellow Button
    return { accent: 'white', text: 'var(--color-bg)', headerBg: 'var(--color-plumbing)', headerText: 'white', headerSub: 'rgba(255,255,255,0.8)', btnBg: 'var(--color-electrical)', btnText: 'var(--color-bg)' };
  };
  const theme = getTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.open(`mailto:${content.settings.email}?subject=${subject}&body=${body}`);
    setSent(true);
    resetTimer.current = setTimeout(() => { setSent(false); setIsOpen(false); setFormData({ name: '', email: '', message: '' }); }, 3000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          backgroundColor: theme.accent,
          color: theme.text,
          border: 'none',
          borderRadius: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          transition: 'background-color 0.5s ease, box-shadow 0.5s ease, color 0.5s ease'
        }}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* Popup Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: '360px',
              maxWidth: 'calc(100vw - 2rem)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              zIndex: 998,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem 1.5rem 1rem', backgroundColor: theme.headerBg, transition: 'background-color 0.5s ease' }}>
              <h3 style={{ color: theme.headerText, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Send us a message</h3>
              <p style={{ color: theme.headerSub, fontSize: '0.85rem', margin: '0.5rem 0 0' }}>We'll get back to you promptly</p>
            </div>

            {sent ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                  <p style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '1.125rem' }}>Message ready!</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Opening your email client...</p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                />
                <textarea
                  placeholder="How can we help?"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '0.85rem',
                    backgroundColor: theme.btnBg,
                    color: theme.btnText,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'background-color 0.5s ease, color 0.5s ease'
                  }}
                >
                  <Send size={18} /> Send Message
                </motion.button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SiteLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  if (isAdmin) return <Admin />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <AnimatedRoutes />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

function App() {
  return (
    <Router>
      <SiteLayout />
    </Router>
  );
}

export default App;
