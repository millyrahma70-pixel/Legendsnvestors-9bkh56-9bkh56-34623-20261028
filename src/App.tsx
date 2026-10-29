import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';

const Index = lazy(() => import('@/pages/Index'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CloudUserPage = lazy(() => import('@/pages/CloudUserPage'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Suspense fallback={<div style={{minHeight:'100vh', background:'#111', color:'#c9a84c', display:'grid', placeItems:'center'}}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<CloudUserPage />} />
          <Route path="*" element={<div style={{minHeight:'100vh', background:'#111', color:'#fff', display:'grid', placeItems:'center'}}>Not Found - <a href="#/" style={{color:'#c9a84c'}}>Home</a></div>} />
        </Routes>
      </Suspense>
    </HashRouter>
  </QueryClientProvider>
);

export default App;
