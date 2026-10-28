import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Users, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface Props { children:ReactNode; siteName:string; onLogout:()=>void; logoutBusy:boolean }
const tabs:{path:string;label:string;icon:LucideIcon}[]=[{path:'/home',label:'Home',icon:Home},{path:'/product',label:'Products',icon:Package},{path:'/team',label:'Team',icon:Users},{path:'/mine',label:'Account',icon:UserRound}];
export default function SiteUserLayout({children,siteName,onLogout,logoutBusy}:Props) {
  return <div className="min-h-screen bg-background"><header className="border-b border-border bg-card px-4 py-4 lg:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><NavLink to="/home" className="flex min-h-11 items-center font-semibold text-primary text-xl">{siteName}</NavLink><Button variant="outline" disabled={logoutBusy} onClick={onLogout} className="min-h-11 rounded-xl">{logoutBusy?'Signing out...':'Sign out'}</Button></div></header><div className="mx-auto max-w-7xl lg:flex"><nav aria-label="Member navigation" className="fixed bottom-0 inset-x-0 z-30 flex border-t border-border bg-card p-2 lg:static lg:w-56 lg:shrink-0 lg:flex-col lg:gap-3 lg:border-t-0 lg:border-r lg:p-6">{tabs.map(({path,label,icon:Icon})=><NavLink key={path} to={path} className={({isActive})=>`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 text-base font-medium lg:flex-none lg:flex-row lg:justify-start lg:gap-3 hover:bg-primary/10 focus-visible:outline focus-visible:outline-primary ${isActive?'bg-primary/10 text-primary':'text-muted-foreground'}`}><Icon size={22}/>{label}</NavLink>)}</nav><main className="min-w-0 flex-1 p-4 pb-28 lg:p-8">{children}</main></div></div>;
}
