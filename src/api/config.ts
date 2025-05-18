// Configuración base de la API
export const API_BASE_URL = 'https://usta-trainer-backend.onrender.com/api/v1';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  // Usuarios
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password'
  },

  // Cursos/Entrenamientos
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    COMPLETE: (id: string) => `/courses/${id}/complete`,
    PROGRESS: (id: string) => `/courses/${id}/progress`
  },

  // Módulos
  MODULES: {
    BASE: '/modules',
    BY_ID: (id: string) => `/modules/${id}`,
    BY_COURSE: (courseId: string) => `/modules/course/${courseId}`
  },

  // Lecciones
  LESSONS: {
    BASE: '/lessons',
    BY_ID: (id: string) => `/lessons/${id}`,
    BY_MODULE: (moduleId: string) => `/lessons/module/${moduleId}`
  },

  // Ejercicios/Prácticas
  EXERCISES: {
    BASE: '/exercises',
    BY_ID: (id: string) => `/exercises/${id}`,
    BY_LESSON: (lessonId: string) => `/exercises/lesson/${lessonId}`,
    SUBMIT: (id: string) => `/exercises/${id}/submit`,
    EVALUATE: (id: string) => `/exercises/${id}/evaluate`
  },

  // CodeLab (si aplica)
  CODELAB: {
    BASE: '/codelab',
    RUN_CODE: '/codelab/run',
    SAVE_CODE: '/codelab/save',
    LOAD_CODE: '/codelab/load'
  },

  // Estadísticas/Progreso
  STATS: {
    BASE: '/stats',
    USER_PROGRESS: '/stats/user-progress',
    COURSE_STATS: (courseId: string) => `/stats/course/${courseId}`
  },

  // Notificaciones
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD: '/notifications/unread',
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`
  }
};

// Configuración de roles (si es constante en el frontend)
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  GUEST: 'guest'
};

// Configuración de timeout
export const API_TIMEOUT = 15000; // 15 segundos

// Configuración de reintentos
export const API_RETRIES = 2;