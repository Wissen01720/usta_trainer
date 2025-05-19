import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";

interface ClassType {
  id: number;
  name: string;
  students: number;
  avgProgress: number;
  recentSubmissions: number;
}

const ClassesTeacher: React.FC = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/classes')
      .then(res => res.json())
      .then(data => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Cargando clases...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Clases</CardTitle>
      </CardHeader>
      <CardContent>
        {classes.length === 0 && <div className="text-muted-foreground">No tienes clases asignadas.</div>}
        <div className="space-y-3">
          {classes.map(cls => (
            <div key={cls.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-medium">{cls.name}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>{cls.students} estudiantes</span>
                  <span className="ml-4">Progreso promedio: {cls.avgProgress}%</span>
                  <span className="ml-4">Entregas recientes: {cls.recentSubmissions}</span>
                </div>
              </div>
              <Button size="sm" variant="outline">Ver detalles</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassesTeacher;