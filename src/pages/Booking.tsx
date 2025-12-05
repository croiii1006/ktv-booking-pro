import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

const roomTypeLabels = {
  luxury: '豪华包',
  large: '大包',
  medium: '中包',
  small: '小包',
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedCustomerId = searchParams.get('customerId');
  const preselectedRoomId = searchParams.get('roomId');
  const preselectedDate = searchParams.get('date');

  const [roomType, setRoomType] = useState<string>('');
  const [roomId, setRoomId] = useState<string>(preselectedRoomId || '');
  const [date, setDate] = useState<string>(preselectedDate || new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState<string>(preselectedCustomerId || '');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms, customers, addOrder, getBookingStatus } = useData();

  // Filter rooms by type
  const filteredRooms = roomType ? rooms.filter(r => r.type === roomType) : rooms;

  // Get available rooms for selected date
  const availableRooms = filteredRooms.filter(r => getBookingStatus(r.id, date) === 'available');

  useEffect(() => {
    if (preselectedRoomId) {
      const room = rooms.find(r => r.id === preselectedRoomId);
      if (room) {
        setRoomType(room.type);
      }
    }
  }, [preselectedRoomId, rooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId || !date || !customerId) {
      toast({
        title: '请填写完整信息',
        variant: 'destructive',
      });
      return;
    }

    const status = getBookingStatus(roomId, date);
    if (status !== 'available') {
      toast({
        title: '该房间已被预定',
        variant: 'destructive',
      });
      return;
    }

    addOrder({
      roomId,
      customerId,
      staffId: user?.id || '',
      date,
    });

    toast({
      title: '提交成功',
      description: '订房申请已提交，等待队长审核',
    });

    navigate('/orders');
  };

  const selectedRoom = rooms.find(r => r.id === roomId);
  const selectedCustomer = customers.find(c => c.id === customerId);

  return (
    <AppLayout title="订房" showBack>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">预定日期 *</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">房型</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="选择房型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">豪华包 ¥888/h</SelectItem>
                <SelectItem value="large">大包 ¥588/h</SelectItem>
                <SelectItem value="medium">中包 ¥388/h</SelectItem>
                <SelectItem value="small">小包 ¥288/h</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              房间号 * 
              <span className="text-muted-foreground font-normal ml-2">
                ({availableRooms.length} 间可预定)
              </span>
            </label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="选择房间" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.number}号 - {roomTypeLabels[room.type]} ({room.floor}楼)
                  </SelectItem>
                ))}
                {availableRooms.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">暂无可预定房间</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">客户 *</label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="选择客户" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Preview */}
          {selectedRoom && selectedCustomer && (
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-foreground">订单预览</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">房间:</span>
                <span>{selectedRoom.number}号 {roomTypeLabels[selectedRoom.type]}</span>
                <span className="text-muted-foreground">日期:</span>
                <span>{date}</span>
                <span className="text-muted-foreground">客户:</span>
                <span>{selectedCustomer.name}</span>
                <span className="text-muted-foreground">价格:</span>
                <span className="text-secondary font-semibold">¥{selectedRoom.pricePerHour}/小时</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="xl"
            className="w-full mt-6"
            disabled={!roomId || !date || !customerId}
          >
            提交订房申请
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
