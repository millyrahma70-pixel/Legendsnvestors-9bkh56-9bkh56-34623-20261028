import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '@/lib/api';

export default function RegisterPage(){
  const [step,setStep]=useState(1);
  const [name,setName]=useState('');const [phone,setPhone]=useState('');const [pass,setPass]=useState('');const [confirm,setConfirm]=useState('');const [ref,setRef]=useState('');const [email,setEmail]=useState('');const [show,setShow]=useState(false);const [msg,setMsg]=useState('');const [loading,setLoading]=useState(false);
  const nav=useNavigate();

  useEffect(()=>{
    // Get ref from URL - works for /#/register?ref=CODE and /?ref=CODE
    try {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const fromHash = new URLSearchParams(hash.split('?')[1] || '').get('ref');
      const fromSearch = new URLSearchParams(search).get('ref');
      const code = (fromHash || fromSearch || '').toUpperCase();
      if(code) setRef(code);
      else {
        // Try localStorage saved ref
        const saved = localStorage.getItem('pending_ref') || '';
        if(saved) setRef(saved);
      }
    } catch {}
  },[]);

  async function handleStep1(e:any){
    e.preventDefault();
    if(!name.trim()) return setMsg('Enter Full Name');
    if(!phone.trim()) return setMsg('Enter Phone Number');
    if(pass.length<6) return setMsg('Password at least 6 characters');
    if(pass!==confirm) return setMsg('Passwords do not match');
    setMsg(''); setStep(2);
  }

  async function handleStep2(e:any){
    e.preventDefault();
    if(!email.trim()) return setMsg('Enter email for verification');
    setLoading(true);setMsg('Creating account...');
    
    // Try Supabase if available
    try{
      const c=await getSupabaseClient();
      if(c) await (c as any).auth.signUp({email:`${phone}@legends.local`,password:pass,options:{data:{full_name:name,phone,ref,email}}});
    }catch(err){ console.log('Supabase offline, using local', err); }

    // FIXED SAVE - ARRAY format + setCurrentUser
    try{
      const existing = localStorage.getItem('legend_users');
      let usersArray: any[] = [];
      try {
        const parsed = JSON.parse(existing || '[]');
        usersArray = Array.isArray(parsed) ? parsed : Object.values(parsed);
      } catch { usersArray = []; }

      const newUser = {
        id: 'user_' + Date.now(),
        full_name: name,
        name: name,
        phone: phone,
        email: email,
        password: pass,
        referralCode: 'LG' + Math.random().toString(36).substr(2,6).toUpperCase(),
        referredBy: ref || '6ED7FBECBA',
        balance: 9000,
        bonus: 9000,
        createdAt: new Date().toISOString()
      };

      // Remove old user with same phone
      usersArray = usersArray.filter((u:any) => u.phone !== phone);
      usersArray.push(newUser);
      
      localStorage.setItem('legend_users', JSON.stringify(usersArray));
      // SAVE CURRENT USER - THIS FIXES TEAM PAGE!
      localStorage.setItem('legend_current_user', JSON.stringify(newUser));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setMsg(`Account created! UGX 9,000 bonus! Redirecting...`);
      setTimeout(()=>nav('/home'),1000);
    }catch(err:any){
      console.error(err);
      setMsg('Error: ' + err.message);
    }
    setLoading(false);
  }

  const wrap={background:'#222',borderRadius:'16px',display:'flex',alignItems:'center',padding:'0 14px',border:'1px solid #333',marginBottom:'16px'} as any;
  const input={flex:1,background:'transparent',border:'none',height:'52px',color:'white',outline:'none',paddingLeft:'10px',fontSize:'15px'} as any;

  return(
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'16px'}}>
      <div style={{maxWidth:'420px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginTop:'8px'}}>
          <div style={{fontSize:'18px',color:'#e6b800',fontWeight:600}}>Investors Platform</div>
          <div style={{color:'#e6b800',letterSpacing:'3px',marginTop:'14px',fontSize:'16px'}}>CREATE YOUR ACCOUNT</div>
        </div>

        {step===1 ? (
        <>
          <div style={{background:'linear-gradient(90deg,#1a1a08,#2a2410)',border:'1px solid #3a3000',borderRadius:'20px',padding:'16px',display:'flex',alignItems:'center',gap:'14px',margin:'22px 0'}}>
            <div style={{width:'56px',height:'56px',background:'#ffcc00',borderRadius:'16px',display:'grid',placeItems:'center',fontSize:'26px'}}>🎁</div>
            <div><div style={{fontWeight:700}}>Registration Bonus</div><div style={{color:'#ffcc00',fontWeight:800,fontSize:'17px'}}>UGX 9,000 credited on activation</div></div>
          </div>
          <div style={{background:'#141414',border:'1px solid #222',borderRadius:'24px',padding:'20px'}}>
            <div style={{fontSize:'30px',fontWeight:800}}>Create Account</div>
            <div style={{color:'#e6b800',fontSize:'14px',marginBottom:'18px'}}>Step 1 of 2 · Account details</div>
            <form onSubmit={handleStep1}>
              <label style={{fontSize:'14px',color:'#999'}}>Full Name</label>
              <div style={wrap}><span>👤</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. John Doe" style={input}/></div>
              <label style={{fontSize:'14px',color:'#999'}}>Phone Number</label>
              <div style={wrap}><span>📞</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 0751234567" style={input}/></div>
              <label style={{fontSize:'14px',color:'#999'}}>Password</label>
              <div style={wrap}><span>🔒</span><input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="At least 6 characters" style={input}/><span onClick={()=>setShow(!show)} style={{cursor:'pointer'}}>👁️</span></div>
              <label style={{fontSize:'14px',color:'#999'}}>Confirm Password</label>
              <div style={wrap}><span>🔒</span><input type={show?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter password" style={input}/><span onClick={()=>setShow(!show)} style={{cursor:'pointer'}}>👁️</span></div>
              <label style={{fontSize:'14px',color:'#999'}}>Referral Code (Optional)</label>
              <div style={{...wrap,borderColor:ref?'#e6b800':'#333'}}><span>🎁</span><input value={ref} onChange={e=>setRef(e.target.value.toUpperCase())} placeholder="6ED7FBECBA" style={{...input,fontWeight:700}}/></div>
              {ref && <div style={{color:'#ffcc00',fontSize:'14px',marginBottom:'10px'}}>✓ Referral added: {ref}</div>}
              {msg && <div style={{background:'#2a2410',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontSize:'13px',marginBottom:'14px',textAlign:'center'}}>{msg}</div>}
              <button type="submit" style={{width:'100%',height:'56px',background:'#ffcc00',color:'black',fontWeight:900,fontSize:'17px',borderRadius:'16px',border:'none'}}>Continue</button>
              <div style={{textAlign:'center',marginTop:'16px',fontSize:'14px',color:'#aaa'}}>Already have an account? <Link to="/login" style={{color:'#ffcc00',fontWeight:700,textDecoration:'none'}}>Sign In</Link></div>
            </form>
          </div>
        </>
        ) : (
        <div style={{background:'#141414',border:'1px solid #222',borderRadius:'24px',padding:'20px',marginTop:'28px'}}>
          <div style={{color:'#e6b800',fontSize:'17px',fontWeight:700,marginBottom:'16px'}}>Step 2 of 2 · Email verification</div>
          <div style={{fontSize:'28px',fontWeight:800,marginBottom:'16px'}}>Finish your registration</div>
          <form onSubmit={handleStep2}>
            <label style={{fontSize:'16px',fontWeight:700,marginBottom:'8px',display:'block'}}>Email for verification</label>
            <div style={{...wrap,marginBottom:'18px',background:'#222'}}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={input}/></div>
            {msg && <div style={{background:'#2a2410',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontSize:'13px',marginBottom:'14px',textAlign:'center'}}>{msg}</div>}
            <button disabled={loading} type="submit" style={{width:'100%',height:'54px',background:'#ffcc00',color:'black',fontWeight:700,fontSize:'16px',borderRadius:'16px',border:'none',opacity:loading?0.6:1}}>{loading?'Creating account...':'Activate & Claim Bonus'}</button>
            <div onClick={()=>setStep(1)} style={{textAlign:'center',marginTop:'20px',fontWeight:600,cursor:'pointer',color:'#999'}}>Back to account details</div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
                                                                                                }
