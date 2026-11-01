import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  Shield,
  ListOrdered,
  Headphones,
  CreditCard,
  Gift,
  LogOut,
  ChevronRight,
  CreditCard as RechargeIcon,
  ArrowDownToLine,
  Activity,
  TrendingUp,
  UserCircle,
} from 'lucide-react';
import { getCurrentUser, setCurrentUser, formatUGX } from '@/lib/storage';

export default function MinePage() {
  const navigate = useNavigate();
  const [currentUser, setUserState] = useState<any>(null);

  useEffect(() => {
    let u = getCurrentUser();

    if (!u) {
      try {
        const sess = JSON.parse(localStorage.getItem('legend_session') || 'null');
        const curr = JSON.parse(
          localStorage.getItem('legend_current_user') ||
            localStorage.getItem('currentUser') ||
            'null'
        );

        u =
          curr ||
          (sess?.user
            ? {
                id: sess.user.id || sess.user.email,
                phone: sess.user.user_metadata?.phone || sess.user.email,
                email: sess.user.email,
                level: 1,
                balance: 9000,
                referralCode:
                  sess.user.user_metadata?.referral_code ||
                  sess.user.user_metadata?.ref ||
                  'LGDEMO',
                ...sess.user.user_metadata,
              }
            : null);

        if (u && !u.id) u.id = u.email || u.phone;

        try {
          const all = JSON.parse(localStorage.getItem('legend_users_db') || '{}');
          const found = Object.values(all).find(
            (x: any) => x.id === u.id || x.email === u.email
          ) as any;

          if (found) u = { ...u, ...found };
        } catch {}
      } catch {}
    }

    if (!u) {
      navigate('/login');
      return;
    }

    setUserState(u);
  }, [navigate]);

  if (!currentUser)
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'grid',
          placeItems: 'center',
          color: '#c9a84c',
        }}
      >
        Loading...
      </div>
    );

  const handleSignOut = () => {
    try {
      localStorage.removeItem('legend_session');
      localStorage.removeItem('legend_current_user');
      localStorage.removeItem('currentUser');
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
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0d0f',
        color: '#f5f7fb',
        paddingBottom: 28,
      }}
    >
      <div
        style={{
          maxWidth: 460,
          margin: '0 auto',
          padding: '10px 12px 24px',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                background: '#171b20',
                display: 'grid',
                placeItems: 'center',
                color: '#f5f7fb',
              }}
            >
              ⌂
            </div>

            <div
              style={{
                background: '#20242a',
                borderRadius: 999,
                padding: '7px 12px',
                color: '#dfe5eb',
                fontSize: 13,
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentUser.phone || currentUser.email || 'Legend Investor'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>＋</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '5px 7px',
                borderRadius: 8,
                background: '#171b20',
                color: '#f0bf47',
              }}
            >
              98
            </span>
            <span
              style={{
                fontSize: 18,
                lineHeight: 1,
                transform: 'rotate(90deg)',
              }}
            >
              ⋮
            </span>
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(30,25,10,0.95), rgba(18,20,24,0.96))',
            border: '1px solid rgba(240,191,71,0.2)',
            borderRadius: 24,
            padding: 18,
            boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(240,191,71,0.12)',
                border: '2px solid rgba(240,191,71,0.5)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <div style={{ display: 'grid', gap: 4 }}>
                <span
                  style={{
                    display: 'block',
                    width: 18,
                    height: 3,
                    background: '#f0bf47',
                    borderRadius: 999,
                    margin: '0 auto',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: 18,
                    height: 3,
                    background: '#f0bf47',
                    borderRadius: 999,
                    margin: '0 auto',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: 18,
                    height: 3,
                    background: '#f0bf47',
                    borderRadius: 999,
                    margin: '0 auto',
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#f5f7fb',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentUser.phone || currentUser.email || 'Legend Investor'}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    color: '#101214',
                    padding: '4px 8px',
                    borderRadius: 999,
                    background:
                      'linear-gradient(135deg, #f3d57a 0%, #dfb547 45%, #d3a536 100%)',
                  }}
                >
                  Lv{currentUser.level || 1}
                </span>

                <span style={{ color: '#b9c0c8', fontSize: 12 }}>
                  Referral: {currentUser.referralCode || 'LGDEMO'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                margin: 0,
                color: '#b5bdc8',
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              Balance
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 900,
                color: '#f0bf47',
                letterSpacing: '-0.05em',
              }}
            >
              {formatUGX(currentUser.balance || 0)}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 10,
            }}
          >
            {[
              { icon: RechargeIcon, label: 'Recharge', path: '/recharge' },
              { icon: ArrowDownToLine, label: 'Withdraw', path: '/withdraw' },
              { icon: ListOrdered, label: 'Records', path: '/records' },
            ].map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '12px 8px',
                  color: '#f5f7fb',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Icon size={18} color="#f0bf47" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/tasks')}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            marginTop: 16,
            padding: 0,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div style={{ position: 'relative', height: 112 }}>
            <img
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=900&h=240&fit=crop"
              alt="Task banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.7)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.4))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#f7f9fb',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Task Center
            </div>
          </div>
        </button>

        <div
          style={{
            marginTop: 18,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 22,
            padding: '12px 10px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10,
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '14px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#edf2f8',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Icon size={18} color="#f0bf47" />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      {item.label}
                    </span>
                  </span>

                  <ChevronRight size={16} color="#b5bdc8" />
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 16,
              padding: '15px 18px',
              fontWeight: 900,
              fontSize: 18,
              color: '#111214',
              background:
                'linear-gradient(135deg, #f3d57a 0%, #dfb547 45%, #d3a536 100%)',
              boxShadow: '0 10px 24px rgba(240,191,71,0.18)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LogOut size={18} />
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
        }
