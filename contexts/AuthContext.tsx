import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем состояние авторизации при загрузке
  useEffect(() => {
    // Заглушка - в реальном приложении здесь будет проверка токена
    const checkAuthState = async () => {
      setIsLoading(true);
      // Симуляция проверки авторизации
      setTimeout(() => {
        setIsLoading(false);
        // Постоянно авторизован для разработки
        setUser({
          id: '1',
          email: 'user@example.com',
          name: 'Пользователь',
        });
      }, 1000);
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Заглушка для авторизации
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // В реальном приложении здесь будет API запрос
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };

      setUser(mockUser);
    } catch (error) {
      throw new Error('Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Заглушка для регистрации
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // В реальном приложении здесь будет API запрос
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };

      setUser(mockUser);
    } catch (error) {
      throw new Error('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
