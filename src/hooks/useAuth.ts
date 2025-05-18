import { useEffect, useState } from 'react';
import { authService } from '../api/authService';
import { AuthUser } from '../types/authUser';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser & { name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para unir first_name y last_name en name
  const buildUserWithName = (profile: AuthUser): AuthUser & { name: string } => ({
    ...profile,
    name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim(),
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const profile = await authService.getProfile();
          const userWithName = buildUserWithName(profile);
          setUser(userWithName);
          localStorage.setItem('user', JSON.stringify(userWithName));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ocurrió un error desconocido');
        }
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login({ email, password });
      const userWithName = buildUserWithName(user);
      localStorage.setItem('user', JSON.stringify(userWithName));
      setUser(userWithName);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error al iniciar sesión');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout().finally(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    });
  };

  return { user, loading, error, login, logout };
};