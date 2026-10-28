import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteAdminIncomeControl from '@/components/features/SiteAdminIncomeControl';
import { ADMIN_LOGIN_NUMBER } from '@/constants/admin';
import type { SiteActionProps } from '@/types/siteActions';

interface Props extends SiteActionProps { siteName: string; dueAccounts: number; unavailable: boolean; logoutBusy: boolean; onLogout: () => void }
export default function SiteAdminHeader({ siteName, dueAccounts, unavailable, logoutBusy, onLogout, run, busy }: Props) {
  return <header className="admin-header">
    <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4"><span className="admin-brand-mark"><Shield size={29} strokeWidth={1.8} /></span><div><h1 className="text-2xl font-bold leading-tight sm:text-3xl">Admin Panel</h1><p className="mt-1 text-base font-medium text-primary">Full Control Dashboard</p></div></div>
      <div className="flex items-center gap-3"><SiteAdminIncomeControl run={run} busy={busy} dueAccounts={dueAccounts} unavailable={unavailable} /><Button variant="outline" onClick={onLogout} disabled={logoutBusy} className="min-h-12 gap-2 rounded-2xl border-border bg-background px-5 text-base text-muted-foreground hover:text-foreground"><LogOut size={20} />{logoutBusy ? 'Exiting…' : 'Exit'}</Button></div>
    </div>
    <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 pb-4 text-sm text-muted-foreground sm:px-6 lg:px-8"><p>{siteName} <span className="mx-2 text-primary" aria-hidden="true">/</span> Admin {ADMIN_LOGIN_NUMBER}</p><p>Secure Cloud controls · all devices</p></div>
  </header>;
}
