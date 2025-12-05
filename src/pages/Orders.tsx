import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: '待审核', color: 'bg-warning/10 text-warning', icon: Clock },
  approved: { label: '已通过', color: 'bg-success/10 text-success', icon: CheckCircle },
  rejected: { label: '已驳回', color: 'bg-destructive/10 text-destructive', icon: XCircle },
  paid: { label: '已支付', color: 'bg-primary/10 text-primary', icon: CreditCard },
  cancelled: { label: '已取消', color: 'bg-muted text-muted-foreground', icon: XCircle },
};

const roomTypeLabels = {
  luxury: '豪华包',
  large: '大包',
  medium: '中包',
  small: '小包',
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user, isLeader } = useAuth();
  const { orders, updateOrderStatus, getCustomerById, getRoomById } = useData();

  // Filter orders based on role
  // Staff: see their own orders (订单申请)
  // Leader: see only staff applications, not their own (订单审核)
  const filteredOrders = isLeader 
    ? orders.filter(o => o.staffId !== user?.id) // Leader sees staff orders only
    : orders.filter(o => o.staffId === user?.id); // Staff sees their own orders

  // Sort by date and status
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const statusOrder = { pending: 0, approved: 1, paid: 2, rejected: 3, cancelled: 4 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleApprove = (orderId: string) => {
    updateOrderStatus(orderId, 'approved', user?.id);
    toast({ title: '订单已通过', description: '订单审核已通过' });
    setSelectedOrder(null);
  };

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected', user?.id);
    toast({ title: '订单已驳回', description: '订单审核已驳回' });
    setSelectedOrder(null);
  };

  const handleMarkPaid = (orderId: string) => {
    updateOrderStatus(orderId, 'paid', user?.id);
    toast({ title: '订单已支付', description: '已标记为已支付' });
    setSelectedOrder(null);
  };

  const handleCancel = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled', user?.id);
    toast({ title: '订单已取消', description: '预定已取消' });
    setSelectedOrder(null);
  };

  const pageTitle = isLeader ? '订单审核' : '订单申请';

  return (
    <AppLayout title={pageTitle}>
      <div className="p-4 space-y-3">
        {sortedOrders.map((order) => {
          const room = getRoomById(order.roomId);
          const customer = getCustomerById(order.customerId);
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;

          return (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full bg-card rounded-xl p-4 shadow-sm border border-border text-left transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {room?.number}号 {room && roomTypeLabels[room.type]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    客户: {customer?.name} | 日期: {order.date}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    申请人: {order.staffId}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {sortedOrders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            暂无{isLeader ? '待审核订单' : '订单申请'}
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>
              订单编号: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <OrderDetailContent
              order={selectedOrder}
              isLeader={isLeader}
              onApprove={() => handleApprove(selectedOrder.id)}
              onReject={() => handleReject(selectedOrder.id)}
              onMarkPaid={() => handleMarkPaid(selectedOrder.id)}
              onCancel={() => handleCancel(selectedOrder.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function OrderDetailContent({
  order,
  isLeader,
  onApprove,
  onReject,
  onMarkPaid,
  onCancel,
}: {
  order: Order;
  isLeader: boolean;
  onApprove: () => void;
  onReject: () => void;
  onMarkPaid: () => void;
  onCancel: () => void;
}) {
  const { getRoomById, getCustomerById } = useData();
  const room = getRoomById(order.roomId);
  const customer = getCustomerById(order.customerId);
  const status = statusConfig[order.status];

  return (
    <div className="space-y-4">
      <div className="bg-muted rounded-lg p-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">房间:</span>
          <span className="font-medium">{room?.number}号 {room && roomTypeLabels[room.type]}</span>
          
          <span className="text-muted-foreground">日期:</span>
          <span className="font-medium">{order.date}</span>
          
          <span className="text-muted-foreground">客户:</span>
          <span className="font-medium">{customer?.name}</span>
          
          <span className="text-muted-foreground">申请人:</span>
          <span className="font-medium">{order.staffId}</span>
          
          <span className="text-muted-foreground">状态:</span>
          <span className={`font-medium ${status.color} px-2 py-0.5 rounded inline-block`}>
            {status.label}
          </span>
          
          <span className="text-muted-foreground">申请时间:</span>
          <span className="font-medium text-xs">{new Date(order.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Leader Actions */}
      {isLeader && order.status === 'pending' && (
        <div className="flex gap-2">
          <Button variant="success" className="flex-1" onClick={onApprove}>
            通过
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onReject}>
            驳回
          </Button>
        </div>
      )}

      {isLeader && order.status === 'approved' && (
        <div className="flex gap-2">
          <Button variant="gold" className="flex-1" onClick={onMarkPaid}>
            标记已支付
          </Button>
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            取消预定
          </Button>
        </div>
      )}
    </div>
  );
}
