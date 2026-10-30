import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedeemGiftPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const s = localStorage.getItem('legend_session');
    if (!s) { navigate('/login'); return; }
    setUser(JSON.parse(s));
  }, [navigate]);

  const handleRedeem = () => {
    if (!code) { alert('Enter code'); return; }
    const valid: any = { WELCOME100: 10000, LEGEND50: 5000, BONUS2024: 20000 };
    const amount = valid[code.toUpperCase()];
    if (!amount) { alert('Invalid code'); return; }
    alert('Success! UGX ' + amount + ' added');
    setCode('');
  };

  if (!user) return <div style={{ minHeight: '100vh', background: '#121212', display: 'grid', placeItems: 'center', color: '#c9a84c' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white' }}>
      <div style={{ padding: '14px 20px', background: '#1e1e1e', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#2a2a2a', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px' }}>Back</button>
        <h1 style={{ color: '#c9a84c', fontSize: '18px', fontWeight: 700 }}>Redeem Gift Code</h1>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{ background: '#1e1e1e', borderRadius: '20px', padding: '20px', border: '1px solid #2a2a2a' }}>
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="WELCOME100" style={{ width: '100%', background: '#2a2a2a', border: 'none', padding: '16px', borderRadius: '12px', color: 'white', textTransform: 'uppercase', boxSizing: 'border-box' }} />
          <button onClick={handleRedeem} style={{ width: '100%', marginTop: '16px', background: '#e6b800', color: 'black', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 800 }}>Redeem Now</button>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '12px', marginTop: '12px' }}>Try: WELCOME100, LEGEND50, BONUS2024</p>
        </div>
      </div>
    </div>
  );
      }
