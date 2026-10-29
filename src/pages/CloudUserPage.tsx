import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CloudUserPage(){
  const [user,setUser]=useState<any>(null);
  const nav=useNavigate();
  
  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ nav('/login'); return; }
    try{
      const sess=JSON.parse(s);
      const users=JSON.parse(localStorage.getItem('legend_users')||'{}');
      const u=users[sess?.user?.email];
      setUser(u?.data || {full_name:'Investor'});
    }catch{ setUser({full_name:'Investor'}); }
  },[]);

  const darkCard={background:'#161616',borderRadius:'18px',padding:'16px',border:'1px solid #222'} as any;

  return(
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'80px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>

        {/* Top - Your earning schedule */}
        <div style={{padding:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
            <div style={{fontSize:'14px',color:'#aaa'}}>Explore VIP products</div>
            <Link to="/products" style={{color:'#e6b800',fontSize:'13px',textDecoration:'none'}}>View all ›</Link>
          </div>

          <div style={darkCard}>
            <div style={{fontSize:'15px',fontWeight:600,marginBottom:'6px'}}>Your earning schedule</div>
            <div style={{fontSize:'28px',fontWeight:800,marginBottom:'8px'}}>UGX 0</div>
            <div style={{fontSize:'13px',color:'#888',lineHeight:'1.5',marginBottom:'12px'}}>
              Daily earnings across 0 active products. Each payment is earned exactly 24 hours after activation, then every 24 hours until term end.<br/><br/>
              No upcoming daily earnings. View your products to check their terms.
            </div>
            
            <div style={{background:'#1f1f1f',borderRadius:'12px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <div><div style={{fontSize:'12px',color:'#e6b800'}}>VIP 1 Legend One BMW</div><div style={{fontSize:'12px',color:'#888'}}>UGX 50,000 · 60-day term</div></div>
              <div style={{width:'8px',height:'8px',background:'#ffcc00',borderRadius:'50%'}}></div>
            </div>
            <div style={{fontSize:'12px',color:'#888'}}>VIP job is not currently active. Reinvest or wait until account refresh still credits count reset periods without losing eligible earnings.</div>
            <Link to="/products" style={{display:'block',marginTop:'12px',background:'#222',textAlign:'center',padding:'10px',borderRadius:'12px',color:'white',fontSize:'13px',textDecoration:'none'}}>View active terms</Link>
          </div>
        </div>

        {/* Discover VIP products */}
        <div style={{padding:'0 16px',marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
            <div style={{fontWeight:700}}>Discover VIP products</div>
            <Link to="/products" style={{color:'#e6b800',fontSize:'13px',textDecoration:'none'}}>View all ›</Link>
          </div>
          <div style={{display:'flex',gap:'10px',overflowX:'auto'}}>
            <div style={{minWidth:'140px',background:'#161616',borderRadius:'14px',padding:'10px',border:'1px solid #222'}}>
              <div style={{fontSize:'11px',color:'#e6b800'}}>VIP 1</div>
              <div style={{fontSize:'12px',fontWeight:600,marginTop:'4px'}}>Legend One</div>
              <div style={{fontSize:'11px',color:'#888'}}>UGX 50,000</div>
            </div>
            <div style={{minWidth:'140px',background:'#161616',borderRadius:'14px',padding:'10px',border:'1px solid #222'}}>
              <div style={{fontSize:'11px',color:'#e6b800'}}>VIP 2</div>
              <div style={{fontSize:'12px',fontWeight:600,marginTop:'4px'}}>Legend Pro</div>
              <div style={{fontSize:'11px',color:'#888'}}>UGX 150,000</div>
            </div>
            <div style={{minWidth:'140px',background:'#161616',borderRadius:'14px',padding:'10px',border:'1px solid #222'}}>
              <div style={{fontSize:'11px',color:'#e6b800'}}>VIP 3</div>
              <div style={{fontSize:'12px',fontWeight:600,marginTop:'4px'}}>Legend Elite</div>
              <div style={{fontSize:'11px',color:'#888'}}>UGX 300,000</div>
            </div>
          </div>
        </div>

        {/* BIG BMW CARD - Like video */}
        <div style={{padding:'0 16px',marginBottom:'16px'}}>
          <div style={{borderRadius:'22px',overflow:'hidden',background:'#161616',border:'1px solid #222'}}>
            <div style={{height:'180px',background:'linear-gradient(180deg,#2a2a2a,#111)',position:'relative',display:'grid',placeItems:'center'}}>
              <div style={{fontSize:'80px'}}>🏎️</div>
              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.6}} alt="BMW"/>
              <div style={{position:'absolute',bottom:'12px',left:'12px',background:'rgba(0,0,0,0.7)',padding:'6px 10px',borderRadius:'10px',fontSize:'12px'}}>VIP 3 Legend One BMW</div>
            </div>
            <div style={{padding:'14px'}}>
              <div style={{fontWeight:700}}>VIP 3 Legend One BMW</div>
              <div style={{color:'#e6b800',fontWeight:800,marginTop:'4px'}}>UGX 50,000</div>
              <div style={{color:'#888',fontSize:'12px',marginTop:'2px'}}>60-day term</div>
            </div>
          </div>
        </div>

        {/* Platform announcement */}
        <div style={{padding:'0 16px',marginBottom:'16px'}}>
          <div style={darkCard}>
            <div style={{fontWeight:700,marginBottom:'6px'}}>Platform announcement</div>
            <div style={{fontSize:'13px',color:'#aaa',marginBottom:'14px'}}>Welcome to Legend Investors. Verify payment details before sending money. ✨</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Link to="/recharge" style={{background:'#1f1f1f',padding:'12px',borderRadius:'12px',display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',color:'white',fontSize:'13px'}}><span>📥</span> Recharge</Link>
              <Link to="/withdraw" style={{background:'#1f1f1f',padding:'12px',borderRadius:'12px',display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',color:'white',fontSize:'13px'}}><span>↗️</span> Withdraw</Link>
              <Link to="/invite" style={{background:'#1f1f1f',padding:'12px',borderRadius:'12px',display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',color:'white',fontSize:'13px'}}><span>🎁</span> Invite</Link>
            </div>
          </div>
        </div>

        {/* Payment status */}
        <div style={{padding:'0 16px',marginBottom:'16px'}}>
          <div style={darkCard}>
            <div style={{fontWeight:700,marginBottom:'6px'}}>Payment status</div>
            <div style={{fontSize:'13px',color:'#aaa'}}>1 pending request(s) in your latest 100 orders.</div>
            <Link to="/orders" style={{display:'block',marginTop:'10px',color:'#e6b800',fontSize:'13px',textDecoration:'none'}}>Track payments & transactions</Link>
          </div>
        </div>

      </div>

      {/* Bottom Nav - EXACT like video */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#141414',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',padding:'10px 0 14px'}}>
        <Link to="/home" style={{textAlign:'center',textDecoration:'none'}}><div style={{color:'#ffcc00',fontSize:'20px'}}>🏠</div><div style={{fontSize:'11px',color:'#ffcc00',marginTop:'2px'}}>Home</div></Link>
        <Link to="/products" style={{textAlign:'center',textDecoration:'none'}}><div style={{color:'#888',fontSize:'20px'}}>📦</div><div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>Products</div></Link>
        <Link to="/team" style={{textAlign:'center',textDecoration:'none'}}><div style={{color:'#888',fontSize:'20px'}}>👥</div><div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>Team</div></Link>
        <Link to="/account" style={{textAlign:'center',textDecoration:'none'}}><div style={{color:'#888',fontSize:'20px'}}>👤</div><div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>Account</div></Link>
      </div>
    </div>
  );
                                         }
