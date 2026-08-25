import React, { useState } from 'react';
import { UserPlus, Plus, X, Sparkles, CheckCircle2, ShieldCheck, MapPin, Briefcase, Clock, Tag } from 'lucide-react';
import { sound } from '../utils/sound';

export default function CandidateRegistrationModal({ isOpen, onClose, onRegisterCandidate }) {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('AI / ML');
  const [location, setLocation] = useState('Bengaluru, IN');
  const [experienceYears, setExperienceYears] = useState(2);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['Python', 'FastAPI', 'React']);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState(['Startups', 'Hackathons', 'Research']);

  if (!isOpen) return null;

  const categories = ['AI / ML', 'Frontend', 'Backend', 'UI / UX Design', 'Research & Data', 'Product & Strategy'];

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    sound.playClick();
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim()) return;

    sound.playSuccess();
    const initials = name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const newCandidate = {
      id: `c_${Date.now()}`,
      initials: initials || 'CD',
      name: name.trim(),
      role: roleTitle.trim(),
      avatar_color: 'linear-gradient(135deg, #2563eb, #38bdf8)',
      location: location.trim(),
      experience_years: Number(experienceYears),
      experience_level: experienceLevel,
      availability: `Evenings, Weekends (${hoursPerWeek}h/wk)`,
      availability_hours: Number(hoursPerWeek),
      match_score: 95,
      skills: skills.map(s => ({ name: s, level: 5 })),
      bio: bio.trim() || `${roleTitle} actively seeking collaborative project teams and venture opportunities.`,
      why_match: [
        `Verified skills in ${skills.slice(0, 3).join(', ')}`,
        `Available ${hoursPerWeek} hours/week for project sprints`,
        `Complementary expertise in ${primaryCategory}`
      ],
      github: `${name.toLowerCase().replace(/\s+/g, '')}-dev`,
      portfolio: `${name.toLowerCase().replace(/\s+/g, '')}.dev`,
      hackathons_won: 1,
      timezone: 'IST (UTC+5:30)'
    };

    onRegisterCandidate(newCandidate);
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
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
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

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <UserPlus size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
              Register in Talent Candidate Pool
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Add your skills to the database so project creators and team leads can discover and invite you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                YOUR FULL NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                PRIMARY ROLE TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Backend Go Developer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                DOMAIN CATEGORY
              </label>
              <select
                value={primaryCategory}
                onChange={(e) => setPrimaryCategory(e.target.value)}
                style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                LOCATION / CITY
              </label>
              <input
                type="text"
                placeholder="e.g. Delhi, IN"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              YOUR TECHNICAL SKILLS (Type skill and press Enter)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="badge-pill badge-blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveSkill(s)}
                  title="Click to remove"
                >
                  {s} ✕
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="e.g. PyTorch, Rust, Figma, PostgreSQL, Docker..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                EXPERIENCE LEVEL
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="Beginner">Beginner (1-2y)</option>
                <option value="Intermediate">Intermediate (2-4y)</option>
                <option value="Advanced">Advanced (4-6y)</option>
                <option value="Veteran">Veteran (6y+)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                WEEKLY CAPACITY ({hoursPerWeek}h / week)
              </label>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer', marginTop: '0.5rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
              SHORT BIO / PITCH
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of what you build and what teams you want to join..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.85rem', outline: 'none', resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.65rem', marginTop: '0.25rem' }}>
            Publish Profile to Candidate Pool
          </button>
        </form>

      </div>
    </div>
  );
}
