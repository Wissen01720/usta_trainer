import React from "react";
import { BookOpen, Users, Edit3, Clock } from "lucide-react";
import { Lesson } from "./types";

interface TeacherLessonStatsProps {
  lessons: Lesson[];
}

const TeacherLessonStats: React.FC<TeacherLessonStatsProps> = ({ lessons }) => {
  const publishedLessons = lessons.filter(l => l.is_published);
  const draftLessons = lessons.filter(l => !l.is_published);
  const totalMinutes = lessons.reduce((acc, lesson) => acc + (lesson.estimated_duration || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">{lessons.length}</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">Total Lecciones</p>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          <span className="font-semibold">{publishedLessons.length}</span>
        </div>
        <p className="text-green-700 text-sm mt-1">Publicadas</p>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
        <div className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold">{draftLessons.length}</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">Borradores</p>
      </div>
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <span className="font-semibold">{totalMinutes}</span>
        </div>
        <p className="text-purple-700 text-sm mt-1">Min. Totales</p>
      </div>
    </div>
  );
};

export default TeacherLessonStats;