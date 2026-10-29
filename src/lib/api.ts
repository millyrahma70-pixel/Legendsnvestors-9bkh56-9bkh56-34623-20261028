import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { CLOUD_URL } from '@/constants/admin';

let clientPromise: Promise<SupabaseClient> | undefined;
let cachedClient: SupabaseClient | undefined;

function createDummyClient(): SupabaseClient {
  console.warn('Using dummy Supabase client - backend offline');
  // @ts-ignore
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: (cb: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async () => ({ data: null, error: { message: 'Backend offline, please try again' } }),
      signUp: async () => ({ data: null, error: { message: 'Backend offline' } }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    functions: {
      invoke: async () => ({ data: null, error: { message: 'Backend offline' } }),
    },
  } as unknown as SupabaseClient;
}

async function createCloudClient(): Promise<SupabaseClient> {
  try {
    const env = (import.meta as any).env as Record<string, string | undefined>;
    let url = env.VITE_SUPABASE_URL || CLOUD_URL;
    let anonKey = env.VITE_SUPABASE_ANON_KEY;

    if (!anonKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(`${CLOUD_URL}/functions/v1/legend-public-config`, { 
          cache: 'no-store', 
          signal: controller.signal 
        });
        clearTimeout(timeout);
        
        if (response.ok) {
          const config: any = await response.json();
          if (config?.anonKey && config?.url) {
            url = config.url;
            anonKey = config.anonKey;
          }
        }
      } catch (fetchError) {
        console.warn('Could not fetch cloud config, using env fallback:', fetchError);
      }
    }

    if (!url || !anonKey) {
      console.warn('No Supabase credentials, using dummy');
      return createDummyClient();
    }

    const client = createClient(url, anonKey, {
      auth: { 
        flowType: 'pkce', 
        persistSession: true, 
        autoRefreshToken: true, 
        detectSessionInUrl: false, 
        storageKey: 'legend_verified_admin_session' 
      },
      global: { 
        fetch: (input: any, init: any) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(20000) }) 
      },
    });
    
    cachedClient = client;
    return client;
    
  } catch (error) {
    console.error('Supabase init failed, using dummy:', error);
    return createDummyClient();
  }
}

export function getSupabaseClient(): Promise<SupabaseClient> {
  if (cachedClient) return Promise.resolve(cachedClient);
  if (!clientPromise) {
    clientPromise = createCloudClient().catch(err => {
      console.error('Client creation failed:', err);
      clientPromise = undefined;
      return createDummyClient();
    });
  }
  return clientPromise;
} 
