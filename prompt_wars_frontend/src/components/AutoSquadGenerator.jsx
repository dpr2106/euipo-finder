import React, { useState } from 'react';
import { Cpu, Users, ArrowRight, CheckCircle2, Shield, Loader2, Layers, Sliders } from 'lucide-react';
import { sound } from '../utils/sound';
import { api } from '../services/api';

export default function AutoSquadGenerator({ onAdoptSquad }) {
  const [projectTitle, setProjectTitle] = useState('Legal Metrology AI Auditor & Compliance Engine');
  const [category, setCategory] = useState('GovTech / Computer Vision');
  const [teamSize, setTeamSize] = useState(4);
  const [minHours, setMinHours] = useState(20);
  const [requiredSkills, setRequiredSkills] = useState(['OpenCV', 'FastAPI', 'React', 'Figma']);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedSquads, setGeneratedSquads] = useState(null);

  const templates = [
    {
      title: 'Legal Metrology Automated Compliance Engine',
      category: 'GovTech / Computer Vision',
      skills: ['OpenCV', 'FastAPI', 'React', 'Figma', 'OCR']
    },
    {
      title: 'Clinical Triage & Healthcare Decision Support',
      category: 'HealthTech / LLM Systems',
      skills: ['Python', 'FastAPI', 'React', 'Healthcare', 'Data Pipelines']
    },
    {
      title: 'Spatial Collaborative 3D Design Suite',
      category: 'Graphics / Distributed Web',
      skills: ['Three.js', 'WebGL', 'Go', 'Figma', 'WebSockets']
    }
  ];

  const handleSelectTemplate = (t) => {
    sound.playClick();
    setProjectTitle(t.title);
    setCategory(t.category);
    setRequiredSkills(t.skills);
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(skillInput.trim())) {
        setRequiredSkills([...requiredSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    sound.playClick();
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleGenerate = async () => {
    sound.playClick();
    setLoading(true);
    try {
      const results = await api.autoSquadMatch({
        project_title: projectTitle,
        project_description: 'Staffing requisition match',
        category: category,
        team_size: teamSize,
        required_roles: ['Lead', 'Frontend', 'Backend', 'Delivery'],
        required_skills: requiredSkills,
        min_hours_per_week: minHours
      });
      setGeneratedSquads(results);
      sound.playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
          Automated Staffing & Team Optimization Engine
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: '700px', fontSize: '0.875rem' }}>
          Define project scope and competency requirements. The optimization algorithm computes mathematically optimal team combinations across availability, seniority, and skill coverage.
        </p>
      </div>

      {/* Input Form & Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left: Configuration Form */}
        <div className="enterprise-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={16} color="#60a5fa" /> Requisition Specifications
          </h3>

          <div>
            <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              PROJECT / INITIATIVE TITLE
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              style={{
                width: '100%',
                background: '#090b10',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.45rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                TARGET TEAM HEADCOUNT
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#090b10',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0.45rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value={3}>3 Members</option>
                <option value={4}>4 Members (Standard Roster)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                MINIMUM CAPACITY
              </label>
              <select
                value={minHours}
                onChange={(e) => setMinHours(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#090b10',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0.45rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value={15}>15+ hrs / week</option>
                <option value={20}>20+ hrs / week</option>
                <option value={25}>25+ hrs / week</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              REQUIRED COMPETENCIES (Press Enter to Add)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {requiredSkills.map((s, idx) => (
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
              placeholder="e.g. PyTorch, Next.js, Figma, SQL..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              style={{
                width: '100%',
                background: '#090b10',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.55rem 0.8rem',
                borderRadius: '0.45rem',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Computing Optimal Allocations...
              </>
            ) : (
              <>
                <Cpu size={16} /> Execute Team Optimization
              </>
            )}
          </button>
        </div>

        {/* Right: Enterprise Presets */}
        <div className="enterprise-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
            Standard Requisition Templates
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Select a standard project profile to populate required skill vectors and test combinatorial team formation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {templates.map((tpl, i) => (
              <div
                key={i}
                onClick={() => handleSelectTemplate(tpl)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '0.45rem',
                  background: '#090b10',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tpl.title}</span>
                  <span className="badge-pill badge-zinc" style={{ fontSize: '0.65rem' }}>{tpl.category}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                  {tpl.skills.map((s, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', background: '#181d2a', color: '#94a3b8', borderRadius: '3px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Generated Squads Display */}
      {generatedSquads && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Recommended Team Formations
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {generatedSquads.map((squad, sIdx) => {
              const score = squad.overall_synergy;
              const isTop = sIdx === 0;

              return (
                <div
                  key={squad.squad_id}
                  className="enterprise-card"
                  style={{
                    padding: '1.4rem',
                    border: isTop ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                    background: '#11141d',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        ALLOCATION OPTION #{sIdx + 1}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                          {score}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coverage</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1rem' }}>
                      {squad.members.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.45rem 0.65rem',
                            background: '#090b10',
                            borderRadius: '0.35rem',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#93c5fd' }}>
                            {m.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.825rem' }}>{m.name}</span>
                              <span className="badge-pill badge-zinc" style={{ fontSize: '0.6rem' }}>{m.primary_category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', background: '#090b10', padding: '0.65rem', borderRadius: '0.35rem', borderLeft: '2px solid #3b82f6' }}>
                      {squad.rationale}
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => {
                      sound.playSuccess();
                      onAdoptSquad(squad.members);
                    }}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Load into Analytics Lab <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
