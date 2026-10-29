import { getSupabaseClient } from '@/lib/api';
import type { SiteCommand, SiteFilter, SiteSnapshot, SiteSettings, SiteProduct } from '@/types/site';

export class SessionExpiredError extends Error {
  constructor(message = 'Your session expired. Return to Sign In.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

const FALLBACK: SiteSnapshot = {
  user: null as any,
  balances: { available: 0, total: 0 } as any,
  products: [] as SiteProduct[],
  transactions: [],
  settings: {} as SiteSettings,
} as any;

export async function siteCommand(command: SiteCommand, filter: SiteFilter = {}, externalSignal?: AbortSignal): Promise<SiteSnapshot> {
  try {
    if (externalSignal?.aborted) return FALLBACK;
    const client = await getSupabaseClient();
    const { data: sessionData } = await client.auth.getSession();
    
    if (!sessionData?.session?.access_token) {
      console.warn('No session, returning fallback for', command);
      return FALLBACK;
    }

    const { data, error } = await (client as any).functions.invoke('legend-site', {
      body: { ...command, filter },
      headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
    });

    if (error || !data) {
      console.warn('legend-site error:', error);
      return FALLBACK;
    }

    return data as SiteSnapshot;
  } catch (e) {
    console.warn('siteCommand catch:', e);
    return FALLBACK;
  }
}

export async function fetchPublicSite(): Promise<{ settings: SiteSettings; catalog: SiteProduct[] }> {
  try {
    const client = await getSupabaseClient();
    const [settings, catalog] = await Promise.all([
      (client as any).from('legend_site_settings').select('version,config').single(),
      (client as any).from('legend_site_catalog').select('*').eq('enabled', true).order('id'),
    ]);

    if (settings.error || catalog.error) {
      console.warn('fetchPublicSite fallback');
      return { settings: {} as SiteSettings, catalog: [] };
    }
    return { settings: settings.data as SiteSettings, catalog: catalog.data as SiteProduct[] };
  } catch (e) {
    console.warn('fetchPublicSite catch', e);
    return { settings: {} as SiteSettings, catalog: [] };
  }
}

export const money = (value: number) => `UGX ${value.toLocaleString('en-UG')}`;
export const dateTime = (value: string) => new Date(value).toLocaleString();
