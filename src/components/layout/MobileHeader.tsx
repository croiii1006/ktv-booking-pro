import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Crown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
}

export function MobileHeader({ title, showBack }: MobileHeaderProps) {
  const { user, logout, isLeader } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 gradient-primary text-primary-foreground">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2"
            >
              ←
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {user && (
              <div className="flex items-center gap-1 text-xs text-primary-foreground/80">
                {isLeader ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
                <span>{user.name}</span>
                <span className="opacity-60">({isLeader ? '队长' : '业务员'})</span>
              </div>
            )}
          </div>
        </div>
        
        {user && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
