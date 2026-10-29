import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WHATSAPP = '966557067827';
const TELEGRAM = 'https://t.me/+-dWGeVqFYhllZWY0';

type Tab = 'all'|'recharge'|'withdraw'|'income';

export default function RecordsPage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [records,setRecords]=useState<any[]>([]);
  const [tab,setTab]=useState<Tab>('all');

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    const u=JSON.parse(s);
    setUser(u);
    const recs=JSON.parse(localStorage.getItem('legend_records')||'[]');
    const my=recs.filter((r:any)=>r.userId===u.id).sort((a:any,b:any)=>new Date(b.date||b.createdAt).getTime()-new Date(a.date||a.createdAt).getTime());
    setRecords(my);
  },[]);

  if(!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  let filtered = records;
  if(tab==='recharge') filtered=records.filter(r=>r.type==='recharge');
  if(tab==='withdraw') filtered=records.filter(r=>r.type==='withdraw');
  if(tab==='income') filtered=records.filter(r=>r.type==='income'||r.type==='checkin'||r.type==='bonus'||r.type==='referral');

  const totalIn = filtered.filter(r=>r.amount>0||r.received>0).reduce((s,r)=>s+(r.amount||r.received||0),0);

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>‹</button>
          <h1 style={{fontWeight:700,flex:1}}>Records</h1>
        </div>

        <div style={{display:'flex',gap:'8px',padding:'12px 16px',overflowX:'auto',borderBottom:'1px solid #1a1a1a'}}>
          {[
            {k:'all',l:'All'},
            {k:'recharge',l:'Recharge'},
            {k:'withdraw',l:'Withdraw'},
            {k:'income',l:'Income'},
          ].map((t:any)=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{whiteSpace:'nowrap',padding:'8px 14px',borderRadius:'12px',fontSize:'12px',fontWeight:600,background:tab===t.k?'#e6a800':'#1a1a1a',color:tab===t.k?'black':'#666',border:'1px solid #222'}}>{t.l}</button>
          ))}
        </div>

        {filtered.length>0 && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',padding:'12px 16px'}}>
            <div style={{background:'#151515',borderRadius:'12px',padding:'12px',textAlign:'center'}}><p style={{fontWeight:800}}>{filtered.length}</p><p style={{color:'#666',fontSize:'10px'}}>Records</p></div>
            <div style={{background:'#151515',borderRadius:'12px',padding:'12px',textAlign:'center'}}><p style={{fontWeight:800,color:'#e6a800'}}>{totalIn.toLocaleString()} UGX</p><p style={{color:'#666',fontSize:'10px'}}>Total In</p></div>
          </div>
        )}

        <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:'8px'}}>
          {filtered.length===0 ? (
            <div style={{background:'#151515',borderRadius:'16px',padding:'32px',textAlign:'center'}}>
              <p style={{color:'#666'}}>No records</p>
            </div>
          ) : filtered.map((tx:any)=>(
            <div key={tx.id} style={{background:'#151515',border:'1px solid #222',borderRadius:'16px',padding:'14px',display:'flex',justifyContent:'space-between'}}>
              <div style={{display:'flex',gap:'10px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',display:'grid',placeItems:'center'}}>
                  {tx.type==='recharge'?'📥':tx.type==='withdraw'?'📤':'💰'}
                </div>
                <div>
                  <p style={{fontSize:'13px',fontWeight:500}}>{tx.type} {tx.amount?`• ${tx.amount.toLocaleString()} UGX`:''}</p>
                  <p style={{fontSize:'11px',color:'#666'}}>{new Date(tx.date||tx.createdAt).toLocaleString()}</p>
                  <p style={{fontSize:'10px',marginTop:'4px'}}><span style={{padding:'2px 6px',borderRadius:'20px',background:tx.status==='completed'?'rgba(230,168,0,0.1)':tx.status==='pending'?'rgba(251,191,36,0.1)':'rgba(239,68,68,0.1)',color:tx.status==='completed'?'#e6a800':tx.status==='pending'?'#fbbf24':'#ef4444'}}>{tx.status||'pending'}</span></p>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{fontWeight:700,fontSize:'13px',color:tx.type==='withdraw'?'#ef4444':'#e6a800'}}>{tx.type==='withdraw'?'-':'+'}{(tx.received||tx.amount||0).toLocaleString()} UGX</p>
              </div>
            </div>
          ))}

          <div style={{marginTop:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#25d366',textDecoration:'none',border:'1px solid #222'}}>WhatsApp Support: +966557067827</a>
            <a href={TELEGRAM} target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#0088cc',textDecoration:'none',border:'1px solid #222'}}>Telegram: t.me/+-dWGeVqFYhllZWY0</a>
          </div>
        </div>
      </div>
    </div>
  );
}

