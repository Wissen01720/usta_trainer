import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Users, Trophy, CheckCircle } from 'lucide-react';

interface ViewClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: {
    name: string;
    students: number;
    avgProgress: number;
  };
}

export function ViewClassModal({ isOpen, onClose, classData }: ViewClassModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{classData.name}</DialogTitle>
          <DialogDescription>
            Información detallada de la clase y progreso de los estudiantes
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="assignments">Tareas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{classData.students}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={classData.avgProgress} />
                    <p className="text-sm text-muted-foreground">{classData.avgProgress}% Completado</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Desempeño</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-lg font-medium">Excelente</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actividades Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { event: "Tarea entregada", student: "Ana García", time: "Hace 2 horas" },
                    { event: "Proyecto completado", student: "Carlos López", time: "Hace 3 horas" },
                    { event: "Ejercicio enviado", student: "María Rodríguez", time: "Hace 5 horas" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.event}</p>
                        <p className="text-sm text-muted-foreground">{activity.student}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { name: "Ana García", progress: 85, status: "Activo" },
                    { name: "Carlos López", progress: 72, status: "Activo" },
                    { name: "María Rodríguez", progress: 90, status: "Activo" },
                    { name: "Juan Pérez", progress: 65, status: "Ausente" }
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium">{student.name}</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={student.progress} className="w-[100px]" />
                          <span className="text-sm text-muted-foreground">{student.progress}%</span>
                        </div>
                      </div>
                      <Badge variant={student.status === "Activo" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { 
                      title: "Crear una animación interactiva",
                      dueDate: "15 Abril, 2025",
                      status: "Pendiente",
                      submissions: 8
                    },
                    {
                      title: "Desarrollar un juego simple",
                      dueDate: "22 Abril, 2025",
                      status: "Activo",
                      submissions: 12
                    },
                    {
                      title: "Sistema de partículas",
                      dueDate: "29 Abril, 2025",
                      status: "Próximo",
                      submissions: 0
                    }
                  ].map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">Fecha de entrega: {assignment.dueDate}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="outline">{assignment.status}</Badge>
                          <span className="text-sm text-muted-foreground">{assignment.submissions} entregas</span>
                        </div>
                      </div>
                      <Button size="sm">Ver detalles</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}