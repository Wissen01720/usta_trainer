import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, BookOpen, Video, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import LessonList, { Lesson } from './LessonList';
import { Badge } from "../../ui/badge"; // Asegúrate de que este import existe

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

const initialForm = {
  title: '',
  slug: '',
  content: '',
  difficulty_level: 'beginner',
  thumbnail_url: '',
  video_url: '',
  estimated_duration: 0,
  prerequisites: [] as { type: 'lesson' | 'exercise'; id: string }[],
  is_published: false
};

// Función para colores de dificultad (igual que en LessonList)
const getDifficultyColor = (level?: string) => {
  switch (level) {
    case "beginner":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

const LessonsAdmin: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

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

  // Mostrar detalles de una lección
  const handleShowDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  // Crear una nueva lección
  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/lessons/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al crear la lección');
      setShowModal(false);
      setForm({ ...initialForm });
      fetchLessons();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al crear la lección');
      } else {
        setError('Error al crear la lección');
      }
    } finally {
      setCreating(false);
    }
  };

  // Editar lección
  const handleEdit = async () => {
    if (!selectedLesson) return;
    setEditing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/lessons/${selectedLesson.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(selectedLesson)
      });
      if (!res.ok) throw new Error('Error al editar la lección');
      setSelectedLesson(null);
      fetchLessons();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al editar la lección');
      } else {
        setError('Error al editar la lección');
      }
    } finally {
      setEditing(false);
    }
  };

  // Eliminar lección
  const handleDelete = async () => {
    if (!selectedLesson) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/lessons/${selectedLesson.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      if (!res.ok) throw new Error('Error al eliminar la lección');
      setSelectedLesson(null);
      fetchLessons();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al eliminar la lección');
      } else {
        setError('Error al eliminar la lección');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Filtrado y paginación (primeras 10 lecciones)
  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.slug.toLowerCase().includes(search.toLowerCase())
  );
  const lessonsToShow = filteredLessons.slice(0, 10);

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        {/* Encabezado y botón para agregar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Lecciones</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar lección..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded border px-2 py-1 dark:bg-gray-700 dark:text-white"
            />
            <Button size="sm" onClick={() => setShowModal(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Agregar Lección
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Listado de Lecciones</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center text-gray-900 dark:text-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p>Cargando lecciones...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                {error}
              </div>
            ) : lessonsToShow.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-8 text-gray-700 dark:text-gray-300"
              >
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No hay lecciones registradas</p>
                <p className="text-sm mt-1">Comienza agregando tu primera lección</p>
                <Button className="mt-4 gap-1" size="sm" onClick={() => setShowModal(true)}>
                  <Plus className="h-4 w-4" />
                  Agregar Lección
                </Button>
              </motion.div>
            ) : (
              <LessonList
                lessons={lessonsToShow}
                onShowDetails={handleShowDetails}
                onDelete={lesson => {
                  setSelectedLesson(lesson);
                  if (window.confirm('¿Seguro que deseas eliminar esta lección?')) {
                    handleDelete();
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Modal para crear lección */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg"
            >
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Agregar Lección</h2>
              {/* Formulario de creación */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleCreate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Título</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Slug</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contenido</label>
                  <textarea
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nivel de dificultad</label>
                  <select
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.difficulty_level}
                    onChange={e => setForm(f => ({ ...f, difficulty_level: e.target.value }))}
                  >
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">URL de miniatura</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.thumbnail_url}
                    onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">URL de video</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.video_url}
                    onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Duración estimada (minutos)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white"
                    value={form.estimated_duration}
                    onChange={e => setForm(f => ({ ...f, estimated_duration: Number(e.target.value) }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={form.is_published}
                    onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                  />
                  <label htmlFor="is_published" className="text-sm text-gray-700 dark:text-gray-200">¿Publicar?</label>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    disabled={creating}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    disabled={creating}
                    className="gap-1"
                  >
                    {creating ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Crear
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de detalles/edición */}
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                {selectedLesson.title}
              </h2>

              <div className="space-y-4">
                {/* Sección de información */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dificultad</h3>
                    <Badge className={`mt-1 ${selectedLesson.difficulty_level ? getDifficultyColor(selectedLesson.difficulty_level) : ''}`}>
                      {selectedLesson.difficulty_level || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duración</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedLesson.estimated_duration ? `${selectedLesson.estimated_duration} minutos` : 'No especificada'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedLesson.is_published ? (
                        <span className="text-green-600 dark:text-green-400">Publicado</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">Borrador</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha creación</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(selectedLesson.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contenido</h3>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200">
                    {selectedLesson.content || 'No hay contenido'}
                  </div>
                </div>

                {/* Video */}
                {selectedLesson.video_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Video</h3>
                    <a
                      href={selectedLesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Ver video
                    </a>
                  </div>
                )}

                {/* Prerrequisitos */}
                {selectedLesson.prerequisites && selectedLesson.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prerrequisitos</h3>
                    <div className="mt-1 space-y-1">
                      {selectedLesson.prerequisites.map((p, idx) => (
                        <div key={idx} className="text-sm text-gray-900 dark:text-white">
                          <span className="capitalize">{p.type}</span>: {p.id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="gap-1"
                >
                  {deleting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </>
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={editing}
                    className="gap-1"
                  >
                    {editing ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default LessonsAdmin;