import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  exp: number;
  iat: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simulación de API
const mockApi = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === 'teacher@example.com' && password === 'teacher123') {
      return {
        accessToken: 'mock-access-token-teacher',
        refreshToken: 'mock-refresh-token-teacher',
        user: {
          id: '2',
          name: 'Profesor Ejemplo',
          email: 'teacher@example.com',
          role: 'teacher',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
      };
    }

    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        accessToken: 'mock-access-token-admin',
        refreshToken: 'mock-refresh-token-admin',
        user: {
          id: '3',
          name: 'Administrador',
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
      };
    }

    if (password === 'password123') {
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          name: 'Estudiante Ejemplo',
          email: email,
          role: 'student',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
      };
    }

    throw new Error('Credenciales inválidas');
  },

  register: async (name: string, email: string, password: string, role: User['role']) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      accessToken: 'mock-access-token-new',
      refreshToken: 'mock-refresh-token-new',
      user: {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      },
    };
  },

  refreshToken: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      accessToken: 'mock-new-access-token',
      refreshToken: 'mock-new-refresh-token',
    };
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
  }, [navigate, toast]);

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const data = await mockApi.refreshToken();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      const decoded = jwtDecode<DecodedToken>(data.accessToken);
      if (['student', 'teacher', 'admin'].includes(decoded.role)) {
        setUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role as 'student' | 'teacher' | 'admin',
        });
      } else {
        throw new Error('Rol no válido');
      }
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.exp * 1000 > Date.now()) {
            setUser({
              id: decoded.sub,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
            });
          } else {
            await refreshToken();
          }
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await mockApi.login(email, password);
  
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
  
      // Validar que el rol sea uno de los valores permitidos
      if (['student', 'teacher', 'admin'].includes(data.user.role)) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as 'student' | 'teacher' | 'admin', // Asegura el tipo
          avatar: data.user.avatar,
        });
      } else {
        throw new Error('Rol no válido');
      }
  
      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido de vuelta, ${data.user.name}!`,
      });
  
      const redirectPath = {
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        admin: '/admin/dashboard',
      }[data.user.role] || '/dashboard';
  
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error de autenticación',
        description: error instanceof Error ? error.message : 'Credenciales inválidas',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    try {
      setIsLoading(true);
      const data = await mockApi.register(name, email, password, role);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);

      toast({
        title: 'Registro exitoso',
        description: `Bienvenido a CodeVerse, ${data.user.name}!`,
      });

      const redirectPath = {
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        admin: '/admin/dashboard',
      }[data.user.role] || '/dashboard';

      navigate(redirectPath);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error de registro',
        description: error instanceof Error ? error.message : 'Ocurrió un error al registrarse',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}