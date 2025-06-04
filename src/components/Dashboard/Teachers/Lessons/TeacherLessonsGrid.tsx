import React from "react";
import TeacherLessonCard from "./TeacherLessonCard";
import { Lesson } from "./types";

interface TeacherLessonsGridProps {
  lessons: Lesson[];
  loading: boolean;
  error?: string | null;
  onShowDetails: (lesson: Lesson) => void;
}

const TeacherLessonsGrid: React.FC<TeacherLessonsGridProps> = ({
  lessons,
  loading,
  error,
  onShowDetails,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">Cargando lecciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="block text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          No hay lecciones aún
        </span>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Comienza creando tu primera lección
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <TeacherLessonCard
          key={lesson.id}
          lesson={lesson}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
};

export default TeacherLessonsGrid;