import { motion } from 'framer-motion';
import { ShieldCheck, Clock, BadgeDollarSign, Wrench, AlertTriangle, CheckCircle, PhoneCall, ChevronDown } from 'lucide-react';

const Plumbing = () => {
  const guarantees = [
    { text: "NO CALL OUT FEE", icon: <BadgeDollarSign size={32} /> },
    { text: "FIXED $250 RATE (Drain Cleaning)", icon: <Wrench size={32} /> },
    { text: "NO FIX NO PAY", icon: <ShieldCheck size={32} /> }
  ];

  const emergencyInfo = [
    { text: "EMERGENCY CALL 24/7", subtext: "Covering all Sydney area", icon: <AlertTriangle size={24} className="text-accent" /> },
    { text: "EMERGENCY 7 DAYS", subtext: "Ready when you need us most", icon: <Clock size={24} className="text-accent" /> }
  ];

  const servicesBreakdown = [
    { title: "GENERAL PLUMBING", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/technician-rhtn80s1xnpu86dtmlwtjefkv73ps41h86f41rvv2c.png" },
    { title: "HOT WATER", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/shower-rhtnh04j8o0h61c56hohd4u57qtzbzp54mu54ykflw.png" },
    { title: "GAS HEATING", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/boiler-rhtnm2h82iy3qdz9loi3sutkghv6t9t2hpec8n222s.png" },
    { title: "BLOCKAGES", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/appliances-rhtnvyq20qhryllstghpjux9lj3auk3c6ond4idukk.png" },
    { title: "WATER LEAK DETECTION", img: "https://urbanproplumbing.com.au/wp-content/uploads/elementor/thumbs/leak-rhtoa46kwxv6r91s6kpi3ad3kdc8qi9usq8j8hegw4.png" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Hero Banner with Image */}
      <section style={{ 
        position: 'relative',
        padding: '10rem 0 8rem',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=100&w=3000&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div
             initial={{ y: 30, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'white', letterSpacing: '-0.02em' }}>
              Expert Plumbing Solutions
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '650px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
              Fast, reliable, and upfront pricing. From emergency blockages to full renovations, we solve your plumbing problems without the guesswork.
            </p>
          </motion.div>

          {/* Core Guarantees Banner */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: '2rem',
              backgroundColor: 'var(--color-accent)',
              padding: '2.5rem',
              color: 'var(--color-bg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
          >
            {guarantees.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '1rem' }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', textAlign: 'center', lineHeight: 1.2 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'white', opacity: 0.8 }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Emergency System & Direct Access Strip */}
      <section style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          backgroundColor: 'var(--color-surface)',
          borderTop: '4px solid var(--color-accent)'
        }}>
          {emergencyInfo.map((info, idx) => (
            <div key={idx} style={{ 
              padding: '3rem 2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem',
              borderRight: idx === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <div style={{ backgroundColor: 'rgba(245,158,11,0.08)', padding: '1.25rem' }}>
                {info.icon}
              </div>
              <div>
                <h3 style={{ color: 'var(--color-text)', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.25rem 0', letterSpacing: '-0.01em' }}>{info.text}</h3>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{info.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* The New Horizontal Command Strip */}
        <div style={{ 
          backgroundColor: '#020617', 
          borderTop: '1px solid rgba(255,255,255,0.03)', 
          padding: '1.5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <style>{`
            .access-link {
              display: flex; align-items: center; gap: 0.75rem;
              color: rgba(255,255,255,0.6); text-decoration: none;
              font-weight: 700; font-size: 0.9rem; letter-spacing: 0.05em;
              transition: all 0.3s ease;
              padding: 0.5rem 1rem;
              border: 1px solid transparent;
            }
            .access-link:hover {
              color: white;
              background-color: rgba(255,255,255,0.03);
              border-color: rgba(255,255,255,0.08);
            }
            .access-link .link-icon { color: var(--color-accent); opacity: 0.7; transition: all 0.3s ease; }
            .access-link:hover .link-icon { transform: scale(1.1); opacity: 1; }
            
            @keyframes pulse-glow {
              0% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.4; transform: scale(1); }
            }
          `}</style>
          
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ 
                width: '8px', height: '8px', borderRadius: '50%', 
                backgroundColor: 'var(--color-accent)', 
                boxShadow: '0 0 12px var(--color-accent)',
                animation: 'pulse-glow 2s infinite'
              }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                Direct Dispatch Available
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { href: 'tel:+61412242997', label: '+61 412 242 997', sub: 'John', icon: <PhoneCall size={16} className="link-icon" /> },
                { href: 'tel:+61426051275', label: '+61 426 051 275', sub: 'Leo', icon: <PhoneCall size={16} className="link-icon" /> },
                { href: 'mailto:service@urbanproplumbing.com.au', label: 'Email Request', sub: '', icon: <span className="link-icon" style={{ fontWeight: 800 }}>@</span> }
              ].map((item) => (
                <a key={item.href} href={item.href} className="access-link">
                  {item.icon}
                  <span>{item.label}</span>
                  {item.sub && <span style={{ opacity: 0.4, fontSize: '0.75rem', fontWeight: 500 }}>({item.sub})</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text)' }}
            >
              Here's how our plumbers can help
            </motion.h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-accent)', margin: '1.5rem auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {servicesBreakdown.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: 'var(--color-accent)' }}
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  padding: '2.5rem 1.5rem', 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <img src={service.img} alt={service.title} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {service.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--color-text)' }}>Serving Greater Sydney Since 2015</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
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
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--color-bg)' }}
              >
                <CheckCircle className="text-accent" size={32} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-text)' }}>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Contact CTA */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)', textAlign: 'center' }}>
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
              <a href="tel:+61412242997" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call John
              </a>
              <a href="tel:+61426051275" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
  );
};

export default Plumbing;
