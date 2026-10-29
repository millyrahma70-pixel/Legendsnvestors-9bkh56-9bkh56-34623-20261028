import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function formatUGX(n:number){ return `UGX ${Number(n||0).toLocaleString()}`; }

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    setUser(JSON.parse(s));
  },[]);

  if (!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  // Simple 7-day chart data - no recharts needed
  const chartData = useMemo(() => {
    const txs = JSON.parse(localStorage.getItem(`legend_tx_${user.id}`)||'[]').filter((t:any)=>t.type==='income');
    const days: { label: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const amount = txs.filter((t:any)=> new Date(t.createdAt).toDateString() === dateStr).reduce((s:number,t:any)=>s+t.amount,0);
      days.push({ label, amount });
    }
    return days;
  }, [user.id]);

  const maxIncome = Math.max(...chartData.map(d => d.amount), 1);

  // Stats from localStorage
  const stats = useMemo(() => {
    const recharges = JSON.parse(localStorage.getItem(`legend_recharges_${user.id}`)||'[]');
    const withdrawals = JSON.parse(localStorage.getItem(`legend_withdraws_${user.id}`)||'[]');
    const products = JSON.parse(localStorage.getItem(`legend_products_${user.id}`)||'[]');
    const comm = JSON.parse(localStorage.getItem(`legend_comm_${user.id}`)||'{"l1":0,"l2":0,"l3":0}');

    const totalDeposited = recharges.filter((r:any)=>r.status==='completed').reduce((s:number,r:any)=>s+r.amount,0);
    const totalWithdrawn = withdrawals.filter((w:any)=>w.status==='completed').reduce((s:number,w:any)=>s+w.amount,0);
    const active = products.filter((p:any)=>p.status==='active').length;
    const expired = products.filter((p:any)=>p.status==='expired').length;
    const totalRef = comm.l1+comm.l2+comm.l3;

    return { totalDeposited, totalWithdrawn, active, expired, totalRef, comm, totalProducts: products.length, pending: withdrawals.filter((w:any)=>w.status==='pending').length };
  }, [user.id]);

  const handlePasswordUpdate = () => {
    if (!oldPassword) { alert('Enter current password'); return; }
    if (oldPassword !== user.password) { alert('Current password incorrect'); return; }
    if (!newPassword || newPassword.length < 6) { alert('New password at least 6 chars'); return; }
    if (newPassword !== confirmPassword) { alert('Passwords do not match'); return; }
    
    setSaving(true);
    setTimeout(()=>{
      const updated={...user,password:newPassword};
      setUser(updated);
      localStorage.setItem('legend_session',JSON.stringify(updated));
      // update in users list
      const users=JSON.parse(localStorage.getItem('legend_users')||'[]');
      const idx=users.findIndex((u:any)=>u.id===user.id);
      if(idx>=0){ users[idx]=updated; localStorage.setItem('legend_users',JSON.stringify(users)); }
      alert('Password updated!');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      setSaving(false);
    },600);
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'white'}}>‹</button>
          <h1 style={{flex:1,fontWeight:700,fontSize:'16px'}}>My Profile</h1>
          <div style={{width:'32px',height:'32px',borderRadius:'10px',background:'#e6a800',display:'grid',placeItems:'center',color:'black'}}>✓</div>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'14px'}}>
          {/* Account Card */}
          <div style={{borderRadius:'20px',padding:'20px',background:'linear-gradient(135deg,#1a1400,#2a2000)',border:'1px solid rgba(230,168,0,0.3)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{width:'60px',height:'60px',borderRadius:'16px',background:'rgba(230,168,0,0.12)',border:'2px solid rgba(230,168,0,0.4)',display:'grid',placeItems:'center',fontWeight:900,fontSize:'22px',color:'#e6a800'}}>
                {user.phone?.charAt(0)?.toUpperCase()||'L'}
              </div>
              <div>
                <p style={{fontWeight:800,fontSize:'16px'}}>{user.phone||'+256746085840'}</p>
                <div style={{display:'flex',gap:'6px',marginTop:'4px',alignItems:'center'}}>
                  <span style={{fontSize:'10px',fontWeight:800,background:'#e6a800',color:'black',padding:'2px 8px',borderRadius:'12px'}}>Lv{user.level||1}</span>
                  <span style={{color:'#666',fontSize:'11px'}}>#{user.referralCode||'4B86F10B5A'}</span>
                </div>
                <p style={{color:'#666',fontSize:'10px',marginTop:'4px'}}>Member since {new Date(user.createdAt||Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            <div style={{marginTop:'16px',paddingTop:'16px',borderTop:'1px solid rgba(230,168,0,0.15)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <div><p style={{color:'#888',fontSize:'11px'}}>Current Balance</p><p style={{color:'#e6a800',fontWeight:900,fontSize:'18px',marginTop:'2px'}}>{formatUGX(user.balance||9000)}</p></div>
              <div style={{textAlign:'right'}}><p style={{color:'#888',fontSize:'11px'}}>Cumulative Income</p><p style={{fontWeight:800,fontSize:'16px',marginTop:'2px'}}>{formatUGX(user.cumulativeIncome||0)}</p></div>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            {[
              {label:'Total Deposited',value:formatUGX(stats.totalDeposited),sub:'Approved recharges',color:'#e6a800'},
              {label:'Total Withdrawn',value:formatUGX(stats.totalWithdrawn),sub:`${stats.pending} pending`,color:'#60a5fa'},
              {label:'Active Products',value:String(stats.active),sub:`${stats.expired} expired · ${stats.totalProducts} total`,color:'#34d399'},
              {label:'Referral Earnings',value:formatUGX(stats.totalRef),sub:'Across all 3 levels',color:'#a78bfa'},
            ].map(s=>(
              <div key={s.label} style={{borderRadius:'16px',padding:'14px',background:'#151515',border:'1px solid #222'}}>
                <p style={{color:'#888',fontSize:'10px'}}>{s.label}</p>
                <p style={{fontWeight:900,fontSize:'15px',color:s.color,marginTop:'6px'}}>{s.value}</p>
                <p style={{color:'#666',fontSize:'10px',marginTop:'2px'}}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* 7-Day Earnings - NO RECHARTS, simple div bars */}
          <div style={{borderRadius:'20px',padding:'16px',background:'#151515',border:'1px solid #222'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <p style={{fontWeight:700,fontSize:'13px'}}>📈 7-Day Earnings</p>
              <span style={{color:'#666',fontSize:'11px'}}>Total: <span style={{color:'#e6a800',fontWeight:700}}>{formatUGX(chartData.reduce((s,d)=>s+d.amount,0))}</span></span>
            </div>
            {chartData.every(d=>d.amount===0)?(
              <div style={{padding:'30px',textAlign:'center',color:'#666',fontSize:'12px'}}>No income yet. Purchase VIP product to start.</div>
            ):(
              <div style={{display:'flex',alignItems:'end',gap:'6px',height:'100px',marginTop:'16px'}}>
                {chartData.map((d,i)=>(
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                    <div style={{width:'100%',height:`${(d.amount/maxIncome)*80}px`,minHeight:d.amount>0?'8px':'2px',background:d.amount===maxIncome?'#e6a800':d.amount>0?'rgba(230,168,0,0.5)':'#2a2a2a',borderRadius:'6px 6px 0 0'}}></div>
                    <span style={{fontSize:'9px',color:'#666'}}>{d.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Change */}
          <div style={{borderRadius:'20px',padding:'16px',background:'#151515',border:'1px solid #222'}}>
            <p style={{fontWeight:700,fontSize:'13px',marginBottom:'12px'}}>🔒 Change Password</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <div>
                <p style={{color:'#888',fontSize:'11px',marginBottom:'6px'}}>Current Password</p>
                <div style={{display:'flex',background:'#1e1e1e',border:'1px solid #333',borderRadius:'12px',padding:'12px'}}>
                  <input type={showOld?'text':'password'} value={oldPassword} onChange={e=>setOldPassword(e.target.value)} placeholder="Enter current password" style={{flex:1,background:'transparent',border:'none',outline:'none',color:'white',fontSize:'13px'}}/>
                  <button onClick={()=>setShowOld(!showOld)} style={{background:'none',border:'none',color:'#666',fontSize:'12px'}}>{showOld?'Hide':'Show'}</button>
                </div>
              </div>
              <div>
                <p style={{color:'#888',fontSize:'11px',marginBottom:'6px'}}>New Password</p>
                <div style={{display:'flex',background:'#1e1e1e',border:'1px solid #333',borderRadius:'12px',padding:'12px'}}>
                  <input type={showNew?'text':'password'} value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="At least 6 characters" style={{flex:1,background:'transparent',border:'none',outline:'none',color:'white',fontSize:'13px'}}/>
                  <button onClick={()=>setShowNew(!showNew)} style={{background:'none',border:'none',color:'#666',fontSize:'12px'}}>{showNew?'Hide':'Show'}</button>
                </div>
              </div>
              <div>
                <p style={{color:'#888',fontSize:'11px',marginBottom:'6px'}}>Confirm New Password</p>
                <div style={{display:'flex',background:'#1e1e1e',border:'1px solid #333',borderRadius:'12px',padding:'12px'}}>
                  <input type={showConfirm?'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter new password" style={{flex:1,background:'transparent',border:'none',outline:'none',color:'white',fontSize:'13px'}}/>
                  <button onClick={()=>setShowConfirm(!showConfirm)} style={{background:'none',border:'none',color:'#666',fontSize:'12px'}}>{showConfirm?'Hide':'Show'}</button>
                </div>
              </div>
              <button onClick={handlePasswordUpdate} disabled={saving} style={{width:'100%',padding:'14px',borderRadius:'12px',fontWeight:800,background:'#e6a800',color:'black',border:'none',marginTop:'6px',opacity:saving?0.6:1}}>
                {saving?'Updating...':'Update Password'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#111',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',padding:'10px 0',maxWidth:'440px',margin:'0 auto'}}>
        <Link to="/home" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>⌂</div><div style={{fontSize:'11px',color:'#888'}}>Home</div></Link>
        <Link to="/products" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>◫</div><div style={{fontSize:'11px',color:'#888'}}>Products</div></Link>
        <Link to="/team" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>👥</div><div style={{fontSize:'11px',color:'#888'}}>Team</div></Link>
        <Link to="/mine" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{background:'#2a2410',borderRadius:'12px',margin:'0 6px',padding:'4px 0'}}><div style={{color:'#e6a800'}}>👤</div><div style={{fontSize:'11px',color:'#e6a800',fontWeight:700}}>Account</div></div></Link>
      </div>
    </div>
  );
      }
