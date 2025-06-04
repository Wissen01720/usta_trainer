import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Eye, Plus, Edit3, Trash2, Video, Clock, Users, BookOpen, X, ChevronDown } from 'lucide-react';
import { useToast } from "../../../ui/use-toast";

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

const TeacherDashboard: React.FC = () => {
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
  const { toast } = useToast();

  // Cargar lecciones del docente autenticado
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
        toast({ title: "Error", description: errorData.detail || 'Error al crear la lección.' });
        setCreating(false);
        return;
      }
      setShowModal(false);
      setForm({ ...initialForm });
      toast({ title: "Lección creada", description: "La lección ha sido creada exitosamente." });
    } catch {
      toast({ title: "Error", description: "No se pudo crear la lección." });
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
        toast({ title: "Error", description: errorData.detail || 'Error al editar la lección.' });
        setEditing(false);
        return;
      }
      setSelectedLesson(null);
      toast({ title: "Lección actualizada", description: "La lección ha sido actualizada." });
    } catch {
      toast({ title: "Error", description: "No se pudo editar la lección." });
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
        toast({ title: "Error", description: errorData.detail || 'Error al eliminar la lección.' });
        setDeleting(false);
        return;
      }
      setSelectedLesson(null);
      toast({ title: "Lección eliminada", description: "La lección ha sido eliminada." });
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar la lección." });
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

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const publishedLessons = lessons.filter(lesson => lesson.is_published);
  const draftLessons = lessons.filter(lesson => !lesson.is_published);

  return (
    <MainLayout role="teacher">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header con gradiente */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 mb-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Panel de Lecciones</h1>
                  <p className="text-blue-100 text-lg">Gestiona y organiza tus contenidos educativos</p>
                </div>
                <Button 
                  onClick={() => setShowModal(true)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" /> 
                  Nueva Lección
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">{lessons.length}</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Total Lecciones</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">{publishedLessons.length}</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Publicadas</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">{draftLessons.length}</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Borradores</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">{lessons.reduce((acc, lesson) => acc + (lesson.estimated_duration || 0), 0)}</span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Min. Totales</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">Cargando lecciones...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <div className="text-red-600 dark:text-red-400 text-lg font-semibold">{error}</div>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No hay lecciones aún</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Comienza creando tu primera lección</p>
                <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" /> Crear Primera Lección
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lessons.map(lesson => (
                  <Card key={lesson.id} className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      {lesson.thumbnail_url ? (
                        <img
                          src={lesson.thumbnail_url}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-blue-400 dark:text-blue-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={
                          lesson.is_published
                            ? 'bg-green-500 text-white border-0 shadow-lg'
                            : 'bg-yellow-500 text-white border-0 shadow-lg'
                        }>
                          {lesson.is_published ? 'Publicado' : 'Borrador'}
                        </Badge>
                      </div>

                      {/* Video indicator */}
                      {lesson.video_url && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {lesson.title}
                      </CardTitle>
                      
                      {/* Meta info */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getDifficultyColor(lesson.difficulty_level || 'beginner')}>
                          {lesson.difficulty_level || 'Beginner'}
                        </Badge>
                        {lesson.estimated_duration && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/30">
                            <Clock className="h-3 w-3 mr-1" />
                            {lesson.estimated_duration} min
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {lesson.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span>Slug: {lesson.slug}</span>
                        <span>{lesson.created_at?.split('T')[0]}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/30"
                          onClick={() => handleShowDetails(lesson)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> 
                          Detalles
                        </Button>
                        {lesson.video_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/30"
                          >
                            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-2" />
                              Video
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal para crear lección */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Lección</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowModal(false)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título *
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Título de la lección"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug *
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      placeholder="slug-unico"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenido *
                  </label>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Describe el contenido de la lección..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dificultad
                    </label>
                    <div className="relative">
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        value={form.difficulty_level}
                        onChange={e => setForm(f => ({ ...f, difficulty_level: e.target.value }))}
                      >
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="number"
                      value={form.estimated_duration}
                      onChange={e => setForm(f => ({ ...f, estimated_duration: Number(e.target.value) }))}
                      placeholder="30"
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL de Miniatura
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.thumbnail_url}
                      onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL del Video
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.video_url}
                      onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Prerrequisitos */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prerrequisitos
                    </label>
                    <Button size="sm" onClick={handleAddPrerequisite} type="button" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Agregar
                    </Button>
                  </div>
                  {form.prerequisites.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <select
                        value={p.type}
                        onChange={e => handlePrerequisiteChange(idx, 'type', e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="lesson">Lección</option>
                        <option value="exercise">Ejercicio</option>
                      </select>
                      <input
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        value={p.id}
                        onChange={e => handlePrerequisiteChange(idx, 'id', e.target.value)}
                        placeholder="ID del prerrequisito"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRemovePrerequisite(idx)} 
                        type="button"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="publish"
                    checked={form.is_published}
                    onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="publish" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publicar inmediatamente
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => setShowModal(false)} disabled={creating}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={creating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {creating ? "Creando..." : "Crear Lección"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles/edición */}
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Lección</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedLesson(null)}
                  className="rounded-full w-8 h-8 p-0"
                  disabled={editing || deleting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título *
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editForm.title}
                      onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Título de la lección"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug *
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editForm.slug}
                      onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                      placeholder="slug-unico"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenido *
                  </label>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editForm.content}
                    onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Describe el contenido de la lección..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dificultad
                    </label>
                    <div className="relative">
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        value={editForm.difficulty_level}
                        onChange={e => setEditForm(f => ({ ...f, difficulty_level: e.target.value }))}
                      >
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="number"
                      value={editForm.estimated_duration}
                      onChange={e => setEditForm(f => ({ ...f, estimated_duration: Number(e.target.value) }))}
                      placeholder="30"
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL de Miniatura
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editForm.thumbnail_url}
                      onChange={e => setEditForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL del Video
                    </label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editForm.video_url}
                      onChange={e => setEditForm(f => ({ ...f, video_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Prerrequisitos edición */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prerrequisitos
                    </label>
                    <Button size="sm" onClick={handleEditAddPrerequisite} type="button" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Agregar
                    </Button>
                  </div>
                  {editForm.prerequisites.map((p, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <select
                        value={p.type}
                        onChange={e => handleEditPrerequisiteChange(idx, 'type', e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="lesson">Lección</option>
                        <option value="exercise">Ejercicio</option>
                      </select>
                      <input
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        value={p.id}
                        onChange={e => handleEditPrerequisiteChange(idx, 'id', e.target.value)}
                        placeholder="ID del prerrequisito"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditRemovePrerequisite(idx)} 
                        type="button"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <input
                    type="checkbox"
                    id="edit-publish"
                    checked={editForm.is_published}
                    onChange={e => setEditForm(f => ({ ...f, is_published: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="edit-publish" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lección publicada
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="destructive" 
                  onClick={handleDelete} 
                  disabled={deleting || editing}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedLesson(null)} disabled={editing || deleting}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleEdit} 
                    disabled={editing || deleting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
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

export default TeacherDashboard;