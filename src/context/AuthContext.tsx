import {createContext, useContext, useState, useCallback, type ReactNode} from 'react';
import {generateId} from '../utils/uuid';

export interface User {
  id: string;
  username: string;
  nombre: string;
  cargo: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_USER: User = {
  id: generateId(),
  username: 'admin',
  nombre: 'Administrador',
  cargo: 'Administrador del Sistema',
  email: 'admin@stmsc.gob.bo',
};

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      setUser(ADMIN_USER);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
