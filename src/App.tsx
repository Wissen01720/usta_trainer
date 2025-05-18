import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
// Importa los componentes específicos de estudiantes
import LessonsStudents from "./components/Dashboard/Students/LessonsStudents";
import SettingsStudents from "./components/Dashboard/Students/SettingsStudents";
import CodeLabStudents from "./components/Dashboard/Students/CodelabStudents";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
// Dashboard components
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard";
// Import monaco-editor styles
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
          {/* Rutas específicas para estudiantes */}
          <Route path="/codelab" element={<CodeLabStudents />} />
          <Route path="/lessons" element={<LessonsStudents />} />
          <Route path="/settings" element={<SettingsStudents />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Dashboard routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;