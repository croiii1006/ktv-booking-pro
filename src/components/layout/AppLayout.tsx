import { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  hideNav?: boolean;
}

export function AppLayout({ children, title, showBack, hideNav }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader title={title} showBack={showBack} />
      <main className={`flex-1 ${hideNav ? '' : 'pb-20'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
