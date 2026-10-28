import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { z } from 'zod';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { loginSchema } from '@/lib/siteValidations';
import { signInAccount } from '@/lib/siteAuth';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export function useSharedLogin() {
  const navigate = useNavigate();
  const { user, loading } = useAdminAuth();
  const login = useMutation({
    mutationFn: (values: z.infer<typeof loginSchema>) => signInAccount(values.identifier, values.password),
    onSuccess: account => navigate(isAuthorizedAdmin(account) ? '/admin' : '/home', { replace: true }),
    onError: (error: Error) => toast.error(error.message),
    retry: false,
    gcTime: 0,
  });
  useEffect(() => {
    if (!loading && !login.isPending && user?.verified) navigate(isAuthorizedAdmin(user) ? '/admin' : '/home', { replace: true });
  }, [user, loading, login.isPending, navigate]);
  return { login, busy: loading || login.isPending };
}
