import { useContext } from 'react';
import { AdminAuthContext } from '@/lib/adminAuthContext';

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth requires AdminAuthProvider');
  return context;
}
