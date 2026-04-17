import { motion } from 'framer-motion';
import { Zap, Lightbulb, Activity, Shield, AlertTriangle, Clock, PhoneCall, CheckCircle, ChevronDown, BatteryCharging, Power } from 'lucide-react';

const Electrical = () => {
  const guarantees = [
    { text: "LIFETIME WORKMANSHIP", icon: <Shield size={32} /> },
    { text: "FIXED UPFRONT PRICING", icon: <BadgeIcon /> },
    { text: "MASTER ELECTRICIANS", icon: <Zap size={32} /> }
  ];

  function BadgeIcon() {
    return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>;
  }

  const emergencyInfo = [
    { text: "EMERGENCY POWER 24/7", subtext: "Quick response for blackouts", icon: <AlertTriangle size={24} className="text-accent" /> },
    { text: "EMERGENCY 7 DAYS", subtext: "Always on call in Sydney", icon: <Clock size={24} className="text-accent" /> }
  ];

  const servicesBreakdown = [
    { title: "RESIDENTIAL WIRING", icon: <Activity size={24} /> },
    { title: "LIGHTING INSTALLATION", icon: <Lightbulb size={24} /> },
    { title: "SWITCHBOARD UPGRADES", icon: <Shield size={24} /> },
    { title: "FAULT DIAGNOSTICS", icon: <SearchIcon /> },
    { title: "EV CHARGERS", icon: <BatteryCharging size={24} /> },
    { title: "HOME AUTOMATION", icon: <Power size={24} /> }
  ];

  function SearchIcon() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
  }


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
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95)), url(https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=100&w=3000&auto=format&fit=crop)',
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
              Expert Electrical Solutions
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '650px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
              Safe, efficient, and innovative electrical services. From rapid fault-finding to complete smart home installations, we keep the lights on globally.
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
              backgroundColor: '#eab308', /* Distinct electrical accent color */
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

      {/* Emergency Section */}
      <section style={{ backgroundColor: 'var(--color-surface)', borderTop: '4px solid #eab308' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {emergencyInfo.map((info, idx) => (
            <div key={idx} style={{ flex: '1 1 300px', padding: '2.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'rgba(234,179,8,0.1)', padding: '1.25rem' }}>
                {info.icon}
              </div>
              <div>
                <h3 style={{ color: 'var(--color-text)', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem 0' }}>{info.text}</h3>
                <p style={{ color: 'var(--color-text-muted)', margin: 0, fontWeight: 500 }}>{info.subtext}</p>
              </div>
            </div>
          ))}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 2.5rem', backgroundColor: 'var(--color-bg)', borderLeft: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
             <style>{`
               .contact-card-elec {
                 display: flex; align-items: center; gap: 1.25rem;
                 color: var(--color-text); text-decoration: none;
                 padding: 0.85rem 1.25rem;
                 background-color: var(--color-surface);
                 border: 1px solid rgba(255,255,255,0.05);
                 transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
               }
               .contact-card-elec:hover {
                 transform: translateY(-4px);
                 border-color: #eab308;
                 background-color: rgba(255,255,255,0.02);
                 box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
               }
               .contact-card-elec .icon-wrapped-elec {
                 padding: 0.75rem; 
                 background-color: rgba(255,255,255,0.03); 
                 color: #eab308;
                 transition: all 0.4s ease;
               }
               .contact-card-elec:hover .icon-wrapped-elec {
                 background-color: #eab308;
                 color: var(--color-bg);
               }
             `}</style>
             
             {/* Subtle accent glow */}
             <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, #eab308 0%, transparent 70%)', opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none' }} />
             
             <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ width: '8px', height: '8px', backgroundColor: '#eab308' }} />
               Direct Contact
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
               {[
                 { href: 'tel:+61412242997', label: '+61 412 242 997', sub: 'John', icon: <PhoneCall size={22} /> },
                 { href: 'tel:+61426051275', label: '+61 426 051 275', sub: 'Leo', icon: <PhoneCall size={22} /> },
                 { href: 'mailto:service@urbanproplumbing.com.au', label: 'Email Us', sub: 'service@urbanproplumbing.com.au', icon: <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>@</span> }
               ].map((item) => (
                 <a key={item.href} href={item.href} className="contact-card-elec">
                   <div className="icon-wrapped-elec">
                     {item.icon}
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', overflow: 'hidden' }}>
                     <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.02em' }}>{item.label}</span>
                     {item.sub && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.sub}</span>}
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
              Our Services
            </motion.h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: '#eab308', margin: '1.5rem auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {servicesBreakdown.map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: '#eab308' }}
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  padding: '2.5rem 2rem', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div style={{ color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem' }}>
                  {service.icon}
                </div>
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {service.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--color-text)' }}>Why Choose UrbanPro Electrical?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', textAlign: 'left' }}>
            {['Fully Licensed Master Electricians', 'Transparent Upfront Pricing', 'Latest Diagnostics Technology', 'Clean & Respectful Team'].map((benefit, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--color-bg)' }}
              >
                <CheckCircle color="#eab308" size={32} style={{ flexShrink: 0 }} />
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
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>Need an Electrician?</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              Call us now for fast, upfront service — or send us an email anytime.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
              <a href="tel:+61412242997" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: '#eab308', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call John
              </a>
              <a href="tel:+61426051275" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: '#eab308', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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

export default Electrical;
