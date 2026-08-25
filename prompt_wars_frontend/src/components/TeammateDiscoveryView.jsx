import React, { useState } from 'react';
import { Search, Send, Check, Eye, MapPin, Briefcase, Clock, X, ExternalLink, Code2, Award, CheckCircle2, UserPlus, Sparkles, Filter, SlidersHorizontal, Mail } from 'lucide-react';
import { sound } from '../utils/sound';

export default function TeammateDiscoveryView({
  candidatesList,
  onShowToast,
  activeSquad,
  setActiveSquad,
  currentUser,
  onRequireAuth,
  onOpenCandidateRegistration,
  onOpenEmailInvite
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedIds, setInvitedIds] = useState(new Set());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [minHours, setMinHours] = useState(0);

  const quickFilterSkills = ['Python', 'React', 'TypeScript', 'Figma', 'OpenCV', 'FastAPI', 'Go', 'LLMs', 'PyTorch', 'Docker', 'WebSockets', 'Supabase'];

  const handleToggleFilterSkill = (skill) => {
    sound.playClick();
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(skillInput.trim())) {
        setSelectedSkills([...selectedSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const processedCandidates = candidatesList.map((candidate) => {
    const candidateSkillNames = candidate.skills.map(s => s.name.toLowerCase());
    
    let matchedCount = 0;
    if (selectedSkills.length > 0) {
      matchedCount = selectedSkills.filter(req => candidateSkillNames.includes(req.toLowerCase())).length;
    }

    let dynamicScore = candidate.match_score || 85;
    if (selectedSkills.length > 0) {
      const matchRatio = matchedCount / selectedSkills.length;
      dynamicScore = Math.round((matchRatio * 70) + 30);
    }

    return {
      ...candidate,
      computed_score: dynamicScore,
      matched_filter_count: matchedCount
    };
  });

  const filteredCandidates = processedCandidates.filter((c) => {
    if (minHours > 0 && (c.availability_hours || 20) < minHours) return false;

    if (selectedSkills.length > 0) {
      const candidateSkills = c.skills.map(s => s.name.toLowerCase());
      const hasAnySelected = selectedSkills.some(req => candidateSkills.includes(req.toLowerCase()));
      if (!hasAnySelected) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q) ||
      c.skills.some(s => s.name.toLowerCase().includes(q))
    );
  }).sort((a, b) => {
    if (selectedSkills.length > 0) {
      return b.matched_filter_count - a.matched_filter_count || b.computed_score - a.computed_score;
    }
    return b.computed_score - a.computed_score;
  });

  const handleInvite = (candidate) => {
    if (!currentUser) {
      sound.playClick();
      onRequireAuth();
      return;
    }

    if (onOpenEmailInvite) {
      onOpenEmailInvite(candidate);
      return;
    }

    sound.playSuccess();
    const nextInvited = new Set(invitedIds);
    if (nextInvited.has(candidate.id)) {
      nextInvited.delete(candidate.id);
      onShowToast(`Invitation revoked for ${candidate.name}.`);
    } else {
      nextInvited.add(candidate.id);
      onShowToast(`Invitation sent to ${candidate.name}!`);
    }
    setInvitedIds(nextInvited);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{
        background: 'linear-gradient(135deg, #121424, #1a1e36)',
        border: '1px solid #293154',
        borderRadius: '0.75rem',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Find Teammates by Required Skills
          </h1>
          <p style={{ color: '#a5b4fc', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '650px' }}>
            Search candidates with complementary skills. Team leads can filter by tech stack and dispatch collaboration emails directly to builders.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => { sound.playClick(); onOpenCandidateRegistration(); }}
          style={{ padding: '0.65rem 1.25rem' }}
        >
          <UserPlus size={16} /> + Join Candidate Pool
        </button>
      </div>

      <div className="enterprise-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#121424' }}>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#818cf8'
              }}
            />
            <input
              type="text"
              placeholder="Search by candidate name, role, city, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#0a0b14',
                border: '1px solid #293154',
                color: '#f8fafc',
                padding: '0.7rem 1rem 0.7rem 2.6rem',
                borderRadius: '0.45rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#0a0b14', padding: '0.4rem 0.85rem', borderRadius: '0.45rem', border: '1px solid #293154' }}>
            <span style={{ fontSize: '0.775rem', color: '#a5b4fc', whiteSpace: 'nowrap' }}>
              Min Capacity: <strong style={{ color: '#c4b5fd' }}>{minHours}h/wk</strong>
            </span>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
              style={{ accentColor: '#8b5cf6', cursor: 'pointer', width: '90px' }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.775rem', color: '#a5b4fc', fontWeight: 600 }}>
              FILTER BY EXACT REQUIRED SKILLS (Click to match):
            </span>
            {selectedSkills.length > 0 && (
              <button
                onClick={() => setSelectedSkills([])}
                style={{ background: 'none', border: 'none', color: '#c4b5fd', fontSize: '0.725rem', cursor: 'pointer' }}
              >
                Clear all filters ({selectedSkills.length})
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {quickFilterSkills.map((sk) => {
              const isSelected = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  onClick={() => handleToggleFilterSkill(sk)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.725rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #8b5cf6' : '1px solid #293154',
                    background: isSelected ? 'rgba(139, 92, 246, 0.25)' : '#0a0b14',
                    color: isSelected ? '#ffffff' : '#a5b4fc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {isSelected && <Check size={12} />}
                  {sk}
                </button>
              );
            })}

            <input
              type="text"
              placeholder="+ Add custom skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              style={{
                background: '#0a0b14',
                border: '1px dashed #293154',
                color: '#fff',
                padding: '0.25rem 0.6rem',
                borderRadius: '0.35rem',
                fontSize: '0.725rem',
                outline: 'none',
                width: '140px'
              }}
            />
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 500 }}>
          Showing <strong style={{ color: '#f8fafc' }}>{filteredCandidates.length}</strong> matching candidates
          {selectedSkills.length > 0 && ` for [${selectedSkills.join(', ')}]`}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(390px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredCandidates.map((c) => {
          const isInvited = invitedIds.has(c.id);

          return (
            <div
              key={c.id}
              className="enterprise-card"
              style={{
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.15rem',
                border: isInvited ? '1px solid #10b981' : (c.matched_filter_count > 0 ? '1px solid #8b5cf6' : '1px solid #293154'),
                background: '#121424',
                position: 'relative'
              }}
            >
              <div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: c.avatar_color || 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      {c.initials}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em', margin: 0 }}>
                        {c.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 500, marginTop: '0.1rem' }}>
                        {c.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
                    <svg viewBox="0 0 36 36" style={{ width: '44px', height: '44px', transform: 'rotate(-90deg)' }}>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#1f2545"
                        strokeWidth="3.2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={c.computed_score >= 90 ? '#10b981' : '#8b5cf6'}
                        strokeWidth="3.2"
                        strokeDasharray={`${c.computed_score}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      color: '#f8fafc'
                    }}>
                      <span>{c.computed_score}</span>
                      <span style={{ fontSize: '0.55rem', color: '#c4b5fd', marginTop: '-2px' }}>%</span>
                    </div>
                  </div>

                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  fontSize: '0.75rem',
                  color: '#a5b4fc',
                  marginTop: '0.65rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} color="#8b5cf6" /> {c.location}
                  </span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Briefcase size={12} /> {c.experience_years}y · {c.experience_level}
                  </span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {c.availability}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.9rem' }}>
                  {c.skills.map((skill, sIdx) => {
                    const isMatchedFilter = selectedSkills.some(req => req.toLowerCase() === skill.name.toLowerCase());
                    return (
                      <div
                        key={sIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: isMatchedFilter ? 'rgba(139, 92, 246, 0.25)' : '#181c33',
                          border: isMatchedFilter ? '1px solid #8b5cf6' : '1px solid #293154',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 500,
                          color: isMatchedFilter ? '#ffffff' : '#cbd5e1'
                        }}
                      >
                        <span style={{ color: isMatchedFilter ? '#c4b5fd' : '#8b5cf6', fontSize: '0.65rem', letterSpacing: '-1px' }}>
                          {'|'.repeat(Math.min(5, skill.level || 4))}
                        </span>
                        <span>{skill.name}</span>
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45, marginTop: '0.85rem' }}>
                  {c.bio}
                </p>

                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 0.9rem',
                  background: '#0a0b14',
                  borderRadius: '0.45rem',
                  border: '1px solid #293154'
                }}>
                  <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                    Match Justification
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {c.why_match.map((reason, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #293154' }}>
                <button
                  onClick={() => { sound.playClick(); setSelectedProfile(c); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#a5b4fc',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Eye size={14} /> View Dossier
                </button>

                <button
                  onClick={() => handleInvite(c)}
                  className="btn-primary"
                  style={{
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <Mail size={13} /> Send Email Invite
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {selectedProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="enterprise-card" style={{
            maxWidth: '580px',
            width: '100%',
            padding: '1.75rem',
            background: '#121424',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedProfile(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#a5b4fc',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '8px',
                background: selectedProfile.avatar_color || 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff'
              }}>
                {selectedProfile.initials}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>{selectedProfile.name}</h2>
                <div style={{ color: '#c4b5fd', fontWeight: 500, fontSize: '0.85rem' }}>{selectedProfile.role}</div>
                <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>{selectedProfile.location} • {selectedProfile.timezone}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
              {selectedProfile.bio}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem', background: '#0a0b14', padding: '0.85rem', borderRadius: '0.45rem', border: '1px solid #293154' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Experience</span>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedProfile.experience_years} Years ({selectedProfile.experience_level})</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Committed Hours</span>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#6ee7b7' }}>{selectedProfile.availability}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={() => setSelectedProfile(null)}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  handleInvite(selectedProfile);
                  setSelectedProfile(null);
                }}
              >
                <Mail size={14} /> Send Email Invite
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}