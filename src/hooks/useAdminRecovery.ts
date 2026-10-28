import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendAdminOtp, verifyAdminOtpAndSetPassword } from '@/lib/adminAuth';
import type { AdminVerificationValues } from '@/lib/adminValidations';

export function useAdminRecovery() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  const send = useMutation({
    mutationFn: sendAdminOtp,
    retry: false,
    onSuccess: () => {
      setSent(true);
      setCooldown(60);
      toast.success('Recovery code requested. Check your admin email and spam folder.');
    },
    onError: (error: Error) => { setCooldown(60); toast.error(error.message); },
  });
  const save = useMutation({
    mutationFn: (values: AdminVerificationValues) => verifyAdminOtpAndSetPassword(values.token, values.password),
    retry: false,
    onSuccess: () => {
      toast.success('Admin password saved. Sign in with your number and new password.');
      navigate('/login', { replace: true });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  return { sent, cooldown, send, save };
}
