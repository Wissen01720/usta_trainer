import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ChevronRight, Code } from 'lucide-react';
import axios from 'axios';
import { authService } from '../../api/authService';
import { ROLES } from '../../api/config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Solo recibes el usuario, el token ya se guarda en authService
      const user = await authService.login({ email, password });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Redirigir según el rol del usuario
      switch (user.role) {
        case ROLES.STUDENT:
          navigate('/student-dashboard');
          break;
        case ROLES.ADMIN:
          navigate('/admin-dashboard');
          break;
        case ROLES.TEACHER:
          navigate('/teacher-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendMsg = err.response?.data?.message?.toLowerCase() || '';
        if (backendMsg.includes('correo') || backendMsg.includes('email')) {
          setError('El correo ingresado no es válido o no está registrado.');
        } else if (backendMsg.includes('contraseña') || backendMsg.includes('password')) {
          setError('La contraseña es incorrecta.');
        } else {
          setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
      } else if (err instanceof Error) {
        setError(err.message || 'Ocurrió un error inesperado.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar email recordado si existe
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2E3A4D] via-[#3E4A5D] to-[#1E2A3D] overflow-hidden relative">
      {/* Partículas animadas de fondo */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Logo animado flotante */}
      <motion.div
        className="absolute top-1/4 left-1/4 opacity-10"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Code className="h-32 w-32 text-white" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#A78BFA] to-[#F472B6] p-6 text-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Bienvenido de vuelta</h2>
            <p className="text-white/90 mt-1">Ingresa a tu cuenta estudiantil</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                Correo Universitario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="tu.correo@universidad.edu"
                  autoComplete="username"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/70 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/70 hover:text-white" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#A78BFA] focus:ring-[#A78BFA] border-white/30 rounded bg-white/5"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                  Recordar mi cuenta
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-[#A78BFA] hover:text-white transition"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A78BFA] transition-all ${
                  isLoading ? 'bg-[#A78BFA]/70 cursor-not-allowed' : 'bg-[#A78BFA] hover:bg-[#9061F9] hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ingresando...
                  </>
                ) : (
                  'Ingresar a mi cuenta'
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer del formulario */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 px-6 py-4 rounded-b-xl"
          >
            <div className="text-center text-sm text-white/80">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="font-medium text-white hover:text-[#A78BFA] transition inline-flex items-center"
              >
                Regístrate ahora <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;