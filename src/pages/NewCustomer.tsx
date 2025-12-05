import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewCustomer() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [memberType, setMemberType] = useState<'regular' | 'vip' | 'svip'>('regular');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [rechargeBalance, setRechargeBalance] = useState('');
  const [giftBalance, setGiftBalance] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addCustomer } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !idCard) {
      toast({
        title: '请填写完整信息',
        description: '姓名、手机号和身份证号为必填项',
        variant: 'destructive',
      });
      return;
    }

    addCustomer({
      name,
      phone,
      idCard,
      memberType,
      registrationDate,
      rechargeBalance: Number(rechargeBalance) || 0,
      giftBalance: Number(giftBalance) || 0,
      staffId: user?.id || '',
    });

    toast({
      title: '新增成功',
      description: `客户 ${name} 已添加`,
    });
    
    navigate('/customers');
  };

  return (
    <AppLayout title="新增客户" showBack>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">客户姓名 *</label>
            <Input
              placeholder="请输入客户姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">手机号码 *</label>
            <Input
              type="tel"
              placeholder="请输入手机号码"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">身份证号 *</label>
            <Input
              placeholder="请输入身份证号"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">会员类型</label>
            <Select value={memberType} onValueChange={(v: any) => setMemberType(v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="选择会员类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">普通会员</SelectItem>
                <SelectItem value="vip">VIP会员</SelectItem>
                <SelectItem value="svip">SVIP会员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">办理日期</label>
            <Input
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">剩余充值金额</label>
            <Input
              type="number"
              placeholder="请输入充值金额"
              value={rechargeBalance}
              onChange={(e) => setRechargeBalance(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">剩余赠送金额</label>
            <Input
              type="number"
              placeholder="请输入赠送金额"
              value={giftBalance}
              onChange={(e) => setGiftBalance(e.target.value)}
            />
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full mt-6">
            确认新增
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
