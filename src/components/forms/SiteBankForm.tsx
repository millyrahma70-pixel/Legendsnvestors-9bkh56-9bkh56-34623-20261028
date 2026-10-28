import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import SiteSelect from '@/components/forms/SiteSelect';
import { bankSchema } from '@/lib/siteValidations';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot }
export default function SiteBankForm({data,run,busy}:Props) {
  const {register,handleSubmit,formState:{errors}}=useForm<z.infer<typeof bankSchema>>({resolver:zodResolver(bankSchema),defaultValues:data.account!.bank_card||{network:'MTN',account:data.account!.phone,holder:''}});
  return <form onSubmit={handleSubmit(bank_card=>{void run('bank',{bank_card}).catch(()=>{});})} className="rounded-2xl border border-border bg-card p-6 space-y-4"><h1 className="text-2xl font-semibold">Bind a payout account</h1><p className="text-muted-foreground leading-relaxed">Use your mobile-money account details. Pending withdrawals keep the destination recorded at submission, even if you update this account later.</p><SiteSelect label="Network" registration={register('network')} options={[{value:'MTN',label:'MTN Mobile Money'},{value:'Airtel',label:'Airtel Money'}]}/><SiteField label="Account holder name" registration={register('holder')} error={errors.holder?.message}/><SiteField label="Mobile money account number" type="tel" registration={register('account')} error={errors.account?.message}/><Button type="submit" disabled={busy} className="min-h-12 rounded-xl">Save payout account</Button></form>;
}
