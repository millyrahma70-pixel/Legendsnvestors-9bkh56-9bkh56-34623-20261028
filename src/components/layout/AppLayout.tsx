import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export default function AppLayout({ children, noPadding }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="max-w-[430px] w-full mx-auto min-h-screen bg-[#0a0a0a] relative">
        <div className={noPadding ? '' : 'pb-[80px]'}>
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
