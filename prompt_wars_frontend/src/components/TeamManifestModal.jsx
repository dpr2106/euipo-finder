import React from 'react';
import { X, Shield, Printer, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

export default function TeamManifestModal({ isOpen, onClose, activeSquad, synergyAnalysis }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const score = synergyAnalysis?.overall_synergy || 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="enterprise-card" style={{
        width: '100%',
        maxWidth: '740px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        background: '#11141d',
        border: '1px solid #23293a'
      }}>
        
        {/* Modal Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={20} color="#3b82f6" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Official Team Composition & Staffing Manifest
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={handlePrint} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              <Printer size={14} /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Box */}
        <div style={{
          border: '1px solid #23293a',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          background: '#090b10',
          position: 'relative'
        }}>
          
          {/* Header Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.04em' }}>
                Equipo CERTIFIED STAFFING ROSTER
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.15rem' }}>
                SRM Prompt Wars 2026 // Project Team Formation
              </h3>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Generated: {new Date().toLocaleDateString()} | Verification Token: PM-ROSTER-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                COVERAGE SCORE
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>
                {score}%
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              ALLOCATED TEAM MEMBERS ({activeSquad.length})
            </div>

            {activeSquad.map((member, idx) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: '#11141d',
                  borderRadius: '0.35rem',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    0{idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{member.role_title}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge-pill badge-zinc" style={{ fontSize: '0.65rem' }}>
                    {member.primary_category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {member.availability_hours_per_week} hrs/wk
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Synergy Pillars Matrix */}
          {synergyAnalysis && (
            <div style={{ background: '#11141d', padding: '0.85rem', borderRadius: '0.35rem', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                COMPETENCY COVERAGE BREAKDOWN
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                {Object.entries(synergyAnalysis.radar_scores).map(([key, val]) => (
                  <div key={key}>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {key.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                      {val}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signoff */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981' }}>
              <CheckCircle2 size={13} /> Verified by Equipo Competency Engine
            </div>
            <div>Official Registration Document</div>
          </div>

        </div>

      </div>
    </div>
  );
}
