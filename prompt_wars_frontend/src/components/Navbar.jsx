import React, { useState } from 'react';
import { Shield, Search, BarChart3, FolderKanban, Sparkles, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onLogout
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'discover', label: 'Find Teammates' },
    { id: 'synergy', label: 'Team Analytics' },
    { id: 'projects', label: 'Project Roster' },
    ...(currentUser ? [{ id: 'my-profile', label: 'My Skills & Matches' }] : []),
  ];

  const handleNav = (id) => {
    sound.playClick();
    setActiveTab(id);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 11, 16, 0.95)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 2rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Shield size={18} strokeWidth={2.2} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em', color: '#f8fafc' }}>
            Equipo
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  padding: '0.35rem 0',
                  borderBottom: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
                  transition: 'color 0.15s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Auth Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  background: '#11141d',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  color: '#f8fafc'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {currentUser.avatar_initials || 'ME'}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentUser.name}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  background: '#11141d',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  width: '200px',
                  zIndex: 100,
                  overflow: 'hidden',
                  padding: '0.35rem 0'
                }}>
                  <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.role_title}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNav('my-profile');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.85rem',
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#181d2a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Sparkles size={14} color="#60a5fa" /> My Skills & Matches
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.85rem',
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#181d2a'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={onOpenLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '0.825rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem'
                }}
              >
                Sign In
              </button>

              <button
                className="btn-primary"
                onClick={onOpenLogin}
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
              >
                <UserPlus size={14} /> Create Profile
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
