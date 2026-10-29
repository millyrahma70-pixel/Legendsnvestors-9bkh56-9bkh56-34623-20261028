import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VIP_PRODUCTS = [
  {id:1, vip:1, name:'VIP 1 Legend One BMW', price:30000, daily:3000, img:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600'},
  {id:2, vip:2, name:'VIP 2 Legend One BMW', price:42000, daily:4200, img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600'},
  {id:3, vip:3, name:'VIP 3 Legend One BMW', price:50000, daily:5000, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600'},
];

function formatUGX(n:number){ return `UGX ${n.toLocaleString()}`; }

export default function HomePage(){
  const nav=useNavigate();
  const [balance,setBalance]=useState(9000);
  const [user,setUser]=useState<any>(null);
  const [activeCount,setActiveCount]=useState(0);
  const [countdown,setCountdown]=useState('00:00:00');

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ nav('/login'); return; }
    try{
      const sess=JSON.parse(s);
      const users=JSON.parse(localStorage.getItem('legend_users')||'{}');
      const u=users[sess?.user?.email];
      setUser(u?.data || {full_name:'Investor'});
      const b=localStorage.getItem('legend_balance');
      setBalance(b?Number(b):9000);
      // products
      const prods=JSON.parse(localStorage.getItem('legend_products')||'[]');
      setActiveCount(prods.length);
    }catch{ setUser({full_name:'Investor'}); }
    
    // countdown timer 24h
    const iv=setInterval(()=>{
      const next=localStorage.getItem('legend_next_payout');
      if(!next){ setCountdown('00:00:00'); return; }
      const diff=Number(next)-Date.now();
      if(diff<=0){ setCountdown('00:00:00'); }
      else {
        const h=Math.floor(diff/3600000).toString().padStart(2,'0');
        const m=Math.floor((diff%3600000)/60000).toString().padStart(2,'0');
        const s=Math.floor((diff%60000)/1000).toString().padStart(2,'0');
        setCountdown(`${h}:${m}:${s}`);
      }
    },1000);
    return ()=>clearInterval(iv);
  },[]);

  function signOut(){ localStorage.removeItem('legend_session'); nav('/login'); }

  return(
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',paddingBottom:'80px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px'}}>
          <div style={{color:'#e6a800',fontWeight:800,fontSize:'20px'}}>Legend Investors</div>
          <button onClick={signOut} style={{background:'#1f1f1f',border:'1px solid #333',color:'white',padding:'8px 16px',borderRadius:'12px',fontSize:'13px'}}>Sign out</button>
        </div>

        {/* Hero - A New World */}
        <div style={{margin:'0 16px 14px',borderRadius:'22px',overflow:'hidden',position:'relative',height:'210px'}}>
          <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.85))'}}></div>
          <div style={{position:'absolute',top:'12px',right:'12px',background:'#e6a800',color:'black',padding:'5px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:800}}>LEGEND</div>
          <div style={{position:'absolute',bottom:'16px',left:'16px'}}>
            <div style={{fontSize:'12px',color:'#bbb'}}>Enter</div>
            <div style={{fontSize:'32px',fontWeight:900,lineHeight:'1'}}>A New World</div>
            <div style={{fontSize:'13px',color:'#aaa',marginTop:'6px'}}>Your account, products and rewards in one place.</div>
          </div>
        </div>

        {/* Daily Income Timer - if active */}
        {activeCount>0 && (
          <div style={{margin:'0 16px 12px',background:'linear-gradient(135deg,#1a1100,#2d1f00)',border:'1px solid rgba(230,168,0,0.3)',borderRadius:'16px',padding:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
              <div style={{width:'32px',height:'32px',background:'#e6a800',borderRadius:'10px',display:'grid',placeItems:'center'}}>⏰</div>
              <div><div style={{color:'#e6a800',fontSize:'12px',fontWeight:600}}>Next Income Payout</div><div style={{color:'#888',fontSize:'10px'}}>{activeCount} product(s)</div></div>
            </div>
            <div style={{background:'rgba(0,0,0,0.4)',border:'1px solid rgba(230,168,0,0.3)',padding:'6px 10px',borderRadius:'10px',color:'#e6a800',fontWeight:900}}>{countdown}</div>
          </div>
        )}

        {/* Available balance */}
        <div style={{margin:'0 16px 12px',background:'#1a1a0f',border:'1px solid #2a2410',borderRadius:'20px',padding:'16px'}}>
          <div style={{color:'#e6a800',fontSize:'14px'}}>Available balance</div>
          <div style={{color:'#e6a800',fontSize:'30px',fontWeight:900,marginTop:'6px'}}>{formatUGX(balance)}</div>
          <div style={{color:'#888',fontSize:'12px',marginTop:'4px'}}>Lifetime income: UGX 0</div>
          <Link to="/products" style={{display:'inline-block',marginTop:'14px',background:'#e6a800',color:'black',padding:'12px 18px',borderRadius:'12px',fontWeight:800,fontSize:'13px',textDecoration:'none'}}>Explore VIP products</Link>
        </div>

        {/* Your earning schedule */}
        <div style={{margin:'0 16px 12px',background:'#161616',border:'1px solid #222',borderRadius:'20px',padding:'16px'}}>
          <div style={{width:'28px',height:'28px',borderRadius:'50%',border:'2px solid #e6a800',display:'grid',placeItems:'center',color:'#e6a800',fontSize:'14px'}}>🕒</div>
          <div style={{fontSize:'17px',fontWeight:700,marginTop:'10px'}}>Your earning schedule</div>
          <div style={{fontSize:'28px',fontWeight:900,marginTop:'6px'}}>UGX 0</div>
          <div style={{color:'#888',fontSize:'12px',lineHeight:'1.6',marginTop:'8px'}}>
            Daily earnings across {activeCount} active products. Each payment is earned exactly 24 hours after activation, then every 24 hours until term end.<br/><br/>
            No upcoming daily earnings. View your products to check their terms.<br/><br/>
            The background payout job is not currently connected. Account refresh still credits completed periods without losing eligible earnings.
          </div>
          <Link to="/products" style={{color:'#e6a800',fontSize:'12px',marginTop:'12px',display:'block',textDecoration:'none'}}>View active terms</Link>
        </div>

        {/* Discover VIP */}
        <div style={{padding:'0 16px',marginBottom:'10px',display:'flex',justifyContent:'space-between'}}>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}><div style={{width:'3px',height:'18px',background:'#e6a800'}}></div><div style={{fontWeight:800}}>Discover VIP products</div></div>
          <Link to="/products" style={{color:'#e6a800',fontSize:'12px',textDecoration:'none'}}>View all ›</Link>
        </div>

        {VIP_PRODUCTS.map(p=>(
          <div key={p.id} style={{margin:'0 16px 12px',borderRadius:'18px',overflow:'hidden',background:'#161616',border:'1px solid #222'}}>
            <div style={{position:'relative',height:'180px'}}>
              <img src={p.img} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',top:'10px',left:'10px',background:'#e6a800',color:'black',padding:'5px 12px',borderRadius:'16px',fontWeight:800,fontSize:'12px'}}>VIP {p.vip}</div>
            </div>
            <div style={{padding:'12px'}}><div style={{fontWeight:700}}>{p.name}</div><div style={{color:'#e6a800',fontWeight:800,marginTop:'4px'}}>{formatUGX(p.price)}</div><div style={{color:'#888',fontSize:'12px'}}>60-day term</div></div>
          </div>
        ))}

        {/* Platform announcement */}
        <div style={{margin:'0 16px 10px',background:'#161616',border:'1px solid #222',borderRadius:'18px',padding:'16px'}}>
          <div style={{fontWeight:700}}>Platform announcement</div>
          <div style={{color:'#aaa',fontSize:'12px',marginTop:'6px'}}>Welcome to Legend Investors. Verify payment details before sending money.</div>
        </div>

        <div style={{padding:'0 16px',display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'10px'}}>
          <Link to="/recharge" style={{background:'#1e1e1e',border:'1px solid #333',padding:'10px 16px',borderRadius:'12px',textDecoration:'none',color:'white',fontSize:'13px'}}>📄 Recharge</Link>
          <Link to="/withdraw" style={{background:'#1e1e1e',border:'1px solid #333',padding:'10px 16px',borderRadius:'12px',textDecoration:'none',color:'white',fontSize:'13px'}}>↗ Withdraw</Link>
          <Link to="/invite" style={{background:'#1e1e1e',border:'1px solid #333',padding:'10px 16px',borderRadius:'12px',textDecoration:'none',color:'white',fontSize:'13px'}}>🎁 Invite</Link>
        </div>

        <div style={{margin:'0 16px 20px',background:'#161616',border:'1px solid #222',borderRadius:'18px',padding:'16px'}}>
          <div style={{fontWeight:700}}>Payment status</div>
          <div style={{color:'#aaa',fontSize:'12px',marginTop:'6px'}}>1 pending request(s) in your latest 100 orders.</div>
          <div style={{color:'#e6a800',fontSize:'12px',marginTop:'10px'}}>Track payments & transactions</div>
        </div>

      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#1a1a1a',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',padding:'8px 0 10px'}}>
        <Link to="/home" style={{textAlign:'center',textDecoration:'none',flex:1,background:'#2a2410',borderRadius:'14px',margin:'0 4px',padding:'6px 0'}}><div style={{color:'#e6a800'}}>🏠</div><div style={{fontSize:'11px',color:'#e6a800',fontWeight:700}}>Home</div></Link>
        <Link to="/products" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>📦</div><div style={{fontSize:'11px',color:'#888'}}>Products</div></Link>
        <Link to="/team" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>👥</div><div style={{fontSize:'11px',color:'#888'}}>Team</div></Link>
        <Link to="/account" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>👤</div><div style={{fontSize:'11px',color:'#888'}}>Account</div></Link>
      </div>
    </div>
  );
  }
