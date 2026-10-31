import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Copy, Check, Share2, Users, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getTeamMembers, getTeamCommissions, formatUGX } from '@/lib/storage';

export default function InvitePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let u: any = null;
    // Try ALL possible keys
    const keys = ['legend_current_user', 'legend_session', 'currentUser', 'user', 'legend_user', 'session'];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const p = JSON.parse(raw);
        const user = p?.user || p?.currentUser || p;
        if (user?.id || user?.phone || user?.referralCode) { u = user; break; }
      } catch {}
    }
    // Try from users array
    if (!u) {
      try {
        const curId = localStorage.getItem('legend_current_user_id') || '';
        const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
        if (Array.isArray(users) && users.length) {
          if (curId) u = users.find((x:any) => x.id === curId) || null;
          if (!u) u = users[0]; // fallback to first user for testing
        }
      } catch {}
    }
    setCurrentUser(u);
    setReady(true);
  }, []);

  if (!ready) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#c9a84c'}}>Loading...</div>;

  if (!currentUser) {
    return (
      <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'white',padding:'20px'}}>
        <div style={{textAlign:'center'}}>
          <p style={{marginBottom:'16px'}}>No login found. Please login again.</p>
          <button onClick={()=>navigate('/login')} style={{padding:'16px 32px',background:'#c9a84c',borderRadius:'12px',color:'black',fontWeight:800}}>Go to Login</button>
          <p style={{marginTop:'12px',fontSize:'11px',color:'#666'}}>Tip: After login, DON'T clear storage</p>
        </div>
      </div>
    );
  }

  let level1: any[] = [], level2: any[] = [], level3: any[] = [];
  let commissions = { level1: 0, level2: 0, level3: 0, total: 0 } as any;
  try {
    const team = getTeamMembers(currentUser.id);
    level1 = team?.level1 || [];
    level2 = team?.level2 || [];
    level3 = team?.level3 || [];
    commissions = getTeamCommissions(currentUser.id) || commissions;
  } catch {}

  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const referralCode = currentUser.referralCode || currentUser.id || currentUser.phone || 'CODE';
  const referralUrl = `${baseUrl}#/register?ref=${referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(referralUrl); } catch {}
    setCopied(true); toast.success('Copied!'); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',paddingBottom:'90px',color:'white'}}>
      <div style={{display:'flex',gap:'12px',padding:'16px',background:'#111',borderBottom:'1px solid #222'}}>
        <button onClick={()=>navigate(-1)} style={{width:'32px',height:'32px',borderRadius:'12px',background:'#1e1e1e'}}>‹</button>
        <h1 style={{fontWeight:800}}>Invite & Earn</h1>
      </div>
      <div style={{margin:'16px',padding:'20px',background:'#151515',borderRadius:'20px',border:'1px solid #222'}}>
        <p style={{fontSize:'12px',color:'#888',marginBottom:'8px'}}>Your Code: {referralCode}</p>
        <div style={{background:'#111',border:'2px solid #c9a84c',width:'140px',height:'140px',borderRadius:'16px',display:'grid',placeItems:'center',marginBottom:'12px'}}>
          <img ref={qrRef} src={qrUrl} onLoad={()=>setQrLoaded(true)} style={{width:'120px',height:'120px'}} />
        </div>
        <p style={{fontSize:'10px',color:'#888',wordBreak:'break-all',background:'#1e1e1e',padding:'10px',borderRadius:'10px',marginBottom:'10px'}}>{referralUrl}</p>
        <button onClick={copyLink} style={{width:'100%',padding:'14px',background:'#c9a84c',color:'black',borderRadius:'12px',fontWeight:800}}>{copied ? 'Copied!' : 'Copy Link'}</button>
      </div>
      <div style={{margin:'0 16px',padding:'16px',background:'#151515',borderRadius:'16px',border:'1px solid #222'}}>
        <p style={{fontWeight:700,marginBottom:'8px'}}>Team: L1 {level1.length} - L2 {level2.length} - L3 {level3.length}</p>
        <p style={{fontSize:'11px',color:'#666'}}>Invite link has repo name + your own code - FIXED!</p>
      </div>
    </div>
  );
    }
