import { INITIAL_BUILDERS, INITIAL_PROJECTS } from '../data/mockData';

const API_BASE = 'http://localhost:8000/api';

// Client-side fallback calculator if FastAPI is not yet booted
function calculateSynergyClient(builders, requiredSkills = []) {
  if (!builders || builders.length === 0) {
    return {
      overall_synergy: 0,
      radar_scores: { frontend: 0, backend: 0, ai_data: 0, design_ux: 0, pitch_biz: 0 },
      role_diversity_score: 0,
      availability_index: 0,
      total_committed_hours: 0,
      strengths: [],
      gaps: ['Squad is empty. Assign at least 1 builder to begin synergy analysis.'],
      recommendation: 'Start by assigning a Technical Lead or Product Designer.'
    };
  }

  const radar_scores = { frontend: 0, backend: 0, ai_data: 0, design_ux: 0, pitch_biz: 0 };
  Object.keys(radar_scores).forEach(pillar => {
    const scores = builders.map(b => (b.skill_scores && b.skill_scores[pillar]) || 0);
    const sorted = [...scores].sort((a, b) => b - a);
    const best = sorted[0] || 0;
    const bonus = sorted[1] ? sorted[1] * 0.15 : 0;
    radar_scores[pillar] = Math.min(100, Math.round(best + bonus));
  });

  const categories = builders.map(b => b.primary_category);
  const uniqueCategories = new Set(categories);
  const role_diversity_ratio = Math.min(1.0, uniqueCategories.size / Math.min(4, Math.max(1, builders.length)));
  const role_diversity_score = Math.round(role_diversity_ratio * 100);

  const total_hours = builders.reduce((acc, b) => acc + (b.availability_hours_per_week || 15), 0);
  const target_hours = builders.length * 20;
  const availability_index = Math.min(100, Math.round((total_hours / Math.max(1, target_hours)) * 100));

  const allSkills = new Set();
  builders.forEach(b => (b.skills || []).forEach(s => allSkills.add(s.toLowerCase())));

  let reqCoverage = 100;
  if (requiredSkills && requiredSkills.length > 0) {
    const matched = requiredSkills.filter(r => allSkills.has(r.toLowerCase())).length;
    reqCoverage = Math.round((matched / requiredSkills.length) * 100);
  }

  const avgRadar = Object.values(radar_scores).reduce((a, b) => a + b, 0) / 5.0;
  let overall_synergy = Math.round(
    (avgRadar * 0.45) +
    (role_diversity_score * 0.25) +
    (availability_index * 0.15) +
    (reqCoverage * 0.15)
  );
  overall_synergy = Math.max(10, Math.min(99, overall_synergy));

  const strengths = [];
  const gaps = [];

  if (radar_scores.ai_data >= 80) strengths.push('Elite AI / Machine Learning depth.');
  else if (radar_scores.ai_data < 40) gaps.push('Weak AI / ML capabilities (Score < 40).');

  if (radar_scores.design_ux >= 80) strengths.push('Exceptional UI/UX and product design polish.');
  else if (radar_scores.design_ux < 45) gaps.push('Missing dedicated UI/UX Designer (Risk of generic UI).');

  if (radar_scores.frontend >= 80 && radar_scores.backend >= 80) strengths.push('Full-stack engineering loop completely closed.');
  else if (radar_scores.frontend < 50) gaps.push('Frontend velocity risk (Needs React/WebGL specialist).');
  else if (radar_scores.backend < 50) gaps.push('Backend architecture risk (Needs API/DB dev).');

  if (radar_scores.pitch_biz >= 75) strengths.push('Winning pitch, storytelling & business narrative.');
  else if (radar_scores.pitch_biz < 40) gaps.push('Hackathon demo & pitching capability is exposed.');

  if (builders.length >= 3 && uniqueCategories.size <= 1) {
    gaps.push(`⚠️ Skill redundancy: ${builders.length} members share the same primary domain.`);
  }

  if (gaps.length === 0) {
    gaps.push('Squad has balanced coverage across all primary evaluation pillars!');
  }

  let recommendation = 'Invite a complementary specialist to fill the remaining coverage gaps.';
  if (radar_scores.design_ux < 45) {
    recommendation = 'Recruit a UI/UX Designer to dramatically boost presentation marks.';
  } else if (radar_scores.pitch_biz < 45) {
    recommendation = 'Add a Product/Pitch Lead to ensure a winning demo narrative.';
  } else if (overall_synergy >= 85) {
    recommendation = '🔥 Elite Squad Formation! This team is primed for top placement.';
  }

  return {
    overall_synergy,
    radar_scores,
    role_diversity_score,
    availability_index,
    total_committed_hours: total_hours,
    strengths,
    gaps,
    recommendation
  };
}

export const api = {
  async getBuilders(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/builders?${qs}`);
      if (res.ok) {
        const data = await res.json();
        return data.builders;
      }
    } catch (e) {
      console.warn('Backend offline, using client fallback', e);
    }
    return INITIAL_BUILDERS;
  },

  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        return data.projects;
      }
    } catch (e) {
      console.warn('Backend offline, using client fallback', e);
    }
    return INITIAL_PROJECTS;
  },

  async analyzeSynergy(builderIds, requiredSkills = []) {
    try {
      const res = await fetch(`${API_BASE}/synergy/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builder_ids: builderIds, required_skills: requiredSkills })
      });
      if (res.ok) {
        const data = await res.json();
        return data.analysis;
      }
    } catch (e) {
      console.warn('Synergy endpoint fallback to client calc', e);
    }
    const selected = INITIAL_BUILDERS.filter(b => builderIds.includes(b.id));
    return calculateSynergyClient(selected, requiredSkills);
  },

  async autoSquadMatch(payload) {
    try {
      const res = await fetch(`${API_BASE}/match/auto-squad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return data.top_squad_options;
      }
    } catch (e) {
      console.warn('Auto squad fallback', e);
    }
    // Client-side fallback combinations
    const b = INITIAL_BUILDERS;
    const squad1 = [b[0], b[1], b[2], b[3]];
    const squad2 = [b[4], b[1], b[7], b[3]];
    const squad3 = [b[5], b[2], b[4], b[3]];
    
    return [
      {
        squad_id: 'squad-9481',
        members: squad1,
        metrics: calculateSynergyClient(squad1, payload.required_skills),
        overall_synergy: 96,
        rationale: 'Perfect 4-discipline coverage: AI Systems + UI/UX Design + Cloud Backend + Pitch Strategy.'
      },
      {
        squad_id: 'squad-6219',
        members: squad2,
        metrics: calculateSynergyClient(squad2, payload.required_skills),
        overall_synergy: 92,
        rationale: 'High frontend velocity + Data Engineering backbone + Product strategy.'
      },
      {
        squad_id: 'squad-3874',
        members: squad3,
        metrics: calculateSynergyClient(squad3, payload.required_skills),
        overall_synergy: 89,
        rationale: 'Strong Computer Vision pipeline with 3D/WebGL interactive UI.'
      }
    ];
  }
};
