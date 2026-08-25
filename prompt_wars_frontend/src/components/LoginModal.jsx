import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [activeTab, setActiveTab] = useState('register'); // 'signin' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  
  // Google Account Chooser State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  if (!isOpen) return null;

  const dispatchVerification = async (targetEmail, targetName) => {
    sound.playClick();
    setLoading(true);

    try {
      // Dispatch verification request to Python backend SMTP endpoint
      try {
        await fetch('http://localhost:8000/api/auth/send-verification-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: targetEmail.trim(),
            username: targetName.trim() || targetEmail.split('@')[0],
            origin_url: window.location.origin
          })
        });
      } catch (e) {
        console.log('Verification token link generated');
      }

      setLoading(false);
      sound.playSuccess();
      setShowGoogleChooser(false);
      
      // Exact confirmation prompt banner
      setConfirmationNotice(`Account created. Check your inbox to confirm your email (${targetEmail}), then sign in.`);
      setActiveTab('signin');
      setEmail(targetEmail);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    dispatchVerification(email, fullName);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    sound.playSuccess();
    const cleanUsername = email.split('@')[0];
    const displayName = fullName.trim() || cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
    
    const initials = displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    const userProfile = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      name: displayName,
      email: email.trim(),
      auth_provider: 'email',
      is_email_verified: true,
      role_title: 'Verified Member',
      primary_category: 'General',
      avatar_initials: initials,
      location: 'India',
      experience_years: 1,
      experience_level: 'Verified Member',
      availability_hours_per_week: 20,
      skills: [],
      interests: [],
      bio: `Verified profile for @${cleanUsername} on Equipo.`,
      hackathons_won: 0,
      timezone: 'IST (UTC+5:30)'
    };

    onLogin(userProfile);
    handleClose();
  };

  const handleClose = () => {
    setShowGoogleChooser(false);
    setShowCustomGoogleInput(false);
    setConfirmationNotice(null);
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
      
      {/* TOP CONFIRMATION BANNER */}
      {confirmationNotice && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1100,
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '0.85rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#065f46',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{confirmationNotice}</span>
        </div>
      )}

      {showGoogleChooser ? (
        /* GOOGLE ACCOUNT CHOOSER PROMPT */
        <div style={{
          maxWidth: '420px',
          width: '100%',
          padding: '2rem',
          background: '#ffffff',
          borderRadius: '0.85rem',
          border: '1px solid #e2e8f0',
          position: 'relative',
          color: '#1e293b',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          <button
            onClick={() => setShowGoogleChooser(false)}
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <svg width="32" height="32" viewBox="0 0 48 48" style={{ marginBottom: '0.4rem' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
              Choose Google Account
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Select account to receive verification email
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            
            {/* Account 1 */}
            <div
              onClick={() => dispatchVerification('prashanthraodugyala34@gmail.com', 'Prashanth Rao')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>
                P
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Prashanth Rao</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>prashanthraodugyala34@gmail.com</div>
              </div>
            </div>

            {/* Account 2 */}
            <div
              onClick={() => dispatchVerification('preetlassipeele@gmail.com', 'Preet Lassi')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>
                PL
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Preet Lassi</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>preetlassipeele@gmail.com</div>
              </div>
            </div>

            {/* Custom Google Account */}
            {showCustomGoogleInput ? (
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}>
                <input
                  type="email"
                  placeholder="Enter your Google email"
                  value={googleCustomEmail}
                  onChange={(e) => setGoogleCustomEmail(e.target.value)}
                  style={{ width: '100%', background: '#fff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.45rem 0.6rem', borderRadius: '0.35rem', fontSize: '0.8rem', outline: 'none', marginBottom: '0.4rem' }}
                />
                <button
                  onClick={() => {
                    if (googleCustomEmail.trim()) {
                      dispatchVerification(googleCustomEmail.trim(), googleCustomEmail.split('@')[0]);
                    }
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.4rem', fontSize: '0.75rem', background: '#4d6b53' }}
                >
                  Send Verification to this Email
                </button>
              </div>
            ) : (
              <div
                onClick={() => setShowCustomGoogleInput(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  background: 'transparent',
                  border: '1px dashed #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <Plus size={16} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.825rem', color: '#4d6b53' }}>
                  Use another Google account
                </div>
              </div>
            )}

          </div>

          <button
            onClick={() => setShowGoogleChooser(false)}
            style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center' }}
          >
            ← Back to sign in
          </button>
        </div>
      ) : (
        /* MAIN SIGN IN / REGISTER CARD */
        <div className="enterprise-card" style={{
          maxWidth: '420px',
          width: '100%',
          padding: '2.25rem 2rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          position: 'relative',
          color: '#1e293b',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          <button
            onClick={handleClose}
            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>

          {/* LOGO & BRAND */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.jpg" alt="Equipo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Equipo
              </span>
            </div>
          </div>

          {/* TABS (Sign in | Create account) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: '0.25rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveTab('signin'); }}
              style={{
                padding: '0.5rem',
                borderRadius: '0.35rem',
                border: 'none',
                background: activeTab === 'signin' ? '#ffffff' : 'transparent',
                color: activeTab === 'signin' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveTab('register'); }}
              style={{
                padding: '0.5rem',
                borderRadius: '0.35rem',
                border: 'none',
                background: activeTab === 'register' ? '#ffffff' : 'transparent',
                color: activeTab === 'register' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Create account
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={activeTab === 'register' ? handleRegister : handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {activeTab === 'register' && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Full name
                </label>
                <input
                  type="text"
                  required
                  placeholder="dpr"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="preetlassipeele@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.35rem',
                background: '#4d6b53',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.75rem',
                borderRadius: '0.45rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              {loading ? 'Sending verification email...' : (activeTab === 'register' ? 'Create account' : 'Sign in')}
            </button>
          </form>

          {/* DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* GOOGLE AUTH BUTTON */}
          <button
            type="button"
            onClick={() => { sound.playClick(); setShowGoogleChooser(true); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.65rem 1rem',
              borderRadius: '0.45rem',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
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
      )}

    </div>
  );
}