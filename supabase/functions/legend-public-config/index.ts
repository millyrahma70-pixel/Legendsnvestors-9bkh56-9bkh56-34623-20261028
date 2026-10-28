import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

Deno.serve((request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (request.method !== 'GET') return jsonResponse({ error: 'Method not allowed' }, 405);
  // This is the public browser key, never the service-role key or another secret.
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) return jsonResponse({ error: 'Public cloud configuration is unavailable' }, 503);
  return jsonResponse({ url, anonKey });
});
