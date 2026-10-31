import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawStatusPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all'|'pending'|'completed'|'rejected'>('all');
  
  const session = localStorage.getItem('legend_session');
  const user = session ? JSON.parse(session) : null;
  
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const raw = JSON.parse(localStorage.getItem(`legend_withdraw_${user.id}`) || '[]');
    setOrders(raw);
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const total = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.receivedAmount, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      <div style={{ padding: '14px 16px', background: '#111', borderBottom: '1px solid #222', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: 10, background: '#1e1e1e', border: 'none', color: 'white' }}>‹</button>
        <h1 style={{ flex: 1, fontWeight: 700 }}>Withdrawal Status</h1>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1100, #2a1f00)', border: '1px solid #c9a84c44', borderRadius: 18, padding: 16 }}>
          <p style={{ color: '#888', fontSize: 12 }}>Total Withdrawn</p>
          <p style={{ color: '#c9a84c', fontSize: 24, fontWeight: 900 }}>UGX {total.toLocaleString()}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto' }}>
          {[
            { k: 'all', label: `All (${orders.length})` },
            { k: 'pending', label: `Pending (${orders.filter(o => o.status === 'pending').length})` },
            { k: 'completed', label: `Approved (${orders.filter(o => o.status === 'completed').length})` },
          ].map(t => (
            <button key={t.k} onClick={() => setFilter(t.k as any)} style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', whiteSpace: 'nowrap', background: filter === t.k ? '#c9a84c' : '#1a1a1a', color: filter === t.k ? 'black' : '#666' }}>{t.label}</button>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, padding: 40, textAlign: 'center', color: '#666' }}>
              <p>No withdrawal records</p>
              <button onClick={() => navigate('/withdraw')} style={{ marginTop: 12, background: '#c9a84c', color: 'black', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700 }}>Make Withdrawal</button>
            </div>
          ) : filtered.map(order => (
            <div key={order.id} style={{ background: '#151515', border: '1px solid #222', borderRadius: 18, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: order.status === 'pending' ? 'rgba(245,158,11,0.1)' : order.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: order.status === 'pending' ? '#f59e0b' : order.status === 'completed' ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{order.status.toUpperCase()}</span>
                <span style={{ color: '#666' }}>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><p style={{ color: '#888', fontSize: 11 }}>Amount</p><p style={{ fontSize: 20, fontWeight: 900 }}>UGX {order.amount.toLocaleString()}</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ color: '#888', fontSize: 11 }}>You Receive</p><p style={{ fontSize: 18, fontWeight: 900, color: '#c9a84c' }}>UGX {order.receivedAmount.toLocaleString()}</p></div>
                </div>
                <div style={{ background: '#1e1e1e', borderRadius: 10, padding: 12, marginTop: 12, fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}><span>Fee (16%)</span><span style={{ color: '#ef4444' }}>-UGX {order.fee.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontWeight: 700 }}><span>Net</span><span style={{ color: '#c9a84c' }}>UGX {order.receivedAmount.toLocaleString()}</span></div>
                </div>
                <p style={{ fontSize: 11, color: '#555', marginTop: 10 }}>{order.bankCard?.bank} - {order.bankCard?.accountNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
              }
