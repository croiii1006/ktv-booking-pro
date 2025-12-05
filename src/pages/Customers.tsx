import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Phone, CreditCard, Calendar } from 'lucide-react';
import { Customer } from '@/types';

const memberTypeLabels = {
  regular: { label: '普通', color: 'bg-muted text-muted-foreground' },
  vip: { label: 'VIP', color: 'bg-secondary text-secondary-foreground' },
  svip: { label: 'SVIP', color: 'gradient-gold text-primary' },
};

export default function Customers() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user, isLeader } = useAuth();
  const { customers } = useData();

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.includes(search) || c.phone.includes(search);
    const matchStaff = isLeader || c.staffId === user?.id;
    return matchSearch && matchStaff;
  });

  return (
    <AppLayout title="我的客户">
      <div className="p-4 space-y-4">
        {/* Search & Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜索客户姓名或手机号"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="gold"
            size="icon"
            onClick={() => navigate('/customers/new')}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Customer List */}
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={() => navigate(`/customers/${customer.id}`)}
            />
          ))}
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>暂无客户数据</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function CustomerCard({ customer, onClick }: { customer: Customer; onClick: () => void }) {
  const typeInfo = memberTypeLabels[customer.memberType];

  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-xl p-4 shadow-sm border border-border text-left transition-all duration-200 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{customer.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Phone className="w-3 h-3" />
            <span>{customer.phone}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">余额</p>
          <p className="text-lg font-bold text-secondary">¥{customer.balance.toLocaleString()}</p>
        </div>
      </div>
    </button>
  );
}
