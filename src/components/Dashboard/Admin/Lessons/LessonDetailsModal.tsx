import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "../../../ui/button";
import { Video, Trash2, Edit } from 'lucide-react';
import { Badge } from "../../../ui/badge";
import { getDifficultyColor } from './LessonUtils';
import { Lesson } from './LessonList';

interface Props {
  selectedLesson: Lesson | null;
  setSelectedLesson: (l: Lesson | null) => void;
  handleEdit: () => void;
  editing: boolean;
  handleDelete: () => void;
  deleting: boolean;
}

const LessonDetailsModal: React.FC<Props> = ({
  selectedLesson, setSelectedLesson, handleEdit, editing, handleDelete, deleting
}) => {
  if (!selectedLesson) return null;
  return (
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
                {selectedLesson.created_at ? new Date(selectedLesson.created_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contenido</h3>
            <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-800 dark:text-gray-200">
              {selectedLesson.content || 'No hay contenido'}
            </div>
          </div>
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
  );
};

export default LessonDetailsModal;