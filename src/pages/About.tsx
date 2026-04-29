import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Clock, CheckCircle, Award, MapPin, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useContent } from '../hooks/useContent';

const About = () => {
  const navigate = useNavigate();
  const { content } = useContent();

  const teamSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: teamScroll } = useScroll({
    target: teamSectionRef,
    offset: ['start end', 'end start'],
  });
  const teamBgY = useTransform(teamScroll, [0, 1], ['-15%', '15%']);
  const teamBgScale = useTransform(teamScroll, [0, 0.5, 1], [1.15, 1, 1.15]);
  const teamOverlayOpacity = useTransform(teamScroll, [0, 0.5, 1], [0.95, 0.75, 0.95]);

  const goToCapabilities = () => {
    sessionStorage.setItem('scrollToServices', '1');
    navigate('/');
  };

  const stats = content.about.stats;

  const values = [
    { icon: <Shield size={32} />, title: 'Transparency', desc: 'Upfront pricing with no hidden fees. What we quote is what you pay — always.' },
    { icon: <Clock size={32} />, title: 'Reliability', desc: '24/7 availability with same-day service for emergencies across all of Greater Sydney.' },
    { icon: <CheckCircle size={32} />, title: 'Quality', desc: 'All work is fully licensed, insured, and backed by our No Fix No Pay guarantee.' },
    { icon: <Award size={32} />, title: 'Integrity', desc: 'We treat every home like our own and stand behind every single job we complete.' },
  ];

  const team = content.team;

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
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.88)), url(images/about-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1.5rem', marginBottom: '2rem',
            }}>
              <MapPin size={16} style={{ color: '#60a5fa' }} />
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Sydney, Australia</span>
            </div>
            <h1 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, marginBottom: '1.5rem', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              About <span style={{ color: 'var(--color-plumbing)' }}>Urban</span><span style={{ color: 'var(--color-electrical)' }}>Pro</span>
            </h1>
            <p style={{ fontSize: 'var(--font-size-body)', color: 'rgba(255,255,255,0.85)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
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
              <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '2rem', lineHeight: 1.2 }}>
                {content.about.storyHeading}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: 'var(--font-size-body)' }}>
                {content.about.storyPara1}
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                {content.about.storyPara2}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.5rem 1.25rem', backgroundColor: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)', color: 'var(--color-plumbing)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ABN: {content.settings.abn}
                </div>
                <div style={{ padding: '0.5rem 1.25rem', backgroundColor: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)', color: 'var(--color-plumbing)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Licence: {content.settings.licence}
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
                  <div style={{ fontSize: 'var(--font-size-h2)', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.75rem' }}>{stat.label}</div>
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
      <section ref={teamSectionRef} style={{
        padding: '8rem 0',
        position: 'relative',
        backgroundColor: '#0a1223',
        overflow: 'hidden',
      }}>
        {/* Parallax background image */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-10% 0',
            backgroundImage: 'url(images/team-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: teamBgY,
            scale: teamBgScale,
            zIndex: 0,
          }}
        />
        {/* Dark overlay (opacity tied to scroll) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0a1223',
            opacity: teamOverlayOpacity,
            zIndex: 1,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-plumbing)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--color-plumbing)' }} />
              The People Behind the Work
              <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--color-plumbing)' }} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'white', margin: '0 0 1.5rem' }}>{content.about.teamHeading}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '520px', margin: '0 auto' }}>
              {content.about.teamSubheading}
            </p>
          </motion.div>

          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {team.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  padding: '1.75rem 2.5rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '3px solid var(--color-plumbing)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '88px', height: '88px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, var(--color-plumbing), rgba(96,165,250,0.15))',
                  marginBottom: '1rem',
                  flexShrink: 0,
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'rgba(15,23,42,0.9)' }}>
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', ...(member.imgStyle || {}) }}
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: 800, color: 'white', marginBottom: '0.4rem', lineHeight: 1.2 }}>{member.name}</h3>

                <div style={{
                  color: 'var(--color-plumbing)', fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.9rem',
                }}>{member.role}</div>

                <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, marginBottom: '1.25rem', fontSize: 'var(--font-size-sm)', flexGrow: 1 }}>{member.bio}</p>

              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .team-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 680px) {
            .team-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
            .team-grid > div { padding: 1.5rem 1.5rem !important; }
          }
        `}</style>
      </section>

      {/* Values */}
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>How We Work</h2>
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
                <h3 style={{ fontSize: 'var(--font-size-h4)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem' }}>{val.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: 'var(--font-size-sm)' }}>{val.desc}</p>
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
            <h2 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
              Ready to Work with Us?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-body)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              Contact Sydney's most trusted plumbing team today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <a href={`tel:${content.settings.phone1}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call {content.settings.phone1Name}
              </a>
              <a href={`tel:${content.settings.phone2}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', backgroundColor: 'var(--color-plumbing)', color: 'var(--color-bg)', textDecoration: 'none', fontSize: '1.125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <PhoneCall size={22} /> Call {content.settings.phone2Name}
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
