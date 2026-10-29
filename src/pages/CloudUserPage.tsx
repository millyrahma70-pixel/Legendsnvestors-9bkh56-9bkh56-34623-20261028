import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupabaseClient } from '@/lib/api';

export default function CloudUserPage() {
  const [userEmail, setUserEmail] = useState('Guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const client = await getSupabaseClient();
        const { data } = await client.auth.getSession();
        if (data?.session?.user?.email) {
          setUserEmail(data.session.user.email);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-[#c9a84c]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-[#c9a84c]">LEGENDS INVESTORS</h1>
        <p className="text-[#c9a84c] mt-1">Welcome, {userEmail} 👋</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4">
            <div className="text-gray-400 text-sm">Balance</div>
            <div className="text-xl font-bold text-[#c9a84c]">UGX 0</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4">
            <div className="text-gray-400 text-sm">Total</div>
            <div className="text-xl font-bold">UGX 0</div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Link to="/product" className="block w-full h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center px-4">📦 Products</Link>
          <Link to="/tasks" className="block w-full h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center px-4">✅ Tasks</Link>
          <Link to="/recharge" className="block w-full h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center px-4">💳 Recharge</Link>
          <Link to="/withdraw" className="block w-full h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center px-4">💸 Withdraw</Link>
          <Link to="/" className="block w-full h-12 rounded-xl bg-[#c9a84c] text-black font-bold flex items-center justify-center">← Go Home</Link>
          <Link to="/login" className="block w-full h-12 rounded-xl border border-[#c9a84c] text-[#c9a84c] flex items-center justify-center">Go to Login</Link>
        </div>
      </div>
    </div>
  );
}
