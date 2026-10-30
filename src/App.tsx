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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

