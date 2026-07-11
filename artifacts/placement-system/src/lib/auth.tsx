import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@workspace/api-client-react';
import { setAuthTokenGetter } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('placement_token');
    const storedUser = localStorage.getItem('placement_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('placement_token');
        localStorage.removeItem('placement_user');
      }
    }
    
    setAuthTokenGetter(() => localStorage.getItem('placement_token'));
    setIsReady(true);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('placement_token', newToken);
    localStorage.setItem('placement_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('placement_token');
    localStorage.removeItem('placement_user');
    setToken(null);
    setUser(null);
  };

  if (!isReady) return null; // Or a full screen loader

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
