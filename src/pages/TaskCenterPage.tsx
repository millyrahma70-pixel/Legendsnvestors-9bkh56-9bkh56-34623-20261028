import { useNavigate } from 'react-router-dom';

export default function TaskCenterPage() {
  const navigate = useNavigate();
  
  // Get L1 count from localStorage
  let l1Count = 0;
  try {
    const session = localStorage.getItem('legend_session');
    if (session) {
      const u = JSON.parse(session);
      const users = JSON.parse(localStorage.getItem('legend_users') || '[]');
      const team = users.filter((x: any) => x.invitedBy === u.referralCode || x.invitedBy === u.id || x.referralCode === u.referralCode);
      l1Count = team.length;
    }
  } catch {}

  const tasks = [
    { lv: 'Lv1', label: 'Invite 5 Level 1 investors', reward: 10000, target: 5 },
    { lv: 'Lv2', label: 'Invite 10 Level 1 investors', reward: 40000, target: 10 },
    { lv: 'Lv3', label: 'Invite 30 Level 1 investors', reward: 130000, target: 30 },
    { lv: 'Lv4', label: 'Invite 60 Level 1 investors', reward: 280000, target: 60 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', paddingBottom: '20px' }}>
      <div style={{ padding: '14px 16px', background: '#111', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#1e1e1e', border: 'none', color: 'white' }}>‹</button>
        <h1 style={{ fontWeight: 700, fontSize: '18px' }}>Task Center</h1>
      </div>

      <div style={{ margin: '16px', borderRadius: '20px', padding: '20px', background: 'linear-gradient(135deg, #1a1400, #2a2000)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <p style={{ color: '#888', fontSize: '13px' }}>Cumulative rewards</p>
        <p style={{ color: '#c9a84c', fontSize: '32px', fontWeight: 900, marginTop: '4px' }}>UGX 0</p>
      </div>

      <div style={{ padding: '0 16px', display: 'grid', gap: '12px' }}>
        {tasks.map(task => {
          const progress = Math.min((l1Count / task.target) * 100, 100);
          return (
            <div key={task.lv} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: '18px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e6b800)', color: 'black', fontSize: '11px', fontWeight: 900, padding: '3px 9px', borderRadius: '20px' }}>{task.lv}</span>
                    <span style={{ fontSize: '14px', color: '#ddd' }}>{task.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#777', marginTop: '6px' }}>Get: <span style={{ color: '#c9a84c', fontWeight: 700 }}>UGX {task.reward.toLocaleString()}</span></div>
                </div>
                <span style={{ fontSize: '10px', background: '#222', color: '#777', padding: '4px 10px', borderRadius: '12px' }}>In Progress</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: '14px', marginBottom: '6px' }}>
                <span>{l1Count} Current</span>
                <span>{task.target} Target</span>
              </div>

              <div style={{ width: '100%', height: '6px', background: '#2a2a2a', borderRadius: '10px' }}>
                <div style={{ width: `${progress}%`, height: '6px', background: 'linear-gradient(90deg, #c9a84c, #e6b800)', borderRadius: '10px' }}></div>
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '6px' }}>{l1Count}/{task.target} Progress</div>
            </div>
          );
        })}
      </div>
    </div>
  );
                             }
