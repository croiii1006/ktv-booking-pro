import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Mic2, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast({
          title: '登录成功',
          description: '欢迎回来！',
        });
        navigate('/home');
      } else {
        toast({
          title: '登录失败',
          description: '账号或密码错误',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen gradient-primary flex flex-col">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <div className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center shadow-gold mb-6 animate-pulse-gold">
          <Mic2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground mb-2">金色年华 KTV</h1>
        <p className="text-primary-foreground/70 text-sm">业务管理系统</p>
      </div>

      {/* Login Form */}
      <div className="bg-card rounded-t-3xl px-6 py-8 shadow-lg animate-slide-up">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">业务员登录</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="请输入账号"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-12"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="xl"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? '登录中...' : '登 录'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            测试账号: staff1 / staff2 / leader
          </p>
          <p className="text-xs text-muted-foreground">
            密码: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
