import { NavLink } from '@/components/NavLink';
import { Home, Users, Calendar, ClipboardList, Grid3X3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function BottomNav() {
  const { isLeader } = useAuth();

  const navItems = [
    { to: '/home', icon: Home, label: '首页' },
    { to: '/customers', icon: Users, label: '客户' },
    { to: '/booking', icon: Calendar, label: '订房' },
    { to: '/booking-grid', icon: Grid3X3, label: '排房' },
    { to: '/orders', icon: ClipboardList, label: '订单' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
