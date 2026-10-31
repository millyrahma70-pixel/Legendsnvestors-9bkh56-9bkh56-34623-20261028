import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawPage() {
  const nav = useNavigate();
  const [bal, setBal] = useState(9000);
  const [amt, setAmt] = useState('');
  const [card, setCard] = useState<any>(null);
  const [hasProd, setHasProd] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('legend_session');
    if (!s) return;
    const j = JSON.parse(s);
    const b = j.user?.user_metadata?.bonus || j.balance || 9000;
    setBal(j.balance || b);
    setCard(j.bankCard || null);
    const uid = j.user?.email || 'default';
    const p = JSON.parse(localStorage.getItem(`legend_products_${uid}`) || '[]');
    const all = JSON.parse(localStorage.getItem('legend_all_purchases') || '[]');
    const mine = all.filter((x: any) => x.userId === uid);
    setHasProd(p.length > 0 || mine.length > 0);
  }, []);

  const MIN = 9000;
  const n = parseInt(amt) || 0;
  const fee = Math.floor(n * 0.16);
  const recv = n - fee;

  const submit = () => {
    if (!hasProd) {
      alert('Buy a product first to unlock withdrawal');
      nav('/product');
      return;
    }
    if (!card) {
      alert('Bind card first');
      nav('/bind-card');
      return;
    }
    if (n < MIN) {
      alert(`Min is ${MIN}`);
      return;
    }
    if (n > bal) {
      alert('Low balance');
      return;
    }
    const s = localStorage.getItem('legend_session');
    const j = JSON.parse(s!);
    const uid = j.user?.email || 'default';
    const order = {
      id: 'W' + Date.now(),
      amount: n,
      fee,
      recv,
      status: 'pending',
      card,
      createdAt: new Date().toISOString(),
    };
    const list = JSON.parse(localStorage.getItem(`legend_withdraw_${uid}`) || '[]');
    list.unshift(order);
    localStorage.setItem(`legend_withdraw_${uid}`, JSON.stringify(list));
    j.balance = bal - n;
    if (j.user?.user_metadata) j.user.user_metadata.bonus = Math.max(0, (j.user.user_metadata.bonus || 9000) - n);
    localStorage.setItem('legend_session', JSON.stringify(j));
    alert(`Success! You receive UGX ${recv} in 1-24h to ${card.bank}`);
    nav('/withdraw-status');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => nav(-1)} style={{ width: 32, height: 32, borderRadius: 8, background: '#222', border: 'none', color: '#fff' }}>‹</button>
        <h1>Withdrawal</h1>
      </div>
      <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 16, padding: 20 }}>
        <p style={{ color: '#888', fontSize: 13 }}>Balance</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#c9a84c' }}>UGX {bal.toLocaleString()}</p>
        {!hasProd && (
          <div style={{ marginTop: 12, background: '#331111', padding: 12, borderRadius: 10 }}>
            <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 700 }}>🔒 Locked - Buy product first</p>
            <button onClick={() => nav('/product')} style={{ marginTop: 8, background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>Buy Product</button>
          </div>
        )}
        {hasProd && <p style={{ color: '#22c55e', fontSize: 11, marginTop: 8 }}>✓ Product active - Unlocked</p>}
        <p style={{ marginTop: 16, color: '#888', fontSize: 12 }}>Bank Card</p>
        <button onClick={() => nav('/bind-card')} style={{ width: '100%', marginTop: 6, padding: 12, borderRadius: 10, background: '#1e1e1e', border: '1px solid #333', color: card ? '#fff' : '#666', textAlign: 'left' }}>
          {card ? `${card.bank} - ${card.accountNumber}` : 'Bind card'}
        </button>
        <p style={{ marginTop: 16, color: '#888', fontSize: 12 }}>Amount (Min 9000)</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 6, background: '#1e1e1e', border: '1px solid #333', borderRadius: 10, padding: 12 }}>
          <span style={{ color: '#c9a84c', fontWeight: 700 }}>UGX</span>
          <input value={amt} onChange={e => setAmt(e.target.value)} type="number" placeholder="9000" disabled={!hasProd} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff' }} />
        </div>
        <p style={{ fontSize: 11, color: '#666', marginTop: 8 }}>Receive: UGX {recv > 0 ? recv.toLocaleString() : 0} | Fee 16% | Arrives 1-24h</p>
        <button onClick={submit} style={{ width: '100%', marginTop: 16, padding: 14, borderRadius: 10, border: 'none', fontWeight: 800, background: hasProd ? '#c9a84c' : '#333', color: hasProd ? '#000' : '#666' }}>
          {hasProd ? 'Confirm - 1-24h' : '🔒 Buy Product First'}
        </button>
      </div>
    </div>
  );
                                                                         }
