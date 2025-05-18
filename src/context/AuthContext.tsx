import React, { createContext, useState, useEffect, useCallback } from 'react';
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

type UserRole = User['role'];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = 'https://usta-trainer-backend.onrender.com/api/v1/auth';

const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    return response.json();
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }

    return response.json();
  },

  refreshToken: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  },
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    console.error('Auth error:', error);
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
    return message;
  }, [toast]);

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
      setIsLoading(true);
      const { accessToken, refreshToken: newRefreshToken } = await authApi.refreshToken();
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      const decoded = jwtDecode<DecodedToken>(accessToken);
      validateUserRole(decoded.role);

      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      });
    } catch (error) {
      handleError(error, 'Error al renovar la sesión');
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [handleError, logout]);

  const validateUserRole = (role: string): role is UserRole => {
    if (!['student', 'teacher', 'admin'].includes(role)) {
      throw new Error('Rol de usuario no válido');
    }
    return true;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          await refreshToken();
          return;
        }

        validateUserRole(decoded.role);
        setUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        });
      } catch (error) {
        handleError(error, 'Error al verificar autenticación');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshToken, handleError, logout]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { accessToken, refreshToken, user } = await authApi.login(email, password);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);

      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      handleError(error, 'Error en el login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const { accessToken, refreshToken, user } = await authApi.register(name, email, password, role);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);

      toast({
        title: 'Registro exitoso',
        description: `Bienvenido, ${user.name}!`,
      });

      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      handleError(error, 'Error al registrarse');
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

export { AuthContext, AuthProvider };