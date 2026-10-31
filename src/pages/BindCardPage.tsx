import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BindCardPage() {
  const navigate = useNavigate();
  const [bank, setBank] = useState('MTN');
  const [holderName, setHolderName] = useState('Nnnn');
  const [accountNumber, setAccountNumber] = useState('0756406186');
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = () => {
    alert(`Clicked! Saving: ${bank} ${holderName} ${accountNumber}`);
    
    try {
      const sessionStr = localStorage.getItem('legend_session');
      if (!sessionStr) { alert('No session! Please login again'); return; }
      
      const user = JSON.parse(sessionStr);
      const card = { bank, holderName, accountNumber, savedAt: new Date().toISOString() };
      
      // SAVE
      localStorage.setItem(`legend_card_${user.id}`, JSON.stringify(card));
      localStorage.setItem('legend_session', JSON.stringify({ ...user, bankCard: card }));
      
      // Update users array
      const usersStr = localStorage.getItem('legend_users');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const idx = users.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
          users[idx].bankCard = card;
          localStorage.setItem('legend_users', JSON.stringify(users));
        }
      }
      
      alert(`✅ SAVED SUCCESS!\n${bank} - ${accountNumber}\n\nNow check:\n1. Go to Mine page\n2. You should see card\n3. If not, type this in console:\nlocalStorage.getItem('legend_session')`);
      navigate('/mine');
    } catch (e) {
      alert('Error: ' + e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#1a1a1a', borderRadius: '24px 24px 0 0' }}>
            {['MTN','AIRTEL'].map(b => (
              <button key={b} onClick={() => { setBank(b); setShowPicker(false); }} style={{ width: '100%', padding: 20, background: 'none', border: 'none', borderBottom: '1px solid #222', color: 'white', fontSize: 16, textAlign: 'left' }}>{b} {bank === b ? '✓' : ''}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px', background: '#111', display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: 10, background: '#1e1e1e', border: 'none', color: 'white' }}>‹</button>
        <h1 style={{ fontWeight: 700 }}>Bind Bank Card</h1>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>* Select Bank</label>
            <button onClick={() => setShowPicker(true)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: '#1e1e1e', border: '1px solid #333', color: 'white' }}>
              <span>{bank}</span><span>▼</span>
            </button>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>* Account Holder Name</label>
            <input value={holderName} onChange={e => setHolderName(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, background: '#1e1e1e', border: '1px solid #333', color: 'white', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>* Bank Account</label>
            <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, background: '#1e1e1e', border: '1px solid #333', color: 'white', outline: 'none' }} />
          </div>
          <button onClick={handleConfirm} style={{ width: '100%', background: '#e6b800', color: 'black', border: 'none', padding: 16, borderRadius: 12, fontWeight: 900, fontSize: 18 }}>Confirm</button>
          
          <button onClick={() => {
            const s = localStorage.getItem('legend_session');
            alert(s ? s.slice(0,300) : 'No session');
          }} style={{ width: '100%', marginTop: 10, background: '#222', color: '#888', border: 'none', padding: 12, borderRadius: 10, fontSize: 12 }}>DEBUG: Show Session</button>
        </div>
      </div>
    </div>
  );
      }
