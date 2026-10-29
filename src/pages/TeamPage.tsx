import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function formatUGX(n:number){ return `UGX ${n.toLocaleString()}`; }

export default function TeamPage() {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [team,setTeam]=useState({l1:[],l2:[],l3:[]});
  const [commissions,setCommissions]=useState({l1:0,l2:0,l3:0});

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ navigate('/login'); return; }
    const u=JSON.parse(s);
    setUser(u);
    const t=JSON.parse(localStorage.getItem(`legend_team_${u.id}`)||'{"l1":[],"l2":[],"l3":[]}');
    setTeam(t);
    const c=JSON.parse(localStorage.getItem(`legend_comm_${u.id}`)||'{"l1":0,"l2":0,"l3":0}');
    setCommissions(c);
  },[]);

  if (!user) return <div style={{minHeight:'100vh',background:'#0f0f0f',display:'grid',placeItems:'center',color:'#c9a84c'}}>Loading...</div>;

  const totalTeam = team.l1.length + team.l2.length + team.l3.length;
  const referralUrl = `${window.location.origin}/#/register?ref=${user.referralCode||user.id}`;

  const copy = async () => {
    try{ await navigator.clipboard.writeText(referralUrl); }catch{ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levels = [
    { level: 1, members: team.l1.length, rate: '27%', commission: commissions.l1 },
    { level: 2, members: team.l2.length, rate: '2%', commission: commissions.l2 },
    { level: 3, members: team.l3.length, rate: '1%', commission: commissions.l3 },
  ];

  return (
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',paddingBottom:'80px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        <div style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'4px',height:'22px',background:'#c9a84c',borderRadius:'2px'}}></div>
          <div style={{fontWeight:800,fontSize:'20px'}}>Team</div>
        </div>

        <div style={{margin:'0 16px 12px',borderRadius:'20px',padding:'20px', background:'linear-gradient(135deg,#1a1400,#2a2000)', border:'1px solid rgba(201,168,76,0.3)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <span style={{fontSize:'18px'}}>👥</span>
            <span style={{color:'#c9a84c',fontWeight:600,fontSize:'14px'}}>Total Team</span>
            <span style={{color:'white',fontWeight:900,fontSize:'24px',marginLeft:'auto'}}>{totalTeam}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:'14px', borderTop:'1px solid rgba(201,168,76,0.2)'}}>
            <div>
              <p style={{fontSize:'26px',fontWeight:900,color:'#c9a84c'}}>UGX 0</p>
              <p style={{color:'#666',fontSize:'11px',marginTop:'2px'}}>Team Deposit</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:'18px',fontWeight:900,color:'#c9a84c'}}>{formatUGX(commissions.l1+commissions.l2+commissions.l3)}</p>
              <p style={{color:'#666',fontSize:'11px',marginTop:'2px'}}>Total Commission</p>
            </div>
          </div>
        </div>

        <div style={{margin:'0 16px 12px',borderRadius:'20px',padding:'16px', background:'#151515', border:'1px solid #2a2a2a'}}>
          <p style={{color:'#888',fontSize:'13px',marginBottom:'8px',fontWeight:500}}>Share URL</p>
          <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
            <div style={{flex:1,borderRadius:'12px',padding:'10px 12px',fontSize:'11px',color:'#888', background:'#1e1e1e', border:'1px solid #333',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {referralUrl}
            </div>
            <button onClick={copy} style={{width:'40px',height:'40px',borderRadius:'12px',display:'grid',placeItems:'center',background:'#2a2a2a',border:'none',color:'white'}}>{copied?'✓':'⎙'}</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            <button onClick={copy} style={{padding:'14px',borderRadius:'14px',fontWeight:800,color:'black',fontSize:'13px',background:'linear-gradient(135deg,#c9a84c,#8b6914)',border:'none'}}>
              {copied?'Copied!':'Copy Link'}
            </button>
            <button onClick={()=>navigate('/invite')} style={{padding:'14px',borderRadius:'14px',fontWeight:700,fontSize:'13px', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', color:'#c9a84c'}}>
              Invite Page
            </button>
          </div>
        </div>

        <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
          {levels.map((lvl, i) => (
            <div key={lvl.level} style={{borderRadius:'18px',padding:'16px', background:i===0?'linear-gradient(135deg,#1a1400,#2a2000)':'#151515', border:i===0?'1px solid rgba(201,168,76,0.4)':'1px solid #2a2a2a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontWeight:900,color:'white',fontSize:'15px'}}>Level {lvl.level}</p>
                  <p style={{color:'#666',fontSize:'11px',marginTop:'2px'}}>{lvl.members} Members</p>
                </div>
                <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'9px',color:'#666'}}>Rate</p>
                    <p style={{color:'#c9a84c',fontWeight:900,fontSize:'22px'}}>{lvl.rate}</p>
                  </div>
                  <div style={{width:'1px',height:'40px',background:'rgba(201,168,76,0.2)'}}></div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontSize:'9px',color:'#666'}}>Commission</p>
                    <p style={{color:'white',fontWeight:700,fontSize:'13px'}}>{formatUGX(lvl.commission)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalTeam === 0 ? (
          <div style={{margin:'0 16px',borderRadius:'20px',padding:'40px',textAlign:'center', background:'#151515'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>👥</div>
            <p style={{color:'#666',fontSize:'13px'}}>No Members yet</p>
            <p style={{color:'#444',fontSize:'11px',marginTop:'4px'}}>Share your invite link to grow your team</p>
          </div>
        ) : (
          <div style={{padding:'0 16px'}}>
            <h3 style={{color:'white',fontWeight:600,fontSize:'13px',marginBottom:'8px'}}>Level 1 Members</h3>
            {team.l1.map((m:any)=>(
              <div key={m.id} style={{borderRadius:'12px',padding:'12px',display:'flex',justifyContent:'space-between',marginBottom:'6px', background:'#151515', border:'1px solid #2a2a2a'}}>
                <div><p style={{color:'white',fontSize:'13px',fontWeight:500}}>{m.phone||m.id}</p><p style={{color:'#666',fontSize:'11px'}}>{new Date(m.createdAt||Date.now()).toLocaleDateString()}</p></div><span style={{color:'#c9a84c',fontSize:'11px',fontWeight:600}}>Lv1</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#1a1a1a',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',padding:'8px 0 10px'}}>
        <Link to="/home" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>🏠</div><div style={{fontSize:'11px',color:'#888'}}>Home</div></Link>
        <Link to="/products" style={{textAlign:'center',textDecoration:'none',flex:1}}><div style={{color:'#888'}}>📦</div><div style={{fontSize:'11px',color:'#888'}}>Products</div></Link>
        <Link to="/team" style={{textAlign:'center',textDecoration:'none',flex:1,background:'#2a2410',borderRadius:'14px',margin:'0 4px'}}><div style={{color:'#c9a84c'}}>👥</div><div style={{fontSize:'11px',color:'#c9a84c',fontWeight:700}}>Team</div></Link>
        <Link to="/account" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>👤</div><div style={{fontSize:'11px',color:'#888'}}>Account</div></Link>
      </div>
    </div>
  );
          }
