import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "../../../ui/button";
import { Plus } from 'lucide-react';

interface Props {
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  form: {
    title: string;
    slug: string;
    content: string;
    difficulty_level: string;
    thumbnail_url: string;
    video_url: string;
    estimated_duration: number;
    prerequisites: { type: 'lesson' | 'exercise'; id: string }[];
    is_published: boolean;
  };
  setForm: React.Dispatch<React.SetStateAction<Props['form']>>;
  creating: boolean;
  handleCreate: () => void;
}

const LessonCreateModal: React.FC<Props> = ({
  showModal, setShowModal, form, setForm, creating, handleCreate
}) => {
  if (!showModal) return null;
  return (
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
  );
};

export default LessonCreateModal;