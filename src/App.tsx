import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import CloudUserPage from "./pages/CloudUserPage";
import ProductPage from "./pages/ProductPage";
import MinePage from "./pages/MinePage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import BindCardPage from "./pages/BindCardPage";
import RecordsPage from "./pages/RecordsPage";
import RechargePage from "./pages/RechargePage";
import CheckInPage from "./pages/CheckInPage";
import RechargeStatusPage from "./pages/RechargeStatusPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import RedeemGiftPage from "./pages/RedeemGiftPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import InvitePage from "./pages/InvitePage";

function WithdrawPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', padding: '20px' }}>
      <h2 style={{ color: '#c9a84c' }}>Withdraw</h2>
      <p style={{ color: '#888', marginTop: '10px' }}>Min UGX 5,000 - 5% fee - 24h process</p>
      <a href="#/mine" style={{ color: '#c9a84c', display: 'inline-block', marginTop: '20px' }}>Back to Account</a>
    </div>
  );
}

function RegulationPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', padding: '20px' }}>
      <h2 style={{ color: '#c9a84c' }}>Platform Rules</h2>
      <div style={{ marginTop: '16px', lineHeight: '22px', fontSize: '14px', color: '#ccc' }}>
        <p>1. Daily income at 00:00 UTC</p><p>2. L1 15%, L2 5%, L3 2% commission</p><p>3. Min recharge 20k, min withdraw 5k</p>
      </div>
      <a href="#/mine" style={{ color: '#c9a84c', display: 'inline-block', marginTop: '20px' }}>Back</a>
    </div>
  );
}

function TaskCenterPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', padding: '20px' }}>
      <h2 style={{ color: '#c9a84c' }}>Task Center</h2>
      <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
        <a href="#/checkin" style={{ background: '#1e1e1e', padding: '16px', borderRadius: '12px', color: 'white', textDecoration: 'none' }}>Daily Check-in →</a>
        <a href="#/invite" style={{ background: '#1e1e1e', padding: '16px', borderRadius: '12px', color: 'white', textDecoration: 'none' }}>Invite Friends →</a>
        <a href="#/redeem" style={{ background: '#1e1e1e', padding: '16px', borderRadius: '12px', color: 'white', textDecoration: 'none' }}>Redeem Gift →</a>
      </div>
    </div>
  );
}

function WithdrawStatusPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: 'white', padding: '20px' }}>
      <h2 style={{ color: '#c9a84c' }}>Withdrawal Status</h2>
      <p style={{ color: '#666', marginTop: '20px' }}>No withdrawals yet</p>
      <a href="#/mine" style={{ color: '#c9a84c', display: 'inline-block', marginTop: '20px' }}>Back</a>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
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
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/customer-service" element={<CustomerServicePage />} />
        <Route path="/redeem" element={<RedeemGiftPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* THESE WERE MISSING - CAUSING YOUR 404 */}
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/withdrawal" element={<WithdrawPage />} />
        <Route path="/withdrawal-status" element={<WithdrawStatusPage />} />
        <Route path="/withdraw-status" element={<WithdrawStatusPage />} />
        <Route path="/regulation" element={<RegulationPage />} />
        <Route path="/platform-rules" element={<RegulationPage />} />
        <Route path="/rules" element={<RegulationPage />} />
        <Route path="/task" element={<TaskCenterPage />} />
        <Route path="/tasks" element={<TaskCenterPage />} />
        <Route path="/task-center" element={<TaskCenterPage />} />
        <Route path="/taskcenter" element={<TaskCenterPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
      }
