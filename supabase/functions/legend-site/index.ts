import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { actionSchemas, envelopeSchema } from '../_shared/siteSchemas.ts';
import { deferPaymentReconciliation } from '../_shared/deferPaymentReconciliation.ts';
import { getEarningsAutomation } from '../_shared/earningsAutomation.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null,{headers:corsHeaders});
  if (request.method !== 'POST') return jsonResponse({error:'Method not allowed'},405);
  const deadline = new AbortController();
  const timer = setTimeout(() => deadline.abort(), 15000);
  try {
    const raw = await request.text();
    if (raw.length>12000) return jsonResponse({error:'Request is too large'},413);
    const envelope = envelopeSchema.safeParse(JSON.parse(raw));
    if (!envelope.success) return jsonResponse({error:'Invalid request format'},400);
    const {action,payload,requestKey,filter} = envelope.data;
    // New recharges must be reserved and confirmed by the server-side PesaJet gateway.
    // Existing manual recharge orders remain visible and reviewable.
    if (action==='recharge') return jsonResponse({error:'Use the recharge page to request a PesaJet phone prompt. Manual recharge submissions are no longer accepted.'},409);
    if (action!=='snapshot' && !requestKey) return jsonResponse({error:'A request identifier is required'},400);
    const schema=actionSchemas[action];
    if (!schema) return jsonResponse({error:'Unknown website action'},400);
    const validated=schema.safeParse(payload);
    if (!validated.success) return jsonResponse({error:validated.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')},400);
    const adminClient=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{
      auth:{persistSession:false,autoRefreshToken:false},
      global:{fetch:(input,init)=>fetch(input,{...init,signal:deadline.signal})},
    });
    const token=request.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');
    if (!token) return jsonResponse({error:'Sign in to your verified account'},401);
    const {data:{user},error:authError}=await adminClient.auth.getUser(token);
    deadline.signal.throwIfAborted();
    if (authError || !user?.email_confirmed_at || !user.email) return jsonResponse({error:'Your session expired. Sign in again with a verified email'},401);
    const {data:allowlist,error:allowError}=await adminClient.from('legend_directory_admins').select('email').eq('email',user.email.toLowerCase()).maybeSingle();
    if (allowError) throw allowError;
    const isAdmin=Boolean(allowlist);
    if (['settings','product','status','adjust','review','giftCreate','giftRevoke','stop','resetOtp','incomeRun'].includes(action) && !isAdmin) return jsonResponse({error:'Administrator access required'},403);
    if (action==='review') {
      const {data:order,error:orderError}=await adminClient.from('legend_site_orders').select('payment').eq('id',validated.data.id).maybeSingle();
      if (orderError) throw orderError;
      if (order?.payment?.gateway==='PesaJet') return jsonResponse({error:'PesaJet recharges are verified and credited automatically. Check the gateway status; manual approval or rejection is disabled.'},409);
    }
    if (action==='resetOtp') {
      const {data:account,error}=await adminClient.from('legend_site_accounts').select('email').eq('user_id',payload.user_id).single();
      if (error || !account) return jsonResponse({error:'Account not found'},404);
      const {error:otpError}=await adminClient.auth.signInWithOtp({email:account.email,options:{shouldCreateUser:false}});
      if (otpError) return jsonResponse({error:'Could not send reset verification. Please retry later'},429);
    }
    console.log('Website command',{action,actor:user.id,admin:isAdmin});
    const {data,error}=await adminClient.rpc('legend_site_command',{p_actor:user.id,p_email:user.email,p_admin:isAdmin,p_action:action,p_payload:validated.data,p_request:requestKey??null,p_filter:filter});
    deadline.signal.throwIfAborted();
    if (error) {
      console.error('Website command rejected',{action,code:error.code});
      const message=error.code==='23505'?'This phone number, gift code or payment reference is already registered. Do not submit the same payment twice':error.code==='40P01'?'Another action is in progress. Please retry':error.code==='P0001'?error.message:'Could not complete this action. Refresh and retry';
      return jsonResponse({error:message},409);
    }
    const automation=await getEarningsAutomation(adminClient,isAdmin);
    deadline.signal.throwIfAborted();
    if (action==='snapshot') deferPaymentReconciliation(user.id,isAdmin);
    return jsonResponse({...data,automation});
  } catch (error) {
    console.error('Website gateway failed',error instanceof Error?error.message:'Unknown error');
    return deadline.signal.aborted
      ? jsonResponse({error:'Cloud account loading timed out. Please retry your connection.'},504)
      : jsonResponse({error:'Website service is temporarily unavailable. Please retry'},500);
  } finally {
    clearTimeout(timer);
  }
});
