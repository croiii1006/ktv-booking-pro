import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLeader: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users
const mockUsers: Record<string, { password: string; user: User }> = {
  'staff1': {
    password: '123456',
    user: { id: 'S001', name: '张三', phone: '13800001111', role: 'staff' }
  },
  'staff2': {
    password: '123456',
    user: { id: 'S002', name: '李四', phone: '13800002222', role: 'staff' }
  },
  'leader': {
    password: '123456',
    user: { id: 'L001', name: '王队长', phone: '13800003333', role: 'leader' }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const userData = mockUsers[username];
    if (userData && userData.password === password) {
      setUser(userData.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isLeader = user?.role === 'leader';

  return (
    <AuthContext.Provider value={{ user, login, logout, isLeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
