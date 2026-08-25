import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, X, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    sound.playSuccess();
    
    // Extract a friendly display name from the email address
    const emailPrefix = email.split('@')[0];
    const formattedName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const initials = formattedName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'EQ';

    const userProfile = {
      id: `user_${Date.now()}`,
      email: email.trim(),
      username: emailPrefix,
      name: formattedName || 'Equipo Builder',
      role_title: 'Fullstack & Systems Engineer',
      primary_category: 'AI / ML',
      avatar_initials: initials,
      location: 'Bengaluru, IN',
      experience_years: 3,
      experience_level: 'Intermediate (2-4y)',
      availability_hours_per_week: 25,
      skills: [
        { name: 'Python', level: 5 },
        { name: 'FastAPI', level: 5 },
        { name: 'React', level: 4 },
        { name: 'Docker', level: 4 }
      ],
      interests: ['Startups', 'Research', 'Hackathons'],
      bio: 'Builder and collaborator on Equipo platform.',
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
      email: 'prashanthraodugyala34@gmail.com',
      username: 'prashanth.dev',
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
      bio: 'Builder passionate about autonomous AI systems and collaborative ventures.',
      hackathons_won: 3,
      timezone: 'IST (UTC+5:30)'
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="enterprise-card" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2rem',
        background: '#121424',
        border: '1px solid #3d497c',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc' }}>
            {isRegister ? 'Create Your Account' : 'Sign in to Equipo'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#a5b4fc', marginTop: '0.25rem' }}>
            {isRegister ? 'Enter your email to start forming teams' : 'Access your team roster, invitations, and projects'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.65rem 0.8rem 0.65rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.65rem 0.8rem 0.65rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.35rem', justifyContent: 'center', padding: '0.65rem' }}>
            {isRegister ? 'Sign Up with Email' : 'Sign In'} <ArrowRight size={15} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #293154', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleQuickDemoLogin}
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
          >
            ⚡ One-Click Demo (Prashant Sharma)
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.775rem', color: '#a5b4fc' }}>
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <button
              onClick={() => { sound.playClick(); setIsRegister(!isRegister); }}
              style={{ background: 'none', border: 'none', color: '#c4b5fd', fontWeight: 700, cursor: 'pointer' }}
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}