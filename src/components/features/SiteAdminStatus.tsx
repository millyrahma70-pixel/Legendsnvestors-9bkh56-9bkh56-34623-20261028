import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';

interface Props { data: SiteSnapshot }
export default function SiteAdminStatus({ data }: Props) {
  const { config } = data.settings;
  const states = [{ label: 'Website', open: !config.maintenance }, { label: 'Registration', open: config.registrationOpen }, { label: 'Recharges', open: config.rechargeOpen }, { label: 'Withdrawals', open: config.withdrawalOpen }];
  return <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">Website operations</h2><Link to="/admin?tab=settings" className="inline-flex min-h-11 items-center text-primary hover:opacity-80">Manage settings</Link></div>
    <div className="mt-4 flex flex-wrap gap-3">{states.map(state => <span key={state.label} className="rounded-xl border border-border bg-secondary px-4 py-3 text-base">{state.label} <strong className={state.open ? 'text-primary' : 'text-muted-foreground'}>· {state.open ? 'Open' : 'Paused'}</strong></span>)}</div>
    <p className="mt-5 text-muted-foreground">Combined member balances: <strong className="text-primary">{money(data.stats.balance)}</strong></p>
    <p className="mt-3 flex items-start gap-3 text-base leading-relaxed text-muted-foreground"><ShieldCheck size={20} className="mt-1 shrink-0 text-primary" />Financial actions are verified and audited in Cloud. Approving a withdrawal records your review; it does not send mobile money automatically.</p>
  </section>;
}
