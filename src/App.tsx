import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

const CloudUserPage = lazy(() => import('@/pages/CloudUserPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const TeamPage = lazy(() => import('@/pages/TeamPage'));
const MinePage = lazy(() => import('@/pages/MinePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const BindCardPage = lazy(() => import('@/pages/BindCardPage'));
const RecordsPage = lazy(() => import('@/pages/RecordsPage'));
const RechargePage = lazy(() => import('@/pages/RechargePage'));
const WithdrawPage = lazy(() => import('@/pages/WithdrawPage'));
const CheckInPage = lazy(() => import('@/pages/CheckInPage'));
const TaskCenterPage = lazy(() => import('@/pages/TaskCenterPage'));
const RechargeStatusPage = lazy(() => import('@/pages/RechargeStatusPage'));
const WithdrawStatusPage = lazy(() => import('@/pages/WithdrawStatusPage'));
const CustomerServicePage = lazy(() => import('@/pages/CustomerServicePage'));
const RegulationPage = lazy(() => import('@/pages/RegulationPage'));
const RedeemGiftPage = lazy(() => import('@/pages/RedeemGiftPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#0a0a0a] text-[#e6a800]">Loading Legends...</div>}>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<CloudUserPage />} />
          <Route path="/cloud-user" element={<CloudUserPage />} />
          
          <Route path="/product" element={<ProductPage />} />
          <Route path="/products" element={<ProductPage />} />
          
          <Route path="/team" element={<TeamPage />} />
          <Route path="/invite" element={<TeamPage />} />
          
          <Route path="/mine" element={<MinePage />} />
          <Route path="/account" element={<MinePage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/bind-card" element={<BindCardPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/recharge" element={<RechargePage />} />
          <Route path="/recharge-status" element={<RechargeStatusPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/withdraw-status" element={<WithdrawStatusPage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route path="/tasks" element={<TaskCenterPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          <Route path="/regulation" element={<RegulationPage />} />
          <Route path="/redeem" element={<RedeemGiftPage />} />
          
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
        </Suspense>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
