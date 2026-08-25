import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import TeammateDiscoveryView from './components/TeammateDiscoveryView';
import MyProfileSkillsView from './components/MyProfileSkillsView';
import SynergyLab from './components/SynergyLab';
import ProjectHub from './components/ProjectHub';
import TeamManifestModal from './components/TeamManifestModal';
import LoginModal from './components/LoginModal';
import CandidateRegistrationModal from './components/CandidateRegistrationModal';
import CollaborationEmailModal from './components/CollaborationEmailModal';
import NeuralBackground from './components/NeuralBackground';
import { api } from './services/api';
import { INITIAL_BUILDERS, INITIAL_PROJECTS } from './data/mockData';
import { CANDIDATES } from './data/candidatesData';
import { sound } from './utils/sound';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [allBuilders, setAllBuilders] = useState(INITIAL_BUILDERS);
  const [candidatesList, setCandidatesList] = useState(CANDIDATES);
  const [allProjects, setAllProjects] = useState(INITIAL_PROJECTS);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  
  const [emailCandidate, setEmailCandidate] = useState(null);

  const [activeSquad, setActiveSquad] = useState([
    INITIAL_BUILDERS[0],
    INITIAL_BUILDERS[1],
    INITIAL_BUILDERS[2],
  ]);

  const [synergyAnalysis, setSynergyAnalysis] = useState(null);
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function updateSynergy() {
      const builderIds = activeSquad.map(b => b.id);
      const analysis = await api.analyzeSynergy(builderIds);
      setSynergyAnalysis(analysis);
    }
    updateSynergy();
  }, [activeSquad]);

  const handleAutoFillBestSquad = () => {
    const bestCombo = [
      INITIAL_BUILDERS[0],
      INITIAL_BUILDERS[1],
      INITIAL_BUILDERS[2],
      INITIAL_BUILDERS[3],
    ];
    setActiveSquad(bestCombo);
    showToast('Optimal 96% coverage team allocated.');
  };

  const handleLogin = (userProfile) => {
    setCurrentUser(userProfile);
    showToast(`Welcome, ${userProfile.name}! Profile active.`);
  };

  const handleLogout = () => {
    sound.playClick();
    setCurrentUser(null);
    if (activeTab === 'my-profile') {
      setActiveTab('landing');
    }
    showToast('You have successfully logged out.');
  };

  const handleRegisterCandidate = (newCandidate) => {
    setCandidatesList([newCandidate, ...candidatesList]);
    
    const newBuilder = {
      id: newCandidate.id,
      name: newCandidate.name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role_title: newCandidate.role,
      primary_category: newCandidate.skills[0]?.name.includes('Python') ? 'AI / ML' : 'Backend',
      bio: newCandidate.bio,
      skills: newCandidate.skills.map(s => s.name),
      skill_scores: { frontend: 70, backend: 80, ai_data: 85, design_ux: 60, pitch_biz: 65 },
      experience_years: newCandidate.experience_years,
      experience_level: newCandidate.experience_level,
      availability_hours_per_week: newCandidate.availability_hours,
      timezone: newCandidate.timezone,
      interests: ['Startups', 'Hackathons'],
      hackathons_won: newCandidate.hackathons_won,
      open_for_teams: true
    };
    setAllBuilders([newBuilder, ...allBuilders]);
    
    showToast(`✨ ${newCandidate.name} added to the candidate pool! Team leads can now discover and email you.`);
  };

  const handleOpenEmailModal = (candidate) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setEmailCandidate(candidate);
  };

  const handleEmailSent = (candidate, receipt) => {
    showToast(`✉️ Invitation email dispatched to ${candidate.name}!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <NeuralBackground />

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          background: '#121424',
          border: toast.type === 'error' ? '1px solid #ef4444' : '1px solid #8b5cf6',
          padding: '0.75rem 1.15rem',
          borderRadius: '0.45rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          {toast.type === 'error' ? (
            <AlertCircle size={16} color="#ef4444" />
          ) : (
            <CheckCircle2 size={16} color="#8b5cf6" />
          )}
          {toast.message}
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setIsCandidateModalOpen(true)}
            onExploreTeammates={() => setActiveTab('discover')}
            onOpenSignIn={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'discover' && (
          <TeammateDiscoveryView
            candidatesList={candidatesList}
            onShowToast={showToast}
            activeSquad={activeSquad}
            setActiveSquad={setActiveSquad}
            currentUser={currentUser}
            onRequireAuth={() => setIsLoginModalOpen(true)}
            onOpenCandidateRegistration={() => setIsCandidateModalOpen(true)}
            onOpenEmailInvite={handleOpenEmailModal}
          />
        )}

        {activeTab === 'my-profile' && (
          <MyProfileSkillsView
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            allProjects={allProjects}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'synergy' && (
          <SynergyLab
            activeSquad={activeSquad}
            setActiveSquad={setActiveSquad}
            allBuilders={allBuilders}
            synergyAnalysis={synergyAnalysis}
            onAutoFillBestSquad={handleAutoFillBestSquad}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectHub
            allProjects={allProjects}
            allBuilders={allBuilders}
            onShowToast={showToast}
            currentUser={currentUser}
            onRequireAuth={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'rgba(10, 11, 20, 0.95)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>Equipo</span>
            <span>—</span>
            <span>Autonomous Skill Matching & Project Synergy Platform</span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Connected Collaboration Network for Builders & Researchers
          </div>
        </div>
      </footer>

      <TeamManifestModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        activeSquad={activeSquad}
        synergyAnalysis={synergyAnalysis}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <CandidateRegistrationModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        onRegisterCandidate={handleRegisterCandidate}
      />

      <CollaborationEmailModal
        isOpen={Boolean(emailCandidate)}
        onClose={() => setEmailCandidate(null)}
        recipientCandidate={emailCandidate}
        currentUser={currentUser}
        onEmailSent={handleEmailSent}
      />

    </div>
  );
}