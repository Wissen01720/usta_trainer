import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
            refreshToken,
          });
          const { token, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      // FastAPI espera 'username' no 'email'
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail ||
          error.response?.data?.message ||
          'Error al iniciar sesión';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al registrar el usuario'
        );
      }
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al obtener el perfil'
        );
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  forgotPassword: async (email: string) => {
    try {
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            'Error al solicitar restablecimiento'
        );
      }
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            'Error al restablecer la contraseña'
        );
      }
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;