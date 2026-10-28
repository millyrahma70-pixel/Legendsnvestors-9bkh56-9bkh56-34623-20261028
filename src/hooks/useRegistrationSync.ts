import { useEffect } from 'react';
import { toast } from 'sonner';
import { getUsers } from '@/lib/storage';
import { submitJoiningReport } from '@/lib/registrationDirectory';
import type { JoiningRecord } from '@/types/admin';

const SYNC_KEY = 'legend_synced_joining_ids';

function getDeviceType(): JoiningRecord['device_type'] {
  const agent = navigator.userAgent;
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(agent)) return 'Tablet';
  return /Mobile|iPhone|Android/i.test(agent) ? 'Mobile' : 'Desktop';
}

function getSyncedIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}

export function useRegistrationSync() {
  useEffect(() => {
    let active = true;
    let running = false;
    let lastFailure = 0;
    const sync = async () => {
      if (!active || running || !navigator.onLine || Date.now() - lastFailure < 60000) return;
      running = true;
      try {
        const synced = new Set(getSyncedIds());
        const allUsers = getUsers();
        const users = allUsers.filter(user => !user.isAdmin);
        const pending = users.filter(user => !synced.has(user.id)).slice(0, 20);
        for (const user of pending) {
          if (!active) break;
          const phone = user.phone.replace(/[\s()-]/g, '');
          if (!/^\+?[0-9]{9,15}$/.test(phone) || !/^[A-Z0-9]{4,16}$/.test(user.referralCode)) continue;
          const referrer = allUsers.find(member => member.id === user.referredBy);
          await submitJoiningReport({ localId: user.id, phone, referralCode: user.referralCode, referredByCode: referrer?.referralCode || null,
            deviceType: getDeviceType(), joinedAt: user.createdAt, source: Date.now() - Date.parse(user.createdAt) < 60000 ? 'new' : 'existing' });
          synced.add(user.id);
          localStorage.setItem(SYNC_KEY, JSON.stringify([...synced]));
          console.log('Joining record synchronized');
        }
        if (active && pending.length) toast.dismiss('legend-join-sync');
      } catch (error) {
        lastFailure = Date.now();
        console.error('Joining record sync paused; queued for retry');
        if (active) toast.error('Your account is saved on this device, but its joining record has not synced. We will retry automatically.', { id: 'legend-join-sync', description: error instanceof Error ? error.message : 'Check your internet connection.' });
      } finally { running = false; }
    };
    const retry = () => { lastFailure = 0; void sync(); };
    void sync();
    const interval = setInterval(() => void sync(), 30000);
    window.addEventListener('online', retry);
    window.addEventListener('legend-registration-created', retry);
    return () => { active = false; clearInterval(interval); window.removeEventListener('online', retry); window.removeEventListener('legend-registration-created', retry); };
  }, []);
}
