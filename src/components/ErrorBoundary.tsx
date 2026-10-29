import React from 'react';

export class ErrorBoundary extends React.Component<any, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:'100vh', background:'#111', color:'#c9a84c', display:'grid', placeItems:'center', textAlign:'center', padding:'20px'}}>
          <div>
            <h1 style={{fontSize:'28px', fontWeight:'bold'}}>LEGENDS INVESTORS</h1>
            <p style={{color:'#fff', marginTop:'10px'}}>Loading... Please refresh</p>
            <button onClick={()=>window.location.reload()} style={{marginTop:'20px', background:'#c9a84c', color:'#000', padding:'10px 20px', borderRadius:'8px', fontWeight:'bold'}}>Refresh</button>
            <p style={{marginTop:'20px'}}><a href="#/" style={{color:'#c9a84c'}}>← Go Home</a></p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
