import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BindCardPage() {
  const navigate = useNavigate();
  const session = localStorage.getItem('legend_session');
  const user = session ? JSON.parse(session) : null;
  
  const existingCard = user ? JSON.parse(localStorage.getItem(`legend_card_${user.id}`) || 'null') : null;
  
  const [bank, setBank] = useState(existingCard?.bank || '');
  const [holderName, setHolderName] = useState(existingCard?.holderName || user?.phone || '');
  const [accountNumber, setAccountNumber] = useState(existingCard?.accountNumber || '');
  const [showPicker, setShowPicker] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const handleConfirm = () => {
    if (!bank) { alert('Select bank'); return; }
    if (!holderName.trim()) { alert('Enter holder name'); return; }
    if (!accountNumber.trim()) { alert('Enter account number'); return; }
    
    const card = { bank, holderName: holderName.trim(), accountNumber: accountNumber.trim() };
    localStorage.setItem(`legend_card_${user.id}`, JSON.stringify(card));
    
    // Also update session
    const updated = { ...user, bankCard: card };
    localStorage.setItem('legend_session', JSON.stringify(updated));
    
    const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx >= 0) { users[idx].bankCard = card; localStorage.setItem('legend_users', JSON.stringify(users)); }
    
    alert('Bank card bound!');
    navigate('/mine');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#1a1a1a', borderRadius: '24px 24px 0 0', border: '1px solid #222' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #222' }}>
              <button onClick={() => setShowPicker(false)} style={{ color: '#888', background: 'none', border: 'none' }}>Cancel</button>
              <b>Select Bank</b>
              <button onClick={() => setShowPicker(false)} style={{ color: '#c9a84c', fontWeight: 700, background: 'none', border: 'none' }}>Confirm</button>
            </div>
            {['MTN', 'AIRTEL'].map(b => (
              <button key={b} onClick={() => { setBank(b); setShowPicker(false); }} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '1px solid #222', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <span>{b}</span>
                {bank === b && <span style={{ color: '#c9a84c' }}>✓</span>}
              </button>
            ))}
            <div style={{ height: 24 }}></div>
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px', background: '#111', borderBottom: '1px solid #222', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: 10, background: '#1e1e1e', border: 'none', color: 'white' }}>‹</button>
        <h1 style={{ fontWeight: 700 }}>Bind Bank Card</h1>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>* Select Bank</label>
            <button onClick={() => setShowPicker(true)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: '#1e1e1e', border: '1px solid #333', color: bank ? 'white' : '#666' }}>
              <span>{bank || 'Please select'}</span>
              <span>▼</span>
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>* Account Holder Name</label>
            <input value={holderName} onChange={e => setHolderName(e.target.value)} placeholder="User name" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, background: '#1e1e1e', border: '1px solid #333', color: 'white', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#c9a84c', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>* Bank Account</label>
            <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter MTN or Airtel number" style={{ width: '100%', padding: '14px 16px', borderRadius: 12, background: '#1e1e1e', border: '1px solid #333', color: 'white', outline: 'none' }} />
          </div>

          <button onClick={handleConfirm} style={{ width: '100%', background: 'linear-gradient(135deg, #c9a84c, #f0c040)', color: 'black', border: 'none', padding: 16, borderRadius: 12, fontWeight: 900 }}>Confirm</button>
        </div>

        <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, padding: 16, marginTop: 12, fontSize: 12, color: '#666' }}>
          Please enter your actual MTN or Airtel Money account. Wrong info = failed withdrawal.
        </div>
      </div>
    </div>
  );
                                                                                            }
