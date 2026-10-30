import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function InvitePage() {
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const WHATSAPP = "966557067827"; // change to your number

  useEffect(() => {
    try {
      const s = localStorage.getItem('legend_session');
      if (s) setUser(JSON.parse(s));
    } catch {}
  }, []);

  const inviteCode = user?.id ? `LEGEND-${user.id.slice(0,6).toUpperCase()}` : 'LEGEND-XXXX';
  const inviteLink = `${window.location.origin}/#/register?ref=${inviteCode}`;
  const shareText = `Join Legend Investors with my code ${inviteCode}: ${inviteLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', paddingBottom: '80px' }}>
      <div style={{ padding: '14px 20px', background: '#1e1e1e', borderBottom: '1px solid #2a2a2a' }}>
        <h1 style={{ color: '#c9a84c', fontWeight: 700, fontSize: '20px' }}>Legend Investors</h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '10px 0 16px 4px' }}>Invite Friends</h2>

        <div style={{ background: '#1e1e1e', borderRadius: '24px', padding: '20px', border: '1px solid #2a2a2a', marginBottom: '16px' }}>
          <p style={{ color: '#9a9a9a', fontSize: '14px', marginBottom: '8px' }}>Your invite code</p>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#c9a84c', letterSpacing: '1px' }}>{inviteCode}</p>
          
          <div style={{ marginTop: '16px', background: '#2a2a2a', borderRadius: '12px', padding: '12px', wordBreak: 'break-all', fontSize: '13px', color: '#aaa' }}>
            {inviteLink}
          </div>

          <button onClick={handleCopy} style={{ width: '100%', marginTop: '16px', background: '#e6b800', color: 'black', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '15px' }}>
            {copied ? 'Copied!' : 'Copy Invite Link'}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
            <a href={'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(shareText)} target="_blank" rel="noreferrer" style={{ textAlign: 'center', background: '#25D366', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              WhatsApp
            </a>
            <Link to="/team" style={{ textAlign: 'center', background: '#2a2a2a', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              My Team
            </Link>
          </div>
        </div>

        <div style={{ background: '#1e1e1e', borderRadius: '24px', padding: '20px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>How it works</h3>
          <p style={{ color: '#9a9a9a', fontSize: '14px', lineHeight: '20px' }}>
            Share your link. When friends recharge, you get L1 15%, L2 5%, L3 2% commission instantly.
          </p>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1e1e1e', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-around', padding: '8px 0 14px' }}>
        <Link to="/home" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>⌂</div><div style={{ fontSize: '12px' }}>Home</div></Link>
        <Link to="/products" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>◫</div><div style={{ fontSize: '12px' }}>Products</div></Link>
        <Link to="/team" style={{ textAlign: 'center', textDecoration: 'none', color: '#c9a84c', flex: 1 }}><div>👥</div><div style={{ fontSize: '12px', fontWeight: 700 }}>Team</div></Link>
        <Link to="/mine" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>👤</div><div style={{ fontSize: '12px' }}>Account</div></Link>
      </div>
    </div>
  );
                     }
