import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { normalizePaymentPhone, paymentProvider } from '../_shared/pesajetPhone.ts';
import { PaymentError, paymentRowSchema, publicPayment } from '../_shared/pesajetTypes.ts';
import { syncPayment } from '../_shared/pesajetSync.ts';

const phone = z.string().max(32).transform(normalizePaymentPhone).refine(value => Boolean(paymentProvider(value)), 'Enter a supported Ugandan MTN or Airtel phone number');
const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('start'), requestKey: z.string().uuid(), phone, amount: z.number().int().min(30000).max(1000000000) }).strict(),
  z.object({ action: z.literal('current') }).strict(),
  z.object({ action: z.literal('status'), id: z.string().uuid() }).strict(),
]);
Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    const raw = await request.text();
    if (raw.length > 4096) return jsonResponse({ error: 'Request is too large' }, 413);
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) return jsonResponse({ error: parsed.error.issues.map(issue => issue.message).join('; ') }, 400);
    const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return jsonResponse({ error: 'Sign in to your verified account to recharge' }, 401);
    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error: authError } = await client.auth.getUser(token);
    if (authError || !user?.email_confirmed_at || !user.email) return jsonResponse({ error: 'Your session expired. Sign in again.' }, 401);
    const input = parsed.data;
    let row: unknown;
    if (input.action === 'start') {
      const { data, error } = await client.rpc('legend_pesajet_reserve', { p_user: user.id, p_request: input.requestKey, p_phone: input.phone, p_amount: input.amount, p_provider: paymentProvider(input.phone) });
      if (error) return jsonResponse({ error: error.code === 'P0001' ? error.message : 'Could not reserve the recharge. Check your payment status and retry.' }, 409);
      row = data;
      console.log('PesaJet recharge reserved', { userId: user.id });
    } else {
      let query = client.from('legend_pesajet_payments').select('*');
      if (input.action === 'status') {
        const { data: admin, error } = await client.from('legend_directory_admins').select('email').eq('email', user.email.toLowerCase()).maybeSingle();
        if (error) throw new PaymentError('Payment access could not be verified.', 503);
        query = query.eq('id', input.id);
        if (!admin) query = query.eq('user_id', user.id);
      } else query = query.eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
      const { data, error } = await query.maybeSingle();
      if (error) throw new PaymentError('Payment status could not be loaded. Please retry.', 503);
      if (!data) return input.action === 'current' ? jsonResponse({ payment: null }) : jsonResponse({ error: 'Payment not found' }, 404);
      row = data;
    }
    const result = await syncPayment(client, paymentRowSchema.parse(row));
    return jsonResponse({ payment: publicPayment(result) });
  } catch (error) {
    if (error instanceof PaymentError) return jsonResponse({ error: error.message }, error.status);
    console.error('PesaJet gateway error', { kind: error instanceof Error ? error.name : 'Unknown' });
    return jsonResponse({ error: 'Payment service is unavailable. Check the existing payment status before trying again.' }, 500);
  }
});
