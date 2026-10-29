import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '@/lib/api';

export default function LoginPage(){
  const [phone,setPhone]=useState('');const [pass,setPass]=useState('');const [show,setShow]=useState(false);const [msg,setMsg]=useState('');const [loading,setLoading]=useState(false);const nav=useNavigate();

  async function login(e:any){
    e.preventDefault(); 
    if(!phone.trim()) return setMsg('Enter phone number'); 
    if(!pass.trim()) return setMsg('Enter password');
    setLoading(true);setMsg('');
    try{
      const c=await getSupabaseClient();
      const {error,data}=await (c as any).auth.signInWithPassword({email:`${phone}@legends.local`,password:pass});
      if(error){
        // Try local storage fallback
        const users = JSON.parse(localStorage.getItem('legend_users')||'{}');
        const u = users[`${phone}@legends.local`];
        if(u && u.password===pass){
          localStorage.setItem('legend_session', JSON.stringify({user:{email:`${phone}@legends.local`, user_metadata:u.data}}));
          setMsg('Welcome back! (Demo mode)');
          setTimeout(()=>nav('/home'),800);
        } else {
          setMsg(error.message);
        }
      } else if(data?.session) { 
        localStorage.setItem('legend_session', JSON.stringify(data.session));
        setMsg('Welcome back!'); 
        setTimeout(()=>nav('/home'),800); 
      } else {
        setMsg('Check credentials');
      }
    }catch(err:any){ 
      // FULL OFFLINE MODE - check localStorage
      try{
        const users = JSON.parse(localStorage.getItem('legend_users')||'{}');
        const key = `${phone}@legends.local`;
        const u = users[key];
        if(!u){
          setMsg('Account not found. Please Create Account first');
        } else if(u.password!==pass){
          setMsg('Wrong password');
        } else {
          localStorage.setItem('legend_session', JSON.stringify({user:{email:key, user_metadata:u.data}, access_token:'demo'}));
          setMsg('Welcome back! (Offline mode - Going to dashboard...)');
          setTimeout(()=>nav('/home'),800);
        }
      }catch{
        setMsg('Login failed - please register first');
      }
    }
    setLoading(false);
  }

  const wrap={background:'#222',borderRadius:'16px',display:'flex',alignItems:'center',padding:'0 14px',border:'1px solid #333',marginBottom:'16px'} as any;
  const input={flex:1,background:'transparent',border:'none',height:'52px',color:'white',outline:'none',paddingLeft:'10px',fontSize:'15px'} as any;

  return(
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'16px'}}>
      <div style={{maxWidth:'420px',margin:'0 auto',textAlign:'center'}}>
        <div style={{fontSize:'54px',fontWeight:900,marginTop:'10px'}}>LEGEND</div>
        <div style={{color:'#e6b800',fontSize:'20px',fontWeight:600,marginTop:'-4px'}}>Investors Platform</div>
        <div style={{color:'#e6b800',letterSpacing:'3px',marginTop:'20px',fontSize:'16px'}}>WELCOME BACK</div>
        
        <div style={{background:'#141414',border:'1px solid #222',borderRadius:'24px',padding:'20px',marginTop:'28px',textAlign:'left'}}>
          <div style={{fontSize:'28px',fontWeight:800}}>Sign In</div>
          <div style={{color:'#e6b800',fontSize:'14px',marginBottom:'18px'}}>Step 1 of 1 · Welcome back</div>
          
          <form onSubmit={login}>
            <label style={{fontSize:'14px',color:'#999'}}>Phone Number</label>
            <div style={wrap}><span>📞</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 0751234567" style={input}/></div>
            
            <label style={{fontSize:'14px',color:'#999'}}>Password</label>
            <div style={wrap}><span>🔒</span><input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Your password" style={input}/><span onClick={()=>setShow(!show)} style={{cursor:'pointer'}}>👁️</span></div>
            
            {msg && <div style={{background:'#2a2410',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontSize:'13px',marginBottom:'14px',textAlign:'center'}}>{msg}</div>}
            
            <button disabled={loading} type="submit" style={{width:'100%',height:'56px',background:'#ffcc00',color:'black',fontWeight:900,fontSize:'17px',borderRadius:'16px',border:'none',opacity:loading?0.6:1}}>{loading?'Signing in...':'Sign In'}</button>
            
            <div style={{textAlign:'center',marginTop:'16px',fontSize:'14px',color:'#aaa'}}>Don't have account? <Link to="/register" style={{color:'#ffcc00',fontWeight:700,textDecoration:'none'}}>Create Account</Link></div>
            <div style={{textAlign:'center',marginTop:'10px'}}><Link to="/" style={{color:'#666',fontSize:'13px',textDecoration:'none'}}>← Home</Link></div>
          </form>
        </div>
        <div style={{textAlign:'center',marginTop:'18px',color:'#666',fontSize:'14px'}}>🎧 Need help? Contact support</div>
      </div>
    </div>
  );
        }
