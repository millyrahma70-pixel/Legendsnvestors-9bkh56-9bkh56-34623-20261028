import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [card, setCard] = useState<any>(null);
  const [hasProduct, setHasProduct] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const sStr = localStorage.getItem('legend_session');
    if (!sStr) { navigate('/login'); return; }
    const session = JSON.parse(sStr);
    
    // BALANCE = bonus 9000 + earnings
    const bonus = session.user?.user_metadata?.bonus || 9000;
    let bal = session.balance ?? bonus;
    if (bal === 0 && bonus) bal = bonus;
    
    // Save back
    session.balance = bal;
    localStorage.setItem('legend_session', JSON.stringify(session));
    setBalance(bal);
    setCard(session.bankCard || null);

    // CHECK IF HAS ACTIVE PRODUCT
    const uid = session.user?.email || session.user?.phone || 'default';
    const keys = [`legend_products_${uid}`, `legend_user_products_${uid}`, `legend_purchases_${uid}`, `products_${uid}`];
    let found: any[] = [];
    for (const k of keys) {
      try {
        const p = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(p) && p.length > 0) { found = p; break; }
      } catch {}
    }
    // Also check global
    try {
      const allPurchases = JSON.parse(localStorage.getItem('legend_all_purchases') || '[]');
      const mine = allPurchases.filter((p: any) => p.userId === uid || p.email === uid);
      if (mine.length > 0) found = mine;
    } catch {}
    
    setProducts(found);
    const active = found.some((p: any) => p.status === 'active' || p.status === 'running' || p.active === true);
    setHasProduct(active);
  }, []);

  const MIN_WITHDRAW = 9000;
  const FEE_RATE = 0.16;
  const numAmount = parseInt(amount) || 0;
  const fee = Math.floor(numAmount * FEE_RATE);
  const received = numAmount - fee;

  const handleWithdraw = () => {
    if (!hasProduct) {
      alert('❌ You must buy a product first!\n\nYour bonus UGX 9,000 is locked until you purchase at least 1 product.\n\nGo to Products page to buy.');
      navigate('/product');
      return;
    }
    if (!card) { alert('Bind bank card first'); navigate('/bind-card'); return; }
    if (numAmount < MIN_WITHDRAW) { alert(`Minimum is UGX ${MIN_WITHDRAW.toLocaleString()}`); return; }
    if (numAmount > balance) { alert('Insufficient balance'); return; }
    
    const sStr = localStorage.getItem('legend_session');
    const session = JSON.parse(sStr!);
    const uid = session.user?.email || 'default';
    
    const order = {
      id: 'W' + Date.now(),
      userId: uid,
      amount: numAmount,
      fee,
      receivedAmount: received,
      status: 'pending',
      bankCard: card,
      createdAt: new Date().toISOString(),
      arrivalNote: 'Funds arrive in 1-24 hours'
    };
    
    const orders = JSON.parse(localStorage.getItem(`legend_withdraw_${uid}`) || '[]');
    orders.unshift(order);
    localStorage.setItem(`legend_withdraw_${uid}`, JSON.stringify(orders));
    
    const newBal = balance - numAmount;
    session.balance = newBal;
    if (session.user?.user_metadata?.bonus) {
      session.user.user_metadata.bonus = Math.max(0, session.user.user_metadata.bonus - numAmount);
    }
    localStorage.setItem('legend_session', JSON.stringify(session));
    setBalance(newBal);
    
    alert(`✅ Withdrawal Submitted!\nAmount: UGX ${numAmount.toLocaleString()}\nFee (16%): UGX ${fee.toLocaleString()}\nYou Receive: UGX ${received.toLocaleString()}\n\n💰 Will arrive in 1-24 hours to:\n${card.bank} - ${card.accountNumber}`);
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
          <p style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#c9a84c' }}>UGX {balance.toLocaleString()}</p>
          <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Includes bonus UGX 9,000 + all earnings</p>

          {/* PRODUCT LOCK WARNING */}
          {!hasProduct && (
            <div style={{ marginTop: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 12 }}>
              <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 700 }}>🔒 Withdrawal Locked</p>
              <p style={{ color: '#fca5a5', fontSize: 11, marginTop: 4 }}>You must purchase a product first to unlock your UGX 9,000 bonus withdrawal. Every amount earned will be added to your account after product purchase.</p>
              <button onClick={() => navigate('/product')} style={{ marginTop: 8, background: '#ef4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Buy Product Now →</button>
            </div>
          )}

          {hasProduct && (
            <div style={{ marginTop: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: 10 }}>
              <p style={{ color: '#22c55e', fontSize: 12, fontWeight: 700 }}>✓ Product Active - Withdrawal Unlocked</p>
              <p style={{ color: '#86efac', fontSize: 10, marginTop: 2 }}>{products.length} product(s) active</p>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Bank card</p>
            <button onClick={() => navigate('/bind-card')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', background: '#1e1e1e', border: '1px solid #333', borderRadius: 12, padding: '12px 16px', color: card ? '#ddd' : '#666' }}>
              <span>{card ? `${card.bank} - ${card.accountNumber}` : 'Bind MTN/Airtel card'}</span><span>›</span>
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Withdrawal amount</p>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1e1e1e', border: hasProduct ? '1px solid #333' : '1px solid #331111', borderRadius: 12, padding: '12px 16px', opacity: hasProduct ? 1 : 0.6 }}>
              <span style={{ color: '#c9a84c', fontWeight: 700, marginRight: 8 }}>UGX</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={hasProduct ? "Min 9000" : "Locked - Buy product"} disabled={!hasProduct} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white' }} />
    </
