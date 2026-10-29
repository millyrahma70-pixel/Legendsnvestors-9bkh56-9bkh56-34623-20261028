import { useNavigate } from 'react-router-dom';

const WHATSAPP = '966557067827';
const TELEGRAM = 'https://t.me/+-dWGeVqFYhllZWY0';

const PRODUCTS = [
  { vip:1, price:30000, daily:4500, term:60, total:270000 },
  { vip:2, price:42000, daily:9000, term:60, total:540000 },
  { vip:3, price:50000, daily:11000, term:60, total:660000 },
  { vip:4, price:68000, daily:15000, term:60, total:900000 },
  { vip:5, price:80000, daily:19800, term:60, total:1188000 },
  { vip:6, price:100000, daily:21000, term:60, total:1260000 },
  { vip:7, price:150000, daily:32500, term:60, total:1950000 },
  { vip:8, price:250000, daily:50000, term:60, total:3000000 },
  { vip:9, price:300000, daily:75000, term:60, total:4500000 },
  { vip:10, price:550000, daily:121000, term:60, total:7260000 },
  { vip:11, price:800000, daily:176000, term:60, total:10560000 },
  { vip:12, price:1000000, daily:200000, term:60, total:12000000 },
  { vip:13, price:1500000, daily:300000, term:60, total:18000000 },
];

export default function RegulationPage() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'480px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222',position:'sticky',top:0,zIndex:10}}>
          <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888'}}>‹</button>
          <h1 style={{fontWeight:700}}>Regulation - 13 Products</h1>
        </div>

        <div style={{padding:'20px',background:'linear-gradient(135deg,#0f0f0a,#1a1400)',display:'flex',gap:'16px'}}>
          <div style={{flex:1}}>
            <h2 style={{fontSize:'22px',fontWeight:800}}>LEGEND<br/><span style={{color:'#e6a800'}}>ONE BMW</span></h2>
            <p style={{color:'#e6a800',fontWeight:600,fontSize:'13px',marginTop:'6px'}}>13 VIP Levels</p>
            <p style={{color:'#666',fontSize:'10px',marginTop:'4px'}}>Invest in the Future, Earn Every Day • 60 Days Term</p>
          </div>
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&h=120&fit=crop" alt="BMW" style={{width:'110px',height:'110px',borderRadius:'12px',objectFit:'cover',border:'1px solid rgba(230,168,0,0.3)'}}/>
        </div>

        <div style={{padding:'16px'}}>
          <div style={{borderRadius:'16px',overflow:'hidden',border:'1px solid #222'}}>
            <div style={{display:'grid',gridTemplateColumns:'50px 75px 60px 75px 35px',background:'linear-gradient(135deg,#e6a800,#f0c040)',padding:'10px 2px',textAlign:'center',fontWeight:800,color:'black',fontSize:'11px'}}>
              <div>VIP</div><div>Price</div><div>Daily</div><div>Total</div><div>Days</div>
            </div>
            {PRODUCTS.map((p,i)=>(
              <div key={p.vip} style={{display:'grid',gridTemplateColumns:'50px 75px 60px 75px 35px',background:i%2===0?'#151515':'#111',borderTop:'1px solid #222',padding:'10px 2px',textAlign:'center',fontSize:'11px',alignItems:'center'}}>
                <div><span style={{background:p.vip<=3?'#e6a800':p.vip<=8?'#c9a84c':'#a78234',color:'black',padding:'3px 6px',borderRadius:'20px',fontSize:'9px',fontWeight:800}}>VIP{p.vip}</span></div>
                <div style={{color:'#fff',fontWeight:600}}>{p.price.toLocaleString()}</div>
                <div style={{color:'#e6a800',fontWeight:600}}>{p.daily.toLocaleString()}</div>
                <div style={{color:'#888',fontSize:'10px'}}>{(p.total/1000).toFixed(0)}K</div>
                <div style={{color:'#666'}}>{p.term}</div>
              </div>
            ))}
          </div>
          <p style={{fontSize:'10px',color:'#555',marginTop:'8px',textAlign:'center'}}>13 Products • Min 30,000 UGX • Income daily at 00:00 UTC</p>
        </div>

        <div style={{margin:'0 16px',background:'#151515',border:'1px solid #222',borderRadius:'16px',padding:'16px'}}>
          <p style={{fontWeight:700,fontSize:'13px',marginBottom:'10px',color:'#e6a800'}}>Profit Example</p>
          <div style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'11px',color:'#888',lineHeight:'1.5'}}>
            <p>VIP1: 30K → 4.5K/day = 270K total (9x)</p>
            <p>VIP7: 150K → 32.5K/day = 1.95M total (13x)</p>
            <p>VIP13: 1.5M → 300K/day = 18M total (12x)</p>
            <p style={{marginTop:'6px',color:'#666'}}>Invite bonus: 27% Level1, 2% Level2, 1% Level3 • Registration bonus 9K UGX</p>
          </div>
        </div>

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" style={{display:'block',textAlign:'center',padding:'14px',background:'#25d366',borderRadius:'12px',color:'white',fontWeight:700,textDecoration:'none'}}>WhatsApp Support: +966557067827</a>
          <a href={TELEGRAM} target="_blank" style={{display:'block',textAlign:'center',padding:'12px',background:'#1e1e1e',borderRadius:'12px',color:'#0088cc',textDecoration:'none',border:'1px solid #222'}}>Official Telegram</a>
        </div>
      </div>
      
    </div>
  );
          }
