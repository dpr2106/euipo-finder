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
import { CheckCircle2, AlertCircle, ShieldAlert, Lock, Mail, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [allBuilders, setAllBuilders] = useState(INITIAL_BUILDERS);
  const [candidatesList, setCandidatesList] = useState(CANDIDATES);
  const [allProjects, setAllProjects] = useState(INITIAL_PROJECTS);

  const [currentUser, setCurrentUser] = useState(null);
  const [pendingVerificationUser, setPendingVerificationUser] = useState(null);
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

  // CHECK URL FOR INCOMING EMAIL VERIFICATION LINK (e.g. ?verify_token=xxx&email=xxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify_token');
    const verifiedEmail = params.get('email');

    if (token && verifiedEmail) {
      sound.playSuccess();
      const usernameHandle = verifiedEmail.split('@')[0];
      const verifiedProfile = {
        id: `user_verified_${Date.now()}`,
        username: usernameHandle,
        name: usernameHandle.charAt(0).toUpperCase() + usernameHandle.slice(1),
        email: verifiedEmail,
        is_email_verified: true,
        auth_provider: 'email_verified',
        role_title: 'Verified Builder',
        primary_category: 'AI / ML',
        avatar_initials: usernameHandle.substring(0, 2).toUpperCase(),
        location: 'India',
        experience_years: 1,
        experience_level: 'Verified Member',
        availability_hours_per_week: 20,
        skills: [],
        interests: ['Startups', 'Research'],
        bio: `Verified member @${usernameHandle} on Equipo.`,
        hackathons_won: 0,
        timezone: 'IST (UTC+5:30)'
      };

      setCurrentUser(verifiedProfile);
      setPendingVerificationUser(null);
      setActiveTab('discovery');
      showToast(`🎉 Email ${verifiedEmail} verified! Full platform access unlocked.`);

      // Clean URL query params without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
    if (userProfile.is_email_verified) {
      setCurrentUser(userProfile);
      setPendingVerificationUser(null);
      setActiveTab('discovery');
      showToast(`Welcome @${userProfile.username || userProfile.name}! Verified access active.`);
    } else {
      // Pending email verification
      setPendingVerificationUser(userProfile);
      showToast(`Verification email dispatched to ${userProfile.email}. Confirm email to unlock features.`);
    }
  };

  const handleLogout = () => {
    sound.playClick();
    setCurrentUser(null);
    setPendingVerificationUser(null);
    setActiveTab('landing');
    showToast('You have successfully logged out.');
  };

  const handleRegisterCandidate = (newCandidate) => {
    setCandidatesList([newCandidate, ...candidatesList]);
    showToast(`${newCandidate.name} added to candidate pool!`);
  };

  const handleOpenEmailModal = (candidate) => {
    if (!currentUser || !currentUser.is_email_verified) {
      setIsLoginModalOpen(true);
      return;
    }
    setEmailCandidate(candidate);
  };

  const handleEmailSent = (candidate, receipt) => {
    showToast(`Invitation email dispatched to ${candidate.name}!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      <NeuralBackground />

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
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

      {/* PENDING EMAIL VERIFICATION ALERT BAR (Locks workspace until verified) */}
      {pendingVerificationUser && !currentUser && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(139, 92, 246, 0.2))',
          borderBottom: '1px solid #ef4444',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 400
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Mail size={18} color="#ef4444" />
            <span style={{ fontSize: '0.85rem', color: '#fecaca', fontWeight: 600 }}>
              Access Locked: Verification email dispatched to <strong style={{ color: '#ffffff' }}>{pendingVerificationUser.email}</strong>.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a
              href={`/?verify_token=demo_token_${Date.now()}&email=${pendingVerificationUser.email}`}
              className="btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#10b981', borderColor: '#34d399', textDecoration: 'none' }}
            >
              Verify Email Link
            </a>
          </div>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenManifest={() => setIsManifestOpen(true)}
        onOpenCandidateRegistration={() => setIsCandidateModalOpen(true)}
        onOpenLanding={() => setActiveTab('landing')}
      />

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {activeTab === 'landing' && (
          <LandingPage
            currentUser={currentUser}
            onGetStarted={() => {
              if (currentUser) {
                setActiveTab('discovery');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            onExploreAsGuest={() => setActiveTab('discovery')}
            onOpenSignIn={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'discovery' && (
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

        {activeTab === 'analytics' && (
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

        {activeTab === 'profile' && (
          <MyProfileSkillsView
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            allProjects={allProjects}
            onShowToast={showToast}
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
            <span>•</span>
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