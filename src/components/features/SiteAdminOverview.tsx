import SiteAdminStats from '@/components/features/SiteAdminStats';
import SiteAdminGifts from '@/components/features/SiteAdminGifts';
import SiteAdminStatus from '@/components/features/SiteAdminStatus';
import SiteEarningsAutomationStatus from '@/components/features/SiteEarningsAutomationStatus';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';

interface Props extends SiteActionProps { data: SiteSnapshot }
export default function SiteAdminOverview({ data, run, busy }: Props) {
  return <div className="space-y-8">
    <SiteAdminStats stats={data.stats} />
    <SiteEarningsAutomationStatus automation={data.automation} />
    <SiteAdminGifts data={data} run={run} busy={busy} />
    <SiteAdminStatus data={data} />
  </div>;
}
