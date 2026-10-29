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
          
          {/* FIXED - MinePage IS your Account Page */}
          <Route path="/mine" element={<MinePage />} />
          <Route path="/account" element={<MinePage />} />
          
          <Route path="/checkin" element={<CloudUserPage />} />
          <Route path="/tasks" element={<CloudUserPage />} />
          <Route path="/recharge" element={<CloudUserPage />} />
          <Route path="/withdraw" element={<CloudUserPage />} />
          <Route path="/bind-card" element={<CloudUserPage />} />
          <Route path="/records" element={<CloudUserPage />} />
          <Route path="/about" element={<CloudUserPage />} />
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
