export default function RegulationPage() {
  const products = [
    { vip:1, price:'30K', daily:'5K', total:'270K', days:'60d' },
    { vip:2, price:'42K', daily:'9K', total:'540K', days:'60d' },
    { vip:3, price:'75K', daily:'18K', total:'1080K', days:'60d' },
    { vip:4, price:'150K', daily:'38K', total:'2280K', days:'60d' },
    { vip:5, price:'300K', daily:'80K', total:'4800K', days:'60d' },
    { vip:6, price:'600K', daily:'168K', total:'10080K', days:'60d' },
    { vip:7, price:'1.2M', daily:'350K', total:'21000K', days:'60d' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'white' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'#111', borderBottom:'1px solid #222' }}>
        <button onClick={()=>history.back()} style={{ width:32, height:32, borderRadius:10, background:'#1e1e1e', border:'none', color:'#999' }}>‹</button>
        <h1 style={{ fontWeight:700, fontSize:18 }}>Regulation</h1>
      </div>

      <div style={{ padding:20, display:'flex', gap:16, background:'linear-gradient(135deg, #0f0f0a, #1a1400)', borderBottom:'1px solid #222' }}>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:24, fontWeight:900, lineHeight:1.1 }}>LEGEND<br/><span style={{ color:'#c9a84c' }}>ONE BMW</span></h2>
          <p style={{ color:'#888', fontSize:14, marginTop:6, fontStyle:'italic' }}>Invest in the Future</p>
          <p style={{ color:'#c9a84c', fontWeight:700, fontSize:14 }}>Earn Every Day</p>
          <p style={{ color:'#555', fontSize:11, marginTop:6 }}>Your Smart Choice for Long-Term Passive Income</p>
        </div>
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=120&h=120&fit=crop" alt="BMW" style={{ width:110, height:110, borderRadius:12, objectFit:'cover', border:'1px solid rgba(201,168,76,0.3)' }} />
      </div>

      <div style={{ padding:'16px' }}>
        <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid #222' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', background:'linear-gradient(135deg, #c9a84c, #f0c040)', padding:'10px 0', textAlign:'center', fontWeight:800, fontSize:12, color:'#000' }}>
            <div>Product</div><div>Price</div><div>Daily</div><div>Total</div><div>Days</div>
          </div>
          {products.map((p,i) => (
            <div key={p.vip} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', background: i%2===0 ? '#151515' : '#111', borderTop:'1px solid #222', padding:'10px 0', textAlign:'center', fontSize:12 }}>
              <div><span style={{ background:'#c9a84c', color:'#000', fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:4 }}>VIP{p.vip}</span></div>
              <div style={{ color:'#aaa' }}>{p.price}</div>
              <div style={{ color:'#c9a84c', fontWeight:700 }}>{p.daily}</div>
              <div style={{ color:'#aaa' }}>{p.total}</div>
              <div style={{ color:'#666' }}>{p.days}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:8, marginTop:16, textAlign:'center' }}>
          {[
            { label:'Secure' }, { label:'Daily' }, { label:'Stable' }, { label:'Global' }, { label:'Together' }
          ].map(f => (
            <div key={f.label}>
              <div style={{ width:40, height:40, margin:'0 auto', borderRadius:10, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#c9a84c', fontSize:14 }}>✓</div>
              <div style={{ fontSize:9, color:'#666', marginTop:4 }}>{f.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', color:'#c9a84c', fontWeight:700, marginTop:16, fontSize:13 }}>Legend One BMW — More Than a Product, It's a Future!</div>

        <div style={{ marginTop:16, fontSize:13, color:'#888', lineHeight:'22px', background:'#111', border:'1px solid #222', borderRadius:12, padding:14 }}>
          <p>When a friend you invite registers and invests, you will immediately receive a cash reward equal to <b style={{ color:'#c9a84c' }}>27%</b> of their investment.</p>
          <p style={{ marginTop:8 }}>When a Level 2 team member invests, you will receive a <b style={{ color:'#c9a84c' }}>2%</b> cash reward.</p>
          <p style={{ marginTop:8 }}>When a Level 3 team member invests, you will receive a <b style={{ color:'#c9a84c' }}>1%</b> cash reward.</p>
          <p style={{ marginTop:8 }}>Register to receive a <b style={{ color:'#c9a84c' }}>9,000 UGX</b> bonus. Minimum deposit is <b style={{ color:'#c9a84c' }}>30,000 UGX</b> and minimum withdrawal is <b style={{ color:'#c9a84c' }}>9,000 UGX</b>. Fee is 16%.</p>
          <p style={{ marginTop:8 }}>Each product runs for 60 days. Income settled every 24 hours. Funds arrive in 1-24h.</p>
        </div>
      </div>
    </div>
  );
              }
