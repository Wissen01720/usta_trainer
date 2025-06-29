import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
// Estudiantes
import SettingsStudents from "./components/Dashboard/Students/Settings/SettingsStudents";
import CodeLabStudents from "./components/Dashboard/Students/Codelab/CodelabStudents";
import StudentDashboard from "./components/Dashboard/Students/Lessons/StudentDashboard";
// Auth
import LoginForm from "./components/Auth/LoginForm";
import ForgotPasswordForm from "./components/Auth/ForgotPasswordForm";
import RegisterForm from "./components/Auth/RegisterForm";
// Admin
import AdminDashboard from "./components/Dashboard/Admin/AdminDashboard";
import UsersAdmin from "./components/Dashboard/Admin/UsersAdmin";
import LessonsAdmin from "./components/Dashboard/Admin/Lessons/LessonsAdmin";
import ExercisesAdmin from "./components/Dashboard/Admin/Exercises/ExercisesAdmin";
import AchievementsAdmin from "./components/Dashboard/Admin/AchievementsAdmin";
// Teacher
import TeacherDashboard from "./components/Dashboard/Teachers/Lessons/TeacherDashboard";
import ExercisesTeacher from "./components/Dashboard/Teachers/Exercises/ExercisesTeacher";
import SettingsTeacher from "./components/Dashboard/Teachers/Settings/SettingsTeacher";
// Monaco editor styles
import 'monaco-editor/esm/vs/editor/editor.all.js';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select-role" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Estudiantes */}
          <Route path="/codelab" element={<CodeLabStudents />} />
          <Route path="/settings" element={<SettingsStudents />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          {/* Auth */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/lessons" element={<LessonsAdmin />} />
          <Route path="/admin/exercises" element={<ExercisesAdmin />} />
          <Route path="/admin/achievements" element={<AchievementsAdmin />} />
          {/* Teacher */}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/exercises" element={<ExercisesTeacher />} />
          <Route path="/teacher/settings" element={<SettingsTeacher />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;