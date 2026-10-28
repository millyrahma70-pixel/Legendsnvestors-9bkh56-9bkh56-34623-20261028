import { ShieldCheck } from 'lucide-react';

export default function AdminSignInBrand() {
  return <header className="admin-login-brand text-center lg:text-left">
    <div className="admin-brand-mark mx-auto h-20 w-20 rounded-3xl lg:mx-0"><ShieldCheck size={40} strokeWidth={1.75} aria-hidden="true" /></div>
    <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Legend Investors</h1>
    <p className="mt-2 text-base text-muted-foreground sm:text-lg">Administrator · Full website control</p>
    <div className="mt-8 hidden max-w-md border-t border-primary/20 pt-8 lg:block">
      <p className="text-2xl font-semibold leading-snug">One secure sign-in.<br /><span className="text-primary">Every account and device.</span></p>
      <p className="mt-4 text-muted-foreground leading-relaxed">Manage members, review payments, create redeem codes and update website settings from your control panel.</p>
    </div>
  </header>;
}
