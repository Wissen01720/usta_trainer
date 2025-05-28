import React, { useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import StudentDashboard from '../components/Dashboard/Students/StudentDashboard';
import TeacherDashboard from '../components/Dashboard/Teachers/TeacherDashboard';
import AdminDashboard from '../components/Dashboard/Admin/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

// Normaliza el rol del usuario
const normalizeRole = (
  role: string | undefined
): "student" | "teacher" | "admin" | undefined => {
  if (!role) return undefined;
  const r = role.toLowerCase();
  if (r === "student") return "student";
  if (r === "teacher") return "teacher";
  if (r === "admin") return "admin";
  return undefined;
};

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirige al login si no hay usuario
        navigate('/login');
      } else {
        // Muestra mensaje de bienvenida
        toast({
          title: `Bienvenido al panel de ${user.role}`,
          description: "Has iniciado sesión correctamente",
          variant: "default",
        });
      }
    }
  }, [user, loading, navigate, toast]);

  // Renderiza el dashboard según el rol
  const renderDashboard = () => {
    switch (normalizeRole(user?.role)) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-white">Cargando...</div>;
  }

  return (
    <MainLayout role={normalizeRole(user?.role) || 'student'}>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Dashboard;