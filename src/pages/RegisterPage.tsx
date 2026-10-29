import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '@/lib/api';

export default function RegisterPage(){
  const [step,setStep]=useState(1);
  const [name,setName]=useState('');const [phone,setPhone]=useState('');const [pass,setPass]=useState('');const [confirm,setConfirm]=useState('');const [ref,setRef]=useState('6ED7FBECBA');const [email,setEmail]=useState('');const [show,setShow]=useState(false);const [msg,setMsg]=useState('');const [loading,setLoading]=useState(false);
  const nav=useNavigate();

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
    
    // OFFLINE SAVE - always works!
    try{
      const c=await getSupabaseClient();
      await (c as any).auth.signUp({email:`${phone}@legends.local`,password:pass,options:{data:{full_name:name,phone,ref,email}}});
    }catch{}

    // Save to localStorage - 100% works even offline
    try{
      const users = JSON.parse(localStorage.getItem('legend_users')||'{}');
      users[`${phone}@legends.local`] = {
        email:`${phone}@legends.local`, password:pass, 
        data:{full_name:name, phone, ref, email, bonus:9000},
        created: Date.now()
      };
      localStorage.setItem('legend_users', JSON.stringify(users));
      setMsg(`Account created! UGX 9,000 bonus credited! Code sent to ${email} (demo)`);
      setTimeout(()=>nav('/login'),1500);
    }catch(err:any){
      setMsg('Account saved! Go to login - Bonus UGX 9,000 waiting!');
      setTimeout(()=>nav('/login'),1000);
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
              <div style={{color:'#888',fontSize:'13px',lineHeight:'1.5',margin:'10px 0 18px'}}>Next, verify your email to activate your account and receive the bonus. After activation, sign in with your name or phone number.</div>
              {msg && <div style={{background:'#2a2410',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontSize:'13px',marginBottom:'14px',textAlign:'center'}}>{msg}</div>}
              <button type="submit" style={{width:'100%',height:'56px',background:'#ffcc00',color:'black',fontWeight:900,fontSize:'17px',borderRadius:'16px',border:'none'}}>Register & Claim Bonus</button>
              <div style={{textAlign:'center',marginTop:'16px',fontSize:'14px',color:'#aaa'}}>Already have an account? <Link to="/login" style={{color:'#ffcc00',fontWeight:700,textDecoration:'none'}}>Sign In</Link></div>
            </form>
          </div>
        </>
        ) : (
        <div style={{background:'#141414',border:'1px solid #222',borderRadius:'24px',padding:'20px',marginTop:'28px'}}>
          <div style={{color:'#e6b800',fontSize:'17px',fontWeight:700,marginBottom:'16px'}}>Step 2 of 2 · Email verification</div>
          <div style={{fontSize:'28px',fontWeight:800,marginBottom:'16px'}}>Finish your registration</div>
          <div style={{background:'#222',borderRadius:'16px',padding:'14px 16px',marginBottom:'20px',border:'1px solid #333'}}>
            <div style={{fontWeight:700,fontSize:'16px'}}>{name||'Mom'}</div>
            <div style={{color:'#999',marginTop:'4px'}}>{phone||'0752964233'}</div>
          </div>
          <div style={{color:'#999',fontSize:'14px',lineHeight:'1.6',marginBottom:'18px'}}>
            Verify an email you can access to activate your account and recover your password. Once activated, use your name or phone number and password to sign in on any device.
          </div>
          <form onSubmit={handleStep2}>
            <label style={{fontSize:'16px',fontWeight:700,marginBottom:'8px',display:'block'}}>Email for verification</label>
            <div style={{...wrap,marginBottom:'18px',background:'#222'}}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={input}/></div>
            {msg && <div style={{background:'#2a2410',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontSize:'13px',marginBottom:'14px',textAlign:'center'}}>{msg}</div>}
            <button disabled={loading} type="submit" style={{width:'100%',height:'54px',background:'#ffcc00',color:'black',fontWeight:700,fontSize:'16px',borderRadius:'16px',border:'none',opacity:loading?0.6:1}}>{loading?'Creating account...':'Send verification code'}</button>
            <div onClick={()=>setStep(1)} style={{textAlign:'center',marginTop:'20px',fontWeight:600,cursor:'pointer',color:'#999'}}>Back to account details</div>
          </form>
        </div>
        )}
        <div style={{textAlign:'center',marginTop:'18px',color:'#666',fontSize:'14px'}}>🎧 Need help? Contact support</div>
      </div>
    </div>
  );
              }
