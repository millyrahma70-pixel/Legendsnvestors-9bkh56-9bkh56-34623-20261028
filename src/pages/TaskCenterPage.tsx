import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser, formatUGX, getTeamMembers } from '@/lib/storage';

const TASKS = [
  { level: 'Lv1', label: 'Invite 5 Level 1 investors', reward: 10000, target: 5 },
  { level: 'Lv2', label: 'Invite 10 Level 1 investors', reward: 40000, target: 10 },
  { level: 'Lv3', label: 'Invite 30 Level 1 investors', reward: 130000, target: 30 },
  { level: 'Lv4', label: 'Invite 60 Level 1 investors', reward: 280000, target: 60 },
];

export default function TaskCenterPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    try {
      const user = getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(user);
      const team = getTeamMembers ? getTeamMembers(user.id) : [];
      setTeamCount(team?.length || 0);
      setReady(true);
    } catch (e) {
      console.log('TaskCenter error', e);
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div style={{minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>
        Loading...
      </div>
    );
  }

  const cumulativeRewards = 0;

  const safeFormat = (n: number) => {
    try { return formatUGX(n); } catch { return `UGX ${n.toLocaleString()}`; }
  };

  return (
    <div style={{minHeight:'100vh', background:'#0a0a0a', paddingBottom:'20px'}}>
      <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'#111', borderBottom:'1px solid #222'}}>
        <button onClick={() => navigate(-1)} style={{width:'32px', height:'32px', borderRadius:'10px', background:'#1e1e1e', border:'none', color:'#888', fontSize:'18px'}}>‹</button>
        <h1 style={{fontWeight:700, fontSize:'16px', color:'white'}}>Task Center</h1>
      </div>

      <div style={{margin:'16px', borderRadius:'20px', padding:'20px', background:'linear-gradient(135deg, #1a1400, #2a2000)', border:'1px solid rgba(230,168,0,0.3)'}}>
        <p style={{color:'#999', fontSize:'13px', marginBottom:'4px'}}>Cumulative rewards</p>
        <p style={{color:'#e6a800', fontSize:'28px', fontWeight:900}}>{safeFormat(cumulativeRewards)}</p>
      </div>

      <div style={{padding:'0 16px', display:'flex', flexDirection:'column', gap:'12px'}}>
        {TASKS.map(task => {
          const progress = Math.min(teamCount / task.target, 1);
          const percent = Math.round(progress * 100);
          return (
            <div key={task.level} style={{borderRadius:'20px', padding:'16px', background:'#151515', border:'1px solid #222'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
                    <span style={{fontSize:'10px', fontWeight:900, color:'black', background:'#e6a800', padding:'2px 8px', borderRadius:'20px'}}>{task.level}</span>
                    <span style={{color:'#ccc', fontSize:'13px'}}>{task.label}</span>
                  </div>
                  <p style={{color:'#777', fontSize:'11px'}}>Get: <span style={{color:'#e6a800', fontWeight:700}}>{safeFormat(task.reward)}</span></p>
                </div>
                <span style={{fontSize:'10px', color:'#666', background:'#222', padding:'4px 8px', borderRadius:'20px', height:'fit-content'}}>
                  {percent >= 100 ? 'Completed' : 'In Progress'}
                </span>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#777', marginBottom:'6px'}}>
                <span>{teamCount} Current</span>
                <span>{task.target} Target</span>
              </div>

              <div style={{width:'100%', height:'6px', borderRadius:'10px', background:'#222'}}>
                <div style={{height:'6px', borderRadius:'10px', background:'#e6a800', width:`${percent}%`, transition:'width 0.3s'}} />
              </div>
              <p style={{fontSize:'10px', color:'#666', marginTop:'4px'}}>{teamCount}/{task.target} Progress - {percent}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
                              }
