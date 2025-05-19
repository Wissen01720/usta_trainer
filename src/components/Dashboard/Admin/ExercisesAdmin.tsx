import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Plus } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  is_public: boolean;
  created_at: string;
}

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

const ExercisesAdmin: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    detailed_description: '',
    difficulty: 'beginner',
    language: 'python',
    starter_code: '',
    solution_code: '',
    is_public: false,
    category_id: '',
    estimated_duration: '',
    hints: '',
    learning_outcomes: '',
    prerequisites: ''
  });

  useEffect(() => {
    fetch(`${API_URL}/api/v1/exercises`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [showModal]);

  const handleCreate = async () => {
    setCreating(true);
    // Procesar arrays desde string separados por coma
    const payload = {
      ...form,
      estimated_duration: form.estimated_duration ? Number(form.estimated_duration) : undefined,
      hints: form.hints ? form.hints.split(',').map(h => h.trim()).filter(Boolean) : undefined,
      learning_outcomes: form.learning_outcomes ? form.learning_outcomes.split(',').map(l => l.trim()).filter(Boolean) : undefined,
      prerequisites: form.prerequisites ? form.prerequisites.split(',').map(p => p.trim()).filter(Boolean) : undefined,
      category_id: form.category_id || undefined,
      detailed_description: form.detailed_description || undefined,
      solution_code: form.solution_code || undefined
    };
    try {
      const res = await fetch(`${API_URL}/api/v1/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al crear el ejercicio');
        setCreating(false);
        return;
      }
      setShowModal(false);
      setForm({
        title: '',
        description: '',
        detailed_description: '',
        difficulty: 'beginner',
        language: 'python',
        starter_code: '',
        solution_code: '',
        is_public: false,
        category_id: '',
        estimated_duration: '',
        hints: '',
        learning_outcomes: '',
        prerequisites: ''
      });
    } catch {
      alert('Error al crear el ejercicio');
    }
    setCreating(false);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Ejercicios</h1>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-1" /> Agregar Ejercicio
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Listado de Ejercicios</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center">Cargando ejercicios...</div>
            ) : exercises.length === 0 ? (
              <div className="text-muted-foreground">No hay ejercicios registrados.</div>
            ) : (
              <div className="space-y-3">
                {exercises.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">
                        {ex.title}
                        <span className="text-xs text-muted-foreground ml-2">{ex.language}</span>
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">{ex.difficulty}</Badge>
                        <Badge variant="outline" className={ex.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {ex.is_public ? 'Publicado' : 'Borrador'}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">Creado: {ex.created_at?.split('T')[0]}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Detalles</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para crear ejercicio */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Agregar Ejercicio</h2>
              <div className="space-y-2">
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Título"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción corta"
                />
                <textarea
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.detailed_description}
                  onChange={e => setForm(f => ({ ...f, detailed_description: e.target.value }))}
                  placeholder="Descripción detallada (opcional)"
                  rows={2}
                />
                <select
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.difficulty}
                  onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.language}
                  onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                  placeholder="Lenguaje"
                />
                <textarea
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.starter_code}
                  onChange={e => setForm(f => ({ ...f, starter_code: e.target.value }))}
                  placeholder="Código inicial"
                  rows={3}
                />
                <textarea
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.solution_code}
                  onChange={e => setForm(f => ({ ...f, solution_code: e.target.value }))}
                  placeholder="Código solución (opcional)"
                  rows={2}
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  placeholder="ID de categoría (opcional)"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.estimated_duration}
                  onChange={e => setForm(f => ({ ...f, estimated_duration: e.target.value }))}
                  placeholder="Duración estimada (min, opcional)"
                  type="number"
                  min={0}
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.hints}
                  onChange={e => setForm(f => ({ ...f, hints: e.target.value }))}
                  placeholder="Pistas (separadas por coma, opcional)"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.learning_outcomes}
                  onChange={e => setForm(f => ({ ...f, learning_outcomes: e.target.value }))}
                  placeholder="Resultados de aprendizaje (separados por coma, opcional)"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.prerequisites}
                  onChange={e => setForm(f => ({ ...f, prerequisites: e.target.value }))}
                  placeholder="Prerrequisitos (separados por coma, opcional)"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_public}
                    onChange={e => setForm(f => ({ ...f, is_public: e.target.checked }))}
                  />
                  Publicar
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setShowModal(false)} disabled={creating}>Cancelar</Button>
                <Button size="sm" onClick={handleCreate} disabled={creating}>
                  {creating ? "Creando..." : "Crear"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExercisesAdmin;