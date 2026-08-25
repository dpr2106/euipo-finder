import React, { useState } from 'react';
import { User, Plus, X, Sparkles, CheckCircle2, Clock, Briefcase, MapPin, Send, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { sound } from '../utils/sound';

export default function MyProfileSkillsView({ currentUser, onUpdateUser, allProjects, onShowToast }) {
  const [name, setName] = useState(currentUser?.name || 'Prashant Sharma');
  const [roleTitle, setRoleTitle] = useState(currentUser?.role_title || 'AI Systems & Fullstack Developer');
  const [primaryCategory, setPrimaryCategory] = useState(currentUser?.primary_category || 'AI / ML');
  const [hoursPerWeek, setHoursPerWeek] = useState(currentUser?.availability_hours_per_week || 25);
  const [skills, setSkills] = useState(currentUser?.skills || [
    { name: 'Python', level: 5 },
    { name: 'FastAPI', level: 5 },
    { name: 'React', level: 4 },
    { name: 'PyTorch', level: 4 },
    { name: 'OpenCV', level: 4 }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(5);
  const [interests, setInterests] = useState(currentUser?.interests || ['Hackathons', 'Agentic AI', 'Computer Vision', 'GovTech']);
  const [newInterest, setNewInterest] = useState('');
  const [appliedProjectIds, setAppliedProjectIds] = useState(new Set());

  // Calculate project matches based on current user's skills
  const userSkillNames = skills.map(s => s.name.toLowerCase());

  const matchedProjects = allProjects.map((project) => {
    const required = (project.required_skills || []).map(s => s.toLowerCase());
    const matched = required.filter(r => userSkillNames.includes(r));
    const score = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 75;
    
    return {
      ...project,
      match_score: Math.min(99, Math.max(60, score + 20)), // boost for domain relevance
      matched_skills: matched,
      missing_skills: required.filter(r => !userSkillNames.includes(r))
    };
  }).sort((a, b) => b.match_score - a.match_score);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    sound.playAssign();
    const updated = [...skills, { name: newSkillName.trim(), level: Number(newSkillLevel) }];
    setSkills(updated);
    setNewSkillName('');
    onUpdateUser({ ...currentUser, skills: updated });
    onShowToast(`Added skill: ${newSkillName.trim()}`);
  };

  const handleRemoveSkill = (skillName) => {
    sound.playClick();
    const updated = skills.filter(s => s.name !== skillName);
    setSkills(updated);
    onUpdateUser({ ...currentUser, skills: updated });
  };

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      e.preventDefault();
      if (!interests.includes(newInterest.trim())) {
        const updated = [...interests, newInterest.trim()];
        setInterests(updated);
        onUpdateUser({ ...currentUser, interests: updated });
      }
      setNewInterest('');
    }
  };

  const handleApplyToSquad = (project) => {
    sound.playSuccess();
    const nextApplied = new Set(appliedProjectIds);
    nextApplied.add(project.id);
    setAppliedProjectIds(nextApplied);
    onShowToast(`Applied to join ${project.title}! Squad lead received your skill match profile.`);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Profile Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#fff'
          }}>
            {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#f8fafc' }}>
                {name}
              </h1>
              <span className="badge-pill badge-blue">{primaryCategory}</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.15rem' }}>
              {roleTitle} • {currentUser?.location || 'Chennai, IN'}
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{
          background: '#11141d',
          border: '1px solid var(--border-subtle)',
          padding: '0.6rem 1.1rem',
          borderRadius: '0.45rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
          <strong style={{ fontSize: '0.85rem', color: '#6ee7b7' }}>Open for Hackathons & Projects</strong>
        </div>
      </div>

      {/* Grid: Left (Skill Passport & Preferences) + Right (Recommended Squad Matches) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Left Column: Skills & Availability Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Skill Passport Management */}
          <div className="enterprise-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                My Verified Skills & Competencies
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {skills.length} Skills Listed
              </span>
            </div>

            {/* Current Skills list */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {skills.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: '#090b10',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}
                >
                  <span style={{ color: '#3b82f6', fontSize: '0.7rem', letterSpacing: '-1px' }}>
                    {'|'.repeat(s.level || 4)}
                  </span>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <button
                    onClick={() => handleRemoveSkill(s.name)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 2px' }}
                    title="Remove skill"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                placeholder="Add skill (e.g. OpenCV, Node.js, Three.js)..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                style={{
                  flex: 1,
                  background: '#090b10',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.4rem',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                style={{
                  background: '#090b10',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.5rem',
                  borderRadius: '0.4rem',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value={5}>Level 5 (Expert)</option>
                <option value={4}>Level 4 (Advanced)</option>
                <option value={3}>Level 3 (Intermediate)</option>
              </select>
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add
              </button>
            </form>
          </div>

          {/* Availability & Interests Card */}
          <div className="enterprise-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              Availability & Project Interests
            </h3>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  WEEKLY COMMITMENT CAPACITY
                </span>
                <strong style={{ fontSize: '0.85rem', color: '#60a5fa' }}>{hoursPerWeek} hrs / week</strong>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="5"
                value={hoursPerWeek}
                onChange={(e) => {
                  setHoursPerWeek(Number(e.target.value));
                  onUpdateUser({ ...currentUser, availability_hours_per_week: Number(e.target.value) });
                }}
                style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                DOMAINS & INTERESTS (Press Enter to add)
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                {interests.map((int, i) => (
                  <span key={i} className="badge-pill badge-zinc" style={{ fontSize: '0.725rem' }}>
                    {int}
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="e.g. LegalTech, HealthTech, OpenSource..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={handleAddInterest}
                style={{
                  width: '100%',
                  background: '#090b10',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '0.4rem',
                  fontSize: '0.825rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

        </div>

        {/* Right Column: Matched Squad Opportunities Based on Your Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Matched Squad Opportunities for You
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Ranked automatically against your verified skill passport ({skills.map(s => s.name).join(', ')}).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matchedProjects.map((proj) => {
              const isApplied = appliedProjectIds.has(proj.id);

              return (
                <div
                  key={proj.id}
                  className="enterprise-card"
                  style={{
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    background: '#11141d',
                    border: isApplied ? '1px solid #10b981' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge-pill badge-blue" style={{ fontSize: '0.65rem' }}>{proj.category}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.target_hackathon}</span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>
                        {proj.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {proj.tagline}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        SKILL MATCH
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                        {proj.match_score}%
                      </div>
                    </div>
                  </div>

                  {/* Why this opportunity matches you */}
                  <div style={{ background: '#090b10', padding: '0.65rem 0.85rem', borderRadius: '0.35rem', border: '1px solid var(--border-subtle)', fontSize: '0.775rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      MATCHED COMPETENCIES:
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {proj.required_skills.map((req, rIdx) => {
                        const isMatch = userSkillNames.includes(req.toLowerCase());
                        return (
                          <span
                            key={rIdx}
                            style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: '3px',
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              background: isMatch ? 'rgba(16, 185, 129, 0.15)' : '#181d2a',
                              color: isMatch ? '#6ee7b7' : 'var(--text-muted)',
                              border: isMatch ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                            }}
                          >
                            {isMatch ? '✓ ' : ''}{req}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Looking for: <strong style={{ color: '#cbd5e1' }}>{proj.required_roles[0]}</strong>
                    </div>

                    <button
                      onClick={() => handleApplyToSquad(proj)}
                      className={isApplied ? 'btn-secondary' : 'btn-primary'}
                      style={{
                        padding: '0.4rem 0.95rem',
                        fontSize: '0.8rem',
                        color: isApplied ? '#34d399' : undefined
                      }}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 size={14} /> Request Submitted
                        </>
                      ) : (
                        <>
                          <Send size={13} /> Request to Join Squad
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
