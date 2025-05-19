import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Users, BookOpen, Eye, Plus, BarChart3, FileCheck2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { CreateAssignmentForm } from './../CreateAssignmentForm';
import { ViewClassModal } from './../ViewClassModal';
import { useToast } from "../../ui/use-toast";

interface ClassType {
  id: number;
  name: string;
  students: number;
  avgProgress: number;
  recentSubmissions: number;
}

interface AssignmentFormValues {
  title: string;
  description: string;
  dueDate: string;
}

const TeacherDashboard: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [isViewClassOpen, setIsViewClassOpen] = useState(false);
  const { toast } = useToast();

  // Sample data - would come from API in real app
  const classes = [
    { 
      id: 1, 
      name: "Introduction to Programming - Class A", 
      students: 24,
      avgProgress: 65,
      recentSubmissions: 8
    },
    { 
      id: 2, 
      name: "JavaScript for Beginners - Class B", 
      students: 18,
      avgProgress: 42,
      recentSubmissions: 5
    },
    { 
      id: 3, 
      name: "Creative Coding - Class C", 
      students: 15,
      avgProgress: 28,
      recentSubmissions: 3
    }
  ];

  const handleCreateAssignment = (values: AssignmentFormValues) => {
    console.log('New assignment:', values);
    setIsCreateDialogOpen(false);
    toast({
      title: "Tarea creada",
      description: `La tarea "${values.title}" ha sido creada exitosamente.`,
    });
  };

  const handleViewClass = (classData: ClassType) => {
    setSelectedClass(classData);
    setIsViewClassOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel del Profesor</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus clases y monitorea el progreso de tus estudiantes</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            <Plus className="h-4 w-4 mr-2" /> Crear Tarea
          </Button>
        </div>
      </div>

      {/* Dialog for creating new assignment */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Tarea</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear una nueva tarea para tus estudiantes.
            </DialogDescription>
          </DialogHeader>
          <CreateAssignmentForm 
            onSubmit={handleCreateAssignment}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Class Modal */}
      {selectedClass && (
        <ViewClassModal
          isOpen={isViewClassOpen}
          onClose={() => setIsViewClassOpen(false)}
          classData={selectedClass}
        />
      )}
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Total Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-2xl font-bold text-green-800 dark:text-green-300">57</span>
              </div>
              <Badge className="bg-green-500">+4 esta semana</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Cursos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-blue-800 dark:text-blue-300">3</span>
              </div>
              <Badge className="bg-blue-500">En progreso</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-100 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileCheck2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-purple-800 dark:text-purple-300">12</span>
              </div>
              <Badge className="bg-purple-500">Por revisar</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-100 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Promedio General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-amber-800 dark:text-amber-300">85%</span>
              </div>
              <Badge className="bg-amber-500">Excelente</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Classes Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tus Clases</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <CardDescription>
                  {cls.students} estudiantes inscritos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progreso Promedio</span>
                    <span className="font-medium">{cls.avgProgress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Entregas Recientes</span>
                    <span className="font-medium">{cls.recentSubmissions}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
                  onClick={() => handleViewClass(cls)}
                >
                  <Eye className="h-4 w-4 mr-2" /> Ver Clase
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;