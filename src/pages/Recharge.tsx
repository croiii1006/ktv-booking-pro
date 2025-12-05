import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const quickAmounts = [500, 1000, 2000, 5000, 10000];

export default function Recharge() {
  const { id } = useParams<{ id: string }>();
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCustomerById, updateCustomerBalance } = useData();

  const customer = getCustomerById(id || '');

  if (!customer) {
    return (
      <AppLayout title="充值" showBack>
        <div className="p-4 text-center text-muted-foreground">
          客户不存在
        </div>
      </AppLayout>
    );
  }

  const handleRecharge = () => {
    const rechargeAmount = Number(amount);
    if (!rechargeAmount || rechargeAmount <= 0) {
      toast({
        title: '请输入有效金额',
        variant: 'destructive',
      });
      return;
    }

    updateCustomerBalance(customer.id, rechargeAmount, user?.id || '');
    
    toast({
      title: '充值成功',
      description: `已为 ${customer.name} 充值 ¥${rechargeAmount}`,
    });
    
    navigate(`/customers/${customer.id}`);
  };

  return (
    <AppLayout title="客户充值" showBack>
      <div className="p-4 space-y-6">
        {/* Customer Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{customer.name}</p>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">当前余额</p>
              <p className="text-xl font-bold text-secondary">¥{customer.balance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Amount */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">快捷金额</label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(String(quickAmount))}
                className={`py-3 rounded-lg border text-center font-medium transition-all ${
                  amount === String(quickAmount)
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-border bg-card text-foreground hover:border-secondary'
                }`}
              >
                ¥{quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">自定义金额</label>
          <Input
            type="number"
            placeholder="请输入充值金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Preview */}
        {amount && Number(amount) > 0 && (
          <div className="bg-muted rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">充值金额</span>
              <span className="font-medium">¥{Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">充值后余额</span>
              <span className="font-bold text-secondary">
                ¥{(customer.balance + Number(amount)).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="gold"
          size="xl"
          className="w-full"
          onClick={handleRecharge}
          disabled={!amount || Number(amount) <= 0}
        >
          确认充值
        </Button>
      </div>
    </AppLayout>
  );
}
