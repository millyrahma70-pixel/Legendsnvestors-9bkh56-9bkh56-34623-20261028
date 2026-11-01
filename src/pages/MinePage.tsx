import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Shield, ListOrdered, Headphones, CreditCard, Gift, LogOut, ChevronRight, CreditCard as RechargeIcon, ArrowDownToLine, Activity, TrendingUp, UserCircle } from 'lucide-react';
import { getCurrentUser, setCurrentUser, formatUGX } from '@/lib/storage';

export default function MinePage() {
  const navigate = useNavigate();
  const [currentUser, setUserState] = useState<any>(null);

  useEffect(() => {
    let u = getCurrentUser();
    if (!u) {
      try {
        const curr = JSON.parse(localStorage.getItem('legend_current_user') || 'null');
        if (curr) u = curr;
      } catch {}
    }
    if (!u) { navigate('/login'); return; }
    setUserState(u);
  }, [navigate]);

  if (!currentUser) return <div style={{minHeight:'100vh',background:'#0a0a0a',display:'grid',placeItems:'center',color:'#c9a84c'}}>Loading...</div>;

  const handleSignOut = () => {
    try {
      localStorage.clear();
      setCurrentUser(null);
    } catch {}
    navigate('/login');
  };

  const menuItems = [
    { icon: UserCircle, label: 'Edit Profile', path: '/profile' },
    { icon: Info, label: 'About Us', path: '/about' },
    { icon: Shield, label: 'Regulation', path: '/regulation' },
    { icon: ListOrdered, label: 'Records', path: '/records' },
    { icon: Headphones, label: 'Customer Service', path: '/customer-service' },
    { icon: CreditCard, label: 'Bind Bank Card', path: '/bind-card' },
    { icon: TrendingUp, label: 'Recharge Status', path: '/recharge-status' },
    { icon: Activity, label: 'Withdrawal Status', path: '/withdraw-status' },
    { icon: Gift, label: 'Redeem Gift', path: '/redeem' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Balance Card */}
      <div className="mx-4 mt-4 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #1a1400, #2a2000)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid #c9a84c' }}>
            <span className="text-[#c9a84c] font-black text-xl">{(currentUser.phone || currentUser.email || 'U').charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-white font-bold text-base">{currentUser.phone || currentUser.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-black px-2.5 py-1 rounded-full" style={{ background: '#c9a84c' }}>Lv{currentUser.level || 1}</span>
              <span className="text-gray-400 text-sm">Referral: {currentUser.referralCode || 'LG'}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-1">Balance</p>
          <p className="text-[#c9a84c] text-3xl font-black">{formatUGX(currentUser.balance || 9000)}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: RechargeIcon, label: 'Recharge', path: '/recharge' },
            { icon: ArrowDownToLine, label: 'Withdraw', path: '/withdraw' },
            { icon: ListOrdered, label: 'Records', path: '/records' },
          ].map(action => {
            const Icon = action.icon;
            return (
              <button key={action.label} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-2 py-3 rounded-xl" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <Icon size={20} className="text-[#c9a84c]" />
                <span className="text-gray-300 text-sm"> {/* FIXED: was text-[10px] now text-sm BIGGER */}
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Center */}
      <button onClick={() => navigate('/tasks')} className="mx-4 mt-4 rounded-2xl overflow-hidden w-[calc(100%-2rem)] block text-left border border-[#2a2a2a]">
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=480&h=100&fit=crop" alt="" className="w-full h-24 object-cover" />
          <div className="absolute inset-0 flex items-center justify-between px-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div>
              <p className="text-white font-bold text-base">Task Center</p>
              <p className="text-gray-300 text-sm">Complete tasks and get generous bonuses</p>
            </div>
            <span className="text-[#c9a84c] text-sm font-bold">GO now -&gt;</span>
          </div>
        </div>
      </button>

      {/* Menu */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: '#151515', border: '1px solid #2a2a2a' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={() => navigate(item.path)} className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 border-b border-[#222] last:border-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.1)' }}>
                <Icon size={16} className="text-[#c9a84c]" />
              </div>
              <span className="flex-1 text-left text-gray-200 text-[15px]">{item.label}</span>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          );
        })}
      </div>

      {/* Sign Out - FIXED gold-gradient */}
      <div className="mx-4 mt-6">
        <button onClick={handleSignOut} className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 text-base" style={{ background: 'linear-gradient(90deg, #c9a84c, #f5d76e)' }}>
          <LogOut size={18} />Sign Out
        </button>
      </div>
    </div>
  );
              }
