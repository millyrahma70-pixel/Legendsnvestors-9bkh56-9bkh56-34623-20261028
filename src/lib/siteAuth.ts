import { getSupabaseClient } from '@/lib/api';
import { ADMIN_EMAIL } from '@/constants/admin';

export async function sendAccountOtp(email:string,create=false) {
  try {
    if (email.toLowerCase()===ADMIN_EMAIL) {
      console.warn('Admin should use recovery');
      return;
    }
    const client=await getSupabaseClient();
    const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:create}});
    if (error) console.warn('OTP failed', error.message);
  } catch (e) {
    console.warn('sendAccountOtp error', e);
  }
}

export async function verifyAccountPassword(email:string,token:string,password:string,name?:string) {
  try {
    const client=await getSupabaseClient();
    const {error}=await client.auth.verifyOtp({email,token,type:'email'});
    if (error) throw new Error('Invalid or expired email code');
    const profileName=name?.trim();
    const result=await client.auth.updateUser({password,data:{legend_password_setup:true,...(profileName?{name:profileName}:{})}});
    if (result.error) throw new Error(result.error.message);
  } catch (e:any) {
    throw new Error(e?.message || 'Verification failed');
  }
}

export async function registerAccount(values:{email:string;token:string;password:string;phone:string;referral:string;name?:string}) {
  await verifyAccountPassword(values.email,values.token,values.password,values.name);
  return { success: true } as any;
}

export async function completeAccountRegistration(values:{phone:string;referral:string},requestKey:string) {
  try {
    const { siteCommand } = await import('@/lib/siteApi');
    return await siteCommand({action:'enroll',payload:{phone:values.phone,referral:values.referral},requestKey} as any);
  } catch {
    return { success: true } as any;
  }
}

export async function signInAccount(identifier:string,password:string) {
  try {
    const { signInWithIdentity } = await import('@/lib/sharedLogin');
    return await signInWithIdentity(identifier,password);
  } catch (e:any) {
    console.warn('signInAccount', e);
    throw new Error(e?.message || 'Sign in failed');
  }
}
