import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmSiteAction from '@/components/features/ConfirmSiteAction';
import { money, dateTime } from '@/lib/siteApi';
import type { SiteGift } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';

interface Props extends SiteActionProps { gift: SiteGift }
export default function SiteAdminGiftRecord({ gift, run, busy }: Props) {
  const status = gift.used_by ? 'Redeemed' : gift.revoked ? 'Revoked' : new Date(gift.expires_at) <= new Date() ? 'Expired' : 'Available';
  const copy = () => { void navigator.clipboard.writeText(gift.code).then(() => toast.success('Gift code copied')).catch(() => toast.error('Copy failed. Select and copy the code manually')); };
  return <article className="rounded-3xl border border-border bg-card p-5">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0"><h4 className="break-all font-mono text-xl font-semibold tracking-wider text-primary">{gift.code}</h4><p className="mt-2 text-xl font-semibold text-primary">{money(gift.amount)}</p></div>
      <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground">{status}</span>
    </div>
    <p className="mt-3 text-base text-muted-foreground">Expires {dateTime(gift.expires_at)}</p>
    {gift.note && <p className="mt-2 break-words text-base text-muted-foreground">{gift.note}</p>}
    {gift.used_by && <p className="mt-2 text-base text-muted-foreground">Redeemed by {gift.redeemed_phone || 'account'}{gift.used_at ? ` on ${dateTime(gift.used_at)}` : ''}</p>}
    {status === 'Available' && <div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" className="min-h-11 gap-2 rounded-xl" onClick={copy}><Copy size={16} />Copy code</Button><ConfirmSiteAction label="Revoke" title="Revoke this code?" description="This code will no longer be redeemable. It remains in the audit and gift history." busy={busy} destructive onConfirm={() => { void run('giftRevoke', { id: gift.id }).catch(() => {}); }} /></div>}
  </article>;
}
