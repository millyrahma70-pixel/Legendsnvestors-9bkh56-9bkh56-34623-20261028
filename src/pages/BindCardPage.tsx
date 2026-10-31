import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BindCardPage() {
  const navigate = useNavigate();
  
  const sessionStr = localStorage.getItem('legend_session');
  const parsed = sessionStr ? JSON.parse(sessionStr) : null;
  const existing = parsed?.bankCard || null;

  const [bank, setBank] = useState(existing?.bank || 'MTN');
  const [holderName, setHolderName] = useState(existing?.holderName || parsed?.user?.user_metadata?.full_name || 'John');
  const [accountNumber, setAccountNumber] = useState(existing?.accountNumber || '07xxxxxxx');
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = () => {
    try {
      const sStr = localStorage.getItem('legend_session');
      if (!sStr) { alert('No session, login again'); navigate('/login'); return; }
      
      const session = JSON.parse(sStr);
      
      const card = { bank, holderName: holderName.trim(), accountNumber: accountNumber.trim(), savedAt: new Date().toISOString() };
      
      // Save correctly in your structure: {user, access_token, bankCard}
      const newSession = { ...session, bankCard: card };
      localStorage.setItem('legend_session', JSON.stringify(newSession));
      
      // Also save backup key for WithdrawPage
      const uid = session.user?.email || session.user?.phone || 'default';
      localStorage.setItem(`legend_card_${uid}`, JSON.stringify(card));
      
      alert(`✅ SAVED!\n${bank} - ${accountNumber}\n\nGo to Mine, you will see it now!`);
      navigate('/mine');
    } catch (e: any) {
      alert('Save error: ' + e.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      {showPicker && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#1a1a1a', borderRadius: '24px 24px 0 0', border: '1px solid #222' }}>
            {['MTN','AIRTEL'].map(b => (
              <button key={b} onClick={() => { setBank(b); setShowPicker(false); }} style={{ width: '100%', padding: 20, background: 'none', border: 'none', borderBottom: '1px solid #222', color: 'white', fontSize: 16, textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <span>{b}</span><span>{bank === b ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px', background: '#111', display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid #222' }}>
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
          <button onClick={handleConfirm} style={{ width: '100%', background: 'linear-gradient(135deg, #c9a84c, #f0c040)', color: 'black', border: 'none', padding: 16, borderRadius: 12, fontWeight: 900, fontSize: 16 }}>Confirm & Save</button>
        </div>

        <div style={{ marginTop: 12, background: '#111', borderRadius: 12, padding: 12, fontSize: 12, color: '#666' }}>
          Current: {existing ? `${existing.bank} - ${existing.accountNumber}` : 'No card yet'}
        </div>
      </div>
    </div>
  );
}
