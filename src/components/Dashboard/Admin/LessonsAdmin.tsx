import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

// Tipos para los prerrequisitos y lecciones
interface Prerequisite {
  type: 'lesson' | 'exercise';
  id: string;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  difficulty_level?: string;
  thumbnail_url?: string;
  video_url?: string;
  estimated_duration?: number;
  prerequisites?: Prerequisite[];
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

const initialForm = {
  title: '',
  slug: '',
  content: '',
  difficulty_level: 'beginner',
  thumbnail_url: '',
  video_url: '',
  estimated_duration: 0,
  prerequisites: [] as Prerequisite[],
  is_published: false
};

const LessonsAdmin: React.FC = () => {
  // Estados principales
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ ...initialForm });

  // Estados para edición y detalles
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editForm, setEditForm] = useState<typeof form>(initialForm);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar lecciones desde la API
  const fetchLessons = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/v1/lessons/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar lecciones');
        return res.json();
      })
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar lecciones');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons, showModal, selectedLesson]);

  // Crear nueva lección
  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/lessons/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al crear la lección');
        setCreating(false);
        return;
      }
      setShowModal(false);
      setForm({ ...initialForm });
    } catch {
      alert('Error al crear la lección');
    }
    setCreating(false);
  };

  // Mostrar detalles y preparar edición
  const handleShowDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setEditForm({
      title: lesson.title,
      slug: lesson.slug,
      content: lesson.content,
      difficulty_level: lesson.difficulty_level || 'beginner',
      thumbnail_url: lesson.thumbnail_url || '',
      video_url: lesson.video_url || '',
      estimated_duration: lesson.estimated_duration || 0,
      prerequisites: lesson.prerequisites || [],
      is_published: lesson.is_published
    });
  };

  // Guardar cambios de edición
  const handleEdit = async () => {
    if (!selectedLesson) return;
    setEditing(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al editar la lección');
        setEditing(false);
        return;
      }
      setSelectedLesson(null);
    } catch {
      alert('Error al editar la lección');
    }
    setEditing(false);
  };

  // Eliminar lección
  const handleDelete = async () => {
    if (!selectedLesson) return;
    if (!window.confirm('¿Seguro que deseas eliminar esta lección?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/lessons/${selectedLesson.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al eliminar la lección');
        setDeleting(false);
        return;
      }
      setSelectedLesson(null);
    } catch {
      alert('Error al eliminar la lección');
    }
    setDeleting(false);
  };

  // Prerrequisitos para crear
  const handleAddPrerequisite = () => {
    setForm(f => ({
      ...f,
      prerequisites: [...f.prerequisites, { type: 'lesson', id: '' }]
    }));
  };

  const handlePrerequisiteChange = (idx: number, field: keyof Prerequisite, value: string) => {
    setForm(f => ({
      ...f,
      prerequisites: f.prerequisites.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleRemovePrerequisite = (idx: number) => {
    setForm(f => ({
      ...f,
      prerequisites: f.prerequisites.filter((_, i) => i !== idx)
    }));
  };

  // Prerrequisitos para editar
  const handleEditPrerequisiteChange = (idx: number, field: keyof Prerequisite, value: string) => {
    setEditForm(f => ({
      ...f,
      prerequisites: f.prerequisites.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleEditAddPrerequisite = () => {
    setEditForm(f => ({
      ...f,
      prerequisites: [...f.prerequisites, { type: 'lesson', id: '' }]
    }));
  };

  const handleEditRemovePrerequisite = (idx: number) => {
    setEditForm(f => ({
      ...f,
      prerequisites: f.prerequisites.filter((_, i) => i !== idx)
    }));
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        {/* Encabezado y botón para agregar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Lecciones</h1>
          <Button size="sm" variant="outline" onClick={() => setShowModal(true)}>
            Agregar Lección
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Listado de Lecciones</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Estado de carga, error o listado */}
            {loading ? (
              <div className="p-8 text-center text-gray-900 dark:text-white">Cargando lecciones...</div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400">{error}</div>
            ) : lessons.length === 0 ? (
              <div className="text-gray-700 dark:text-gray-300">No hay lecciones registradas.</div>
            ) : (
              <div className="space-y-3">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                        <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">
                          ({lesson.slug})
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">
                          Dificultad: {lesson.difficulty_level || 'N/A'}
                        </span>
                        {lesson.estimated_duration && (
                          <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">
                            Duración: {lesson.estimated_duration} min
                          </span>
                        )}
                      </p>
                      <div className="flex items-center mt-1 flex-wrap gap-2">
                        <Badge variant="outline" className={
                          lesson.is_published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                        }>
                          {lesson.is_published ? 'Publicado' : 'Borrador'}
                        </Badge>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Autor: {lesson.author_id}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Creado: {lesson.created_at?.split('T')[0]}
                        </span>
                        {lesson.published_at && (
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            Publicado: {lesson.published_at?.split('T')[0]}
                          </span>
                        )}
                        {lesson.video_url && (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 underline ml-2"
                          >
                            Video
                          </a>
                        )}
                        {lesson.thumbnail_url && (
                          <img
                            src={lesson.thumbnail_url}
                            alt="thumbnail"
                            className="w-8 h-8 object-cover rounded ml-2"
                          />
                        )}
                      </div>
                      {/* Prerrequisitos */}
                      {Array.isArray(lesson.prerequisites) && lesson.prerequisites?.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          Prerrequisitos: {lesson.prerequisites!.map((p, idx) =>
                            <span key={idx}>{p.type}: {p.id}{idx < lesson.prerequisites!.length - 1 ? ', ' : ''}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleShowDetails(lesson)}>
                      Detalles
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal para crear lección */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-900 dark:text-white">
              <h2 className="text-lg font-bold mb-4">Agregar Lección</h2>
              <div className="space-y-2">
                {/* Campos del formulario de creación */}
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Título"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="Slug (único)"
                />
                <textarea
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Contenido"
                  rows={3}
                />
                <select
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={form.difficulty_level}
                  onChange={e => setForm(f => ({ ...f, difficulty_level: e.target.value }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={form.thumbnail_url}
                  onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                  placeholder="URL de la miniatura"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={form.video_url}
                  onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                  placeholder="URL del video"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  type="number"
                  value={form.estimated_duration}
                  onChange={e => setForm(f => ({ ...f, estimated_duration: Number(e.target.value) }))}
                  placeholder="Duración estimada (min)"
                  min={0}
                />
                {/* Prerrequisitos */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">Prerrequisitos</span>
                    <Button size="sm" onClick={handleAddPrerequisite} type="button">Agregar</Button>
                  </div>
                  {form.prerequisites.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                      <select
                        value={p.type}
                        onChange={e => handlePrerequisiteChange(idx, 'type', e.target.value)}
                        className="border rounded px-1 py-0.5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="lesson">Lección</option>
                        <option value="exercise">Ejercicio</option>
                      </select>
                      <input
                        className="border rounded px-1 py-0.5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                        value={p.id}
                        onChange={e => handlePrerequisiteChange(idx, 'id', e.target.value)}
                        placeholder="ID"
                      />
                      <Button size="sm" variant="destructive" onClick={() => handleRemovePrerequisite(idx)} type="button">Quitar</Button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                    className="text-gray-900 dark:text-white"
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

        {/* Modal de detalles/edición */}
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-900 dark:text-white">
              <h2 className="text-lg font-bold mb-4">Detalle y Edición de Lección</h2>
              <div className="space-y-2">
                {/* Campos del formulario de edición */}
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Título"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={editForm.slug}
                  onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="Slug (único)"
                />
                <textarea
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={editForm.content}
                  onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Contenido"
                  rows={3}
                />
                <select
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={editForm.difficulty_level}
                  onChange={e => setEditForm(f => ({ ...f, difficulty_level: e.target.value }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={editForm.thumbnail_url}
                  onChange={e => setEditForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                  placeholder="URL de la miniatura"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  value={editForm.video_url}
                  onChange={e => setEditForm(f => ({ ...f, video_url: e.target.value }))}
                  placeholder="URL del video"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                  type="number"
                  value={editForm.estimated_duration}
                  onChange={e => setEditForm(f => ({ ...f, estimated_duration: Number(e.target.value) }))}
                  placeholder="Duración estimada (min)"
                  min={0}
                />
                {/* Prerrequisitos edición */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">Prerrequisitos</span>
                    <Button size="sm" onClick={handleEditAddPrerequisite} type="button">Agregar</Button>
                  </div>
                  {editForm.prerequisites.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-1">
                      <select
                        value={p.type}
                        onChange={e => handleEditPrerequisiteChange(idx, 'type', e.target.value)}
                        className="border rounded px-1 py-0.5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="lesson">Lección</option>
                        <option value="exercise">Ejercicio</option>
                      </select>
                      <input
                        className="border rounded px-1 py-0.5 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                        value={p.id}
                        onChange={e => handleEditPrerequisiteChange(idx, 'id', e.target.value)}
                        placeholder="ID"
                      />
                      <Button size="sm" variant="destructive" onClick={() => handleEditRemovePrerequisite(idx)} type="button">Quitar</Button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={editForm.is_published}
                    onChange={e => setEditForm(f => ({ ...f, is_published: e.target.checked }))}
                    className="text-gray-900 dark:text-white"
                  />
                  Publicar
                </label>
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <Button size="sm" variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedLesson(null)} disabled={editing || deleting}>Cerrar</Button>
                  <Button size="sm" onClick={handleEdit} disabled={editing || deleting}>
                    {editing ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LessonsAdmin;