import { useEffect, useState } from 'react';
import { money, dateTime } from '@/lib/siteApi';
import SiteProductImage from '@/components/features/SiteProductImage';
import { earningCountdown, nextInvestmentEarning } from '@/lib/earningSchedule';
import type { SiteInvestment } from '@/types/site';
interface Props { investment:SiteInvestment }
export default function SiteInvestmentRecord({investment:i}:Props) {
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const remaining=Math.max(0,new Date(i.ends_at).getTime()-now);
  const next=nextInvestmentEarning(i);
  const status=i.status==='active'&&!remaining?'expired':i.status;
  return <article className="rounded-2xl border border-primary/30 bg-card p-6"><SiteProductImage productId={i.product_id} muted={status!=='active'} className="mb-6 aspect-[16/9]" /><div className="flex flex-wrap justify-between gap-3"><h3 className="text-xl font-semibold">{i.name}</h3><span className="text-primary capitalize">{status}</span></div><p className="mt-3 text-primary font-semibold">{money(i.daily_income)} / day</p><p className="mt-2 text-muted-foreground">Credited {money(i.total_earned)}</p>{i.status==='active'&&<div className="mt-4 rounded-xl bg-secondary p-4 space-y-2"><p>Term remaining: <strong>{Math.floor(remaining/86400000)}d {Math.floor(remaining%86400000/3600000)}h</strong></p>{next!==null&&<><p className="text-primary font-semibold">{next<=now?'Earnings due · awaiting server payout':`Next earning in ${earningCountdown(next,now)}`}</p><p className="text-muted-foreground">Earned at {new Date(next).toLocaleString()}</p></>}<p className="text-muted-foreground leading-relaxed">Every 24 hours from activation. Server posting may follow the earned-at time; eligible missed periods are caught up without shifting your schedule.</p></div>}<details className="mt-3"><summary className="min-h-11 cursor-pointer text-primary">View terms</summary><p className="mt-2 text-muted-foreground leading-relaxed">Purchased {dateTime(i.started_at)} for {money(i.price)}. Ends {dateTime(i.ends_at)}. This purchase keeps its original terms even if the catalog changes.</p></details></article>;
}
