import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const nav = useNavigate();
  
  useEffect(()=>{
    // Auto redirect
    const s = localStorage.getItem('legend_session');
    if(s){
      nav('/home');
    }
  },[]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'grid',
      placeItems: 'center',
      color: '#c9a84c',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{maxWidth:'360px'}}>
        <div style={{fontSize:'52px',fontWeight:900,color:'white',lineHeight:'0.9'}}>LEGEND</div>
        <div style={{color:'#e6a800',fontSize:'18px',fontWeight:600,marginTop:'4px',letterSpacing:'2px'}}>Investors Platform</div>
        
        <div style={{marginTop:'30px',background:'#1a1a0f',border:'1px solid #2a2410',borderRadius:'20px',padding:'20px'}}>
          <h1 style={{fontSize:'20px', fontWeight: 'bold', marginBottom:'10px', color:'white'}}>
            Welcome to Legend
          </h1>
          <p style={{fontSize:'14px', color:'#888', lineHeight:'1.5'}}>
            Your account, products and rewards in one place. Get UGX 9,000 bonus on activation.
          </p>
          <div style={{marginTop:'20px',display:'flex',gap:'10px'}}>
            <Link to="/login" style={{flex:1,background:'#e6a800',color:'black',padding:'14px',borderRadius:'14px',fontWeight:800,textDecoration:'none',fontSize:'14px'}}>Sign In</Link>
            <Link to="/register" style={{flex:1,background:'#222',color:'white',border:'1px solid #333',padding:'14px',borderRadius:'14px',fontWeight:700,textDecoration:'none',fontSize:'14px'}}>Create Account</Link>
          </div>
        </div>

        <p style={{marginTop:'24px',fontSize:'12px',color:'#555'}}>
          ✅ GitHub Pages is WORKING!<br/>
          <span style={{color:'#e6a800'}}>Build v-final - Offline mode enabled</span>
        </p>

        <div style={{marginTop:'16px',display:'flex',gap:'12px',justifyContent:'center'}}>
          <Link to="/home" style={{color:'#666',fontSize:'12px',textDecoration:'none'}}>Go to Home →</Link>
          <Link to="/login" style={{color:'#e6a800',fontSize:'12px',textDecoration:'none'}}>Go to Login →</Link>
        </div>
      </div>
    </div>
  )
}
export default Index;
