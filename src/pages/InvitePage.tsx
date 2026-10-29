import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TELEGRAM_LINK = 'https://t.me/+-dWGeVqFYhllZWY0';
const WHATSAPP = '966557067827';

export default function InvitePage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [copied,setCopied]=useState(false);

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    const u=JSON.parse(s);
    setUser(u);
  },[]);

  if(!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#e6a800'}}>Loading...</div>;

  const referralCode = user.referralCode || user.id?.slice(0,6).toUpperCase() || 'LEGEND';
  const referralUrl = `${window.location.origin}/#/register?ref=${referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}&color=e6a800&bgcolor=151515`;

  const copyLink=()=>{
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>‹</button>
          <h1 style={{fontWeight:700}}>Invite & Earn</h1>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{borderRadius:'20px',padding:'20px',background:'linear-gradient(135deg,#1a1100,#2d1f00)',border:'1px solid rgba(230,168,0,0.4)'}}>
            <p style={{color:'#e6a800',fontSize:'12px'}}>Legend Investors</p>
            <h2 style={{fontSize:'22px',fontWeight:800,margin:'4px 0'}}>Invite Friends</h2>
            <p style={{color:'#e6a800',fontWeight:600}}>Earn up to <b style={{fontSize:'20px'}}>27%</b> commission instantly</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginTop:'14px'}}>
              <div style={{background:'rgba(0,0,0,0.4)',borderRadius:'12px',padding:'10px',textAlign:'center'}}><p style={{color:'#e6a800',fontWeight:800}}>UGX 9K</p><p style={{color:'#666',fontSize:'9px'}}>Bonus</p></div>
              <div style={{background:'rgba(0,0,0,0.4)',borderRadius:'12px',padding:'10px',textAlign:'center'}}><p style={{color:'#e6a800',fontWeight:800}}>{referralCode}</p><p style={{color:'#666',fontSize:'9px'}}>Your Code</p></div>
              <div style={{background:'rgba(0,0,0,0.4)',borderRadius:'12px',padding:'10px',textAlign:'center'}}><p style={{color:'#e6a800',fontWeight:800}}>27%</p><p style={{color:'#666',fontSize:'9px'}}>Level 1</p></div>
            </div>
          </div>

          <div style={{background:'#151515',border:'1px solid #222',borderRadius:'20px',padding:'20px'}}>
            <p style={{fontWeight:700,marginBottom:'12px'}}>📱 Your QR Code</p>
            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <img src={qrUrl} alt="QR" style={{width:'120px',height:'120px',borderRadius:'12px',background:'#111',padding:'8px'}}/>
              <div style={{flex:1}}>
                <p style={{color:'#888',fontSize:'11px',marginBottom:'6px'}}>Share your invite link:</p>
                <div style={{background:'#1e1e1e',border:'1px solid #333',borderRadius:'12px',padding:'10px',wordBreak:'break-all'}}>
                  <p style={{color:'#e6a800',fontSize:'10px'}}>{referralUrl}</p>
                </div>
                <button onClick={copyLink} style={{width:'100%',marginTop:'10px',padding:'12px',borderRadius:'12px',background:'#e6a800',color:'black',fontWeight:800,border:'none'}}>{copied?'✓ Copied!':'Copy Link'}</button>
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`
