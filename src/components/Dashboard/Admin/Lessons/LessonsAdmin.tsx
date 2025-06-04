import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Plus, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import LessonList, { Lesson } from './LessonList';
import LessonCreateModal from './LessonCreateModal';
import LessonDetailsModal from './LessonDetailsModal';

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

  const handleShowDetails = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

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

  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.slug.toLowerCase().includes(search.toLowerCase())
  );
  const lessonsToShow = filteredLessons.slice(0, 10);

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
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

        <LessonCreateModal
          showModal={showModal}
          setShowModal={setShowModal}
          form={form}
          setForm={setForm}
          creating={creating}
          handleCreate={handleCreate}
        />

        <LessonDetailsModal
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
          handleEdit={handleEdit}
          editing={editing}
          handleDelete={handleDelete}
          deleting={deleting}
        />
      </div>
    </MainLayout>
  );
};

export default LessonsAdmin;