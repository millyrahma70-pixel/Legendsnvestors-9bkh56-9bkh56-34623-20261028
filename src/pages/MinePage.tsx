import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatUGX = (n:number) => `UGX ${Number(n||0).toLocaleString()}`;

export default function MinePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const sStr = localStorage.getItem('legend_session');
      if (!sStr) { navigate('/login'); return; }
      const s = JSON.parse(sStr);
      const u = s.user || {};
      const bonus = u.user_metadata?.bonus || 9000;
      const balance = s.balance != null ? s.balance : bonus;
      const uid = u.email || u.phone || 'default';
      const prods = JSON.parse(localStorage.getItem(`legend_products_${uid}`) || '[]');
      const all = JSON.parse(localStorage.getItem('legend_all_purchases') || '[]');
      const hasProduct = prods.length > 0 || all.filter((x:any) => x.userId === uid).length > 0;
      setUser({
        phone: u.phone || u.user_metadata?.phone || u.email || '0746085840',
        referralCode: u.user_metadata?.ref || '6ED7FBECBA',
        level: u.level || 1,
        balance,
        bankCard: s.bankCard || { bank: 'MTN', accountNumber: '0756406186' },
        hasProduct,
      });
    } catch(e){ navigate('/login'); }
  }, []);

  if (!user) return <div style={{ background:'#0a0a0a', minHeight:'100vh', color:'#fff', padding:20 }}>Loading...</div>;

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'white', paddingBottom:80 }}>
      {/* HEADER */}
      <div style={{ margin:'16px', borderRadius:20, padding:20, background:'linear-gradient(135deg, #1a1400, #2a2000)', border:'1px solid rgba(201,168,76,0.3)' }}>
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
          <div style={{ width:56, height:56, borderRadius:28, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(201,168,76,0.15)', border:'2px solid #c9a84c', fontSize:24 }}>👤</div>
          <div>
            <div style={{ fontWeight:700, color:'#fff' }}>{user.phone}</div>
            <div style={{ display:'flex', gap:6, marginTop:4, alignItems:'center' }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#000', background:'#c9a84c', padding:'2px 8px', borderRadius:20 }}>Lv{user.level}</span>
              <span style={{ color:'#666', fontSize:12 }}>Referral: {user.referralCode}</span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ color:'#888', fontSize:12, marginBottom:4 }}>Balance</div>
          <div style={{ color:'#c9a84c', fontSize:32, fontWeight:900 }}>{formatUGX(user.balance)}</div>
          <div style={{ fontSize:12, marginTop:6, color: user.hasProduct ? '#22c55e' : '#ef4444' }}>{user.hasProduct ? '✓ Product active - withdrawal unlocked' : '🔒 Buy product to unlock UGX 9,000'}</div>
          {user.bankCard && <div style={{ fontSize:12, color:'#aaa', marginTop:6 }}>💳 {user.bankCard.bank} - {user.bankCard.accountNumber} ✓</div>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16 }}>
          {[
            { label:'Recharge', path:'/recharge', icon:'💳' },
            { label:'Withdraw', path:'/withdraw', icon:'⬇️' },
            { label:'Records', path:'/records', icon:'📋' },
          ].map(b => (
            <button key={b.label} onClick={()=>navigate(b.path)} style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, padding:'10px 0', color:'#c9a84c' }}>
              <div style={{ fontSize:18 }}>{b.icon}</div>
              <div style={{ fontSize:10, color:'#999', marginTop:2 }}>{b.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* MENU */}
      <div style={{ margin:'0 16px', borderRadius:16, overflow:'hidden', background:'#151515', border:'1px solid #222' }}>
        {[
          { label:'Edit Profile', path:'/profile', sub:'' },
          { label:'About Us', path:'/about', sub:'' },
          { label:'Regulation', path:'/regulation', sub:'' },
          { label:'Records', path:'/records', sub:'' },
          { label:'Bind Bank Card', path:'/bind-card', sub:user.bankCard ? `${user.bankCard.bank} - ${user.bankCard.accountNumber}` : 'Not bound' },
          { label:'Customer Service', path:'/customer-service', sub:'' },
          { label:'Recharge Status', path:'/recharge-status', sub:'' },
          { label:'Withdrawal Status', path:'/withdraw-status', sub:'' },
          { label:'Redeem Gift', path:'/redeem', sub:'' },
        ].map((item, i, arr) => (
          <button key={item.label} onClick={()=>navigate(item.path)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'16px', background:'transparent', border:'none', borderBottom: i < arr.length-1 ? '1px solid #222' : 'none', color:'#ccc', textAlign:'left' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontSize:14 }}>•</div>
            <div style={{ flex:1 }}><div style={{ fontSize:14 }}>{item.label}</div>{item.sub && <div style={{ fontSize:11, color:'#666' }}>{item.sub}</div>}</div>
            <div style={{ color:'#555' }}>›</div>
          </button>
        ))}
      </div>

      <div style={{ margin:'12px 16px' }}>
        <button onClick={()=>{ localStorage.removeItem('legend_session'); navigate('/login'); }} style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', fontWeight:800, background:'linear-gradient(135deg, #c9a84c, #f0c040)', color:'#000' }}>Sign Out</button>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#111', borderTop:'1px solid #222', display:'flex', padding:'8px 0' }}>
        {[
          { label:'Home', path:'/' },
          { label:'Product', path:'/product' },
          { label:'Team', path:'/team' },
          { label:'Mine', path:'/mine', active:true },
        ].map(n => (
          <button key={n.label} onClick={()=>navigate(n.path)} style={{ flex:1, background:'transparent', border:'none', color: n.active ? '#c9a84c' : '#666', fontSize:12 }}>{n.label}</button>
        ))}
      </div>
    </div>
  );
                                         }
