import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TASKS = [
  { level: 'Lv1', label: 'Invite 5 Level 1 investors', reward: 10000, target: 5 },
  { level: 'Lv2', label: 'Invite 10 Level 1 investors', reward: 40000, target: 10 },
  { level: 'Lv3', label: 'Invite 30 Level 1 investors', reward: 130000, target: 30 },
  { level: 'Lv4', label: 'Invite 60 Level 1 investors', reward: 280000, target: 60 },
];

export default function TaskCenterPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [l1Count, setL1Count] = useState(0);
  const [claimed, setClaimed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem('legend_session');
      if (!s) { navigate('/login'); return; }
      const u = JSON.parse(s);
      setUser(u);
      
      const team = JSON.parse(localStorage.getItem(`legend_team_${u.id}`) || '[]');
      setL1Count(team.length || 0);
      
      const c = JSON.parse(localStorage.getItem(`legend_tasks_claimed_${u.id}`) || '[]');
      setClaimed(c);
    } catch { navigate('/login'); }
  }, [navigate]);

  const formatUGX = (n: number) => `UGX ${n.toLocaleString()}`;

  const cumulativeRewards = claimed.reduce((sum, lvl) => {
    const t = TASKS.find(x => x.level === lvl);
    return sum + (t?.reward || 0);
  }, 0);

  const handleClaim = (task: any) => {
    if (l1Count < task.target) { alert(`Need ${task.target} invites, you have ${l1Count}`); return; }
    if (claimed.includes(task.level)) { alert('Already claimed'); return; }
    
    const newClaimed = [...claimed, task.level];
    setClaimed(newClaimed);
    localStorage.setItem(`legend_tasks_claimed_${user.id}`, JSON.stringify(newClaimed));
    
    const newBal = (user.balance || 0) + task.reward;
    const updated = { ...user, balance: newBal };
    setUser(updated);
    localStorage.setItem('legend_session', JSON.stringify(updated));
    
    alert(`Claimed ${formatUGX(task.reward)}!`);
  };

  if (!user) return <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'grid', placeItems: 'center', color: '#c9a84c' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#111', borderBottom: '1px solid #2a2a2a' }}>
        <button onClick={() => navigate(-1)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#1e1e1e', border: 'none', color: '#888', display: 'grid', placeItems: 'center' }}>‹</button>
        <h1 style={{ fontWeight: 700, fontSize: '18px' }}>Task Center</h1>
      </div>

      {/* Cumulative Rewards */}
      <div style={{ margin: '16px', borderRadius: '20px', padding: '20px', background: 'linear-gradient(135deg, #1a1400, #2a2000)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <p style={{ color: '#9a9a9a', fontSize: '13px', marginBottom: '6px' }}>Cumulative rewards</p>
        <p style={{ color: '#c9a84c', fontSize: '32px', fontWeight: 900 }}>{formatUGX(cumulativeRewards)}</p>
        <p style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>L1 Investors: {l1Count}</p>
      </div>

      {/* Task List */}
      <div style={{ padding: '0 16px', display: 'grid', gap: '12px' }}>
        {TASKS.map(task => {
          const progress = Math.min((l1Count / task.target) * 100, 100);
          const isCompleted = l1Count >= task.target;
          const isClaimed = claimed.includes(task.level);
          
          return (
            <div key={task.level} style={{ borderRadius: '20px', padding: '16px', background: '#151515', border: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: 'black', padding: '2px 8px', borderRadius: '20px', background: 'linear-gradient(135deg, #c9a84c, #e6b800)' }}>{task.level}</span>
                    <span style={{ color: '#ddd', fontSize: '14px' }}>{task.label}</span>
                  </div>
                  <p style={{ color: '#666', fontSize: '12px' }}>Get: <span style={{ color: '#c9a84c', fontWeight: 700 }}>{formatUGX(task.reward)}</span></p>
                </div>
                <span style={{ fontSize: '10px', color: isClaimed ? '#25D366' : isCompleted ? '#c9a84c' : '#666', padding: '4px 8px', borderRadius: '20px', background: '#222' }}>
                  {isClaimed ? 'Claimed' : isCompleted ? 'Ready to claim' : 'In Progress'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: '6px' }}>
                <span>{l1Count} Current</span>
                <span>{task.target} Target</span>
              </div>

              <div style={{ width: '100%', height: '6px', borderRadius: '10px', background: '#2a2a2a' }}>
                <div style={{ height: '6px', borderRadius: '10px', background: 'linear-gradient(90deg, #c9a84c, #e6b800)', width: `${progress}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <p style={{ fontSize: '10px', color: '#666' }}>{l1Count}/{task.target} Progress</p>
                <button 
                  onClick={() => handleClaim(task)}
                  disabled={isClaimed || !isCompleted}
                  style={{ 
                    background: isClaimed ? '#2a2a2a' : isCompleted ? '#e6b800' : '#333', 
                    color: isClaimed ? '#666' : isCompleted ? 'black' : '#666',
                    border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    cursor: isClaimed || !isCompleted ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isClaimed ? 'Claimed' : isCompleted ? 'Claim' : 'Locked'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1e1e1e', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-around', padding: '8px 0 14px' }}>
        <Link to="/home" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>⌂</div><div style={{ fontSize: '12px' }}>Home</div></Link>
        <Link to="/products" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>◫</div><div style={{ fontSize: '12px' }}>Products</div></Link>
        <Link to="/team" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>👥</div><div style={{ fontSize: '12px' }}>Team</div></Link>
        <Link to="/mine" style={{ textAlign: 'center', textDecoration: 'none', color: '#888', flex: 1 }}><div>👤</div><div style={{ fontSize: '12px' }}>Account</div></Link>
      </div>
    </div>
  );
}
