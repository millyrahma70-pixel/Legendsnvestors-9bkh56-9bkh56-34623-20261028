// SAFE API that never crashes, works offline
let mockClient:any = null;

function createMockClient(){
  return {
    auth: {
      signUp: async ({email,password,options}:any)=>{
        const users = JSON.parse(localStorage.getItem('legend_users')||'{}');
        users[email] = {email,password,data:options?.data||{}, created:Date.now()};
        localStorage.setItem('legend_users', JSON.stringify(users));
        return {data:{user:{email}}, error:null};
      },
      signInWithPassword: async ({email,password}:any)=>{
        const users = JSON.parse(localStorage.getItem('legend_users')||'{}');
        const u = users[email];
        if(!u) return {data:null, error:{message:'Account not found. Please register first'}};
        if(u.password!==password) return {data:null, error:{message:'Wrong password'}};
        const session = {user:{email, user_metadata:u.data}, access_token:'mock'};
        localStorage.setItem('legend_session', JSON.stringify(session));
        return {data:{session}, error:null};
      },
      signInWithOtp: async ({email}:any)=>{
        console.log('Mock OTP sent to', email);
        return {data:{}, error:null};
      },
      getSession: async ()=>{
        const s = localStorage.getItem('legend_session');
        return {data:{session: s?JSON.parse(s):null}, error:null};
      },
      getUser: async ()=>{
        const s = localStorage.getItem('legend_session');
        const sess = s?JSON.parse(s):null;
        return {data:{user:sess?.user||null}, error:null};
      },
      signOut: async ()=>{
        localStorage.removeItem('legend_session');
        return {error:null};
      },
      updateUser: async (d:any)=>{ return {data:{user:d}, error:null}; },
      verifyOtp: async ()=>{ return {data:{}, error:null}; },
    },
    from: (table:string)=>({
      select: ()=>({eq: ()=>({single: async()=>({data:null,error:null}), limit: async()=>({data:[],error:null})}), single: async()=>({data:null,error:null}), limit: async()=>({data:[],error:null})}),
      insert: (d:any)=>({select: ()=>({single: async()=>{return {data:d,error:null}}})}),
      upsert: async (d:any)=>({data:d,error:null}),
    }),
    rpc: async ()=>({data:null,error:null}),
  };
}

export async function getSupabaseClient(){
  try{
    // Try real Supabase if env exists
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if(url && key && url.startsWith('http')){
      const {createClient} = await import('@supabase/supabase-js');
      return createClient(url,key);
    }
  }catch(e){ console.warn('Real supabase not available, using mock', e); }
  if(!mockClient) mockClient = createMockClient();
  return mockClient;
}

export async function getSupabaseAdmin(){ return getSupabaseClient(); }
export function requireEnv(){ return 'mock'; }
