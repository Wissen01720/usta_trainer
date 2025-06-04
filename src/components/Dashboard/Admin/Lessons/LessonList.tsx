import React from "react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Clock, Edit, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Define aquí el tipo Lesson
export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  difficulty_level?: string;
  thumbnail_url?: string;
  video_url?: string;
  estimated_duration?: number;
  prerequisites?: { type: 'lesson' | 'exercise'; id: string }[];
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface LessonListProps {
  lessons: Lesson[];
  onShowDetails: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

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

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  onShowDetails,
  onDelete,
}) => (
  <motion.div
    layout
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    {lessons.map((lesson, index) => (
      <motion.div
        key={lesson.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -5 }}
        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        {lesson.thumbnail_url && (
          <div className="h-40 bg-gray-100 dark:bg-gray-700 relative">
            <img
              src={lesson.thumbnail_url}
              alt={lesson.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
              {lesson.title}
            </h3>
            <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty_level)}`}>
              {lesson.difficulty_level || "N/A"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {lesson.content}
          </p>
          <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400 gap-2">
            {lesson.estimated_duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson.estimated_duration} min
              </span>
            )}
            <span className="text-xs">
              {lesson.is_published ? (
                <span className="text-green-600 dark:text-green-400">Publicado</span>
              ) : (
                <span className="text-yellow-600 dark:text-yellow-400">Borrador</span>
              )}
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Creado: {new Date(lesson.created_at).toLocaleDateString()}</p>
              {lesson.published_at && (
                <p>Publicado: {new Date(lesson.published_at).toLocaleDateString()}</p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onShowDetails(lesson)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                onClick={() => onDelete(lesson)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 gap-1"
            onClick={() => onShowDetails(lesson)}
          >
            Ver detalles
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default LessonList;