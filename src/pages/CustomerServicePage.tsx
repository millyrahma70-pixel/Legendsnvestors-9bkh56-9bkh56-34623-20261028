import { useNavigate } from 'react-router-dom';

const TELEGRAM_LINK = 'https://t.me/+-dWGeVqFYhllZWY0';
const CUSTOMER_SERVICE = '+966557067827';
const WHATSAPP_NUMBER = '966557067827';

export default function CustomerServicePage() {
  const navigate = useNavigate();

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={() => navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888',fontSize:'18px'}}>‹</button>
          <h1 style={{fontWeight:700,fontSize:'16px'}}>Customer Service</h1>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid rgba(230,168,0,0.2)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'#e6a800',display:'grid',placeItems:'center',fontSize:'22px'}}>💬</div>
              <div>
                <p style={{fontWeight:700}}>Legend Support</p>
                <p style={{color:'#e6a800',fontSize:'11px'}}>Online time: 9:00 - 20:00</p>
              </div>
            </div>
            <p style={{color:'#999',fontSize:'13px',lineHeight:'1.6'}}>For any questions about our platform, please contact our online customer service. They will answer all your questions.</p>
            <p style={{color:'#777',fontSize:'13px',marginTop:'8px',lineHeight:'1.6'}}>If our online customer service does not reply immediately, please wait patiently — every message is answered.</p>
          </div>

          <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" style={{display:'block',borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid #222',textDecoration:'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'#0088cc',display:'grid',placeItems:'center',color:'white',fontSize:'20px',fontWeight:800}}>✈</div>
              <div style={{flex:1}}>
                <p style={{color:'white',fontWeight:700}}>Official Telegram</p>
                <p style={{color:'#e6a800',fontSize:'11px',wordBreak:'break-all'}}>{TELEGRAM_LINK}</p>
                <p style={{color:'#666',fontSize:'10px',marginTop:'2px'}}>Click to join our Telegram group</p>
              </div>
            </div>
          </a>

          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{display:'block',borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid rgba(37,211,102,0.3)',textDecoration:'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'#25d366',display:'grid',placeItems:'center',fontSize:'22px'}}>📞</div>
              <div>
                <p style={{color:'white',fontWeight:700}}>WhatsApp Support</p>
                <p style={{color:'#25d366',fontSize:'16px',fontWeight:700,marginTop:'2px'}}>{CUSTOMER_SERVICE}</p>
                <p style={{color:'#666',fontSize:'11px'}}>Tap to chat on WhatsApp</p>
              </div>
            </div>
          </a>

          <div style={{borderRadius:'16px',padding:'16px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
            <p style={{color:'#ef4444',fontSize:'13px',fontWeight:600,marginBottom:'8px'}}>⚠ Security Notice</p>
            <p style={{color:'#888',fontSize:'12px'}}>Never share your password with anyone. Official staff will <strong style={{color:'#ef4444'}}>never</strong> ask for your password.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
