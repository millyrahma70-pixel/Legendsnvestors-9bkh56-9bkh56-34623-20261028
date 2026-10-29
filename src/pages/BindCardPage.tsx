import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BANKS = ['MTN', 'AIRTEL'];

export default function BindCardPage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [bank, setBank] = useState('');
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankPicker, setShowBankPicker] = useState(false);

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    const u=JSON.parse(s);
    setUser(u);
    setBank(u.bankCard?.bank||'');
    setHolderName(u.bankCard?.holderName||u.phone||'');
    setAccountNumber(u.bankCard?.accountNumber||'');
  },[]);

  if (!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  const handleConfirm = () => {
    if (!bank) { alert('Please select a bank'); return; }
    if (!holderName.trim()) { alert('Please enter account holder name'); return; }
    if (!accountNumber.trim()) { alert('Please enter bank account number'); return; }
    
    const updated={...user,bankCard:{bank,holderName:holderName.trim(),accountNumber:accountNumber.trim()}};
    localStorage.setItem('legend_session',JSON.stringify(updated));
    const users=JSON.parse(localStorage.getItem('legend_users')||'[]');
    const idx=users.findIndex((u:any)=>u.id===user.id);
    if(idx>=0){ users[idx]=updated; localStorage.setItem('legend_users',JSON.stringify(users)); }
    
    alert('Bank card bound successfully!');
    navigate('/mine');
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        {showBankPicker && (
          <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'end',justifyContent:'center',background:'rgba(0,0,0,0.8)'}}>
            <div style={{width:'100%',maxWidth:'440px',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'24px 24px 0 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #2a2a2a'}}>
                <button onClick={() => setShowBankPicker(false)} style={{background:'none',border:'none',color:'#888',fontSize:'14px'}}>Cancel</button>
                <p style={{color:'white',fontWeight:700}}>Select Bank</p>
                <button onClick={() => setShowBankPicker(false)} style={{background:'none',border:'none',color:'#e6a800',fontWeight:700,fontSize:'14px'}}>Confirm</button>
              </div>
              {BANKS.map(b => (
                <button key={b} onClick={() => { setBank(b); setShowBankPicker(false); }}
                  style={{width:'100%',padding:'16px 20px',textAlign:'left',background:'transparent',border:'none',borderBottom:'1px solid #222',display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'white',fontSize:'15px',fontWeight:500}}>{b}</span>
                  {bank === b && <span style={{color:'#e6a800'}}>✓</span>}
                </button>
              ))}
              <div style={{height:'24px'}} />
            </div>
          </div>
        )}

        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={() => navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888',fontSize:'18px'}}>‹</button>
          <h1 style={{fontWeight:700,fontSize:'16px'}}>Bind Bank Card</h1>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid #222'}}>
            <div style={{marginBottom:'16px'}}>
              <label style={{color:'#e6a800',fontSize:'13px',fontWeight:600,display:'block',marginBottom:'8px'}}>* Select Bank</label>
              <button onClick={() => setShowBankPicker(true)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #333',color:bank?'white':'#666',fontSize:'14px'}}>
                <span>{bank || 'Please select'}</span><span>▼</span>
              </button>
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={{color:'#e6a800',fontSize:'13px',fontWeight:600,display:'block',marginBottom:'8px'}}>* Account Holder Name</label>
              <input type="text" value={holderName} onChange={e => setHolderName(e.target.value)} placeholder="User name" style={{width:'100%',padding:'16px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #333',color:'white',outline:'none',fontSize:'14px'}} />
            </div>
            <div style={{marginBottom:'20px'}}>
              <label style={{color:'#e6a800',fontSize:'13px',fontWeight:600,display:'block',marginBottom:'8px'}}>* Bank Account</label>
              <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter MTN or Airtel number" style={{width:'100%',padding:'16px',borderRadius:'12px',background:'#1e1e1e',border:'1px solid #333',color:'white',outline:'none',fontSize:'14px'}} />
            </div>
            <button onClick={handleConfirm} style={{width:'100%',padding:'16px',borderRadius:'12px',fontWeight:800,background:'#e6a800',color:'black',border:'none',fontSize:'15px'}}>Confirm</button>
          </div>

          <div style={{borderRadius:'16px',padding:'16px',background:'#151515',border:'1px solid #222'}}>
            <p style={{color:'#666',fontSize:'11px',lineHeight:'1.5'}}>Please enter your actual MTN or Airtel Money account number. Incorrect information may result in failed withdrawals.</p>
          </div>
        </div>
      </div>
    </div>
  );
                              }
