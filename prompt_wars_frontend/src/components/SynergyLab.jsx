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
  UserCheck
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

  const slotRoles = [
    { title: 'Technical Lead & Architecture', defaultCategory: 'AI / ML' },
    { title: 'Product & Interface Design', defaultCategory: 'UI / UX Design' },
    { title: 'Systems & Backend Engineer', defaultCategory: 'Backend' },
    { title: 'Domain & Delivery Lead', defaultCategory: 'Pitch & Biz' },
  ];

  const handleOpenPicker = (slotIdx) => {
    sound.playClick();
    setSelectedSlotIndex(slotIdx);
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

  // Find top complementary candidates for an empty slot
  const getSlotRecommendations = (slotMeta) => {
    const assignedIds = activeSquad.map(b => b.id);
    const available = allBuilders.filter(b => !assignedIds.includes(b.id));
    
    // Prioritize candidates matching the slot's primary category
    return available.filter(b => b.primary_category === slotMeta.defaultCategory).slice(0, 2);
  };

  // Radar Chart Data
  const radarData = {
    labels: [
      'Frontend Dev',
      'Backend Arch',
      'AI & Data',
      'UI/UX Design',
      'Delivery & Biz'
    ],
    datasets: [
      {
        label: 'Team Competency Index',
        data: synergyAnalysis ? [
          synergyAnalysis.radar_scores.frontend,
          synergyAnalysis.radar_scores.backend,
          synergyAnalysis.radar_scores.ai_data,
          synergyAnalysis.radar_scores.design_ux,
          synergyAnalysis.radar_scores.pitch_biz,
        ] : [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointRadius: 4,
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: '#23293a' },
        grid: { color: '#181d2a' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 11, family: 'var(--font-sans)', weight: '500' }
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false, stepSize: 25 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#11141d',
        titleColor: '#60a5fa',
        bodyColor: '#f8fafc',
        borderColor: '#23293a',
        borderWidth: 1,
        padding: 8,
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  const score = synergyAnalysis?.overall_synergy || 0;
  const scoreColor = score >= 85 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Team Composition & Balance Analyzer
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: '680px', fontSize: '0.875rem' }}>
            Evaluate team coverage across technical and operational domains. The analytical engine identifies single-point failure risks and missing competencies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => { sound.playSuccess(); onAutoFillBestSquad(); }}
          >
            <Layers size={15} />
            Auto-Allocate Balanced Team (96% Coverage)
          </button>
          <button
            className="btn-secondary"
            onClick={() => { sound.playClick(); setActiveSquad([]); }}
          >
            Clear Roster
          </button>
        </div>
      </div>

      {/* Main Grid: 4 Role Slots + Right Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        
        {/* Left Column: 4 Squad Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              STAFFING SLOTS ({activeSquad.length} / 4 ALLOCATED)
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
                  border: assignedBuilder ? '1px solid #23293a' : '1px dashed #23293a',
                  background: assignedBuilder ? '#11141d' : '#090b10',
                }}
              >
                {assignedBuilder ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        background: '#1e293b',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: '#93c5fd'
                      }}>
                        {assignedBuilder.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{assignedBuilder.name}</span>
                          <span className="badge-pill badge-blue">{assignedBuilder.primary_category}</span>
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          {assignedBuilder.role_title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                          {assignedBuilder.skills.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', background: '#181d2a', borderRadius: '3px', color: 'var(--text-muted)' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRemoveBuilder(e, slotIdx)}
                      title="Deallocate member"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.4rem'
                      }}
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
                          background: '#11141d',
                          border: '1px dashed #23293a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)'
                        }}>
                          <Plus size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Slot {slotIdx + 1}: {slotMeta.title}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            Recommended Domain: {slotMeta.defaultCategory}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenPicker(slotIdx)}
                        className="btn-outline-blue"
                        style={{ fontSize: '0.725rem' }}
                      >
                        Browse Pool
                      </button>
                    </div>

                    {/* Instant Smart Recommendations in Empty Slot */}
                    {slotRecs.length > 0 && (
                      <div style={{ background: '#11141d', padding: '0.55rem 0.75rem', borderRadius: '0.35rem', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.675rem', color: '#60a5fa', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Sparkles size={11} /> Top Candidate Recommendations:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {slotRecs.map((rec) => (
                            <div
                              key={rec.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.25rem 0.55rem',
                                background: '#090b10',
                                borderRadius: '4px',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.75rem'
                              }}
                            >
                              <span style={{ fontWeight: 600, color: '#f8fafc' }}>{rec.name}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({rec.skills.slice(0, 2).join(', ')})</span>
                              <button
                                onClick={() => handleAssignBuilder(rec, slotIdx)}
                                style={{
                                  background: '#2563eb',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '3px',
                                  padding: '0.15rem 0.4rem',
                                  fontSize: '0.675rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
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

        {/* Right Column: Analytics & Diagnostic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Top Score Card */}
          <div className="enterprise-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Aggregate Team Synergy Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.1rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: scoreColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {score}%
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {score >= 85 ? 'Optimally Balanced' : score >= 60 ? 'Acceptable' : 'Coverage Gaps'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Committed Capacity</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.15rem', fontFamily: 'var(--font-mono)' }}>
                  {synergyAnalysis?.total_committed_hours || 0} hrs/wk
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Role Diversity</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.15rem', fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>
                  {synergyAnalysis?.role_diversity_score || 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="enterprise-card" style={{ padding: '1.25rem', height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Diagnostic Box */}
          <div className="enterprise-card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.6rem' }}>
              <BarChart3 size={15} color="#60a5fa" />
              Staffing Coverage Diagnostic
            </div>

            {synergyAnalysis?.strengths && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
                {synergyAnalysis.strengths.map((str, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.775rem', color: '#6ee7b7' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    {str}
                  </div>
                ))}
              </div>
            )}

            {synergyAnalysis?.gaps && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {synergyAnalysis.gaps.map((gap, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.775rem', color: '#fca5a5' }}>
                    <AlertTriangle size={13} color="#ef4444" />
                    {gap}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Candidate Selection Modal */}
      {isPickerOpen && (
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
          <div className="enterprise-card" style={{ width: '100%', maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem', background: '#11141d' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  Allocate Candidate to Slot {selectedSlotIndex + 1}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {slotRoles[selectedSlotIndex]?.title}
                </p>
              </div>
              <button onClick={() => setIsPickerOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.75rem' }}>
              {allBuilders.map((builder) => {
                const isAssigned = activeSquad.some(b => b.id === builder.id);
                return (
                  <div
                    key={builder.id}
                    onClick={() => handleAssignBuilder(builder)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '0.45rem',
                      background: isAssigned ? '#1e2538' : '#090b10',
                      border: isAssigned ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#93c5fd' }}>
                      {builder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{builder.name}</span>
                        <span className="badge-pill badge-blue" style={{ fontSize: '0.65rem' }}>{builder.primary_category}</span>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{builder.role_title}</div>
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
