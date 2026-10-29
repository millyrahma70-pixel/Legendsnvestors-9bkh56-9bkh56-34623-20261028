import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TITLES: Record<string, string> = { overview: 'At a glance', users: 'User Management', orders: 'Payment Approvals', recharges: 'Recharge Approvals', withdrawals: 'Withdrawal Approvals', products: 'Package Management', gifts: 'Rewards & Redeem Codes', settings: 'Website Settings', audit: 'Activity & Ledger' };

export default function AdminPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [logoutBusy, setLogoutBusy] = useState(false);
  const requestedTab = params.get('tab') || 'overview';
  const tab = Object.prototype.hasOwnProperty.call(TITLES, requestedTab) ? requestedTab : 'overview';
  const status = params.get('orderStatus');
  const ledgerUser = params.get('ledgerUser');
  
  const signOut = () => { 
    setLogoutBusy(true); 
    localStorage.removeItem('admin_session');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 p-4 bg-[#151515] rounded-2xl border border-[#2a2a2a]">
          <h1 className="text-xl font-bold">Legend Investors - Admin</h1>
          <button 
            onClick={signOut} 
            disabled={logoutBusy}
            className="px-4 py-2 bg-red-900/30 text-red-400 rounded-xl text-sm border border-red-900/50"
          >
            {logoutBusy ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{TITLES[tab] || TITLES.overview}</h2>
            <p className="mt-1 text-sm text-gray-500">Admin Panel - Legend Investors</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-[#1e1e1e] text-gray-400 text-sm border border-[#2a2a2a]">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(TITLES).map(([key,title])=>(
            <button 
              key={key}
              onClick={()=>navigate(`/admin?tab=${key}`)}
              className={`p-4 rounded-2xl text-left border ${tab===key ? 'bg-[#e6a800] text-black border-[#e6a800]' : 'bg-[#151515] border-[#2a2a2a] text-white'}`}
            >
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs opacity-70 mt-1">{key}</p>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[#2a2a2a] bg-[#151515] p-8">
          <h3 className="text-lg font-semibold mb-4">{TITLES[tab]} - Content</h3>
          <p className="text-gray-500 text-sm">
            Tab: {tab}<br/>
            Search: {params.get('search') || 'none'}<br/>
            This is simplified admin view. Full SiteAdmin components need dependencies that crash build.
            <br/><br/>
            To restore full admin: install missing packages: lucide-react, sonner, @/components/ui/button, useSite hook
          </p>
          <div className="mt-6 p-4 bg-[#0a0a0a] rounded-xl">
            <p className="text-xs text-gray-600">Admin Quick Stats (from localStorage)</p>
            <p className="text-sm mt-2">Users: {JSON.parse(localStorage.getItem('legend_users')||'[]').length}</p>
            <p className="text-sm">Records: {JSON.parse(localStorage.getItem('legend_records')||'[]').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
