import { FunctionsHttpError } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/api';
import { DIRECTORY_PAGE_SIZE } from '@/constants/admin';
import type { JoiningRecord, JoiningReport } from '@/types/admin';

export async function submitJoiningReport(report: JoiningReport): Promise<void> {
  const client = await getSupabaseClient();
  const { data, error } = await client.functions.invoke('legend-join-report', { body: report });
  if (error) {
    let message = error.message;
    if (error instanceof FunctionsHttpError) {
      const detail = await error.context.text();
      console.error('Joining report failed', error.context.status);
      message = `Cloud sync failed (${error.context.status}). ${detail || 'Please retry.'}`;
    }
    throw new Error(message);
  }
  if (data?.accepted !== true) throw new Error('Cloud did not accept the joining report.');
}

export async function fetchJoiningRecords(search: string, page: number) {
  const client = await getSupabaseClient();
  const term = search.replace(/[^+0-9]/g, '');
  let query = client.from('legend_registration_directory').select('id,local_id,phone,referral_code,referred_by_code,device_type,source,reported_joined_at,received_at', { count: 'exact' });
  if (term) query = query.ilike('phone', `%${term}%`);
  const { data, error, count } = await query.order('received_at', { ascending: false }).order('id', { ascending: false }).range(page * DIRECTORY_PAGE_SIZE, (page + 1) * DIRECTORY_PAGE_SIZE - 1);
  if (error) throw new Error('Unable to load shared joining records. Check your connection and retry.');
  return { records: (data || []) as JoiningRecord[], total: count || 0 };
}
