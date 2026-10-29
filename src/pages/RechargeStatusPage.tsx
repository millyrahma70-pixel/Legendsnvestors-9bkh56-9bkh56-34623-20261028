import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PESAJET_API = 'https://vngrsa9k6jl2x.onspace.build/api/recharge/status';

export default function RechargeStatusPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<any>(null);
  const [status, setStatus] = useState<'pending'|'success'|'failed'>('pending');

  useEffect(()=>{
    const p = localStorage.getItem('pesajet_pending');
    if(!p){ navigate('/recharge'); return; }
    setPending(JSON.parse(p));

    // Poll PesaJet status like your screenshot "Status checking resumes..."
    const iv = setInterval(async ()=>{
      try{
        const res = await fetch(PESAJET_API, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: p
        });
        const data = await res.json();
        if(data.status==='completed'){
          setStatus('success');
          // Credit balance
          const users = JSON.parse(localStorage.getItem('legend_users')||'[]');
          const session = JSON.parse(localStorage.getItem('legend_session')||'{}');
          const idx = users.findIndex((u:any)=>u.id===session.id);
          if(idx>=0){
            users[idx].balance = (users[idx].balance||0) + JSON.parse(p).amount;
            localStorage.setItem('legend_users', JSON.stringify(users));
            localStorage.setItem('legend_session', JSON.stringify(users[idx]));
          }
          localStorage.removeItem('pesajet_pending');
          clearInterval(iv);
        }
      } catch(e){ console.log('Polling...', e); }
    }, 5000);

    return ()=>clearInterval(iv);
  },[]);

  if(!pending) return null;

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'16px'}}>
      <div style={{maxWidth:'480px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
          <button onClick={()=>navigate('/recharge')} style={{width:'36px',height:'36px',borderRadius:'12px',background:'#1e1e1e',border:'none',color:'white',fontSize:'18px'}}>‹</button>
          <h1 style={{fontWeight:800,fontSize:'18px'}}>Recharge Status</h1>
        </div>

        <div style={{background:'#151515',border:`1px solid ${status==='success'?'#22c55e':'#e6a800'}`,borderRadius:'20px',padding:'24px',textAlign:'center'}}>
          <div style={{width:'64px',height:'64px',borderRadius:'50%',background:status==='success'?'rgba(34,197,94,0.15)':'rgba(230,168,0,0.15)',display:'grid',placeItems:'center',margin:'0 auto 16px',fontSize:'28px'}}>
            {status==='success' ? '✓' : '⏳'}
          </div>
          <h2 style={{fontSize:'20px',fontWeight:800}}>{status==='success'?'Recharge Successful!':'Waiting for payment'}</h2>
          <p style={{color:'#e6a800',fontWeight:800,fontSize:'24px',margin:'14px 0'}}>{pending.amount.toLocaleString()} UGX</p>
          <p style={{color:'#999',fontSize:'13px'}}>Phone: {pending.phone}</p>
          <p style={{color:'#666',fontSize:'13px',marginTop:'6px'}}>Method: Airtel Money · PesaJet</p>
          
          {status==='pending' && (
            <>
              <p style={{color:'#999',fontSize:'13px',marginTop:'18px',lineHeight:'1.5'}}>Check your phone for MTN/Airtel prompt.<br/>Confirm payment on your phone, not here.</p>
              <div style={{marginTop:'18px',padding:'12px',background:'#1e1e1e',borderRadius:'12px'}}>
                <p style={{color:'#888',fontSize:'11px'}}>⚠️ Pending is NOT success. Balance credited only after PesaJet confirms. Do not pay again.</p>
              </div>
              <p style={{color:'#666',fontSize:'11px',marginTop:'14px'}}>Status checking resumes when you return to website...</p>
            </>
          )}

          {status==='success' && (
            <p style={{color:'#22c55e',fontSize:'13px',marginTop:'14px'}}>Funds credited to your account!</p>
          )}

          <div style={{display:'flex',gap:'10px',marginTop:'20px'}}>
            <button onClick={()=>{localStorage.removeItem('pesajet_pending'); navigate('/recharge')}} style={{flex:1,padding:'14px',borderRadius:'12px',background:'#1e1e1e',color:'#888',border:'none',fontWeight:600}}>Cancel</button>
            {status==='success' ? (
              <button onClick={()=>navigate('/home')} style={{flex:1,padding:'14px',borderRadius:'12px',background:'#e6a800',color:'black',border:'none',fontWeight:800}}>Go to Home</button>
            ) : (
              <a href="https://wa.me/966557067827" target="_blank" style={{flex:1,padding:'14px',borderRadius:'12px',background:'#25d366',color:'white',fontWeight:700,textDecoration:'none',textAlign:'center'}}>Support</a>
            )}
          </div>
        </div>

        <div style={{marginTop:'16px',background:'#151515',border:'1px solid #222',borderRadius:'16px',padding:'16px'}}>
          <p style={{fontWeight:700,fontSize:'13px',marginBottom:'8px'}}>Prompt delayed?</p>
          <p style={{color:'#666',fontSize:'12px',lineHeight:'1.5'}}>If you didn't receive prompt in 2 minutes, check status again or contact WhatsApp +966557067827</p>
        </div>
      </div>
    </div>
  );
          }
