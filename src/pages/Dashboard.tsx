import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import TeacherDashboard from '../components/Dashboard/TeacherDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../hooks/use-toast";

type Role = 'student' | 'teacher' | 'admin';

const Dashboard: React.FC = () => {
  // In a real app with backend, this would come from auth context
  // For now, we'll get it from localStorage (set in RoleSelector)
  const [userRole, setUserRole] = useState<Role>('student');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as Role | null;
    
    if (savedRole) {
      setUserRole(savedRole);
      toast({
        title: `Bienvenido al panel de ${savedRole}`,
        description: "Has iniciado sesión correctamente",
        variant: "default",
      });
    } else {
      // If no role is saved, redirect to role selection
      navigate('/select-role');
    }
  }, [navigate, toast]);
  
  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };
  
  return (
    <MainLayout role={userRole}>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Dashboard;