import React from 'react';
import { Shield, ArrowRight, CheckCircle2, Sparkles, Users, BarChart3, Cpu, Search, Layers, Rocket, Microscope, Trophy, Code2 } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LandingPage({ onGetStarted, onExploreTeammates, onOpenSignIn }) {
  const useCases = [
    {
      icon: Rocket,
      title: 'Startups & Ventures',
      description: 'Find technical co-founders, UI/UX leads, and growth strategists to take products from 0 to 1.'
    },
    {
      icon: Microscope,
      title: 'Research & Academic Labs',
      description: 'Connect domain researchers with data engineers, ML practitioners, and statistical modelers.'
    },
    {
      icon: Trophy,
      title: 'Competitions & Hackathons',
      description: 'Form balanced, winning teams across engineering, interaction design, and demo presentation.'
    },
    {
      icon: Code2,
      title: 'Open Source & Engineering',
      description: 'Staff open-source repositories and complex software builds with specialized talent.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      
      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 2rem 2rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        
        {/* Top Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          color: '#60a5fa',
          fontWeight: 600
        }}>
          <Sparkles size={14} /> Autonomous Project Team Formation Platform
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: '#f8fafc',
          maxWidth: '920px'
        }}>
          Form high-performance project teams based on <span style={{ color: '#8b5cf6' }}>complementary skills</span>.
        </h1>

        {/* Subtitle addressing Problem Statement */}
        <p style={{
          fontSize: '1.1rem',
          color: '#94a3b8',
          maxWidth: '720px',
          lineHeight: 1.6
        }}>
          Relying only on existing social circles creates unbalanced teams. Whether you are launching a startup, conducting research, or building a competition project, Equipo discovers collaborators with the exact skills you're missing.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => { sound.playClick(); onOpenSignIn(); }}
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
          >
            Create Your Profile <ArrowRight size={16} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => { sound.playClick(); onExploreTeammates(); }}
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
          >
            <Search size={16} /> Explore As Guest
          </button>
        </div>

        {/* Live Interactive Preview Card Mockup */}
        <div style={{
          marginTop: '2.5rem',
          width: '100%',
          maxWidth: '840px',
          background: '#11141d',
          border: '1px solid #23293a',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #23293a', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                platform.Equipo.io/competency-engine
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>
              Live Skill Synergy Scoring
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
            {/* Candidate Box */}
            <div style={{ background: '#090b10', padding: '1.25rem', borderRadius: '0.65rem', border: '1px solid #23293a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
                    AK
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#fff' }}>Alex Kumar</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Frontend Developer</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>94%</span>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Match</div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['React', 'TypeScript', 'Tailwind', 'Next.js'].map((s, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#181d2a', color: '#cbd5e1', borderRadius: '3px' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '0.85rem', padding: '0.65rem', background: '#11141d', borderRadius: '4px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <div style={{ color: '#10b981', fontWeight: 600 }}>âœ“ Fills open React / UI Developer requirement</div>
                <div style={{ color: '#10b981', fontWeight: 600, marginTop: '2px' }}>âœ“ Complementary to Backend & Data Leads</div>
              </div>
            </div>

            {/* Synergy Result Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Aggregate Team Synergy
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  96%
                </span>
                <span style={{ fontSize: '0.85rem', color: '#6ee7b7', fontWeight: 600 }}>
                  Balanced Skill Matrix
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>
                Full coverage across Technical Architecture, Interaction Design, Data Pipelines, and Project Delivery.
              </p>
              <button
                className="btn-primary"
                onClick={() => { sound.playClick(); onExploreTeammates(); }}
                style={{ width: 'fit-content', fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
              >
                Explore Teammate Pool <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Multi-Purpose Use Cases Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Multi-Purpose Platform
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.35rem' }}>
            Built for Every Type of Collaborative Initiative
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div key={i} className="enterprise-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                  <Icon size={18} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>
                  {uc.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {uc.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Process
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.35rem' }}>
            How Equipo Forms Effective Teams
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div className="enterprise-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700 }}>
              01
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc' }}>
              Define Your Skill Passport
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              List your verified technical competencies, availability hours, and project interests (Startups, Research, Hackathons, or Open Source).
            </p>
          </div>

          <div className="enterprise-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700 }}>
              02
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc' }}>
              Autonomous Synergy Matching
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              The platform algorithmically identifies complementary roles to ensure no domain is neglected and team balance is maximized.
            </p>
          </div>

          <div className="enterprise-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700 }}>
              03
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc' }}>
              Roster Alignment & Export
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Invite collaborators, track active project applications, and export certified staffing rosters for any competition or organization.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
        <div style={{
          background: 'linear-gradient(135deg, #11141d, #181d2a)',
          border: '1px solid #23293a',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#f8fafc' }}>
            Ready to find your ideal project collaborators?
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '560px', fontSize: '0.9rem' }}>
            Create your builder profile to discover complementary teammates and staff high-impact initiatives.
          </p>
          <button
            className="btn-primary"
            onClick={() => { sound.playClick(); onOpenSignIn(); }}
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            Create Your Profile <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}
