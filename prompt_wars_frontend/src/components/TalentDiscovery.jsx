import React, { useState } from 'react';
import { Search, Filter, Users, Award, Clock, MapPin, Code2, Globe2, Plus, Check, Zap } from 'lucide-react';
import { sound } from '../utils/sound';

export default function TalentDiscovery({ allBuilders, activeSquad, setActiveSquad, onShowToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [minHours, setMinHours] = useState(0);

  const categories = ['All', 'AI / ML', 'UI / UX Design', 'Backend', 'Frontend', 'Pitch & Biz'];
  const expLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Veteran'];

  const filteredBuilders = allBuilders.filter((b) => {
    if (selectedCategory !== 'All' && b.primary_category !== selectedCategory) return false;
    if (selectedExp !== 'All' && b.experience_level !== selectedExp) return false;
    if (b.availability_hours_per_week < minHours) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchRole = b.role_title.toLowerCase().includes(q);
      const matchSkills = b.skills.some(s => s.toLowerCase().includes(q));
      const matchInterests = (b.interests || []).some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchSkills && !matchInterests) return false;
    }
    return true;
  });

  const handleToggleSquadMember = (builder) => {
    sound.playClick();
    const isAlreadyIn = activeSquad.some(b => b.id === builder.id);
    if (isAlreadyIn) {
      setActiveSquad(activeSquad.filter(b => b.id !== builder.id));
      onShowToast(`Removed ${builder.name} from squad.`);
    } else {
      if (activeSquad.length >= 4) {
        onShowToast('Squad is full (4/4)! Remove a member first.', 'error');
        return;
      }
      setActiveSquad([...activeSquad, builder]);
      sound.playAssign();
      onShowToast(`Added ${builder.name} to squad!`);
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neon-cyan)', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          <Users size={15} /> Verified Builder Directory
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Talent Market & Builder Matchmaker
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '700px', fontSize: '0.95rem' }}>
          Discover top-tier engineers, designers, researchers, and pitchers ready to form high-impact hackathon squads.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Search and Hours */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by skill, name, bio (e.g. PyTorch, Figma, WebSockets)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Min Hours: <strong>{minHours}h/wk</strong>
            </span>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
              style={{ accentColor: 'var(--neon-cyan)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { sound.playClick(); setSelectedCategory(cat); }}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: selectedCategory === cat ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                fontSize: '0.775rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Builder Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredBuilders.map((b) => {
          const isInSquad = activeSquad.some(member => member.id === b.id);

          return (
            <div
              key={b.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isInSquad ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                background: isInSquad ? 'rgba(0, 240, 255, 0.04)' : 'rgba(15, 23, 42, 0.75)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
            >
              <div>
                {/* Header Profile */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <img
                      src={b.avatar}
                      alt={b.name}
                      style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{b.name}</h3>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {b.role_title}
                      </div>
                    </div>
                  </div>

                  <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>
                    {b.primary_category}
                  </span>
                </div>

                {/* Bio */}
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {b.bio}
                </p>

                {/* Skills Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {b.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '0.725rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Meta details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--neon-emerald)' }}>
                    <Award size={14} />
                    <strong>{b.hackathons_won} Wins</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span>{b.availability_hours_per_week}h / week</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} />
                    <span>{b.timezone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--neon-cyan)' }}>
                    <Zap size={14} />
                    <span>{b.experience_level}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleToggleSquadMember(b)}
                className={isInSquad ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: isInSquad ? 'rgba(244, 63, 94, 0.15)' : undefined,
                  borderColor: isInSquad ? 'rgba(244, 63, 94, 0.3)' : undefined,
                  color: isInSquad ? 'var(--neon-rose)' : undefined
                }}
              >
                {isInSquad ? (
                  <>
                    <Check size={16} /> In Squad (Click to Remove)
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Recruit to Squad
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
