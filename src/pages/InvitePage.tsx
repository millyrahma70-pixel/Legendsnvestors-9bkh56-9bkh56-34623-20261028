import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Copy, Check, Share2, Users, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCurrentUser, getTeamMembers, getTeamCommissions, formatUGX } from '@/lib/storage';
import { TELEGRAM_LINK } from '@/constants/products';

export default function InvitePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    try {
      const u = getCurrentUser();
      if (!u) {
        // Try manual fallback
        try {
          const raw = localStorage.getItem('legend_current_user') || localStorage.getItem('legend_session') || '';
          const parsed = JSON.parse(raw);
          if (parsed?.id) { setCurrentUser(parsed); setReady(true); return; }
        } catch {}
        navigate('/login', { replace: true });
        return;
      }
      setCurrentUser(u);
    } catch (e) {
      console.error(e);
      navigate('/login', { replace: true });
    } finally {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#c9a84c'}}>Loading...</div>;
  }

  if (!currentUser) {
    return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'white'}}><button onClick={()=>navigate('/login')} style={{padding:'16px 24px',background:'#c9a84c',borderRadius:'12px',color:'black',fontWeight:800}}>Login First</button></div>;
  }

  // SAFE team
  let level1: any[] = [], level2: any[] = [], level3: any[] = [];
  let commissions = { level1: 0, level2: 0, level3: 0, total: 0 } as any;
  try {
    const team = getTeamMembers(currentUser.id);
    level1 = Array.isArray(team?.level1) ? team.level1 : [];
    level2 = Array.isArray(team?.level2) ? team.level2 : [];
    level3 = Array.isArray(team?.level3) ? team.level3 : [];
    commissions = getTeamCommissions(currentUser.id) || commissions;
  } catch (e) {
    console.warn("Team corrupted", e);
  }
  
  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const referralCode = currentUser.referralCode || currentUser.id || 'NOCODE';
  const referralUrl = `${baseUrl}#/register?ref=${referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}&color=c9a84c&bgcolor=111111`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(referralUrl); } catch {}
    setCopied(true);
    toast.success('Invite link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Join Legend Investors! Register: ${referralUrl} Code: ${referralCode}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const levels = [
    { level: 1, label: 'Level 1', members: level1.length, rate: '27%', commission: commissions.level1, color: '#c9a84c', desc: 'Direct referral' },
    { level: 2, label: 'Level 2', members: level2.length, rate: '2%', commission: commissions.level2, color: '#a78234', desc: 'Level 1 referrals' },
    { level: 3, label: 'Level 3', members: level3.length, rate: '1%', commission: commissions.level3, color: '#7c6128', desc: 'Level 2 referrals' },
  ];

  return (
    <div className="app-container min-h-screen" style={{ background: '#0a0a0a', paddingBottom:'90px' }}>
      <div className="flex items-center gap-3 p-4" style={{ background: '#111111', borderBottom: '1px solid #2a2a2a' }}>
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#1e1e1e' }}>
          <ChevronLeft size={18} className="text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <Share2 size={16} className="text-[#c9a84c]" />
          <h1 className="text-white font-bold text-lg">Invite & Earn</h1>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-2xl p-5" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2 mb-4">
          <QrCode size={16} className="text-[#c9a84c]" />
          <p className="text-white font-bold text-sm">Your QR Code</p>
          <span className="text-gray-600 text-xs ml-auto">{referralCode}</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex-shrink-0 rounded-2xl p-3 flex items-center justify-center relative" style={{ background: '#111111', border: '2px solid rgba(201,168,76,0.5)', width: 140, height: 140 }}>
            {!qrLoaded && <QrCode size={40} className="text-[#c9a84c] opacity-40" />}
            <img ref={qrRef} src={qrUrl} alt="QR" className="w-full h-full object-contain rounded-xl" onLoad={() => setQrLoaded(true)} style={{ opacity: qrLoaded ? 1 : 0 }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-xs mb-2">Your link (every user has own):</p>
            <div className="rounded-xl px-3 py-2.5 mb-3 break-all" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
              <p className="text-[#c9a84c] text-[10px] leading-relaxed">{referralUrl}</p>
            </div>
            <button onClick={copyLink} className="w-full py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2" style={{background:'#c9a84c'}}>
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <button onClick={shareWhatsApp} className="py-3.5 rounded-2xl font-bold text-sm" style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}>💬 WhatsApp</button>
        <button onClick={() => window.open(TELEGRAM_LINK || 'https://t.me/', '_blank')} className="py-3.5 rounded-2xl font-bold text-sm" style={{ background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.3)', color: '#0088cc' }}>✈️ Telegram</button>
      </div>

      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2 mb-4"><Users size={16} className="text-[#c9a84c]" /><p className="text-white font-bold text-sm">3-Level Commission</p></div>
        <div className="space-y-2">
          {levels.map(lvl => (
            <div key={lvl.level} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#1e1e1e', border: `1px solid ${lvl.level === 1 ? 'rgba(201,168,76,0.25)' : '#2a2a2a'}` }}>
              <div><div className="flex items-center gap-2"><span className="text-[9px] font-bold text-black px-2 py-0.5 rounded-full" style={{ background: lvl.color }}>L{lvl.level}</span><p className="text-white text-xs font-semibold">{lvl.members} Members</p></div><p className="text-gray-600 text-[10px] mt-0.5">{lvl.desc}</p></div>
              <div className="text-right"><p className="font-black text-lg" style={{ color: lvl.color }}>{lvl.rate}</p><p className="text-gray-500 text-[10px]">{formatUGX(lvl.commission)}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    }
