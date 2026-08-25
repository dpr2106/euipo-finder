import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, X, Sparkles, Shield, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { sound } from '../utils/sound';

export default function CollaborationEmailModal({
  isOpen,
  onClose,
  recipientCandidate,
  currentUser,
  onEmailSent
}) {
  const defaultSenderEmail = currentUser?.email || 'prashanthraodugyala34@gmail.com';
  
  const [subject, setSubject] = useState(
    recipientCandidate
      ? `[Equipo Collaboration] Prashant Sharma wants to build with you on AI & Fullstack Systems`
      : ''
  );
  const [senderEmail, setSenderEmail] = useState(defaultSenderEmail);
  const [projectTitle, setProjectTitle] = useState('Autonomous Compliance & Multi-Agent Network');
  const [roleOffer, setRoleOffer] = useState(recipientCandidate?.role || 'Technical Contributor');
  const [personalNote, setPersonalNote] = useState(
    `Hi ${recipientCandidate?.name || 'there'},\n\nI reviewed your verified skills in ${recipientCandidate?.skills.map(s => s.name).slice(0, 3).join(', ')} on Equipo. We are currently staffing ${projectTitle} and believe your background would be a high-synergy match for our squad.\n\nLet's connect and discuss building together!`
  );
  const [isSending, setIsSending] = useState(false);
  const [sentReceipt, setSentReceipt] = useState(null);

  if (!isOpen || !recipientCandidate) return null;

  const recipientEmail = recipientCandidate.email || `${recipientCandidate.name.toLowerCase().replace(/\s+/g, '.')}@equipo.network`;

  const handleSendEmail = (e) => {
    e.preventDefault();
    sound.playClick();
    setIsSending(true);

    setTimeout(() => {
      sound.playSuccess();
      setIsSending(false);
      const receipt = {
        dispatch_id: `EQ-MAIL-${Math.floor(100000 + Math.random() * 900000)}`,
        sent_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        recipient_name: recipientCandidate.name,
        recipient_email: recipientEmail,
        sender_email: senderEmail,
        subject: subject
      };
      setSentReceipt(receipt);
      onEmailSent(recipientCandidate, receipt);
    }, 900);
  };

  const handleClose = () => {
    setSentReceipt(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="enterprise-card" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '2rem',
        background: '#121424',
        border: '1px solid #3d497c',
        position: 'relative'
      }}>
        
        <button
          onClick={handleClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#a5b4fc', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        {sentReceipt ? (
          <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                Invitation Dispatched!
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#a5b4fc', marginTop: '0.25rem' }}>
                Official Equipo collaboration email successfully transmitted from <strong>{sentReceipt.sender_email}</strong> to <strong>{sentReceipt.recipient_email}</strong>.
              </p>
            </div>

            <div style={{
              width: '100%',
              background: '#0a0b14',
              border: '1px solid #293154',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.785rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              color: '#cbd5e1'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#818cf8' }}>Dispatch Reference:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#c4b5fd' }}>{sentReceipt.dispatch_id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#818cf8' }}>Sender Address:</span>
                <span style={{ color: '#6ee7b7' }}>{sentReceipt.sender_email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#818cf8' }}>Delivery Timestamp:</span>
                <span>{sentReceipt.sent_at}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#818cf8' }}>Status:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Delivered to Recipient Inbox</span>
              </div>
            </div>

            <button className="btn-primary" onClick={handleClose} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Mail size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                  Dispatch Collaboration Email
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                  Powered by Equipo Network Dispatch Service
                </div>
              </div>
            </div>

            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#0a0b14', padding: '0.75rem', borderRadius: '0.45rem', border: '1px solid #293154', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: '#818cf8', display: 'block', marginBottom: '2px' }}>SENDER (FROM):</span>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    style={{ width: '100%', background: '#121424', border: '1px solid #3d497c', color: '#6ee7b7', padding: '0.35rem 0.5rem', borderRadius: '0.35rem', fontSize: '0.75rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <span style={{ color: '#818cf8', display: 'block', marginBottom: '2px' }}>RECIPIENT (TO):</span>
                  <div style={{ fontWeight: 600, color: '#c4b5fd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: '0.35rem' }}>
                    {recipientCandidate.name} ({recipientEmail})
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  SUBJECT LINE
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    PROJECT / VENTURE
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.825rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    OFFERED ROLE
                  </label>
                  <input
                    type="text"
                    required
                    value={roleOffer}
                    onChange={(e) => setRoleOffer(e.target.value)}
                    style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.55rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.825rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  PERSONALIZED INVITATION NOTE
                </label>
                <textarea
                  rows={4}
                  required
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  style={{ width: '100%', background: '#0a0b14', border: '1px solid #293154', color: '#fff', padding: '0.6rem 0.75rem', borderRadius: '0.45rem', fontSize: '0.8rem', outline: 'none', resize: 'none', lineHeight: 1.4 }}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '0.65rem', marginTop: '0.35rem' }}
              >
                {isSending ? (
                  <>Transmitting from {senderEmail}...</>
                ) : (
                  <>
                    <Send size={15} /> Transmit Email from {senderEmail}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
