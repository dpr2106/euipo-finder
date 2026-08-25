import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Mail, Briefcase, Plus, X } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Fullstack & AI Developer');
  const [primaryCategory, setPrimaryCategory] = useState('AI / ML');
  const [selectedInterests, setSelectedInterests] = useState(['Startups', 'Research', 'Hackathons']);

  if (!isOpen) return null;

  const categories = ['AI / ML', 'Frontend', 'Backend', 'UI / UX Design', 'Research & Data', 'Product & Strategy'];
  const availableInterests = ['Startups', 'Research', 'Hackathons', 'Open Source', 'GovTech', 'HealthTech'];

  const toggleInterest = (interest) => {
    sound.playClick();
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();
    
    const userProfile = {
      id: `user_${Date.now()}`,
      username: username.trim() || (isRegister ? fullName.toLowerCase().replace(/\s+/g, '.') : 'user.demo'),
      name: isRegister ? (fullName.trim() || 'Demo User') : (username.trim() || 'Demo User'),
      role_title: isRegister ? roleTitle : 'Technical Contributor',
      primary_category: primaryCategory,
      avatar_initials: (isRegister ? (fullName || 'DU') : (username || 'DU')).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      location: 'Bengaluru, IN',
      experience_years: 3,
      experience_level: 'Intermediate',
      availability_hours_per_week: 20,
      skills: [
        { name: 'Python', level: 5 },
        { name: 'React', level: 4 },
        { name: 'FastAPI', level: 4 },
        { name: 'Data Engineering', level: 4 }
      ],
      interests: selectedInterests,
      bio: 'Collaborator seeking complementary teammates for innovative projects and ventures.',
      hackathons_won: 2,
      timezone: 'IST (UTC+5:30)'
    };

    onLogin(userProfile);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    sound.playSuccess();
    onLogin({
      id: 'demo_user',
      username: 'prashant.dev',
      name: 'Prashant Sharma',
      role_title: 'AI Systems & Fullstack Engineer',
      primary_category: 'AI / ML',
      avatar_initials: 'PS',
      location: 'Chennai, IN',
      experience_years: 3,
      experience_level: 'Advanced',
      availability_hours_per_week: 25,
      skills: [
        { name: 'Python', level: 5 },
        { name: 'FastAPI', level: 5 },
        { name: 'React', level: 4 },
        { name: 'PyTorch', level: 4 },
        { name: 'OpenCV', level: 4 }
      ],
      interests: ['Startups', 'Research', 'Hackathons', 'GovTech'],
      bio: 'Builder passionate about autonomous AI systems, research projects, and competitions.',
      hackathons_won: 3,
      timezone: 'IST (UTC+5:30)'
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="enterprise-card" style={{
        maxWidth: isRegister ? '520px' : '440px',
        width: '100%',
        padding: '2rem',
        background: '#11141d',
        border: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: '#2563eb',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={22} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc' }}>
            {isRegister ? 'Create Your Builder Profile' : 'Sign in to Equipo'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {isRegister ? 'Join the multi-disciplinary team formation platform' : 'Access your project roster, skill passport, and invitations'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {isRegister ? (
            <>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    PRIMARY ROLE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Scientist"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    PRIMARY DOMAIN
                  </label>
                  <select
                    value={primaryCategory}
                    onChange={(e) => setPrimaryCategory(e.target.value)}
                    style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  PROJECT INTERESTS
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {availableInterests.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(59, 130, 246, 0.2)' : '#090b10',
                          border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                          color: isSelected ? '#93c5fd' : 'var(--text-muted)'
                        }}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  EMAIL / USERNAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="name@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  USERNAME OR EMAIL
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. prashant.dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.25rem', justifyContent: 'center', padding: '0.65rem' }}>
            {isRegister ? 'Register & Set Up Skill Passport' : 'Sign In'} <ArrowRight size={15} />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleQuickDemoLogin}
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
          >
            ⚡ One-Click Demo Sign In (Prashant Sharma)
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already registered?' : 'Need an account?'}{' '}
            <button
              onClick={() => { sound.playClick(); setIsRegister(!isRegister); }}
              style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 600, cursor: 'pointer' }}
            >
              {isRegister ? 'Sign in' : 'Create profile'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
