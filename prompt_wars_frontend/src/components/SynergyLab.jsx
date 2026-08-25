import React, { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  X,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  Sparkles,
  UserCheck,
  Zap,
  Flame,
  Activity
} from 'lucide-react';
import { sound } from '../utils/sound';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SynergyLab({
  activeSquad,
  setActiveSquad,
  allBuilders,
  synergyAnalysis,
  onAutoFillBestSquad
}) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerFilterMode, setPickerFilterMode] = useState('recommended');
  const [simulatedCandidate, setSimulatedCandidate] = useState(null);

  const slotRoles = [
    {
      title: 'Technical Lead & Architecture',
      discipline: 'AI / ML & Systems',
      category: 'AI / ML',
      targetSkills: ['Python', 'PyTorch', 'FastAPI', 'LLMs', 'OpenCV'],
      experienceReq: '4y+ Advanced'
    },
    {
      title: 'Product & Interface Design',
      discipline: 'UI / UX & Product Design',
      category: 'UI / UX Design',
      targetSkills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
      experienceReq: '3y+ Intermediate'
    },
    {
      title: 'Systems & Backend Engineer',
      discipline: 'Backend & Cloud Infrastructure',
      category: 'Backend',
      targetSkills: ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'Distributed Systems'],
      experienceReq: '3y+ Intermediate'
    },
    {
      title: 'Domain & Delivery Lead',
      discipline: 'Pitch, Strategy & Product Delivery',
      category: 'Pitch & Biz',
      targetSkills: ['Pitch', 'Product Strategy', 'GovTech', 'Market Analysis'],
      experienceReq: '2y+ Specialist'
    },
  ];

  const domains = [
    { key: 'frontend', label: 'Frontend Dev', icon: '💻' },
    { key: 'backend', label: 'Backend Arch', icon: '⚙️' },
    { key: 'ai_data', label: 'AI & Data', icon: '🧠' },
    { key: 'design_ux', label: 'UI/UX Design', icon: '🎨' },
    { key: 'pitch_biz', label: 'Delivery & Biz', icon: '🚀' },
  ];

  const handleOpenPicker = (slotIdx) => {
    sound.playClick();
    setSelectedSlotIndex(slotIdx);
    setPickerFilterMode('recommended');
    setIsPickerOpen(true);
  };

  const handleAssignBuilder = (builder, targetSlotIdx = selectedSlotIndex) => {
    sound.playAssign();
    const updated = [...activeSquad];
    const filtered = updated.filter(b => b.id !== builder.id);
    filtered[targetSlotIdx] = builder;
    setActiveSquad(filtered.filter(Boolean));
    setIsPickerOpen(false);
  };

  const handleRemoveBuilder = (e, index) => {
    e.stopPropagation();
    sound.playClick();
    const updated = [...activeSquad];
    updated.splice(index, 1);
    setActiveSquad(updated);
  };

  const getSlotRecommendations = (slotMeta) => {
    const assignedIds = activeSquad.map(b => b.id);
    const available = allBuilders.filter(b => !assignedIds.includes(b.id));
    return available.filter(b => b.primary_category === slotMeta.category).slice(0, 2);
  };

  const currentSlotMeta = selectedSlotIndex !== null ? slotRoles[selectedSlotIndex] : null;

  const getFilteredPoolForSlot = () => {
    if (!currentSlotMeta) return allBuilders;
    const assignedIds = activeSquad.map(b => b.id);

    return allBuilders.map(b => {
      const isAssigned = assignedIds.includes(b.id);
      const isCategoryMatch = b.primary_category === currentSlotMeta.category;
      const matchedSkillCount = (b.skills || []).filter(sk =>
        currentSlotMeta.targetSkills.some(req => req.toLowerCase() === sk.toLowerCase())
      ).length;

      let fitScore = isCategoryMatch ? 90 : 50;
      fitScore += matchedSkillCount * 5;

      return {
        ...b,
        isAssigned,
        isCategoryMatch,
        matchedSkillCount,
        fitScore
      };
    }).filter(b => {
      if (pickerFilterMode === 'recommended') {
        return b.isCategoryMatch || b.matchedSkillCount > 0;
      }
      if (pickerFilterMode === 'senior') {
        return (b.experience_years || 2) >= 3;
      }
      return true;
    }).sort((a, b) => b.fitScore - a.fitScore);
  };

  const radarData = {
    labels: ['Frontend Dev', 'Backend Arch', 'AI & Data', 'UI/UX Design', 'Delivery & Biz'],
    datasets: [
      {
        label: 'Current Squad Competency',
        data: synergyAnalysis ? [
          synergyAnalysis.radar_scores.frontend,
          synergyAnalysis.radar_scores.backend,
          synergyAnalysis.radar_scores.ai_data,
          synergyAnalysis.radar_scores.design_ux,
          synergyAnalysis.radar_scores.pitch_biz,
        ] : [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(139, 92, 246, 0.25)',
        borderColor: '#8b5cf6',
        borderWidth: 2.5,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
      ...(simulatedCandidate ? [{
        label: `Simulated: +${simulatedCandidate.name}`,
        data: [
          Math.min(100, (synergyAnalysis?.radar_scores.frontend || 0) + (simulatedCandidate.skill_scores?.frontend || 30) * 0.4),
          Math.min(100, (synergyAnalysis?.radar_scores.backend || 0) + (simulatedCandidate.skill_scores?.backend || 30) * 0.4),
          Math.min(100, (synergyAnalysis?.radar_scores.ai_data || 0) + (simulatedCandidate.skill_scores?.ai_data || 30) * 0.4),
          Math.min(100, (synergyAnalysis?.radar_scores.design_ux || 0) + (simulatedCandidate.skill_scores?.design_ux || 30) * 0.4),
          Math.min(100, (synergyAnalysis?.radar_scores.pitch_biz || 0) + (simulatedCandidate.skill_scores?.pitch_biz || 30) * 0.4),
        ],
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: '#06b6d4',
        pointRadius: 3,
      }] : [])
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: '#293154' },
        grid: { color: '#1f2545' },
        pointLabels: { color: '#a5b4fc', font: { size: 11, family: 'var(--font-sans)', weight: '600' } },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false, stepSize: 25 }
      }
    },
    plugins: {
      legend: { display: Boolean(simulatedCandidate), labels: { color: '#a5b4fc', font: { size: 10 } } },
      tooltip: { backgroundColor: '#121424', titleColor: '#c4b5fd', bodyColor: '#ffffff', borderColor: '#3d497c', borderWidth: 1, padding: 8 }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  const currentPoolList = isPickerOpen ? getFilteredPoolForSlot() : [];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Interactive Squad Balance & Synergy Lab
          </h1>
          <p style={{ color: '#a5b4fc', marginTop: '0.2rem', maxWidth: '700px', fontSize: '0.875rem' }}>
            Simulate team compositions, inspect multi-domain competency matrices, and allocate specialized talent per role.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => { sound.playSuccess(); onAutoFillBestSquad(); }}>
            <Layers size={15} /> Auto-Staff Balanced Squad
          </button>
          <button className="btn-secondary" onClick={() => { sound.playClick(); setActiveSquad([]); setSimulatedCandidate(null); }}>
            Clear Roster
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        
        {/* Left Column: 4 Squad Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.04em' }}>
              STAFFING ROSTER ({activeSquad.length} / 4 ALLOCATED)
            </span>
          </div>

          {[0, 1, 2, 3].map((slotIdx) => {
            const assignedBuilder = activeSquad[slotIdx];
            const slotMeta = slotRoles[slotIdx];
            const slotRecs = !assignedBuilder ? getSlotRecommendations(slotMeta) : [];

            return (
              <div
                key={slotIdx}
                className="enterprise-card"
                style={{
                  padding: '1.15rem',
                  border: assignedBuilder ? '1px solid #3d497c' : '1px dashed #293154',
                  background: assignedBuilder ? '#121424' : '#0a0b14',
                }}
              >
                {assignedBuilder ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: '#fff'
                      }}>
                        {assignedBuilder.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{assignedBuilder.name}</span>
                          <span className="badge-pill badge-blue">{assignedBuilder.primary_category}</span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: '#a5b4fc', marginTop: '0.1rem' }}>
                          {assignedBuilder.role_title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                          {assignedBuilder.skills.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', background: '#1c223d', borderRadius: '3px', color: '#cbd5e1' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRemoveBuilder(e, slotIdx)}
                      title="Deallocate member"
                      style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer', padding: '0.4rem' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          background: '#121424',
                          border: '1px dashed #293154',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#818cf8'
                        }}>
                          <Plus size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc' }}>
                            Slot {slotIdx + 1}: {slotMeta.title}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#a5b4fc' }}>
                            Discipline Pool: <strong style={{ color: '#c4b5fd' }}>{slotMeta.discipline}</strong>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => handleOpenPicker(slotIdx)} className="btn-outline-blue" style={{ fontSize: '0.725rem' }}>
                        Browse {slotMeta.category} Pool
                      </button>
                    </div>

                    {slotRecs.length > 0 && (
                      <div style={{ background: '#121424', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #293154' }}>
                        <div style={{ fontSize: '0.675rem', color: '#c4b5fd', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Sparkles size={11} /> Top Candidates for {slotMeta.category}:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {slotRecs.map((rec) => (
                            <div key={rec.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.55rem', background: '#0a0b14', borderRadius: '4px', border: '1px solid #293154', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: 600, color: '#f8fafc' }}>{rec.name}</span>
                              <button onClick={() => handleAssignBuilder(rec, slotIdx)} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none', borderRadius: '3px', padding: '0.15rem 0.4rem', fontSize: '0.675rem', fontWeight: 600, cursor: 'pointer' }}>
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Diagnostics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="enterprise-card" style={{ padding: '1rem', background: '#121424', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>Sprint Velocity</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                <Flame size={18} color="#f59e0b" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeSquad.length >= 3 ? 'High' : activeSquad.length === 2 ? 'Moderate' : 'Unstaffed'}
                </span>
              </div>
              <div style={{ fontSize: '0.675rem', color: '#a5b4fc', marginTop: '0.2rem' }}>
                {activeSquad.length >= 3 ? 'Cross-functional' : 'Missing roles'}
              </div>
            </div>

            <div className="enterprise-card" style={{ padding: '1rem', background: '#121424', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>Weekly Capacity</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                <Clock size={18} color="#06b6d4" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {synergyAnalysis?.total_committed_hours || 0}h
                </span>
              </div>
              <div style={{ fontSize: '0.675rem', color: '#a5b4fc', marginTop: '0.2rem' }}>Total squad bandwidth</div>
            </div>

            <div className="enterprise-card" style={{ padding: '1rem', background: '#121424', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>Discipline Blend</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                <Activity size={18} color="#10b981" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeSquad.length >= 4 ? 'Optimal' : `${activeSquad.length}/4 Roles`}
                </span>
              </div>
              <div style={{ fontSize: '0.675rem', color: '#a5b4fc', marginTop: '0.2rem' }}>Role diversity index</div>
            </div>
          </div>

          <div className="enterprise-card" style={{ padding: '1.25rem', background: '#121424', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={15} color="#8b5cf6" />
                Multi-Axis Competency Coverage
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#a5b4fc' }}>What-If:</span>
                <select
                  value={simulatedCandidate?.id || ''}
                  onChange={(e) => {
                    sound.playClick();
                    const cand = allBuilders.find(b => b.id === e.target.value);
                    setSimulatedCandidate(cand || null);
                  }}
                  style={{ background: '#0a0b14', border: '1px solid #3d497c', color: '#c4b5fd', padding: '0.25rem 0.55rem', borderRadius: '0.35rem', fontSize: '0.725rem', outline: 'none' }}
                >
                  <option value="">None (Current Squad)</option>
                  {allBuilders.map(b => (
                    <option key={b.id} value={b.id}>+ Simulate {b.name} ({b.primary_category})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ height: '230px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          <div className="enterprise-card" style={{ padding: '1.25rem', background: '#121424' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <BarChart3 size={15} color="#06b6d4" />
              Squad Competency Heatmap Matrix
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {domains.map((dom) => {
                const score = synergyAnalysis?.radar_scores ? synergyAnalysis.radar_scores[dom.key] : 0;
                return (
                  <div key={dom.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.35rem 0.65rem', background: '#0a0b14', borderRadius: '0.4rem', border: '1px solid #293154', fontSize: '0.775rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '130px' }}>
                      <span>{dom.icon}</span>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{dom.label}</span>
                    </div>

                    <div style={{ flex: 1, margin: '0 1rem' }}>
                      <div style={{ width: '100%', height: '6px', background: '#1f2545', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: score >= 70 ? 'linear-gradient(90deg, #8b5cf6, #06b6d4)' : score >= 40 ? '#f59e0b' : '#ef4444', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>

                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: score >= 70 ? '#34d399' : score >= 40 ? '#fcd34d' : '#f87171' }}>
                      {score >= 70 ? 'Mastered' : score >= 40 ? 'Covered' : 'Gap Warning'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Role-Differentiated Candidate Picker Modal */}
      {isPickerOpen && currentSlotMeta && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="enterprise-card" style={{ width: '100%', maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto', padding: '1.75rem', background: '#121424', border: '1px solid #3d497c' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge-pill badge-blue" style={{ fontSize: '0.7rem' }}>
                    SLOT {selectedSlotIndex + 1} VACANCY
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>
                    Required: <strong style={{ color: '#c4b5fd' }}>{currentSlotMeta.experienceReq}</strong>
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>
                  {currentSlotMeta.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#a5b4fc', marginTop: '0.15rem' }}>
                  Candidate pool tailored specifically for <strong style={{ color: '#c4b5fd' }}>{currentSlotMeta.discipline}</strong> ({currentSlotMeta.targetSkills.join(', ')}).
                </p>
              </div>

              <button onClick={() => setIsPickerOpen(false)} style={{ background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #293154', paddingBottom: '0.75rem' }}>
              <button
                onClick={() => setPickerFilterMode('recommended')}
                style={{
                  background: pickerFilterMode === 'recommended' ? 'rgba(139, 92, 246, 0.25)' : '#0a0b14',
                  border: pickerFilterMode === 'recommended' ? '1px solid #8b5cf6' : '1px solid #293154',
                  color: pickerFilterMode === 'recommended' ? '#ffffff' : '#a5b4fc',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ✨ Best Fit for {currentSlotMeta.category} ({currentPoolList.length})
              </button>

              <button
                onClick={() => setPickerFilterMode('senior')}
                style={{
                  background: pickerFilterMode === 'senior' ? 'rgba(139, 92, 246, 0.25)' : '#0a0b14',
                  border: pickerFilterMode === 'senior' ? '1px solid #8b5cf6' : '1px solid #293154',
                  color: pickerFilterMode === 'senior' ? '#ffffff' : '#a5b4fc',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Senior & Lead Tiers (3y+)
              </button>

              <button
                onClick={() => setPickerFilterMode('all')}
                style={{
                  background: pickerFilterMode === 'all' ? 'rgba(139, 92, 246, 0.25)' : '#0a0b14',
                  border: pickerFilterMode === 'all' ? '1px solid #8b5cf6' : '1px solid #293154',
                  color: pickerFilterMode === 'all' ? '#ffffff' : '#a5b4fc',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Show All Candidates ({allBuilders.length})
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.85rem' }}>
              {currentPoolList.map((builder) => {
                const isAssigned = activeSquad.some(b => b.id === builder.id);
                const isDirectCategoryMatch = builder.primary_category === currentSlotMeta.category;

                return (
                  <div
                    key={builder.id}
                    onClick={() => handleAssignBuilder(builder)}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      background: isAssigned ? '#1f2545' : '#0a0b14',
                      border: isDirectCategoryMatch ? '1px solid #8b5cf6' : '1px solid #293154',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '6px',
                            background: isDirectCategoryMatch ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : '#181c33',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: '#fff'
                          }}>
                            {builder.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{builder.name}</span>
                            <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>{builder.role_title}</div>
                          </div>
                        </div>

                        <span className={`badge-pill ${isDirectCategoryMatch ? 'badge-emerald' : 'badge-zinc'}`} style={{ fontSize: '0.65rem' }}>
                          {isDirectCategoryMatch ? 'Exact Match' : builder.primary_category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                        {(builder.skills || []).map((skill, sIdx) => {
                          const isTarget = currentSlotMeta.targetSkills.some(req => req.toLowerCase() === skill.toLowerCase());
                          return (
                            <span
                              key={sIdx}
                              style={{
                                fontSize: '0.675rem',
                                padding: '0.1rem 0.4rem',
                                background: isTarget ? 'rgba(139, 92, 246, 0.25)' : '#181c33',
                                border: isTarget ? '1px solid #8b5cf6' : '1px solid #293154',
                                borderRadius: '3px',
                                color: isTarget ? '#c4b5fd' : '#cbd5e1',
                                fontWeight: isTarget ? 600 : 400
                              }}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #1f2545', fontSize: '0.725rem', color: '#818cf8' }}>
                      <span>Experience: <strong style={{ color: '#fff' }}>{builder.experience_years || 3}y</strong></span>
                      <span style={{ color: '#34d399', fontWeight: 600 }}>Click to Allocate →</span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
