import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WHATSAPP = '966557067827';
const TELEGRAM = 'https://t.me/+-dWGeVqFYhllZWY0';

export default function WithdrawStatusPage() {
  const navigate = useNavigate();
  const [orders,setOrders]=useState<any[]>([]);
  const [filter,setFilter]=useState<'all'|'pending'|'completed'|'rejected'>('all');

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    const recs=JSON.parse(localStorage.getItem('legend_records')||'[]');
    if(!s) { navigate('/login'); return; }
    const u=JSON.parse(s);
    const myRecs=recs.filter((r:any)=>r.userId===u.id && r.type==='withdraw').sort((a:any,b:any)=>new Date(b.date).getTime()-new Date(a.date).getTime());
    setOrders(myRecs);
  },[]);

  const filtered = filter==='all'?orders:orders.filter(o=>o.status===filter);
  const total = orders.filter(o=>o.status==='completed').reduce((s,o)=>s+(o.received||0),0);

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>‹</button>
          <h1 style={{fontWeight:700,flex:1}}>Withdrawal Status</h1>
          <button onClick={()=>window.location.reload()} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>↻</button>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:'linear-gradient(135deg,#1a1100,#2a1f00)',border:'1px solid rgba(230,168,0,0.3)',borderRadius:'16px',padding:'16px'}}>
            <p style={{color:'#888',fontSize:'11px'}}>Total Successfully Withdrawn</p>
            <p style={{color:'#e6a800',fontWeight:800,fontSize:'22px',marginTop:'4px'}}>{total.toLocaleString()} UGX</p>
            <p style={{color:'#666',fontSize:'10px',marginTop:'6px'}}>WhatsApp support for delayed withdrawals: +966557067827</p>
          </div>

          <div style={{display:'flex',gap:'8px',overflowX:'auto'}}>
            {[
              {k:'all',l:`All (${orders.length})`},
              {k:'pending',l:`Pending (${orders.filter(o=>o.status==='pending').length})`},
              {k:'completed',l:`Approved (${orders.filter(o=>o.status==='completed').length})`},
              {k:'rejected',l:`Rejected (${orders.filter(o=>o.status==='rejected').length})`},
            ].map((t:any)=>(
              <button key={t.k} onClick={()=>setFilter(t.k)} style={{whiteSpace:'nowrap',padding:'8px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:600,background:filter===t.k?'#e6a800':'#1a1a1a',color:filter===t.k?'black':'#666',border:'1px solid #222'}}>{t.l}</button>
            ))}
          </div>

          {filtered.length===0 ? (
            <div style={{background:'#151515',border:'1px solid #222',borderRadius:'16px',padding:'32px',textAlign:'center'}}>
              <p style={{color:'#666'}}>No withdrawal records</p>
              <button onClick={()=>navigate('/withdraw')} style={{marginTop:'12px',padding:'10px 18px',borderRadius:'12px',background:'#e6a800',color:'black',fontWeight:700,border:'none'}}>Make Withdrawal</button>
            </div>
          ) : filtered.map((o:any)=>(
            <div key={o.id} style={{background:'#151515',border:`1px solid ${o.status==='pending'?'rgba(230,168,0,0.3)':'#222'}`,borderRadius:'16px',overflow:'hidden'}}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:o.status==='pending'?'rgba(230,168,0,0.1)':o.status==='completed'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',borderBottom:'1px solid #222'}}>
                <span style={{fontWeight:700,fontSize:'13px',color:o.status==='pending'?'#e6a800':o.status==='completed'?'#22c55e':'#ef4444'}}>{o.status.toUpperCase()}</span>
                <span style={{fontSize:'11px',color:'#666'}}>{new Date(o.date).toLocaleDateString()}</span>
              </div>
              <div style={{padding:'14px'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div><p style={{color:'#888',fontSize:'11px'}}>Amount</p><p style={{fontWeight:800,fontSize:'18px'}}>{o.amount.toLocaleString()} UGX</p></div>
                  <div style={{textAlign:'right'}}><p style={{color:'#888',fontSize:'11px'}}>You Receive</p><p style={{fontWeight:800,color:'#e6a800'}}>{(o.received||0).toLocaleString()} UGX</p></div>
                </div>
                <div style={{marginTop:'10px',padding:'10px',background:'#1e1e1e',borderRadius:'10px'}}>
                  <p style={{fontSize:'11px',color:'#888'}}>Fee: {(o.fee||0).toLocaleString()} UGX (5%) • Account: {o.account?.accountNumber||o.account||'N/A'}</p>
                </div>
                {o.status==='pending' && (
                  <div style={{marginTop:'10px',padding:'10px',background:'rgba(230,168,0,0.06)',border:'1px solid rgba(230,168,0,0.2)',borderRadius:'10px'}}>
                    <p style={{color:'#e6a800',fontSize:'12px',fontWeight:600}}>Processing - 4 to 24 hours</p>
                    <p style={{color:'#666',fontSize:'10px',marginTop:'4px'}}>If delayed beyond 24h, contact WhatsApp support: +966557067827</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginTop:'8px'}}>
            <a href={`https://wa.me/${WHATSAPP}?text=Hello, my withdrawal is delayed`} target="_blank" style={{display:'block',textAlign:'center',padding:'14px',background:'#25d366',borderRadius:'12px',color:'white',fontWeight:700,textDecoration:'none'}}>
              WhatsApp Support: +966557067827
            </a>
            <p style={{fontSize:'10px',color:'#555',textAlign:'center'}}>WhatsApp = For delayed withdrawals, failed withdrawals, wrong account number. We help you manually.</p>
            <a href={TELEGRAM} target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#0088cc',textDecoration:'none',border:'1px solid #222'}}>Official Telegram</a>
          </div>
        </div>
      </div>
    </div>
  );
                                                                     }
