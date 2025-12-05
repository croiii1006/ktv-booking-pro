import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Menu, X, Home, Users, DollarSign, Calendar, Grid3X3, ClipboardList, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order } from '@/types';

const roomTypeLabels = {
  luxury: '豪华包',
  large: '大包',
  medium: '中包',
  small: '小包',
};

const sidebarItems = [
  { icon: Home, label: '首页', to: '/home' },
  { icon: Grid3X3, label: '订房情况', to: '/booking-grid', active: true },
  { icon: Users, label: '用户管理', to: '/customers' },
  { icon: DollarSign, label: '充值记录', to: '/customers' },
  { icon: Calendar, label: '消费记录', to: '/orders' },
  { icon: ClipboardList, label: '订单管理', to: '/orders' },
];

export default function BookingGrid() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{ roomId: string; date: string } | null>(null);
  const [bookingCustomerId, setBookingCustomerId] = useState('');
  
  const navigate = useNavigate();
  const { user, isLeader, logout } = useAuth();
  const { rooms, customers, orders, addOrder, updateOrderStatus, getBookingStatus, getOrderByRoomAndDate, getCustomerById, getRoomById } = useData();

  // Generate dates for current week view
  const dates = useMemo(() => {
    const result: string[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekOffset * 7);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      result.push(date.toISOString().split('T')[0]);
    }
    return result;
  }, [weekOffset]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return {
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
      month: date.getMonth() + 1,
    };
  };

  const handleCellClick = (roomId: string, date: string) => {
    const status = getBookingStatus(roomId, date);
    setSelectedCell({ roomId, date });
    setBookingCustomerId('');
  };

  const handleBooking = () => {
    if (!selectedCell || !bookingCustomerId) {
      toast({ title: '请选择客户', variant: 'destructive' });
      return;
    }

    addOrder({
      roomId: selectedCell.roomId,
      customerId: bookingCustomerId,
      staffId: user?.id || '',
      date: selectedCell.date,
    });

    toast({ title: '预定成功', description: '订房申请已提交，等待审核' });
    setSelectedCell(null);
    setBookingCustomerId('');
  };

  const handleMarkPaid = (orderId: string) => {
    updateOrderStatus(orderId, 'paid', user?.id);
    toast({ title: '已标记支付' });
    setSelectedCell(null);
  };

  const handleCancelBooking = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled', user?.id);
    toast({ title: '已取消预定' });
    setSelectedCell(null);
  };

  const selectedStatus = selectedCell ? getBookingStatus(selectedCell.roomId, selectedCell.date) : null;
  const selectedOrder = selectedCell ? getOrderByRoomAndDate(selectedCell.roomId, selectedCell.date) : null;
  const selectedRoom = selectedCell ? getRoomById(selectedCell.roomId) : null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 gradient-primary transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-foreground">金色年华 KTV</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-primary-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-primary-foreground/70 mt-1">管理系统</p>
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.to}
                onClick={() => {
                  navigate(item.to);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  item.active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-accent-foreground font-bold">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{isLeader ? '队长' : '业务员'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">订房情况</h1>
          
          {/* Week Navigation */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekOffset(w => w - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
              本周
            </Button>
            <Button variant="outline" size="icon" onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Grid Table */}
        <div className="flex-1 overflow-auto p-4">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="bg-muted rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-muted-foreground">房间</span>
              </div>
              {dates.map((date) => {
                const formatted = formatDate(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                return (
                  <div 
                    key={date} 
                    className={`rounded-lg p-2 text-center ${isToday ? 'bg-secondary/20' : 'bg-muted'}`}
                  >
                    <p className={`text-lg font-bold ${isToday ? 'text-secondary' : 'text-foreground'}`}>
                      {formatted.day}
                    </p>
                    <p className="text-xs text-muted-foreground">周{formatted.weekday}</p>
                  </div>
                );
              })}
            </div>

            {/* Room Rows */}
            {rooms.map((room) => (
              <div key={room.id} className="grid grid-cols-8 gap-1 mb-1">
                {/* Room Info */}
                <div className="bg-card rounded-lg p-2 border border-border">
                  <p className="font-bold text-foreground">{room.number}号</p>
                  <p className="text-xs text-muted-foreground">{roomTypeLabels[room.type]}</p>
                  <p className="text-xs text-muted-foreground">{room.floor}楼</p>
                </div>
                
                {/* Date Cells */}
                {dates.map((date) => {
                  const status = getBookingStatus(room.id, date);
                  const order = getOrderByRoomAndDate(room.id, date);
                  const customer = order ? getCustomerById(order.customerId) : null;
                  
                  const statusStyles = {
                    available: 'bg-muted hover:bg-muted/80 cursor-pointer',
                    booked: 'bg-success/20 border-success/50 cursor-pointer',
                    occupied: 'bg-destructive/20 border-destructive/50',
                  };

                  return (
                    <button
                      key={date}
                      onClick={() => handleCellClick(room.id, date)}
                      className={`rounded-lg p-2 border transition-all min-h-[60px] flex flex-col items-center justify-center ${statusStyles[status]}`}
                    >
                      {status === 'available' && (
                        <span className="text-xs text-muted-foreground">可预定</span>
                      )}
                      {status === 'booked' && (
                        <>
                          <span className="text-xs font-medium text-success">已预定</span>
                          {customer && (
                            <span className="text-xs text-muted-foreground truncate max-w-full">
                              {customer.name}
                            </span>
                          )}
                        </>
                      )}
                      {status === 'occupied' && (
                        <span className="text-xs font-medium text-destructive">已占用</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted border border-border" />
              <span className="text-muted-foreground">可预定</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success/20 border border-success/50" />
              <span className="text-muted-foreground">已预定</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/50" />
              <span className="text-muted-foreground">已占用</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking/Detail Dialog */}
      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="max-w-sm mx-auto">
          {selectedStatus === 'available' ? (
            <>
              <DialogHeader>
                <DialogTitle>预定包厢</DialogTitle>
                <DialogDescription>
                  {selectedRoom?.number}号 {selectedRoom && roomTypeLabels[selectedRoom.type]} - {selectedCell?.date}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">选择客户</label>
                  <Select value={bookingCustomerId} onValueChange={setBookingCustomerId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="请选择客户" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground">业务员: {user?.name} ({user?.id})</p>
                </div>
                <Button variant="gold" className="w-full" onClick={handleBooking}>
                  提交预定
                </Button>
              </div>
            </>
          ) : selectedOrder ? (
            <>
              <DialogHeader>
                <DialogTitle>预定详情</DialogTitle>
                <DialogDescription>
                  订单编号: {selectedOrder.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">房间:</span>
                    <span>{selectedRoom?.number}号 {selectedRoom && roomTypeLabels[selectedRoom.type]}</span>
                    <span className="text-muted-foreground">日期:</span>
                    <span>{selectedCell?.date}</span>
                    <span className="text-muted-foreground">客户:</span>
                    <span>{getCustomerById(selectedOrder.customerId)?.name}</span>
                    <span className="text-muted-foreground">申请人:</span>
                    <span>{selectedOrder.staffId}</span>
                    <span className="text-muted-foreground">状态:</span>
                    <span className={selectedOrder.status === 'paid' ? 'text-primary font-medium' : 'text-success font-medium'}>
                      {selectedOrder.status === 'paid' ? '已支付' : '已预定'}
                    </span>
                  </div>
                </div>
                
                {isLeader && selectedOrder.status === 'approved' && (
                  <div className="flex gap-2">
                    <Button variant="gold" className="flex-1" onClick={() => handleMarkPaid(selectedOrder.id)}>
                      已到店并支付
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleCancelBooking(selectedOrder.id)}>
                      取消预定
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
