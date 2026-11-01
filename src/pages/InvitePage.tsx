import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Copy, Check, Share2, Users, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCurrentUser, getTeamMembers, getTeamCommissions, formatUGX } from '@/lib/storage';
import { TELEGRAM_LINK } from '@/constants/products';

export default function InvitePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let u = getCurrentUser();
    if (!u) {
      try {
        const sess = JSON.parse(localStorage.getItem('legend_session') || 'null');
        const curr = JSON.parse(localStorage.getItem('legend_current_user') || localStorage.getItem('currentUser') || 'null');
        u = curr || (sess?.user ? {
          id: sess.user.id || sess.user.email,
          phone: sess.user.user_metadata?.phone || sess.user.email,
          referralCode: sess.user.user_metadata?.referral_code || sess.user.user_metadata?.ref || sess.user.user_metadata?.referralCode,
          full_name: sess.user.user_metadata?.full_name,
          email: sess.user.email,
        } : null);
      } catch {}
    }
    if (!u) { navigate('/login'); return; }
    setUser(u);
  }, [navigate]);

  if (!user) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#c9a84c'}}>Loading...</div>;

  const { level1, level2, level3 } = getTeamMembers(user.id);
  const commissions = getTeamCommissions(user.id);
  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const referralUrl = `${baseUrl}#/register?ref=${user.referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}&color=f0bf47&bgcolor=111111`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success('Invite link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Join Legend Investors and earn daily income! Register with my link:\n${referralUrl}\n\nGet UGX 9,000 bonus on registration!`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(TELEGRAM_LINK, '_blank');
  };

  const levels = [
    { level: 1, label: 'Level 1', members: level1.length, rate: '27%', commission: commissions.level1, color: '#f0bf47', desc: 'Direct referral commission' },
    { level: 2, label: 'Level 2', members: level2.length, rate: '2%', commission: commissions.level2, color: '#ce9f2d', desc: 'Second generation referral' },
    { level: 3, label: 'Level 3', members: level3.length, rate: '1%', commission: commissions.level3, color: '#bc8d2d', desc: 'Third generation referral' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0b0d0f', color: '#f5f7fb', paddingBottom: 28 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '12px 12px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px 18px' }}>
          <button onClick={() => navigate(-1)} style={{ width: 42, height: 42, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#f5f7fb', cursor: 'pointer' }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 size={18} color="#f0bf47" />
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Invite & Earn</h1>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(35,27,12,0.95), rgba(18,20,24,0.95))', border: '1px solid rgba(240,191,71,0.22)', borderRadius: 22, padding: 18, position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ position: 'absolute', top: -24, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,191,71,0.18), transparent 68%)' }} />
          <div style={{ color: '#b5bdc8', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Legend Investors</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 900, letterSpacing: '-0.05em' }}>Invite Friends</h2>
          <p style={{ margin: '0 0 16px', color: '#f0bf47', fontSize: 15, fontWeight: 700 }}>
            Earn up to <span style={{ fontSize: 23, fontWeight: 900 }}>27%</span> commission instantly
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {[
              { label: 'Registration Bonus', value: 'UGX 9K' },
              { label: 'Your Code', value: user.referralCode || 'LGDEMO' },
              { label: 'Level 1 Rate', value: '27%' },
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(0,0,0,0.24)', borderRadius: 14, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ color: '#f0bf47', fontWeight: 900, fontSize: 14, marginBottom: 4 }}>{item.value}</div>
                <div style={{ color: '#aab3be', fontSize: 9, lineHeight: 1.3 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 22, padding: 16, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <QrCode size={16} color="#f0bf47" />
            <span style={{ color: '#edf2f8', fontWeight: 800, fontSize: 15 }}>Your QR Code</span>
            <span style={{ marginLeft: 'auto', color: '#8d98a4', fontSize: 11 }}>Scan to register</span>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 142, height: 142, borderRadius: 18, padding: 12, background: '#111417', border: '2px solid rgba(240,191,71,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {!qrLoaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#8d98a4', fontSize: 11 }}>
                  Loading QR...
                </div>
              )}
              <img ref={qrRef} src={qrUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: qrLoaded ? 1 : 0, transition: 'opacity 0.2s ease' }} onLoad={() => setQrLoaded(true)} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#aab3be', fontSize: 11, marginBottom: 8 }}>Share your invite link:</div>
              <div style={{ background: '#191d22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 12px', marginBottom: 12, wordBreak: 'break-all' }}>
                <span style={{ color: '#f0bf47', fontSize: 11, lineHeight: 1.5 }}>{referralUrl}</span>
              </div>
              <button onClick={copyLink} style={{ width: '100%', border: 'none', borderRadius: 12, background: 'linear-gradient(135deg, #f3d57a 0%, #dfb547 45%, #d3a536 100%)', color: '#101214', fontWeight: 900, padding: '11px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 18 }}>
          <button onClick={shareWhatsApp} style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.28)', borderRadius: 14, padding: '12px 10px', color: '#25d366', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            WhatsApp
          </button>
          <button onClick={shareTelegram} style={{ background: 'rgba(0,136,204,0.08)', border: '1px solid rgba(0,136,204,0.28)', borderRadius: 14, padding: '12px 10px', color: '#4db7ff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            Telegram
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 22, padding: 16, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Users size={16} color="#f0bf47" />
            <span style={{ color: '#edf2f8', fontWeight: 800 }}>3-Level Commission</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ background: 'linear-gradient(135deg, #f3d57a 0%, #dfb547 45%, #d3a536 100%)', color: '#101214', fontWeight: 900, borderRadius: 10, padding: '8px 14px', fontSize: 11 }}>YOU</div>
            <div style={{ width: 2, height: 12, background: '#f0bf47', borderRadius: 999, margin: '8px 0 4px' }} />
            {levels.map((lvl) => (
              <div key={lvl.level} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: lvl.level === 1 ? 'linear-gradient(135deg, #f3d57a 0%, #dfb547 45%, #d3a536 100%)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: lvl.level === 1 ? '#101214' : '#edf2f8', borderRadius: 10, padding: '8px 12px', fontSize: 11, fontWeight: 800 }}>{`Lv${lvl.level} · ${lvl.rate}`}</div>
                <div style={{ width: 2, height: 8, background: 'rgba(240,191,71,0.45)', borderRadius: 999, marginTop: 5 }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {levels.map((lvl) => (
              <div key={lvl.level} style={{ background: '#171b20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: lvl.color, color: '#101214', fontSize: 9, fontWeight: 900, borderRadius: 999, padding: '4px 6px' }}>L{lvl.level}</span>
                    <span style={{ fontWeight: 700, color: '#edf2f8' }}>{lvl.members} Members</span>
                  </div>
                  <div style={{ color: '#8d98a4', fontSize: 10, marginTop: 4 }}>{lvl.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: lvl.color, fontWeight: 900, fontSize: 20 }}>{lvl.rate}</div>
                  <div style={{ color: '#aab3be', fontSize: 10 }}>{formatUGX(lvl.commission)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(240,191,71,0.04)', border: '1px solid rgba(240,191,71,0.14)', borderRadius: 18, padding: 16 }}>
          <div style={{ color: '#f0bf47', fontWeight: 900, marginBottom: 10 }}>How it works</div>
          <div style={{ display: 'grid', gap: 8, color: '#aab3be', fontSize: 12, lineHeight: 1.6 }}>
            <div>1. Share your unique invite link or QR code with friends.</div>
            <div>2. When they register and make a deposit, you instantly earn <strong style={{ color: '#f0bf47' }}>27%</strong> of their investment.</div>
            <div>3. When their referrals invest, you earn <strong style={{ color: '#f0bf47' }}>2%</strong>. Their referrals earn you <strong style={{ color: '#f0bf47' }}>1%</strong>.</div>
            <div>4. Commission is credited to your balance immediately after their recharge is approved.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
