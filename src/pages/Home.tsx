import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Users, Calendar, Grid3X3, ClipboardList, DollarSign, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user, isLeader } = useAuth();
  const { customers, orders } = useData();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const todayOrders = orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length;
  const myCustomers = customers.filter(c => c.staffId === user?.id).length;

  const menuItems = [
    {
      icon: Users,
      label: '我的客户',
      description: `${myCustomers} 位客户`,
      to: '/customers',
      color: 'bg-blue-500',
    },
    {
      icon: Calendar,
      label: '订房',
      description: '为客户预定包厢',
      to: '/booking',
      color: 'bg-green-500',
    },
    {
      icon: Grid3X3,
      label: '订房情况',
      description: '查看排房表',
      to: '/booking-grid',
      color: 'bg-purple-500',
    },
    {
      icon: ClipboardList,
      label: '订单列表',
      description: `${pendingOrders} 个待审核`,
      to: '/orders',
      color: 'bg-orange-500',
    },
  ];

  return (
    <AppLayout title="金色年华 KTV">
      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">今日订单</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{todayOrders}</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">待审核</span>
            </div>
            <p className="text-2xl font-bold text-warning">{pendingOrders}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">快捷功能</h2>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className="bg-card rounded-xl p-4 shadow-sm border border-border text-left transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Leader Actions */}
        {isLeader && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">队长功能</h2>
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">审核订单</h3>
                  <p className="text-xs text-muted-foreground mt-1">{pendingOrders} 个订单待审核</p>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="gradient-gold text-primary px-4 py-2 rounded-lg text-sm font-medium shadow-gold"
                >
                  去审核
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
