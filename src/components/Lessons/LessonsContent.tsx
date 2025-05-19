import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LessonType } from "../../types/lesson";

interface LessonContentProps {
  lesson: LessonType;
  onBack: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-slate-700">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" onClick={onBack} className="rounded-full shadow">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <BookOpen className="h-8 w-8 text-indigo-400" />
        <h2 className="text-3xl font-extrabold text-white">{lesson.title}</h2>
      </div>

      {/* Video */}
      {lesson.video_url && (
        <div className="aspect-video mb-4 rounded-xl overflow-hidden shadow-lg border-2 border-indigo-700/30">
          <iframe
            src={lesson.video_url}
            title={lesson.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="bg-slate-800/60 rounded-xl p-6 shadow-inner">
        <h3 className="text-xl font-semibold mb-3 text-indigo-200">Contenido</h3>
        <div className="prose dark:prose-invert max-w-none text-slate-200">
          {lesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : (
            <p>No hay contenido disponible para esta lección.</p>
          )}
        </div>
      </div>

      {/* Materiales adicionales */}
      <div className="bg-slate-800/60 rounded-xl p-6 shadow-inner">
        <h3 className="text-xl font-semibold mb-3 text-indigo-200">Materiales adicionales</h3>
        <ul className="list-disc list-inside text-indigo-100 space-y-1 pl-2">
          <li>
            <span className="text-slate-300">Descarga el PDF de la lección</span>{" "}
            <span className="text-xs text-indigo-400">(próximamente)</span>
          </li>
          <li>
            <span className="text-slate-300">Accede a recursos externos</span>{" "}
            <span className="text-xs text-indigo-400">(próximamente)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LessonContent;