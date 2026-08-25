import React from 'react';
import { 
  Users, 
  Sparkles, 
  FileText, 
  LogIn, 
  LogOut, 
  User, 
  UserCheck, 
  Grid,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onOpenSignIn, 
  onLogout,
  onOpenManifest,
  onOpenCandidateRegistration,
  onOpenLanding
}) {
  return (
    <header className="navbar-enterprise">
      <div className="navbar-container">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { sound.playClick(); onOpenLanding ? onOpenLanding() : setCurrentTab('discovery'); }} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <img 
            src="/logo.jpg" 
            alt="Equipo Logo" 
            style={{ 
              width: '34px', 
              height: '34px', 
              borderRadius: '8px', 
              objectFit: 'cover',
              border: '1px solid #8b5cf6',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)'
            }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em', 
                background: 'linear-gradient(135deg, #ffffff 40%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                EQUIPO
              </span>
              <span className="badge-pill badge-purple" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                v2.0
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
              Team Formation Platform
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-item ${currentTab === 'discovery' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setCurrentTab('discovery'); }}
          >
            <Grid size={15} />
            <span>Find Teammates</span>
          </button>

          <button 
            className={`nav-tab-item ${currentTab === 'analytics' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setCurrentTab('analytics'); }}
          >
            <Sparkles size={15} />
            <span>Team Analytics</span>
          </button>

          <button 
            className={`nav-tab-item ${currentTab === 'projects' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setCurrentTab('projects'); }}
          >
            <Users size={15} />
            <span>Project Hub</span>
          </button>

          <button 
            className={`nav-tab-item ${currentTab === 'profile' ? 'active' : ''}`}
            onClick={() => { sound.playClick(); setCurrentTab('profile'); }}
          >
            <UserCheck size={15} />
            <span>My Skills & Matches</span>
          </button>
        </nav>

        {/* Right Actions & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          <button 
            className="btn-secondary"
            onClick={() => { sound.playClick(); onOpenCandidateRegistration(); }}
            style={{ fontSize: '0.75rem', padding: '0.45rem 0.8rem' }}
          >
            + Join Candidate Pool
          </button>

          <button 
            className="btn-primary"
            onClick={() => { sound.playClick(); onOpenManifest(); }}
            style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem' }}
          >
            <FileText size={14} />
            <span>Team Manifest</span>
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#121424', border: '1px solid #293154', padding: '0.25rem 0.6rem', borderRadius: '0.5rem' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff'
              }}>
                {currentUser.avatar_initials || 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.785rem', fontWeight: 600, color: '#f8fafc' }}>
                  @{currentUser.username || currentUser.name}
                </span>
              </div>
              <button 
                onClick={() => { sound.playClick(); onLogout(); }}
                title="Log Out"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem', marginLeft: '0.25rem' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary"
              onClick={() => { sound.playClick(); onOpenSignIn(); }}
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.8rem', color: '#c4b5fd', borderColor: '#3d497c' }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}