import React from 'react';
import MainLayout from '../../Layout/MainLayout';
import { useAuth } from "../../../hooks/useAuth";
import ActivityHeatmap from './ActivityHeatmap';

interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}

const getInitials = (user: User | null | undefined) => {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  if (user?.first_name) return user.first_name[0].toUpperCase();
  if (user?.name) return user.name[0].toUpperCase();
  return 'U';
};

const getFullName = (user: User | null | undefined) => {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user?.name || 'Student';
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout role="student">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold capitalize">Student Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-lg font-bold">{getInitials(user as User)}</span>
          </div>
          <div>
            <div className="font-semibold">Welcome back, {getFullName(user as User)}!</div>
            <div className="text-muted-foreground text-sm">
              Continue your learning journey and create amazing animations with code.
            </div>
          </div>
        </div>
        {/* Heatmap de actividad */}
        {user?.id && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Tu actividad</h2>
            <ActivityHeatmap userId={user.id} />
          </div>
        )}
        {/* Aquí puedes agregar cards/resúmenes de progreso, logros, etc. */}
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;