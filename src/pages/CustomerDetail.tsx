import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Phone, CreditCard, Calendar, User } from 'lucide-react';

const memberTypeLabels = {
  regular: { label: '普通会员', color: 'bg-muted text-muted-foreground' },
  vip: { label: 'VIP会员', color: 'bg-secondary text-secondary-foreground' },
  svip: { label: 'SVIP会员', color: 'gradient-gold text-primary' },
};

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById } = useData();

  const customer = getCustomerById(id || '');

  if (!customer) {
    return (
      <AppLayout title="客户详情" showBack>
        <div className="p-4 text-center text-muted-foreground">
          客户不存在
        </div>
      </AppLayout>
    );
  }

  const typeInfo = memberTypeLabels[customer.memberType];

  return (
    <AppLayout title="客户详情" showBack>
      <div className="p-4 space-y-4">
        {/* Customer Info Card */}
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">账户余额</p>
            <p className="text-3xl font-bold text-secondary">¥{customer.balance.toLocaleString()}</p>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            <p>客户编号: {customer.id}</p>
            <p>注册时间: {customer.createdAt}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={() => navigate(`/customers/${customer.id}/recharge`)}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            充值
          </Button>
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => navigate(`/booking?customerId=${customer.id}`)}
          >
            <Calendar className="w-5 h-5 mr-2" />
            订房
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
