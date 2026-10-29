import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '@/lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleReg(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const client = await getSupabaseClient();
      const { data, error } = await (client as any).auth.signUp({ email, password });
      if (error) {
        setMsg(error.message);
      } else {
        setMsg('Account created! Check email, then login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err: any) {
      setMsg(err?.message || 'Backend offline, try later');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-[#c9a84c] mb-2">Create Account</h1>
      <p className="text-sm text-gray-400 mb-6">Join Legends Investors</p>
      
      <form onSubmit={handleReg} className="w-full max-w-sm bg-[#1a1a1a] border border-[#c9a84c]/30 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
            className="mt-1 w-full h-11 rounded-xl bg-[#0f0f0f] border border-[#333] px-4 text-white outline-none focus:border-[#c9a84c]" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 chars"
            className="mt-1 w-full h-11 rounded-xl bg-[#0f0f0f] border border-[#333] px-4 text-white outline-none focus:border-[#c9a84c]" />
        </div>
        
        {msg && <div className="text-sm text-[#c9a84c] bg-[#c9a84c]/10 p-3 rounded-xl">{msg}</div>}
        
        <button disabled={loading} type="submit"
          className="w-full h-12 rounded-xl bg-[#c9a84c] text-black font-bold hover:opacity-90 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <div className="flex justify-between text-sm pt-2">
          <Link to="/login" className="text-[#c9a84c] hover:underline">Have account? Sign In</Link>
          <Link to="/" className="text-gray-400 hover:underline">← Home</Link>
        </div>
      </form>
    </div>
  );
      }
