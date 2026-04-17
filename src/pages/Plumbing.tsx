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
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '3rem 2.5rem',
              color: 'white',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.9)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Subtle blue accent glow inside the box */}
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--color-plumbing) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(30px)', pointerEvents: 'none' }} />
            
            {guarantees.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', flex: '1 1 200px', position: 'relative', zIndex: 1 }}>
                <div style={{ color: 'var(--color-plumbing)', backgroundColor: 'rgba(59,130,246,0.1)', padding: '1.25rem', borderRadius: '4px' }}>
                  {item.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                   <span style={{ fontWeight: 800, fontSize: '1.15rem', display: 'block', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>{item.text}</span>
                   <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--color-plumbing)', margin: '0 auto', opacity: 0.5 }} />
                </div>
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
          borderTop: '4px solid var(--color-plumbing)'
        }}>
          {emergencyInfo.map((info, idx) => (
            <div key={idx} style={{ 
              padding: '3rem 2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem',
              borderRight: idx === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <div style={{ backgroundColor: 'rgba(59,130,246,0.08)', padding: '1.25rem' }}>
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
          background: 'linear-gradient(to right, #020617, #080d1a, #020617)', 
          borderTop: '2px solid var(--color-plumbing)', 
          borderBottom: '1px solid rgba(59,130,246,0.15)',
          padding: '3.5rem 0',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <style>{`
            .access-link {
              display: flex; align-items: center; gap: 1.25rem;
              color: white; text-decoration: none;
              font-weight: 900; font-size: 1.25rem; letter-spacing: 0.02em;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              padding: 1.25rem 2.5rem;
              background-color: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.1);
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .access-link:hover {
              background-color: var(--color-plumbing);
              color: var(--color-bg);
              border-color: var(--color-plumbing);
              transform: translateY(-4px);
              box-shadow: 0 12px 30px -10px var(--color-plumbing);
            }
            .access-link .link-icon { color: var(--color-plumbing); transition: all 0.3s ease; }
            .access-link:hover .link-icon { color: var(--color-bg); transform: scale(1.1); }
            
            @keyframes pulse-glow {
              0% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.4; transform: scale(1); }
            }
          `}</style>
          
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  width: '16px', height: '16px', borderRadius: '50%', 
                  backgroundColor: 'white', 
                  boxShadow: '0 0 20px white',
                  animation: 'pulse-glow 2s infinite'
                }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-plumbing)', animation: 'pulse-glow 2s infinite linear reverse' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                   <span style={{ backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', padding: '0.25rem 0.6rem', fontSize: '0.65rem', fontWeight: 900, borderRadius: '2px' }}>LIVE</span>
                   <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'white' }}>
                     Command Center
                   </span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-plumbing)', letterSpacing: '0.15em' }}>
                  Sydney Region Techs Online
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { href: 'tel:+61412242997', label: 'Call John', sub: '+61 412 242 997', icon: <PhoneCall size={20} className="link-icon" /> },
                { href: 'tel:+61426051275', label: 'Call Leo', sub: '+61 426 051 275', icon: <PhoneCall size={20} className="link-icon" /> },
                { href: 'mailto:service@urbanproplumbing.com.au', label: 'Email Request', sub: 'Instant Response', icon: <span className="link-icon" style={{ fontSize: '1.2rem', fontWeight: 800 }}>@</span> }
              ].map((item) => (
                <a key={item.href} href={item.href} className="access-link">
                  {item.icon}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{item.label}</span>
                    <span style={{ opacity: 0.4, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.02em' }}>{item.sub}</span>
                  </div>
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
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-plumbing)', margin: '1.5rem auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {servicesBreakdown.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: 'var(--color-plumbing)' }}
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
  );
};

export default Plumbing;
