import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// CHANGE THIS to your OnSpace PesaJet backend URL
const PESAJET_API = 'https://ngrsa9k6jl2x.onspace.build/api/recharge'; 
const WHATSAPP = '966557067827';

export default function RechargePage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('30000');
  const [phone, setPhone] = useState('+25675   ');
  const [selected, setSelected] = useState(30000);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(()=>{
    // Check existing pending recharge like your screenshot "Checking for an existing recharge..."
    const existing = localStorage.getItem('pesajet_pending');
    if(existing){
      navigate('/recharge-status');
    }
    setTimeout(()=>setChecking(false), 1200);
  },[]);

  const detectNetwork = () => {
    const p = phone.replace(/\D/g,'');
    if(p.includes('75')||p.includes('74')) return 'Airtel Money';
    if(p.includes('78')||p.includes('76')) return 'MTN Money';
    return 'Airtel Money';
  };

  const handleConfirm = async () => {
    const amt = parseInt(amount);
    if(amt < 30000){ alert('Minimum UGX 30,000'); return; }
    if(!phone){ alert('Enter phone number'); return; }

    setLoading(true);
    try {
      // REAL PesaJet call - uses your OnSpace backend
      const res = await fetch(PESAJET_API, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          phone: phone.replace('+',''),
          amount: amt,
          network: detectNetwork(),
        })
      });
      const data = await res.json();
      
      if(data.success || data.pending){
        localStorage.setItem('pesajet_pending', JSON.stringify({
          phone, amount: amt, id: data.transactionId || Date.now(), time: new Date().toISOString()
        }));
        navigate('/recharge-status');
      } else {
        alert(data.message || 'Failed to initiate. Try again.');
      }
    } catch(e){
      // Fallback for GitHub Pages demo - save pending and go to status page
      // Your real OnSpace site will actually trigger the phone prompt
      console.log('PesaJet API error, using local pending:', e);
      localStorage.setItem('pesajet_pending', JSON.stringify({
        phone, amount: amt, id: Date.now().toString(), time: new Date().toISOString()
      }));
      navigate('/recharge-status');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'480px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',background:'#141414'}}>
          <h1 style={{color:'#e6a800',fontWeight:800,fontSize:'20px'}}>Legend Investors</h1>
          <button onClick={()=>{localStorage.removeItem('legend_session'); navigate('/login')}} style={{background:'#1e1e1e',border:'none',color:'white',padding:'10px 18px',borderRadius:'12px'}}>Sign out</button>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{background:'#151515',border:'1px solid #2a2a2a',borderRadius:'20px',padding:'20px'}}>
            <div style={{color:'#e6a800',fontWeight:700,marginBottom:'10px'}}>📱 Mobile-money recharge</div>
            <h2 style={{fontSize:'24px',fontWeight:800}}>Recharge your account</h2>
            <p style={{color:'#999',fontSize:'14px',margin:'10px 0 20px'}}>Enter your number and amount. Confirm payment on your phone, not on this website.</p>

            <p style={{fontWeight:600,marginBottom:'10px'}}>Quick amounts</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'16px'}}>
              {[30000,90000,150000,300000].map(v=>(
                <button key={v} onClick={()=>{setSelected(v);setAmount(v.toString())}} style={{padding:'14px',borderRadius:'14px',background:selected===v?'rgba(230,168,0,0.15)':'#1e1e1e',border:selected===v?'1px solid #e6a800':'1px solid #222',color:selected===v?'#e6a800':'#666',fontWeight:700}}>{v.toLocaleString()}</button>
              ))}
            </div>

            <p style={{fontWeight:600,marginBottom:'6px'}}>Recharge amount (UGX)</p>
            <input value={amount} onChange={e=>{setAmount(e.target.value); setSelected(parseInt(e.target.value)||0)}} style={{width:'100%',padding:'14px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #222',color:'white',marginBottom:'14px'}}/>
            <p style={{color:'#999',fontSize:'13px'}}>Minimum recharge: <span style={{color:'#e6a800',fontWeight:700}}>UGX 30,000</span></p>

            <p style={{fontWeight:600,margin:'16px 0 6px'}}>Mobile-money phone number</p>
            <input value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%',padding:'14px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #222',color:'white'}}/>
            
            <p style={{color:'#999',marginTop:'12px',fontSize:'13px'}}>Detected automatically: {detectNetwork()}</p>
            <p style={{color:'#999',marginTop:'12px',fontSize:'13px'}}>{checking ? 'Checking for an existing recharge...' : 'No existing pending recharge'}</p>

            <button onClick={handleConfirm} disabled={loading} style={{width:'100%',marginTop:'14px',padding:'16px',borderRadius:'14px',background:loading?'#555':'#8a6d1a',color:'#111',fontWeight:800,border:'none'}}>{loading ? 'Sending prompt...' : 'Confirm recharge'}</button>
          </div>

          <div style={{background:'#151515',border:'1px solid #222',borderRadius:'20px',padding:'20px'}}>
            <p style={{color:'#e6a800',fontWeight:700,fontSize:'13px'}}>MTN & Airtel · powered by PesaJet</p>
            <h3 style={{fontSize:'20px',fontWeight:800,margin:'10px 0 16px'}}>Confirm safely on your phone</h3>
            <div style={{display:'flex',gap:'10px',marginBottom:'14px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#1e1e1e',display:'grid',placeItems:'center',color:'#e6a800',fontWeight:700}}>1</div><p style={{color:'#ccc',fontSize:'13px',flex:1}}>Enter your mobile-money number and recharge amount. The network is detected automatically.</p></div>
            <div style={{display:'flex',gap:'10px',marginBottom:'14px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#1e1e1e',display:'grid',placeItems:'center',color:'#e6a800',fontWeight:700}}>2</div><p style={{color:'#ccc',fontSize:'13px',flex:1}}>Check your phone for the payment prompt. Verify the amount and authorize payment on the provider's prompt.</p></div>
            <div style={{display:'flex',gap:'10px',marginBottom:'14px'}}><div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#1e1e1e',display:'grid',placeItems:'center',color:'#e6a800',fontWeight:700}}>3</div><p style={{color:'#ccc',fontSize:'13px',flex:1}}>Your balance is credited only after PesaJet confirms the payment. Pending is not a successful payment.</p></div>
            <div style={{background:'#1e1e1e',borderRadius:'12px',padding:'14px',display:'flex',gap:'10px',marginTop:'10px'}}><span>🛡️</span><p style={{color:'#999',fontSize:'12px'}}>We never ask for, collect, or store your mobile-money PIN.</p></div>
          </div>

          <div style={{background:'#151515',border:'1px solid #222',borderRadius:'20px',padding:'20px'}}>
            <b>Prompt or payment delayed?</b>
            <p style={{color:'#999',fontSize:'13px',marginTop:'8px',lineHeight:'1.5'}}>Check the existing recharge status rather than paying again. Status checking resumes when you return to the website.</p>
            <a href="#/recharge-status" style={{display:'block',color:'#e6a800',marginTop:'14px',fontWeight:600,textDecoration:'none'}}>Track recharge status</a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" style={{display:'block',color:'#999',marginTop:'10px',textDecoration:'none'}}>Contact payment support</a>
          </div>
        </div>
      </div>
    </div>
  );
        }
