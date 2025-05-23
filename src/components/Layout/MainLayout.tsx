import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Code,
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Home,
  Bell,
  Badge,
  FileCheck2,
  BarChart3,
  Users as UsersIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../hooks/useAuth';

interface MainLayoutProps {
  children: React.ReactNode;
  role?: 'student' | 'teacher' | 'admin';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, role = 'student' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const darkModeStored = localStorage.getItem('darkMode');
    if (darkModeStored === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDarkMode).toString());
    toast({
      title: isDarkMode ? "Modo claro activado" : "Modo oscuro activado",
      description: isDarkMode
        ? "Has cambiado a la interfaz en modo claro."
        : "Has cambiado a la interfaz en modo oscuro.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate('/');
  };

  const dismissNotifications = () => {
    setShowNotificationBadge(false);
    toast({
      title: "Notificaciones leídas",
      description: "Has marcado todas las notificaciones como leídas.",
    });
  };

  // Sidebar items by role
  const navItems =
    role === 'admin'
      ? [
          { name: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: "Lecciones", path: "/admin/lessons", icon: <BookOpen className="h-5 w-5" /> },
          { name: "Ejercicios", path: "/admin/exercises", icon: <Code className="h-5 w-5" /> },
        ]
      : role === 'teacher'
      ? [
          { name: "Dashboard", path: "/teacher-dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: "Clases", path: "/teacher/classes", icon: <UsersIcon className="h-5 w-5" /> },
          { name: "Tareas", path: "/teacher/assignments", icon: <FileCheck2 className="h-5 w-5" /> },
          { name: "Entregas", path: "/teacher/submissions", icon: <BarChart3 className="h-5 w-5" /> },
          { name: "Ajustes", path: "/settings", icon: <Settings className="h-5 w-5" /> },
        ]
      : [
          { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: "Code Lab", path: "/codelab", icon: <Code className="h-5 w-5" /> },
          { name: "Lecciones", path: "/lessons", icon: <BookOpen className="h-5 w-5" /> },
          { name: "Ajustes", path: "/settings", icon: <Settings className="h-5 w-5" /> }
        ];

  const roleColor = {
    student: {
      text: "text-blue-500",
      bg: "bg-blue-500",
      gradient: "from-blue-500 to-indigo-600",
      gradientHover: "hover:from-blue-600 hover:to-indigo-700",
      border: "border-blue-500/20",
      icon: <Code className="h-5 w-5 text-blue-500" />,
    },
    teacher: {
      text: "text-green-500",
      bg: "bg-green-500",
      gradient: "from-green-500 to-emerald-600",
      gradientHover: "hover:from-green-600 hover:to-emerald-700",
      border: "border-green-500/20",
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
    },
    admin: {
      text: "text-purple-500",
      bg: "bg-purple-500",
      gradient: "from-purple-500 to-pink-500",
      gradientHover: "hover:from-purple-600 hover:to-pink-600",
      border: "border-purple-500/20",
      icon: <User className="h-5 w-5 text-purple-500" />,
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.name) {
      const parts = user.name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.name) return user.name;
    return role === 'teacher'
      ? 'Prof. Carlos López'
      : role === 'admin'
      ? 'Admin Sistema'
      : 'Estudiante';
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';
    const name =
      (user?.first_name && user?.first_name) ? user.first_name :
      user?.name ||
      (role === 'teacher'
        ? 'Profesor'
        : role === 'admin'
        ? 'Admin'
        : 'Estudiante');
    return `${greeting}, ${name}`;
  };

  const sidebarAnimation = {
    hidden: { x: -250 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  };

  const navItemAnimation = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }
  };

  const handleNavigation = useCallback((path: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== path) {
      navigate(path);
    }
  }, [location.pathname, navigate]);

  const handleDropdownNavigation = useCallback((path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  }, [location.pathname, navigate]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-20 sticky top-0">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <Link to="/" className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${roleColor[role].gradient} flex items-center justify-center`}>
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">CodeVerse</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification icon with badge */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {showNotificationBadge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notificaciones</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissNotifications}
                    className="h-8"
                  >
                    Marcar como leídas
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {showNotificationBadge ? (
                  <>
                    <div className="p-4 space-y-4">
                      <div className="flex gap-3">
                        <div className={`w-2 self-stretch ${roleColor[role].bg} rounded-full`}></div>
                        <div>
                          <p className="font-medium text-sm">Nueva lección disponible</p>
                          <p className="text-muted-foreground text-xs">Se ha añadido una nueva lección a tu plan de aprendizaje.</p>
                          <p className="text-xs text-slate-500 mt-1">Hace 2 horas</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className={`w-2 self-stretch ${roleColor[role].bg} rounded-full`}></div>
                        <div>
                          <p className="font-medium text-sm">Desafío semanal</p>
                          <p className="text-muted-foreground text-xs">¡Nuevo desafío de código disponible! Complétalo antes del domingo.</p>
                          <p className="text-xs text-slate-500 mt-1">Hace 1 día</p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="ghost" className="w-full justify-center" size="sm">
                        Ver todas las notificaciones
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No tienes notificaciones nuevas
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark mode toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getFullName()}`} alt={getFullName()} />
                    <AvatarFallback className={`bg-gradient-to-br ${roleColor[role].gradient}`}>
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className={`p-1 rounded-full bg-gradient-to-br ${roleColor[role].gradient} flex items-center justify-center`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getFullName()}`} alt={getFullName()} />
                      <AvatarFallback className={`bg-gradient-to-br ${roleColor[role].gradient}`}>
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {getFullName()}
                    </p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleDropdownNavigation(role === 'admin' ? '/admin-dashboard' : role === 'teacher' ? '/teacher-dashboard' : '/dashboard')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleDropdownNavigation('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ajustes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <motion.div
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 p-4 z-50"
            variants={sidebarAnimation}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${roleColor[role].gradient} flex items-center justify-center`}>
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">CodeVerse</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>

            {/* User info in mobile menu */}
            <div className={`p-3 rounded-lg mb-6 bg-slate-100 dark:bg-slate-800 border ${roleColor[role].border}`}>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getFullName()}`} alt={getFullName()} />
                  <AvatarFallback className={`bg-gradient-to-br ${roleColor[role].gradient}`}>
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {getFullName()}
                  </p>
                  <p className={`text-xs ${roleColor[role].text}`}>{role}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover="hover"
                  variants={navItemAnimation}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      location.pathname === item.path
                        ? `bg-gradient-to-r ${roleColor[role].gradient} text-white`
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-4 left-0 w-full px-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full flex items-center justify-center space-x-2 text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <div className={`p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border ${roleColor[role].border}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getFullName()}`} alt={getFullName()} />
                    <AvatarFallback className={`bg-gradient-to-br ${roleColor[role].gradient}`}>
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {getFullName()}
                    </p>
                    <p className={`text-xs ${roleColor[role].text} capitalize`}>{role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{getUserGreeting()}</p>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover="hover"
                  variants={navItemAnimation}
                >
                  <button
                    type="button"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md w-full text-left ${
                      location.pathname === item.path
                        ? `bg-gradient-to-r ${roleColor[role].gradient} text-white`
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.name === "Dashboard" && showNotificationBadge && (
                      <Badge className="ml-auto bg-red-500 text-xs h-5 min-w-5 flex items-center justify-center p-0">2</Badge>
                    )}
                  </button>
                </motion.div>
              ))}
            </nav>

            {/* Quick actions */}
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Acciones rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Ir a inicio</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-slate-50 dark:bg-slate-950">
          <div className="container max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;