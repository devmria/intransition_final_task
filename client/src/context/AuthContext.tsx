import { AuthService } from '~services/Auth/AuthService';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, LoginRequest, RegisterRequest } from '@intransition/shared-types';

interface AuthContextProps {
  user: UserProfile | null;
  loading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AuthService.getCurrentUser();
        setUser(data);
      } catch (error) {
        setUser(null);
      } 
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (request: LoginRequest) => {
    setLoading(true);
    try {
      const data = await AuthService.login(request);
      setUser(data);
    } catch (error) {
      throw error;
    } 
    setLoading(false);
  };

  const register = async (request: RegisterRequest) => {
    setLoading(true);
    try {
      const data = await AuthService.register(request);
      setUser(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }

  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      throw error;
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);