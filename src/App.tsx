import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';

import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';

// Only lazy-load files that EXIST in your repo screenshot
const CloudUserPage = lazy(() => import('@/pages/CloudUserPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const MinePage = lazy(() => import('@/pages/MinePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const BindCardPage = lazy(() => import('@/pages/BindCardPage'));
const RecordsPage = lazy(() => import('@/pages/RecordsPage'));
const RechargePage = lazy(() => import('@/pages/RechargePage'));
const CheckInPage = lazy(() => import('@/pages/CheckInPage'));
const RechargeStatusPage = lazy(() => import('@/pages/RechargeStatusPage'));
const CustomerServicePage = lazy(() => import('@/pages/CustomerServicePage'));
const RedeemGiftPage = lazy(() => import('@/pages/RedeemGiftPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));
const InvitePage = lazy(() => import('@/pages/InvitePage'));

// FALLBACKS for missing files - prevent build crash
const FallbackPage = ({title}:{title:string}) => (
  <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',display:'grid',placeItems:'center',padding:'20px'}}>
    <div style={{textAlign:'center',background:'#151515',padding:'30px',borderRadius:'20px',border:'1px solid #222',maxWidth:'400px',width:'100%'}}>
      <h2 style={{color:'#e6a800',fontWeight:800,marginBottom:'10px'}}>{title}</h2>
      <p style={{color:'#666',fontSize:'13px',marginBottom:'20px'}}>This page is under maintenance. Use bottom navigation.</p>
      <a href="#/home" style={{display:'block',padding:'12px',background:'#e6a800',color:'black',borderRadius:'12px',fontWeight:700,textDecoration:'none'}}>Go Home</a>
    </div>
  </div>
);

const App = () => (
  <HashRouter>
    <Suspense fallback={<div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#0a0a0a',color:'#e6a800'}}>Loading Legends...</div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/home" element={<CloudUserPage />} />
        <Route path="/cloud-user" element={<CloudUserPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/team" element={<InvitePage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/mine" element={<MinePage />} />
        <Route path="/account" element={<MinePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/bind-card" element={<BindCardPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/recharge" element={<RechargePage />} />
        <Route path="/recharge-status" element={<RechargeStatusPage />} />
        <Route path="/withdraw" element={<FallbackPage title="Withdraw" />} />
        <Route path="/withdraw-status" element={<FallbackPage title="Withdraw Status" />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/tasks" element={<FallbackPage title="Tasks" />} />
        <Route path="/customer-service" element={<CustomerServicePage />} />
        <Route path="/regulation" element={<FallbackPage title="Regulations" />} />
        <Route path="/redeem" element={<RedeemGiftPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </HashRouter>
);

export default App;
