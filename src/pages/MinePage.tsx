import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function formatUGX(n:number){ return `UGX ${Number(n||0).toLocaleString()}`; }

export default function MinePage(){
  const nav=useNavigate();
  const [user,setUser]=useState<any>(null);

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ nav('/login'); return; }
    try{ setUser(JSON.parse(s)); }catch{ nav('/login'); }
  },[]);

  if(!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  const handleSignOut=()=>{
    localStorage.removeItem('legend_session');
    nav('/login');
  };

  const menuItems=[
    { icon:'👤', label:'Profile & password', path:'/profile' },
    { icon:'💳', label:'Bind payout account', path:'/bind-card' },
    { icon:'🧾', label:'Transaction records', path:'/records' },
    { icon:'💰', label:'Recharge status', path:'/recharge-status' },
    { icon:'💸', label:'Withdrawal status', path:'/withdraw-status' },
    { icon:'🎁', label:'Redeem gift code', path:'/redeem' },
    { icon:'📅', label:'Daily check-in', path:'/checkin' },
    { icon:'🎧', label:'Customer support', path:'/customer-service' },
    { icon:'🛡️', label:'Platform rules', path:'/regulation' },
  ];

  return(
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white'}}>
      <div style={{maxWidth:'440px',margin:'0 auto',paddingBottom:'90px'}}>
        
        {/* Top bar */}
        <div style={{padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{color:'#e6a800',fontWeight:800,fontSize:'18px'}}>Legend Investors</div>
          <button onClick={handleSignOut} style={{background:'#1e1e1e',border:'1px solid #333',color:'white',padding:'7px 16px',borderRadius:'24px',fontSize:'12px'}}>Sign out</button>
        </div>

        {/* Profile Header - EXACT from your screenshot */}
        <div style={{margin:'0 16px',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'24px',padding:'20px'}}>
          <div style={{color:'#e6a800',fontWeight:700,fontSize:'13px',marginBottom:'10px'}}>Verified Cloud account</div>
          <div style={{fontSize:'26px',fontWeight:800,letterSpacing:'0.5px'}}>{user.phone||'+256746085840'}</div>
          <div style={{color:'#888',fontSize:'12px',marginTop:'6px'}}>{user.email||'legendinvestors6@gmail.com'}</div>
          <div style={{color:'#e6a800',fontSize:'34px',fontWeight:900,marginTop:'18px'}}>{formatUGX(user.balance||9000)}</div>
          <div style={{color:'#888',fontSize:'12px',marginTop:'4px'}}>Referral: {user.referralCode||'4B86F10B5A'} · active</div>
        </div>

        {/* Task Center - EXACT */}
        <Link to="/tasks" style={{textDecoration:'none'}}>
          <div style={{margin:'12px 16px',borderRadius:'24px',overflow:'hidden',position:'relative',height:'88px',background:'#151515',border:'1px solid #2a2a2a'}}>
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=120&fit=crop" alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.4}}/>
            <div style={{position:'relative',zIndex:2,padding:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',height:'100%'}}>
              <div>
                <div style={{fontSize:'22px',fontWeight:800,color:'white'}}>Task Center</div>
                <div style={{color:'#ccc',fontSize:'12px',marginTop:'4px'}}>Explore check-in and referral rewards.</div>
              </div>
              <div style={{color:'#e6a800',fontWeight:700,fontSize:'14px',display:'flex',alignItems:'center',gap:'4px'}}>Go now <span>→</span></div>
            </div>
          </div>
        </Link>

        {/* Menu Items - EXACT from screenshot */}
        <div style={{margin:'0 16px',background:'#1a1a1a',border:'1px solid #222',borderRadius:'20px',overflow:'hidden'}}>
          {menuItems.map((item,i)=>(
            <button key={item.label} onClick={()=>nav(item.path)} style={{width:'100%',display:'flex',alignItems:'center',gap:'12px',padding:'16px',background:'transparent',border:'none',borderBottom:i<menuItems.length-1?'1px solid #222':'none',textAlign:'left'}}>
              <span style={{fontSize:'16px'}}>{item.icon}</span>
              <span style={{flex:1,color:'white',fontSize:'14px',fontWeight:500}}>{item.label}</span>
              <span style={{color:'#555'}}>›</span>
            </button>
          ))}
        </div>

        {/* Recharge / Withdraw quick buttons - from old design but hidden in screenshot? keep small */}
        <div style={{margin:'12px 16px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
          <button onClick={()=>nav('/recharge')} style={{background:'#1a1a1a',border:'1px solid #222',padding:'12px',borderRadius:'14px',color:'#e6a800',fontWeight:600,fontSize:'12px'}}>Recharge</button>
          <button onClick={()=>nav('/withdraw')} style={{background:'#1a1a1a',border:'1px solid #222',padding:'12px',borderRadius:'14px',color:'#e6a800',fontWeight:600,fontSize:'12px'}}>Withdraw</button>
          <button onClick={()=>nav('/records')} style={{background:'#1a1a1a',border:'1px solid #222',padding:'12px',borderRadius:'14px',color:'#e6a800',fontWeight:600,fontSize:'12px'}}>Records</button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#111',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',padding:'10px 0',maxWidth:'440px',margin:'0 auto'}}>
        <Link to="/home" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>⌂</div><div style={{fontSize:'11px',color:'#888'}}>Home</div></Link>
        <Link to="/products" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>◫</div><div style={{fontSize:'11px',color:'#888'}}>Products</div></Link>
        <Link to="/team" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>👥</div><div style={{fontSize:'11px',color:'#888'}}>Team</div></Link>
        <Link to="/mine" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{background:'#2a2410',borderRadius:'12px',margin:'0 6px',padding:'4px 0'}}><div style={{color:'#e6a800'}}>👤</div><div style={{fontSize:'11px',color:'#e6a800',fontWeight:700}}>Account</div></div></Link>
      </div>
    </div>
  );
      }
