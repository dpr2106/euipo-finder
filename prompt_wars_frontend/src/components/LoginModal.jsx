import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, X, AtSign, Zap, CheckCircle2, ExternalLink } from 'lucide-react';
import { sound } from '../utils/sound';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Email Confirmation State
  const [verificationStep, setVerificationStep] = useState(false);
  const [showEmailInboxPreview, setShowEmailInboxPreview] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    if (isRegister && !verificationStep) {
      sound.playClick();
      setVerificationStep(true);
      return;
    }

    finalizeLogin();
  };

  const finalizeLogin = () => {
    sound.playSuccess();
    
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    const userEmail = email.trim() || (isRegister ? `${cleanUsername}@gmail.com` : 'prashanthraodugyala34@gmail.com');

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
      is_email_verified: true,
      role_title: 'Verified Builder',
      primary_category: 'General',
      avatar_initials: initials,
      location: 'India',
      experience_years: 0,
      experience_level: 'Verified Member',
      availability_hours_per_week: 20,
      skills: [],
      interests: [],
      bio: `Verified builder profile for @${cleanUsername} on Equipo.`,
      hackathons_won: 0,
      timezone: 'IST (UTC+5:30)'
    };

    onLogin(userProfile);
    handleModalClose();
  };

  const handleModalClose = () => {
    setVerificationStep(false);
    setShowEmailInboxPreview(false);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    sound.playSuccess();
    onLogin({
      id: 'demo_user',
      username: 'prashanth.dev',
      name: 'Prashanth Rao',
      email: 'prashanthraodugyala34@gmail.com',
      is_email_verified: true,
      role_title: 'AI Systems & Fullstack Developer',
      primary_category: 'AI / ML',
      avatar_initials: 'PR',
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
    handleModalClose();
  };

  const targetEmail = email.trim() || `${username.trim() || 'user'}@gmail.com`;

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
      <div className="enterprise-card" style={{
        maxWidth: showEmailInboxPreview ? '520px' : '440px',
        width: '100%',
        padding: '2rem',
        background: '#121424',
        border: '1px solid #3d497c',
        position: 'relative',
        transition: 'all 0.2s ease'
      }}>
        <button
          onClick={handleModalClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        {/* STEP 2: EMAIL VERIFICATION VIEW */}
        {verificationStep ? (
          <div>
            {!showEmailInboxPreview ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid #8b5cf6',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c4b5fd',
                  marginBottom: '1rem'
                }}>
                  <Mail size={28} />
                </div>
                
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc' }}>
                  Check Your Inbox
                </h2>
                
                <p style={{ fontSize: '0.85rem', color: '#a5b4fc', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  We've sent a verification link to: <br />
                  <strong style={{ color: '#6ee7b7', fontSize: '0.95rem' }}>{targetEmail}</strong>
                </p>

                <p style={{ fontSize: '0.785rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.4 }}>
                  Please check your email and click <strong>Verify Email</strong> to confirm your registration and access Equipo.
                </p>

                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => { sound.playClick(); setShowEmailInboxPreview(true); }}
                    className="btn-primary" 
                    style={{ justifyContent: 'center', padding: '0.75rem' }}
                  >
                    <ExternalLink size={16} /> Open Confirmation Email
                  </button>

                  <button
                    onClick={() => { sound.playClick(); setVerificationStep(false); }}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer', padding: '0.3rem' }}
                  >
                    ← Back to edit email
                  </button>
                </div>
              </div>
            ) : (
              /* REALISTIC EMAIL TEMPLATE PREVIEW */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #293154', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Confirm your signup</span>
                    <span style={{ fontSize: '0.7rem', background: '#334155', color: '#cbd5e1', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>Inbox</span>
                  </div>
                  <button
                    onClick={() => setShowEmailInboxPreview(false)}
                    style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    ← Back
                  </button>
                </div>

                <div style={{ background: '#ffffff', color: '#0f172a', padding: '1.75rem', borderRadius: '0.6rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    <strong>Equipo</strong> &lt;no-reply@auth.equipo-network.com&gt;<br />
                    to me &lt;{targetEmail}&gt;
                  </div>

                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Confirm your email
                  </h1>

                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '1rem' }}>
                    Thanks for signing up for <strong>Equipo</strong>!
                  </p>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Please confirm your email address (<strong>{targetEmail}</strong>) below:
                  </p>

                  <button
                    onClick={finalizeLogin}
                    style={{
                      background: '#000000',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      padding: '0.75rem 1.75rem',
                      borderRadius: '0.45rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    Verify Email
                  </button>

                  <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#94a3b8' }}>
                    If you didn't create an account, you can safely ignore this email.
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STEP 1: INITIAL SIGN IN / SIGN UP FORM */
          <div>
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
                {isRegister ? 'Choose a unique username and enter your email for verification' : 'Sign in using your username and password'}
              </p>
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
                    placeholder="prashanth.dev"
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
                      placeholder="prashanthraodugyala34@gmail.com"
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
                {isRegister ? 'Send Confirmation Email' : 'Sign In'} <ArrowRight size={15} />
              </button>
            </form>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #293154', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleQuickDemoLogin}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Zap size={14} color="#8b5cf6" />
                <span>One-Click Demo (@prashanth.dev)</span>
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
        )}

      </div>
    </div>
  );
}