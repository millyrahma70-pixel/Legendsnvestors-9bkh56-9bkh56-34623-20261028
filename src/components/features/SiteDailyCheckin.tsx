import { CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot }
export default function SiteDailyCheckin({data,run,busy}:Props) {
  const checked=data.account!.last_checkin===new Date().toISOString().slice(0,10);
  return <section className="rounded-3xl border border-primary/30 bg-card p-6 lg:p-8 space-y-6"><CalendarCheck size={32} className="text-primary"/><h1 className="text-2xl font-semibold">Daily check-in</h1><p className="text-4xl font-semibold text-primary">{money(data.settings.config.checkinReward)}</p><p className="text-muted-foreground leading-relaxed">Collect your daily reward once per UTC calendar day. Cloud validates the date and prevents duplicate rewards across devices.</p><Button disabled={busy||checked} onClick={()=>{void run('checkin').catch(()=>{});}} className="min-h-12 rounded-xl px-6">{checked?'Checked in today':'Collect today’s reward'}</Button><p className="text-muted-foreground">Resets at 00:00 UTC.</p></section>;
}
