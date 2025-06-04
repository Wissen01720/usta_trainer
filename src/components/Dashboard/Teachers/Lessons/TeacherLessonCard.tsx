import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Eye, Video, Clock } from "lucide-react";
import { Lesson } from "./types";

interface TeacherLessonCardProps {
  lesson: Lesson;
  onShowDetails: (lesson: Lesson) => void;
}

const getDifficultyColor = (level?: string) => {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "advanced":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
  }
};

const TeacherLessonCard: React.FC<TeacherLessonCardProps> = ({ lesson, onShowDetails }) => (
  <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
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
          <Eye className="h-16 w-16 text-blue-400 dark:text-blue-500" />
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
          onClick={() => onShowDetails(lesson)}
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
);

export default TeacherLessonCard;