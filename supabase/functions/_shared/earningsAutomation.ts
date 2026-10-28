import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

export async function getEarningsAutomation(client: SupabaseClient, admin: boolean) {
  const { data, error } = await client.from('legend_earnings_runs')
    .select('completed_at,remaining_accounts').order('completed_at', { ascending: false }).limit(1).maybeSingle();
  if (error) console.error('Earnings scheduler health unavailable', { code: error.code });
  return {
    configured: (Deno.env.get('LEGEND_EARNINGS_CRON_SECRET')?.length ?? 0) >= 32,
    last_run_at: error ? null : data?.completed_at ?? null,
    backlogged: Boolean(data?.remaining_accounts),
    ...(admin ? { endpoint: `${Deno.env.get('SUPABASE_URL')}/functions/v1/legend-earnings` } : {}),
  };
}
