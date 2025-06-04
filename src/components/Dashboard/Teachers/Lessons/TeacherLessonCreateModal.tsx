import React from "react";
import { Button } from "../../../ui/button";
import { X, Plus, ChevronDown } from "lucide-react";
import { Lesson, Prerequisite } from "./types";

type LessonForm = Omit<Lesson, "id" | "author_id" | "published_at" | "created_at" | "updated_at">;

interface TeacherLessonCreateModalProps {
  show: boolean;
  onClose: () => void;
  form: LessonForm;
  setForm: React.Dispatch<React.SetStateAction<LessonForm>>;
  creating: boolean;
  onCreate: () => void;
  onAddPrerequisite: () => void;
  onPrerequisiteChange: (idx: number, field: keyof Prerequisite, value: string) => void;
  onRemovePrerequisite: (idx: number) => void;
}

const TeacherLessonCreateModal: React.FC<TeacherLessonCreateModalProps> = ({
  show,
  onClose,
  form,
  setForm,
  creating,
  onCreate,
  onAddPrerequisite,
  onPrerequisiteChange,
  onRemovePrerequisite,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Lección</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
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
              <Button size="sm" onClick={onAddPrerequisite} type="button" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Agregar
              </Button>
            </div>
            {(form.prerequisites ?? []).map((p: Prerequisite, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <select
                  value={p.type}
                  onChange={e => onPrerequisiteChange(idx, "type", e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="lesson">Lección</option>
                  <option value="exercise">Ejercicio</option>
                </select>
                <input
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  value={p.id}
                  onChange={e => onPrerequisiteChange(idx, "id", e.target.value)}
                  placeholder="ID del prerrequisito"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemovePrerequisite(idx)}
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
          <Button variant="outline" onClick={onClose} disabled={creating}>
            Cancelar
          </Button>
          <Button
            onClick={onCreate}
            disabled={creating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {creating ? "Creando..." : "Crear Lección"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLessonCreateModal;