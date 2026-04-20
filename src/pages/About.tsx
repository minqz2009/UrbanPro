import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle, Award, PhoneCall, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const goToCapabilities = () => {
    sessionStorage.setItem('scrollToServices', '1');
    navigate('/');
  };

  const stats = [
    { value: '10+', label: 'Years in Sydney' },
    { value: '500+', label: 'Happy Customers' },
    { value: '24/7', label: 'Emergency Service' },
    { value: '100%', label: 'Licensed & Insured' },
  ];

  const values = [
    { icon: <Shield size={32} />, title: 'Transparency', desc: 'Upfront pricing with no hidden fees. What we quote is what you pay — always.' },
    { icon: <Clock size={32} />, title: 'Reliability', desc: '24/7 availability with same-day service for emergencies across all of Greater Sydney.' },
    { icon: <CheckCircle size={32} />, title: 'Quality', desc: 'All work is fully licensed, insured, and backed by our No Fix No Pay guarantee.' },
    { icon: <Award size={32} />, title: 'Integrity', desc: 'We treat every home like our own and stand behind every single job we complete.' },
  ];

  const team = [
    {
      name: 'John Zhao',
      role: 'Lead Plumber & Co-Founder',
      phone: '+61 412 242 997',
      href: 'tel:+61412242997',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format',
      bio: 'With over 15 years of hands-on experience, John leads every emergency call with precision and calm. He co-founded UrbanPro with one goal: honest plumbing you can count on, any hour of the day.',
    },
    {
      name: 'Leo',
      role: 'Senior Plumber',
      phone: '+61 426 051 275',
      href: 'tel:+61426051275',
      photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=faces&auto=format',
      bio: 'Leo specialises in commercial plumbing, gas heating systems, and complex installations. Known for meticulous attention to detail — and always leaving the worksite cleaner than he found it.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '10rem 0 8rem',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.88)), url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=3000&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              backgroundColor: 'rgba(96,165,250,0.15)',
              border: '1px solid rgba(96,165,250,0.35)',
              padding: '0.5rem 1.5rem', marginBottom: '2rem',
            }}>
              <MapPin size={16} style={{ color: 'var(--color-plumbing)' }} />
              <span style={{ color: 'var(--color-plumbing)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sydney, Australia</span>
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              About <span style={{ color: 'var(--color-plumbing)' }}>Urban</span><span style={{ color: 'var(--color-electrical)' }}>Pro</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              Sydney's trusted plumbing professionals. Built on transparency, driven by quality, and available when it matters most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story + Stats */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-plumbing-bg)' }}>
        <div className="container">
          <div className="about-story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-plumbing)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--color-plumbing)' }} />
                Our Story
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '2rem', lineHeight: 1.2 }}>
                Serving Greater Sydney Since 2015
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                Urban Pro Plumbing was founded with a straightforward mission: give Sydney homeowners and businesses access to reliable, honest plumbing without the runaround.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                Led by John Zhao and Leo, our team brings decades of combined experience to every job — from emergency burst pipes at midnight to full bathroom renovations. We show up on time, price fairly, and never leave until the work is done right.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.5rem 1.25rem', backgroundColor: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)', color: 'var(--color-plumbing)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ABN: 48 694 251 888
                </div>
                <div style={{ padding: '0.5rem 1.25rem', backgroundColor: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)', color: 'var(--color-plumbing)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Licence: 280492C
                </div>
              </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    padding: '2.5rem 2rem',
                    borderTop: '3px solid var(--color-plumbing)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.75rem' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .about-story-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          }
        `}</style>
      </section>

      {/* Team */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Users size={28} style={{ color: 'var(--color-plumbing)' }} />
              <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Meet the Team</h2>
            </div>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-plumbing)', margin: '1.5rem auto' }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto' }}>
              Two experienced plumbers. One shared commitment to doing the job right.
            </p>
          </div>

          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '3rem 2.5rem',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--color-plumbing)' }} />

                <div style={{
                  width: '100px', height: '100px',
                  borderRadius: '50%',
                  border: '3px solid var(--color-plumbing)',
                  overflow: 'hidden',
                  marginBottom: '1.75rem',
                  flexShrink: 0,
                }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{member.name}</h3>
                <div style={{ color: 'var(--color-plumbing)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.5rem' }}>{member.role}</div>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem' }}>{member.bio}</p>

                <a href={member.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-plumbing)', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                  <PhoneCall size={18} /> {member.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .team-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* Values */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>How We Work</h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-plumbing)', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.3s ease, transform 0.3s ease',
                }}
              >
                <div style={{
                  color: 'var(--color-plumbing)',
                  backgroundColor: 'rgba(96,165,250,0.08)',
                  width: '72px', height: '72px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.75rem',
                }}>
                  {val.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem' }}>{val.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-plumbing-bg)', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              Ready to Work with Us?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              Contact Sydney's most trusted plumbing team today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <a href="tel:+61412242997" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call John
              </a>
              <a href="tel:+61426051275" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call Leo
              </a>
              <button onClick={goToCapabilities} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'transparent', color: 'var(--color-text)', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: '2px solid rgba(255,255,255,0.25)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Our Capabilities →
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
