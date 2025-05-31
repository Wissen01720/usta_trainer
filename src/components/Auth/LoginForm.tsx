import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ChevronRight, Code, Sparkles, Trophy, Star } from 'lucide-react';
import axios from 'axios';
import { authService } from '../../api/authService';
import { ROLES } from '../../api/config';

interface UserData {
  first_name: string;
  last_name: string;
  role: string;
  // Puedes agregar más campos si tu backend retorna más datos
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
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

      // Mostrar pantalla de bienvenida
      setUserData(user);
      setLoginSuccess(true);

      // Redirigir después de mostrar la bienvenida
      setTimeout(() => {
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
      }, 3000);
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

  // Pantalla de bienvenida después del login exitoso
  if (loginSuccess && userData) {
    const getRoleDisplayName = (role: string) => {
      switch (role) {
        case ROLES.STUDENT:
          return 'Estudiante';
        case ROLES.ADMIN:
          return 'Administrador';
        case ROLES.TEACHER:
          return 'Profesor';
        default:
          return 'Usuario';
      }
    };

    const getRoleIcon = (role: string) => {
      switch (role) {
        case ROLES.STUDENT:
          return <Trophy className="h-12 w-12 text-yellow-400" />;
        case ROLES.ADMIN:
          return <Star className="h-12 w-12 text-purple-400" />;
        case ROLES.TEACHER:
          return <Sparkles className="h-12 w-12 text-blue-400" />;
        default:
          return <Code className="h-12 w-12 text-green-400" />;
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E2A3D] via-[#2E3A4D] to-[#3E4A5D] overflow-hidden relative">
        {/* Partículas de celebración */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#F472B6', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24'][Math.floor(Math.random() * 5)],
              opacity: 0.8
            }}
            animate={{
              y: [0, -window.innerHeight],
              x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
              opacity: [0.8, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 p-8 max-w-lg text-center relative"
        >
          {/* Efectos de luz de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F472B6]/20 via-transparent to-[#A78BFA]/20 rounded-2xl"></div>
          <div className="relative z-10">
            {/* Ícono principal animado */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.6 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-br from-[#F472B6] to-[#A78BFA] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                {getRoleIcon(userData.role)}
              </div>
            </motion.div>

            {/* Mensaje de bienvenida */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido de vuelta!
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <p className="text-xl text-white/90 mb-2">
                  {userData.first_name} {userData.last_name}
                </p>
                <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">
                    {getRoleDisplayName(userData.role)}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Elementos decorativos */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-center space-x-4 mb-6"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-3 h-3 bg-gradient-to-r from-[#F472B6] to-[#A78BFA] rounded-full shadow-lg"
                />
              ))}
            </motion.div>

            {/* Mensaje de redirección */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="text-white/70 text-sm mb-4">
                Te estamos redirigiendo a tu panel principal...
              </p>
              
              {/* Barra de progreso animada */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-2 bg-gradient-to-r from-[#F472B6] to-[#A78BFA] rounded-full shadow-lg"
                />
              </div>

              {/* Mensaje adicional personalizado */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-white/10 rounded-lg p-4 border border-white/20"
              >
                <p className="text-white/80 text-sm italic">
                  {userData.role === ROLES.STUDENT && "¡Listo para aprender algo nuevo hoy! 📚"}
                  {userData.role === ROLES.TEACHER && "¡Hora de inspirar mentes brillantes! 🎓"}
                  {userData.role === ROLES.ADMIN && "¡El sistema está bajo tu control! ⚡"}
                  {![
                    ROLES.STUDENT,
                    ROLES.TEACHER,
                    ROLES.ADMIN
                  ].includes(userData.role) && "¡Bienvenido a la plataforma! 🚀"}
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Efectos de brillo en las esquinas */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#A78BFA]/30 rounded-full blur-xl"></div>
        </motion.div>
      </div>
    );
  }

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