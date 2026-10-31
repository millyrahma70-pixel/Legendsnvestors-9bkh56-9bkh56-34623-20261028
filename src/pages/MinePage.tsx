import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Shield, ListOrdered, Headphones, CreditCard, Gift, LogOut, ChevronRight, CreditCard as RechargeIcon, ArrowDownToLine, Activity, TrendingUp, UserCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const formatUGX = (n:number) => `UGX ${Number(n||0).toLocaleString()}`;

export default function MinePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const sStr = localStorage.getItem('legend_session');
      if (!sStr) { navigate('/login'); return; }
      const s = JSON.parse(sStr);
      const u = s.user || {};
      const bonus = u.user_metadata?.bonus || 9000;
      const balance = s.balance != null ? s.balance : bonus;
      if (s.balance !== balance) {
        s.balance = balance;
        localStorage.setItem('legend_session', JSON.stringify(s));
      }
      const uid = u.email || u.phone || 'default';
      const prods = JSON.parse(localStorage.getItem(`legend_products_${uid}`) || '[]');
      const all = JSON.parse(localStorage.getItem('legend_all_purchases') || '[]');
      const hasProduct = prods.length > 0 || all.filter((x:any) => x.userId === uid || x.email === uid).length > 0;
      setUser({
        phone: u.phone || u.user_metadata?.phone || u.email || 'User',
        referralCode: u.user_metadata?.ref || '----',
        level: u.level || 1,
        balance: balance,
        bankCard: s.bankCard || null,
        hasProduct,
      });
    } catch (e) {
      console.error(e);
      navigate('/login');
    }
  }, []);

  if (!user) return <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: 20, color: '#fff' }}>Loading account...</div>;

  const menuItems = [
    { icon: UserCircle, label: 'Edit Profile', path: '/profile' },
    { icon: Info, label: 'About Us', path: '/about' },
    { icon: Shield, label: 'Regulation', path: '/regulation' },
    { icon: ListOrdered, label: 'Records', path: '/records' },
    { icon: Headphones, label: 'Customer Service', path: '/customer-service' },
    { icon: CreditCard, label: 'Bind Bank Card', path: '/bind-card', sub: user.bankCard ? `${user.bankCard.bank} - ${user.bankCard.accountNumber}` : 'Not bound' },
    { icon: TrendingUp, label: 'Recharge Status', path: '/recharge-status' },
    { icon: Activity, label: 'Withdrawal Status', path: '/withdraw-status' },
    { icon: Gift, label: 'Redeem Gift', path: '/redeem' },
  ];

  return (
    <AppLayout>
      <div className="mx-4 mt-4 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #1a1400, #2a2000)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid #c9a84c' }}>
            <UserCircle size={28} className="text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-white font-bold">{user.phone}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-black px-2 py-0.5 rounded-full" style={{ background: '#c9a84c' }}>Lv{user.level}</span>
              <span className="text-gray-500 text-xs">Referral: {user.referralCode}</span>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <p className="text-gray-500 text-xs mb-1">Balance</p>
          <p className="text-[#c9a84c] text-3xl font-black">{formatUGX(user.balance)}</p>
          <p className="text-[11px] mt-1" style={{ color: user.hasProduct ? '#22c55e' : '#ef4444' }}>
            {user.hasProduct ? '✓ Product active - Min withdraw 9000' : '🔒 Buy product to unlock UGX 9,000'}
          </p>
          {user.bankCard && <p className="text-[11px] text-gray-400 mt-1">💳 {user.bankCard.bank} - {user.bankCard.accountNumber} ✓</p>}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: RechargeIcon, label: 'Recharge', path: '/recharge' },
            { icon: ArrowDownToLine, label: 'Withdraw', path: '/withdraw' },
            { icon: ListOrdered, label: 'Records', path: '/records' },
          ].map(a => {
            const Icon = a.icon;
            return <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-1.5 py-2 rounded-xl" style={{ background: 'rgba(201,168,76,0.1)' }}><Icon size={18} className="text-[#c9a84c]" /><span className="text-gray-400 text-[10px]">{a.label}</span></button>;
          })}
        </div>
      </div>
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => navigate(item.path)} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5" style={{ borderBottom: i < menuItems.length - 1 ? '1px solid #222' : 'none' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}><Icon size={15} className="text-[#c9a84c]" /></div>
              <div className="flex-1 text-left"><span className="text-gray-300 text-sm">{item.label}</span>{(item as any).sub && <p className="text-[10px] text-gray-500">{(item as any).sub}</p>}</div>
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          );
        })}
      </div>
      <div className="mx-4 mt-3 mb-4">
        <button onClick={() => { localStorage.removeItem('legend_session'); navigate('/login'); }} className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #c9a84c, #f0c040)' }}><LogOut size={16} />Sign Out</button>
      </div>
    </AppLayout>
  );
             }
