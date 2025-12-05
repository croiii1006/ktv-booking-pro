import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Users, Grid3X3, ClipboardList } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user, isLeader } = useAuth();
  const { customers, orders } = useData();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const myCustomers = customers.filter(c => c.staffId === user?.id).length;

  // Staff menu items
  const staffMenuItems = [
    {
      icon: Users,
      label: '我的客户',
      description: `${myCustomers} 位客户`,
      to: '/customers',
      color: 'bg-blue-500',
    },
    {
      icon: Grid3X3,
      label: '排房情况',
      description: '查看排房表',
      to: '/booking-grid',
      color: 'bg-purple-500',
    },
    {
      icon: ClipboardList,
      label: '订单申请',
      description: `${pendingOrders} 个待审核`,
      to: '/orders',
      color: 'bg-orange-500',
    },
  ];

  // Leader menu items
  const leaderMenuItems = [
    {
      icon: Users,
      label: '我的客户',
      description: `${myCustomers} 位客户`,
      to: '/customers',
      color: 'bg-blue-500',
    },
    {
      icon: Grid3X3,
      label: '排房情况',
      description: '查看排房表',
      to: '/booking-grid',
      color: 'bg-purple-500',
    },
    {
      icon: ClipboardList,
      label: '订单审核',
      description: `${pendingOrders} 个待审核`,
      to: '/orders',
      color: 'bg-orange-500',
    },
  ];

  const menuItems = isLeader ? leaderMenuItems : staffMenuItems;

  return (
    <AppLayout title="金色年华 KTV">
      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLeader ? '队长' : '业务员'} | 编号: {user?.id}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">快捷功能</h2>
          <div className="grid grid-cols-1 gap-3">
            {menuItems.map((item) => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className="bg-card rounded-xl p-4 shadow-sm border border-border text-left transition-all duration-200 hover:shadow-md active:scale-[0.98] flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
