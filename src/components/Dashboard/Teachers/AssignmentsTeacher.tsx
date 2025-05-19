import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  className: string;
  status: string;
}

const AssignmentsTeacher: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/assignments')
      .then(res => res.json())
      .then(data => {
        setAssignments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Cargando tareas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 && <div className="text-muted-foreground">No has creado tareas.</div>}
        <div className="space-y-3">
          {assignments.map(ass => (
            <div key={ass.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-medium">{ass.title}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Clase: {ass.className}</span>
                  <span className="ml-4">Entrega: {ass.dueDate}</span>
                  <span className="ml-4">Estado: {ass.status}</span>
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

export default AssignmentsTeacher;