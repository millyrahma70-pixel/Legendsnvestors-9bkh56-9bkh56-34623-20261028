import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WHATSAPP = '966557067827';
const TELEGRAM = 'https://t.me/+-dWGeVqFYhllZWY0';

export default function CheckInPage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    setUser(JSON.parse(s));
  },[]);

  if(!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  const today = new Date().toDateString();
  const hasCheckedIn = user.lastCheckIn === today;

  const handleCheckIn = () => {
    if(hasCheckedIn) return;
    setLoading(true);
    setTimeout(()=>{
      const bonus = 300;
      const updated = {
        ...user,
        balance: (user.balance||0)+bonus,
        checkInDays: (user.checkInDays||0)+1,
        lastCheckIn: today
      };
      localStorage.setItem('legend_session', JSON.stringify(updated));
      // save record
      const recs = JSON.parse(localStorage.getItem('legend_records')||'[]');
      recs.push({id:Date.now().toString(),userId:user.id,type:'checkin',amount:bonus,date:new Date().toISOString(),status:'completed'});
      localStorage.setItem('legend_records', JSON.stringify(recs));
      // update users list
      const users = JSON.parse(localStorage.getItem('legend_users')||'[]');
      const idx = users.findIndex((u:any)=>u.id===user.id);
      if(idx>=0){ users[idx]=updated; localStorage.setItem('legend_users', JSON.stringify(users)); }
      setUser(updated);
      setLoading(false);
      alert(`Check-in successful! +300 UGX`);
    },600);
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>‹</button>
          <h1 style={{fontWeight:700}}>Daily Check-in</h1>
        </div>

        <div style={{margin:'16px',borderRadius:'16px',overflow:'hidden',background:'linear-gradient(135deg,#1a1400,#2a2000)',border:'1px solid rgba(230,168,0,0.3)'}}>
          <div style={{padding:'20px',display:'flex',gap:'16px',alignItems:'center'}}>
            <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=100&h=100&fit=crop" alt="" style={{width:'96px',height:'96px',borderRadius:'12px',objectFit:'cover',border:'2px solid rgba(230,168,0,0.3)'}}/>
            <div>
              <p style={{color:'#e6a800',fontWeight:700}}>Daily Check-in Reward</p>
              <p style={{color:'#888',fontSize:'11px',marginBottom:'6px'}}>Get rewards every day</p>
              <p style={{fontSize:'32px',fontWeight:800}}>UGX 300</p>
            </div>
          </div>
          <div style={{padding:'0 20px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <p style={{color:'#888',fontWeight:600,fontSize:'12px'}}>Check-in days</p>
              <p style={{color:'#666',fontSize:'11px'}}>Total days checked in</p>
              <p style={{fontSize:'32px',fontWeight:800,color:'#e6a800',marginTop:'4px'}}>{user.checkInDays||0} Days</p>
            </div>
            <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&h=100&fit=crop" alt="" style={{width:'96px',height:'96px',borderRadius:'12px',objectFit:'cover',border:'2px solid rgba(230,168,0,0.3)'}}/>
          </div>
        </div>

        <div style={{margin:'0 16px'}}>
          <button onClick={handleCheckIn} disabled={hasCheckedIn||loading} style={{width:'100%',padding:'16px',borderRadius:'16px',fontWeight:700,fontSize:'16px',border:'none',background:hasCheckedIn?'#2a2a2a':'linear-gradient(135deg,#b8860b,#e6a800)',color:hasCheckedIn?'#666':'black'}}>
            {loading?'Checking...':hasCheckedIn?'Already Checked In Today':'📅 Check In'}
          </button>
          {hasCheckedIn && <p style={{textAlign:'center',color:'#e6a800',fontSize:'13px',marginTop:'8px'}}>✓ Come back tomorrow!</p>}
        </div>

        <div style={{margin:'16px',background:'#151515',border:'1px solid #222',borderRadius:'16px',padding:'16px'}}>
          <h3 style={{fontWeight:700,fontSize:'13px',marginBottom:'10px'}}>📅 Check-in Rules</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'12px',color:'#888'}}>
            <p>1. Daily check-in reward: 300 UGX.</p>
            <p>2. Check in once a day.</p>
            <p>3. Check in again after 24:00 each day.</p>
          </div>
        </div>

        <div style={{margin:'0 16px',background:'rgba(230,168,0,0.08)',border:'1px solid rgba(230,168,0,0.2)',borderRadius:'16px',padding:'16px'}}>
          <p style={{color:'#888',fontSize:'11px',marginBottom:'4px'}}>Accumulated Check-in Bonus</p>
          <p style={{color:'#e6a800',fontSize:'22px',fontWeight:800}}>{((user.checkInDays||0)*300).toLocaleString()} UGX</p>
          <p style={{color:'#666',fontSize:'11px',marginTop:'4px'}}>From {user.checkInDays||0} days</p>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#25d366',textDecoration:'none',border:'1px solid #222'}}>WhatsApp: +966557067827</a>
          <a href={TELEGRAM} target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#0088cc',textDecoration:'none',border:'1px solid #222'}}>Telegram Support</a>
        </div>
      </div>
    </div>
  );
        }

