import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
const CloudUserPage = lazy(() => import('@/pages/CloudUserPage'));
import AdminAuthProvider from '@/components/features/AdminAuthProvider';
import AdminAccessGate from '@/components/features/AdminAccessGate';
import AdminErrorBoundary from '@/components/features/AdminErrorBoundary';
// import RegistrationSync from '@/components/features/RegistrationSync'; // DISABLED

const ProductPage = lazy(() => import('@/pages/ProductPage'));
const MinePage = lazy(() => import('@/pages/MinePage'));
const TaskCenterPage = lazy(() => import('@/pages/TaskCenterPage'));
const RechargePage = lazy(() => import('@/pages/RechargePage'));
const WithdrawPage = lazy(() => import('@/pages/WithdrawPage'));
const BindCardPage = lazy(() => import('@/pages/BindCardPage'));
const RecordsPage = lazy(() => import('@/pages/RecordsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const RegulationPage = lazy(() => import('@/pages/RegulationPage'));
const CustomerServicePage = lazy(() => import('@/pages/CustomerServicePage'));
const RedeemGiftPage = lazy(() => import('@/pages/RedeemGiftPage'));
const CheckInPage = lazy(() => import('@/pages/CheckInPage'));
const InvitePage = lazy(() => import('@/pages/InvitePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const RechargeStatusPage = lazy(() => import('@/pages/RechargeStatusPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AdminRecoveryPage = lazy(() => import('@/pages/AdminRecoveryPage'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        {/* <RegistrationSync /> DISABLED - was causing white screen */}
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-background text-foreground">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<CloudUserPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/team" element={<InvitePage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/mine" element={<MinePage />} />
          <Route path="/account" element={<MinePage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/tasks" element={<TaskCenterPage />} />
          <Route path="/task-center" element={<TaskCenterPage />} />
          <Route path="/task" element={<TaskCenterPage />} />
          <Route path="/recharge" element={<RechargePage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/withdrawal" element={<WithdrawPage />} />
          <Route path="/bind-card" element={<BindCardPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/regulation" element={<RegulationPage />} />
          <Route path="/platform-rules" element={<RegulationPage />} />
          <Route path="/rules" element={<RegulationPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          <Route path="/redeem" element={<RedeemGiftPage />} />
          <Route path="/withdraw-status" element={<RecordsPage />} />
          <Route path="/recharge-status" element={<RechargeStatusPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin/recovery" element={<AdminErrorBoundary><AdminRecoveryPage /></AdminErrorBoundary>} />
          <Route path="/admin" element={<AdminErrorBoundary><AdminAccessGate><AdminPage /></AdminAccessGate></AdminErrorBoundary>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </HashRouter>
    </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
