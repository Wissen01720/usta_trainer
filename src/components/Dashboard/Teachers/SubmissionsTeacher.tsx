import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";

interface Submission {
  id: number;
  studentName: string;
  assignmentTitle: string;
  submittedAt: string;
  status: string;
}

const SubmissionsTeacher: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Cargando entregas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entregas de Estudiantes</CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 && <div className="text-muted-foreground">No hay entregas recientes.</div>}
        <div className="space-y-3">
          {submissions.map(sub => (
            <div key={sub.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-medium">{sub.studentName}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Tarea: {sub.assignmentTitle}</span>
                  <span className="ml-4">Entregado: {sub.submittedAt}</span>
                  <span className="ml-4">Estado: {sub.status}</span>
                </div>
              </div>
              <Button size="sm" variant="outline">Revisar</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsTeacher;