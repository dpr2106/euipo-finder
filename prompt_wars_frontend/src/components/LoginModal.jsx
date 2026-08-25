import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, X, AtSign, Zap, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Popup Modal Simulation State
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    sound.playSuccess();
    
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    const userEmail = email.trim() || `${cleanUsername}@gmail.com`;

    const initials = cleanUsername
      .split(/[._-]/)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'EQ';

    const formattedDisplayName = cleanUsername
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const userProfile = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      name: formattedDisplayName || cleanUsername,
      email: userEmail,
      auth_provider: 'email',
      is_email_verified: true,
      role_title: 'Builder / Contributor',
      primary_category: 'General',
      avatar_initials: initials,
      location: 'India',
      experience_years: 0,
      experience_level: 'Verified Member',
      availability_hours_per_week: 20,
      skills: [],
      interests: [],
      bio: `Builder profile for @${cleanUsername} on Equipo.`,
      hackathons_won: 0,
      timezone: 'IST (UTC+5:30)'
    };

    onLogin(userProfile);
    handleClose();
  };

  const handleGoogleSuccess = (selectedEmail, selectedName = 'Prashanth Rao') => {
    sound.playSuccess();
    
    const usernameHandle = selectedEmail.split('@')[0];
    const initials = selectedName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'G';

    const userProfile = {
      id: `google_${Date.now()}`,
      username: usernameHandle,
      name: selectedName || usernameHandle,
      email: selectedEmail,
      auth_provider: 'google_oauth',
      is_email_verified: true,
      role_title: 'Fullstack & Systems Engineer',
      primary_category: 'AI / ML',
      avatar_initials: initials,
      location: 'Bengaluru, IN',
      experience_years: 2,
      experience_level: 'Verified Member',
      availability_hours_per_week: 25,
      skills: [
        { name: 'Python', level: 5 },
        { name: 'FastAPI', level: 5 },
        { name: 'React', level: 4 }
      ],
      interests: ['Startups', 'Hackathons', 'Research'],
      bio: `Google-verified collaborator @${usernameHandle} on Equipo.`,
      hackathons_won: 2,
      timezone: 'IST (UTC+5:30)'
    };

    onLogin(userProfile);
    handleClose();
  };

  const handleClose = () => {
    setShowGooglePopup(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      
      {/* GOOGLE AUTH POPUP DIALOG */}
      {showGooglePopup ? (
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          color: '#1f2937'
        }}>
          <button
            onClick={() => setShowGooglePopup(false)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <svg width="36" height="36" viewBox="0 0 48 48" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
              Sign in with Google
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#4b5563', marginTop: '0.2rem' }}>
              Choose an account to continue to <strong>Equipo</strong>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            
            {/* Account Option 1 */}
            <div
              onClick={() => handleGoogleSuccess('prashanthraodugyala34@gmail.com', 'Prashanth Rao')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                background: '#f9fafb',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f9fafb'}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                P
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>Prashanth Rao</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>prashanthraodugyala34@gmail.com</div>
              </div>
            </div>

            {/* Custom Google Email Input */}
            <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <label style={{ fontSize: '0.725rem', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '0.35rem' }}>
                OR SIGN IN WITH ANY GOOGLE EMAIL:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={googleCustomEmail}
                  onChange={(e) => setGoogleCustomEmail(e.target.value)}
                  style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '0.35rem', padding: '0.4rem 0.6rem', fontSize: '0.825rem', outline: 'none', background: '#fff', color: '#111827' }}
                />
                <button
                  onClick={() => {
                    if (googleCustomEmail.trim()) {
                      handleGoogleSuccess(googleCustomEmail.trim(), googleCustomEmail.split('@')[0]);
                    }
                  }}
                  style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Continue
                </button>
              </div>
            </div>

          </div>

          <div style={{ fontSize: '0.725rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.4 }}>
            To continue, Google will share your name, email address, and profile picture with Equipo.
          </div>
        </div>
      ) : (
        /* MAIN SIGN IN MODAL */
        <div className="enterprise-card" style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.25rem',
          background: '#121424',
          border: '1px solid #3d497c',
          position: 'relative'
        }}>
          <button
            onClick={handleClose}
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '0.75rem',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
              {isRegister ? 'Join Equipo' : 'Sign in to Equipo'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#a5b4fc', marginTop: '0.25rem' }}>
              {isRegister ? 'Authenticate via Google to start forming squads' : 'Sign in with Google or your credentials to access workspace'}
            </p>
          </div>

          {/* GOOGLE AUTH BUTTON */}
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={() => { sound.playClick(); setShowGooglePopup(true); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#293154' }} />
            <span style={{ fontSize: '0.725rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>
              or with email / username
            </span>
            <div style={{ flex: 1, height: '1px', background: '#293154' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            
            <div>
              <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                USERNAME / HANDLE *
              </label>
              <div style={{ position: 'relative' }}>
                <AtSign size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                <input
                  type="text"
                  required
                  placeholder="yourusername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.65rem 0.8rem 0.65rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  EMAIL ADDRESS *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#6ee7b7', padding: '0.65rem 0.8rem 0.65rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                PASSWORD *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#818cf8' }} />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.65rem 0.8rem 0.65rem 2.2rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.35rem', justifyContent: 'center', padding: '0.65rem' }}>
              {isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #293154', textAlign: 'center', fontSize: '0.8rem', color: '#a5b4fc' }}>
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <button
              onClick={() => { sound.playClick(); setIsRegister(!isRegister); }}
              style={{ background: 'none', border: 'none', color: '#c4b5fd', fontWeight: 700, cursor: 'pointer' }}
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}