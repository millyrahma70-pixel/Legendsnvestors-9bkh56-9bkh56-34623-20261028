import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  
  const session = localStorage.getItem('legend_session');
  const user = session ? JSON.parse(session) : null;
  const bankCard = user ? JSON.parse(localStorage.getItem(`legend_card_${user.id}`) || 'null') : null;
  
  if (!user) { navigate('/login'); return null; }

  const MIN_WITHDRAW = 9000;
  const FEE_RATE = 0.16;
  const numAmount = parseInt(amount) || 0;
  const fee = Math.floor(numAmount * FEE_RATE);
  const received = numAmount - fee;

  const handleWithdraw = () => {
    if (!bankCard) { alert('Please bind bank card first'); navigate('/bind-card'); return; }
    if (numAmount < MIN_WITHDRAW) { alert(`Minimum is UGX ${MIN_WITHDRAW.toLocaleString()}`); return; }
    if (numAmount > user.balance) { alert('Insufficient balance'); return; }
    
    const order = {
      id: 'W' + Date.now(),
      userId: user.id,
      amount: numAmount,
      fee,
      receivedAmount: received,
      status: 'pending',
      bankCard,
      createdAt: new Date().toISOString()
    };
    
    const orders = JSON.parse(localStorage.getItem(`legend_withdraw_${user.id}`) || '[]');
    orders.unshift(order);
    localStorage.setItem(`legend_withdraw_${user.id}`, JSON.stringify(orders));
    
    // Deduct balance
    const newBal = user.balance - numAmount;
    const updated = { ...user, balance: newBal };
    localStorage.setItem('legend_session', JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx >= 0) { users[idx].balance = newBal; localStorage.setItem('legend_users', JSON.stringify(users)); }
    
    alert('Withdrawal submitted! 4-24 hours');
    navigate('/withdraw-status');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      <div style={{ padding: '14px 16px', background: '#111', borderBottom: '1px solid #222', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: 10, background: '#1e1e1e', border: 'none', color: 'white' }}>‹</button>
        <h1 style={{ flex: 1, fontWeight: 700 }}>Withdrawal</h1>
        <button onClick={() => navigate('/withdraw-status')} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid #c9a84c44', color: '#c9a84c', padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>History</button>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, padding: 20 }}>
          <p style={{ color: '#888', fontSize: 13 }}>Current balance</p>
          <p style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>UGX {user.balance?.toLocaleString() || 0}</p>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Bank card</p>
            <button onClick={() => navigate('/bind-card')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: '#1e1e1e', border: '1px solid #333', borderRadius: 12, padding: '12px 16px', color: bankCard ? '#ddd' : '#666' }}>
              <span>{bankCard ? `${bankCard.bank} - ${bankCard.accountNumber}` : '______ - ____________'}</span>
              <span>›</span>
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Withdrawal amount</p>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1e1e1e', border: '1px solid #333', borderRadius: 12, padding: '12px 16px' }}>
              <span style={{ color: '#c9a84c', fontWeight: 700, marginRight: 8 }}>UGX</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginTop: 8 }}>
              <span>Received: <b style={{ color: 'white' }}>UGX {received > 0 ? received.toLocaleString() : 0}</b></span>
              <span>Fee: <b style={{ color: 'white' }}>16%</b></span>
            </div>
          </div>

          <button onClick={handleWithdraw} style={{ width: '100%', marginTop: 20, background: 'linear-gradient(135deg, #c9a84c, #f0c040)', color: 'black', border: 'none', padding: 16, borderRadius: 12, fontWeight: 900, fontSize: 16 }}>Confirm</button>
        </div>

        <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, padding: 16, marginTop: 12, fontSize: 12, color: '#666', lineHeight: '18px' }}>
          <p>1. Minimum is <b style={{ color: '#c9a84c' }}>UGX 50,000</b></p>
          <p>2. Fee is 16% of amount</p>
          <p>3. Funds arrive in 4-24 hours</p>
          <p>4. Need active product to withdraw</p>
        </div>
      </div>
    </div>
  );
                   }
