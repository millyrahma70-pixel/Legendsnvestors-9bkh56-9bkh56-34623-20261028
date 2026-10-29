import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PRODUCTS = [
  {id:1, vip:1, name:'VIP 1 Legend One BMW', price:30000, dailyIncome:500, term:60, totalIncome:30000, img:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400'},
  {id:2, vip:2, name:'VIP 2 Legend One BMW', price:42000, dailyIncome:840, term:60, totalIncome:50400, img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'},
  {id:3, vip:3, name:'VIP 3 Legend One BMW', price:50000, dailyIncome:1250, term:60, totalIncome:75000, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'},
  {id:4, vip:4, name:'VIP 4 Legend Pro BMW', price:100000, dailyIncome:3000, term:60, totalIncome:180000, img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'},
];

function formatUGX(n:number){ return `UGX ${n.toLocaleString()}`; }
function getRemainingMs(end:string){ return Math.max(0,new Date(end).getTime()-Date.now()); }

export default function ProductPage(){
  const nav=useNavigate();
  const [balance,setBalance]=useState(9000);
  const [myProducts,setMyProducts]=useState<any[]>([]);
  const [buying,setBuying]=useState<number|null>(null);
  const [showMy,setShowMy]=useState(true);
  const [tick,setTick]=useState(0);

  useEffect(()=>{
    const s=localStorage.getItem('legend_session');
    if(!s){ nav('/login'); return; }
    setBalance(Number(localStorage.getItem('legend_balance')||'9000'));
    setMyProducts(JSON.parse(localStorage.getItem('legend_products')||'[]'));
    const iv=setInterval(()=>setTick(t=>t+1),1000);
    return ()=>clearInterval(iv);
  },[]);

  function buy(p:any){
    if(balance < p.price){ alert('Insufficient balance. Recharge first.'); nav('/recharge'); return; }
    setBuying(p.id);
    setTimeout(()=>{
      const newBal=balance-p.price;
      setBalance(newBal);
      localStorage.setItem('legend_balance',String(newBal));
      const end=new Date(); end.setDate(end.getDate()+p.term);
      const up={id:Date.now(), productId:p.id, purchaseDate:new Date().toISOString(), endDate:end.toISOString(), status:'active', vip:p.vip, name:p.name, price:p.price, dailyIncome:p.dailyIncome};
      const arr=[...myProducts, up];
      setMyProducts(arr);
      localStorage.setItem('legend_products', JSON.stringify(arr));
      localStorage.setItem('legend_next_payout', String(Date.now()+86400000));
      setBuying(null);
      alert(`VIP ${p.vip} purchased! Daily income +${formatUGX(p.dailyIncome)}`);
    },600);
  }

  const active=myProducts.filter((p:any)=>getRemainingMs(p.endDate)>0);
  const expired=myProducts.filter((p:any)=>getRemainingMs(p.endDate)<=0);

  return(
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'white',paddingBottom:'80px'}}>
      <div style={{maxWidth:'440px',margin:'0 auto'}}>
        {/* Header */}
        <div style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'4px',height:'22px',background:'#e6a800',borderRadius:'2px'}}></div>
          <div style={{fontWeight:800,fontSize:'20px'}}>Product Center</div>
        </div>

        {/* Stats */}
        <div style={{margin:'0 16px 12px',background:'#151515',border:'1px solid rgba(230,168,0,0.2)',borderRadius:'16px',padding:'16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          <div><div style={{fontSize:'28px',fontWeight:900,color:'#e6a800'}}>{active.length}</div><div onClick={()=>setShowMy(!showMy)} style={{color:'#888',fontSize:'12px',cursor:'pointer'}}>My products {showMy?'▲':'▼'}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:'18px',fontWeight:800,color:'#e6a800'}}>{formatUGX(balance)}</div><Link to="/records" style={{color:'#888',fontSize:'12px',textDecoration:'none'}}>My income ›</Link></div>
        </div>

        {/* My Products with live countdown */}
        {showMy && myProducts.length>0 && (
          <div style={{padding:'0 16px',marginBottom:'16px'}}>
            <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'10px'}}><span>🕒</span><div style={{fontWeight:700,fontSize:'14px'}}>My Products</div>{expired.length>0 && <span style={{background:'rgba(255,0,0,0.1)',color:'#ff4444',fontSize:'10px',padding:'2px 8px',borderRadius:'10px'}}>{expired.length} expired</span>}</div>
            {myProducts.map((up:any)=>{
              const ms=getRemainingMs(up.endDate);
              const isExpired=ms<=0;
              const d=Math.floor(ms/86400000); const h=Math.floor((ms%86400000)/3600000); const m=Math.floor((ms%3600000)/60000); const s=Math.floor((ms%60000)/1000);
              const def=PRODUCTS.find(p=>p.id===up.productId);
              const total=def? new Date(up.endDate).getTime()-new Date(up.purchaseDate).getTime():1;
              const elapsed=Date.now()-new Date(up.purchaseDate).getTime();
              const pct=Math.max(0,Math.min(100,((total-ms)/total)*100));
              return(
                <div key={up.id} style={{background:isExpired?'#151515':'linear-gradient(135deg,#1a1100,#201800)',border:isExpired?'1px solid #333':'1px solid rgba(230,168,0,0.4)',borderRadius:'16px',overflow:'hidden',marginBottom:'10px'}}>
                  <div style={{display:'flex',gap:'12px',padding:'14px'}}>
                    <div style={{position:'relative'}}><img src={def?.img} style={{width:'70px',height:'70px',borderRadius:'12px',objectFit:'cover',filter:isExpired?'grayscale(1)':''}}/><div style={{position:'absolute',top:'2px',left:'2px',background:'#e6a800',color:'black',fontSize:'8px',fontWeight:900,padding:'2px 6px',borderRadius:'10px'}}>VIP{up.vip}</div></div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:700,fontSize:'13px'}}>{up.name}</div><div style={{fontSize:'10px',padding:'2px 8px',borderRadius:'10px',background:isExpired?'rgba(255,0,0,0.1)':'rgba(0,255,0,0.1)',color:isExpired?'#ff4444':'#4ade80'}}>{isExpired?'Expired':'Active'}</div></div>
                      <div style={{fontSize:'11px',color:'#888',marginTop:'6px'}}><div style={{display:'flex',justifyContent:'space-between'}}><span>Daily:</span><span style={{color:'#e6a800'}}>{formatUGX(up.dailyIncome)}</span></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Expires:</span><span>{new Date(up.endDate).toLocaleDateString()}</span></div></div>
                      {!isExpired ? (
                        <div style={{marginTop:'8px',background:'rgba(0,0,0,0.4)',borderRadius:'10px',padding:'6px',display:'flex',gap:'4px'}}>
                          {[{v:d,u:'d'},{v:h,u:'h'},{v:m,u:'m'},{v:s,u:'s'}].map((it,i)=><div key={i} style={{display:'flex',gap:'2px',alignItems:'flex-end'}}><div style={{width:'24px',height:'24px',background:'rgba(230,168,0,0.15)',border:'1px solid rgba(230,168,0,0.3)',borderRadius:'6px',display:'grid',placeItems:'center',color:'#e6a800',fontWeight:800,fontSize:'12px'}}>{String(it.v).padStart(2,'0')}</div><span style={{fontSize:'8px',color:'#666'}}>{it.u}</span>{i<3 && <span style={{color:'#e6a800',fontSize:'10px',margin:'0 1px'}}>:</span>}</div>)}
                        </div>
                      ) : <div style={{marginTop:'8px',background:'rgba(255,0,0,0.06)',border:'1px solid rgba(255,0,0,0.15)',borderRadius:'10px',padding:'6px',textAlign:'center',color:'#ff4444',fontSize:'11px'}}>Term ended — no more daily income</div>}
                    </div>
                  </div>
                  {!isExpired && <div style={{padding:'0 14px 10px'}}><div style={{height:'4px',background:'#1e1e1e',borderRadius:'4px',overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:'#e6a800'}}></div></div></div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Available Products */}
        <div style={{padding:'0 16px',marginBottom:'10px',display:'flex',gap:'8px',alignItems:'center'}}><span>🛍️</span><div style={{fontWeight:700,fontSize:'14px'}}>Available Products</div></div>

        <div style={{padding:'0 16px',display:'flex',flexDirection:'column',gap:'12px'}}>
          {PRODUCTS.map(p=>(
            <div key={p.id} style={{background:'#151515',border:'1px solid #2a2a2a',borderRadius:'18px',overflow:'hidden'}}>
              <div style={{display:'flex',gap:'12px',padding:'14px'}}>
                <div style={{position:'relative'}}><img src={p.img} style={{width:'90px',height:'90px',borderRadius:'12px',objectFit:'cover'}}/><div style={{position:'absolute',top:'2px',left:'2px',background:'#e6a800',color:'black',fontSize:'9px',fontWeight:900,padding:'2px 6px',borderRadius:'10px'}}>VIP{p.vip}</div></div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:'14px'}}>{p.name}</div><div style={{color:'#e6a800',fontWeight:900,fontSize:'18px',marginTop:'4px'}}>{formatUGX(p.price)}</div><div style={{marginTop:'6px',fontSize:'11px',color:'#888'}}><div style={{display:'flex',justifyContent:'space-between'}}><span>Term:</span><span style={{color:'white'}}>{p.term}-day</span></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Daily:</span><span style={{color:'#e6a800'}}>{formatUGX(p.dailyIncome)}</span></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Total:</span><span style={{color:'white'}}>{formatUGX(p.totalIncome)}</span></div></div></div>
              </div>
              <button onClick={()=>buy(p)} disabled={buying===p.id} style={{width:'100%',padding:'14px',background:'#e6a800',color:'black',fontWeight:800,border:'none',fontSize:'14px',opacity:buying===p.id?0.6:1}}>🛍️ {buying===p.id?'Processing...':'BUY NOW'}</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#1a1a1a',borderTop:'1px solid #222',display:'flex',justifyContent:'space-around',padding:'8px 0 10px'}}>
        <Link to="/home" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>🏠</div><div style={{fontSize:'11px',color:'#888'}}>Home</div></Link>
        <Link to="/products" style={{textAlign:'center',textDecoration:'none',flex:1,background:'#2a2410',borderRadius:'14px',margin:'0 4px'}}><div style={{color:'#e6a800'}}>📦</div><div style={{fontSize:'11px',color:'#e6a800',fontWeight:700}}>Products</div></Link>
        <Link to="/team" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>👥</div><div style={{fontSize:'11px',color:'#888'}}>Team</div></Link>
        <Link to="/account" style={{textAlign:'center',textDecoration:'none',flex:1}}><div>👤</div><div style={{fontSize:'11px',color:'#888'}}>Account</div></Link>
      </div>
    </div>
  );
}
