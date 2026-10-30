import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  useEffect(() => {
    try {
      const s = localStorage.getItem('legend_session');
      if (!s) { navigate('/login'); return; }
      setUser(JSON.parse(s));
    } catch { navigate('/login'); }
  }, [navigate]);

  const handleSave = () => {
    if (newPass.length < 6) { alert('Min 6 chars'); return; }
    if (newPass !== confirmPass) { alert('No match'); return; }
    const updated = { ...user, password: newPass };
    localStorage.setItem('legend_session', JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
    const i = users.findIndex((u: any) => u.id === user.id);
    if (i >= 0) { users[i] = updated; localStorage.setItem('legend_users', JSON.stringify(users)); }
    alert('Password Saved!'); setNewPass(''); setConfirmPass('');
  };

  if (!user) return <div style={{ minHeight: '100vh', background: '#121212', display: 'grid', placeItems: 'center', color: '#c9a84c' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', paddingBottom: '90px' }}>
      <div style={{ padding: '14px 20px', background: '#1e1e1e', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2a2a' }}>
        <span style={{ color: '#c9a84c', fontWeight: 700 }}>Legend Investors</span>
        <button onClick={() => { localStorage.removeItem('legend_session'); navigate('/login'); }} style={{ background: '#2a2a2a', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '10px' }}>Sign out</button>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '10px 0 16px' }}>Profile & security</h2>

        <div style={{ background: '#1e1e1e', borderRadius: '24px', padding: '20px', border: '1px solid #2a2a2a', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '14px' }}>Personal summary</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Verified email</p><p style={{ fontWeight: 600, marginBottom: '14px' }}>{user.email}</p>
          <p style={{ color: '#888', fontSize: '14px' }}>Phone number</p><p style={{ fontWeight: 700, marginBottom: '14px' }}>{user.phone || '+256746085840'}</p>
          <p style={{ color: '#888', fontSize: '14px' }}>Joined</p><p style={{ fontWeight: 600, marginBottom: '14px' }}>{new Date(user.createdAt || Date.now()).toLocaleString()}</p>
          <p style={{ color: '#888', fontSize: '14px' }}>Total approved deposits</p><p style={{ fontWeight: 800, marginBottom: '14px' }}>UGX 0</p>
          <p style={{ color: '#888', fontSize: '14px' }}>Total approved withdrawals</p><p style={{ fontWeight: 800, marginBottom: '14px' }}>UGX 0</p>
          <p style={{ color: '#888', fontSize: '14px' }}>Active products</p><p style={{ fontWeight: 800, marginBottom: '14px' }}>0</p>
          <p style={{ color: '#888', fontSize: '14px' }}>Total referral earnings</p><p style={{ fontWeight: 800 }}>UGX 0</p>
        </div>

        <div style={{ background: '#1e1e1e', borderRadius: '24px', padding: '20px', border: '1px solid #2a2a2a', marginBottom: '16px' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>New password</p>
          <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} style={{ width: '100%', background: '#2a2a2a', border: 'none', borderRadius: '12px', padding: '14px', color: 'white', boxSizing: 'border-box' }} />
          <p style={{ fontWeight: 600, margin: '14px 0 8px' }}>Confirm new password</p>
          <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} style={{ width: '100%', background: '#2a2a2a', border: 'none', borderRadius: '12px', padding: '14px', color: 'white', boxSizing: 'border-box' }} />
          <button onClick={handleSave} style={{ marginTop: '14px', background: '#e6b800', color: 'black', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700 }}>Save password</button>
        </div>

        <div style={{ background: '#1e1e1e', borderRadius: '24px', padding: '20px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ fontWeight: 700 }}>Income credited · last 7 days</h3>
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', alignItems: 'end', height: '80px' }}>
            {['Sat','Sun','Mon','Tue','Wed','Thu','Fri'].map(d => (
              <div key={d} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '20px', background: '#c9a84c', borderRadius: '4px 4px 0 0', opacity: 0.3 }}></div>
                <span style={{ fontSize: '11px', color: '#888' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
      }
