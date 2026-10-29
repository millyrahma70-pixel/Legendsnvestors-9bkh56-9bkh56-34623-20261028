import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',paddingBottom:'90px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#111',borderBottom:'1px solid #222'}}>
          <button onClick={() => navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'10px',background:'#1e1e1e',border:'none',color:'#888',fontSize:'18px'}}>‹</button>
          <h1 style={{fontWeight:700,fontSize:'16px'}}>About Us</h1>
        </div>

        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=260&fit=crop" alt="Legend BMW" style={{width:'100%',height:'180px',objectFit:'cover'}} />

        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid rgba(230,168,0,0.2)'}}>
            <h2 style={{color:'#e6a800',fontWeight:900,fontSize:'20px',marginBottom:'12px'}}>Legend — BMW</h2>
            <p style={{color:'#999',fontSize:'13px',lineHeight:'1.6'}}>Legend is a premium investment community built around immersive Legend One BMW technology, strength and the courage of Africa's most majestic animals.</p>
            <p style={{color:'#999',fontSize:'13px',lineHeight:'1.6',marginTop:'12px'}}>Our investment plans allow members to build income through clear daily returns, transparent plan periods and dependable account services.</p>
          </div>

          <div style={{borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid #222'}}>
            <h3 style={{color:'#e6a800',fontWeight:700,fontSize:'15px',marginBottom:'14px'}}>Legendary BMW Heritage</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {[
                { model: 'BMW M1', desc: 'Built between 1978 and 1981, this wedge-shaped, mid-engined supercar designed by Giugiaro birthed the high-performance BMW M Division.' },
                { model: 'BMW E30 M3', desc: 'Launched in 1986, this pure driving machine dominated global touring car racing with its high-revving S14 four-cylinder engine.' },
                { model: 'BMW 3.0 CSL "Batmobile"', desc: 'Introduced in 1973, this aerodynamic lightweight champion first wore the iconic M stripes.' },
                { model: 'BMW 2002', desc: 'This compact sport sedan solidified BMW reputation worldwide as the creator of the Ultimate Driving Machine.' },
                { model: 'BMW E39 M5', desc: 'Widely regarded as the ultimate sports sedan, pairing a sublime chassis with a muscular 4.9-liter V8 engine.' },
                { model: 'BMW Z8', desc: 'Styled by Henrik Fisker with an aluminum spaceframe, this modern classic famously starred in the James Bond film "The World Is Not Enough".' },
              ].map(item => (
                <div key={item.model} style={{paddingLeft:'12px',borderLeft:'2px solid rgba(230,168,0,0.4)'}}>
                  <p style={{color:'#e6a800',fontWeight:600,fontSize:'13px'}}>{item.model}</p>
                  <p style={{color:'#777',fontSize:'11px',marginTop:'4px',lineHeight:'1.5'}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{borderRadius:'20px',padding:'20px',background:'#151515',border:'1px solid #222'}}>
            <p style={{color:'#999',fontSize:'13px',lineHeight:'1.6'}}>Every Legend plan is built on three promises: transparent pricing, clear earnings information and responsive member support.</p>
            <p style={{color:'#999',fontSize:'13px',lineHeight:'1.6',marginTop:'12px'}}>Legend celebrates ambition across Africa and gives every member a confident, premium place to grow their financial journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
                  }
