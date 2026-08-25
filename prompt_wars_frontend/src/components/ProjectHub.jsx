import React, { useState } from 'react';
import { FolderKanban, Plus, Users, Clock, Tag, CheckCircle2, ArrowUpRight, Send, X } from 'lucide-react';
import { sound } from '../utils/sound';

export default function ProjectHub({ allProjects, allBuilders, onShowToast, currentUser, onRequireAuth }) {
  const [projects, setProjects] = useState(allProjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState('GovTech / Computer Vision');
  const [newHackathon, setNewHackathon] = useState('SRM Prompt Wars 2026');
  const [newRoles, setNewRoles] = useState('AI Vision Lead, UI/UX Designer, Systems Architect');
  const [newSkills, setNewSkills] = useState('OpenCV, FastAPI, React, Figma');

  const handleApply = (projectId, role) => {
    if (!currentUser) {
      sound.playClick();
      onRequireAuth();
      return;
    }
    sound.playSuccess();
    onShowToast(`Application logged for position: ${role}. Staffing administrator notified.`);
  };

  const handleOpenCreate = () => {
    if (!currentUser) {
      sound.playClick();
      onRequireAuth();
      return;
    }
    sound.playClick();
    setIsCreateOpen(true);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playSuccess();
    const newProj = {
      id: `p-${Date.now()}`,
      title: newTitle,
      tagline: newTagline || 'Collaborative initiative in active staffing.',
      description: newTagline,
      category: newCategory,
      target_hackathon: newHackathon,
      required_roles: newRoles.split(',').map(r => r.trim()).filter(Boolean),
      required_skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      min_hours_per_week: 20,
      creator_id: currentUser?.id || 'b1',
      created_at: new Date().toISOString(),
      members: [currentUser?.id || 'b1'],
      applicants: []
    };

    setProjects([newProj, ...projects]);
    setIsCreateOpen(false);
    onShowToast('Project requisition published successfully.');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Project Directory & Open Requisitions
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: '700px', fontSize: '0.875rem' }}>
            View active initiatives requiring specialized talent, or publish your own project requisition.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleOpenCreate}
        >
          <Plus size={15} /> Create Project Requisition
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {projects.map((proj) => {
          const memberProfiles = proj.members.map(mId => allBuilders.find(b => b.id === mId)).filter(Boolean);

          return (
            <div
              key={proj.id}
              className="enterprise-card"
              style={{
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.15rem',
                background: '#11141d'
              }}
            >
              <div>
                {/* Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge-pill badge-blue" style={{ fontSize: '0.65rem' }}>
                    {proj.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {proj.target_hackathon}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {proj.tagline}
                </p>

                {/* Existing Members */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                    CURRENT ROSTER ({memberProfiles.length} / 4)
                  </div>
                  <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    {memberProfiles.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: '#1e293b',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          color: '#93c5fd'
                        }}
                        title={`${m.name} (${m.role_title})`}
                      >
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - memberProfiles.length) }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px dashed #23293a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        -
                      </div>
                    ))}
                  </div>
                </div>

                {/* Open Role Slots */}
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                    OPEN REQUISITIONS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {proj.required_roles.map((role, rIdx) => (
                      <div
                        key={rIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.4rem 0.65rem',
                          background: '#090b10',
                          borderRadius: '0.35rem',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.775rem'
                        }}
                      >
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{role}</span>
                        <button
                          onClick={() => handleApply(proj.id, role)}
                          className="btn-outline-blue"
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                        >
                          Submit Candidacy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tech Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                {proj.required_skills.map((s, idx) => (
                  <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: '#090b10', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                    {s}
                  </span>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="enterprise-card" style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', background: '#11141d' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>New Project Requisition</h3>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  PROJECT TITLE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous AI Compliance Auditor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  EXECUTIVE SUMMARY / SCOPE
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the initiative"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    DOMAIN CATEGORY
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    TARGET EVENT / VENUE
                  </label>
                  <input
                    type="text"
                    value={newHackathon}
                    onChange={(e) => setNewHackathon(e.target.value)}
                    style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  TARGET ROLES (Comma separated)
                </label>
                <input
                  type="text"
                  value={newRoles}
                  onChange={(e) => setNewRoles(e.target.value)}
                  style={{ width: '100%', background: '#090b10', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.45rem', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                Publish Staffing Requisition
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
