import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MIN_WITHDRAW = 9000;
const FEE_RATE = 0.16;
const WHATSAPP = '966557067827';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [amount,setAmount]=useState('');

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    setUser(JSON.parse(s));
  },[]);

  if(!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  const num = parseInt(amount)||0;
  const fee = Math.floor(num*FEE_RATE);
  const received = num-fee;

  const handleWithdraw=()=>{
    if(num < MIN_WITHDRAW){ alert(`Minimum ${MIN_WITHDRAW.toLocaleString()} UGX`); return; }
    if(num > (user.balance||0)){ alert('Insufficient balance'); return; }
    if(!user.bankCard && !user.phone){ alert('Please bind withdrawal account first'); navigate('/bind-card'); return; }

    const recs=JSON.parse(localStorage.getItem('legend_records')||'[]');
    recs.unshift({
      id:Date.now().toString(),
      userId:user.id,
      type:'withdraw',
      amount:num,
      fee,
      received,
      status:'pending',
      date:new Date().toISOString(),
      account: user.bankCard || user.phone
    });
    localStorage.setItem('legend_records',JSON.stringify(recs));
    
    // Deduct balance pending
    const users=JSON.parse(localStorage.getItem('legend_users')||'[]');
    const idx=users.findIndex((u:any)=>u.id===user.id);
    if(idx>=0){
      users[idx].balance = (users[idx].balance||0)-num;
      localStorage.setItem('legend_users',JSON.stringify(users));
      localStorage.setItem('legend_session',JSON.stringify(users[idx]));
    }
    navigate('/records');
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>‹</button>
          <h1 style={{fontWeight:700,flex:1}}>Withdrawal</h1>
          <button onClick={()=>navigate('/withdraw-status')} style={{padding:'6px 12px',borderRadius:'10px',background:'rgba(230,168,0,0.1)',border:'1px solid rgba(230,168,0,0.25)',color:'#e6a800',fontSize:'12px'}}>History</button>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{background:'#151515',border:'1px solid #222',borderRadius:'20px',padding:'20px'}}>
            <p style={{color:'#888',fontSize:'13px'}}>Current balance</p>
            <p style={{fontSize:'28px',fontWeight:800,marginTop:'4px'}}>{(user.balance||0).toLocaleString()} UGX</p>

            <p style={{color:'#888',fontSize:'13px',marginTop:'18px',marginBottom:'8px'}}>Select withdrawal account</p>
            <button onClick={()=>navigate('/bind-card')} style={{width:'100%',padding:'14px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #333',color:user.bankCard?'white':'#666',textAlign:'left',display:'flex',justifyContent:'space-between'}}>
              <span>{user.bankCard ? `${user.bankCard.bank||'MTN'} - ${user.bankCard.accountNumber||user.phone}` : '______ - Bind Account'}</span>
              <span>›</span>
            </button>

            <p style={{color:'#888',fontSize:'13px',marginTop:'16px',marginBottom:'8px'}}>Withdrawal amount</p>
            <div style={{display:'flex',alignItems:'center',padding:'14px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #333'}}>
              <span style={{color:'#e6a800',fontWeight:700,marginRight:'8px'}}>UGX</span>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" style={{flex:1,background:'none',border:'none',outline:'none',color:'white'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',fontSize:'12px',color:'#666'}}>
              <span>Received: <b style={{color:'white'}}>{received>0?received.toLocaleString():0} UGX</b></span>
              <span>Fee: <b style={{color:'white'}}>5%</b></span>
            </div>

            <button onClick={handleWithdraw} style={{width:'100%',marginTop:'18px',padding:'16px',borderRadius:'12px',background:'#e6a800',color:'black',fontWeight:800,border:'none',fontSize:'15px'}}>Confirm Withdrawal</button>
          </div>

          <div style={{background:'#151515',border:'1px solid #222',borderRadius:'16px',padding:'16px'}}>
            <p style={{color:'#888',fontSize:'12px',lineHeight:'1.6'}}>
              1. Minimum withdrawal is <b style={{color:'#e6a800'}}>{MIN_WITHDRAW.toLocaleString()} UGX</b><br/>
              2. Fee is 5% of withdrawal amount<br/>
              3. Funds credited within 4-24 hours<br/>
              4. Contact WhatsApp if delayed: +966557067827
            </p>
          </div>

          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" style={{display:'block',textAlign:'center',padding:'14px',background:'#25d366',borderRadius:'12px',color:'white',fontWeight:700,textDecoration:'none'}}>WhatsApp Support: +966557067827</a>
          <a href="https://t.me/+-dWGeVqFYhllZWY0" target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#0088cc',textDecoration:'none',border:'1px solid #222'}}>Official Telegram</a>
        </div>
      </div>
    </div>
  );
}
