import React, { useState, useEffect } from 'react';
import MainLayout from '../../../Layout/MainLayout';
import { useToast } from "../../../../hooks/use-toast";
import LessonsModal from './LessonsModal';
import LessonsProgressCard from './LessonsProgressCard';
import LessonContent from '../../../Lessons/LessonsContent';
import { LessonType } from '../../../../types/lesson';
import { API_BASE_URL, API_ENDPOINTS } from '../../../../api/config';
import { 
  getEmbedUrl
} from './LessonsUtils';
import LessonsGrid from './LessonsGrid';
import LessonsHeader from './LessonsHeader';
import LessonsLoading from './LessonsLoading';
import LessonsEmptyState from './LessonsEmptyState';
import LessonsFAB from './LessonsFAB';

const Lessons: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLessonContent, setShowLessonContent] = useState(false);
  const { toast } = useToast();
  const [userRole] = useState<string>(localStorage.getItem('userRole') || 'student');

  // Estado para lecciones y carga
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [streakDays] = useState(7); // Racha de días estudiando

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}${API_ENDPOINTS.LESSONS.BASE}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          throw new Error('No autorizado');
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Respuesta inesperada del servidor');
        }
        setLessons(data);
        setLoading(false);
        setShowContent(true);
      })
      .catch(() => {
        setLessons([]);
        toast({ 
          title: "¡Ups! 😅", 
          description: "No pudimos cargar las lecciones. ¡Pero no te preocupes, lo intentaremos de nuevo!", 
          variant: "destructive" 
        });
        setLoading(false);
      });
  }, [toast]);

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredLessons = Array.isArray(lessons)
    ? (activeCategory === "Todos"
      ? lessons
      : lessons.filter(lesson => lesson.category === activeCategory))
    : [];
  const searchedLessons = Array.isArray(filteredLessons)
    ? filteredLessons.filter(
        lesson =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const overallProgress = lessons.length
    ? Math.round(
        (lessons.reduce((total, lesson) => total + (lesson.progress || 0), 0) / (lessons.length * 100)) * 100
      )
    : 0;

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const inProgressLessons = lessons.filter(lesson => lesson.progress > 0 && lesson.progress < 100).length;

  const handleLessonClick = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleStartLesson = () => {
    if (!selectedLesson) return;
    setIsModalOpen(false);
    setShowLessonContent(true);
    toast({
      title: "¡Vamos a aprender! 🎯",
      description: `Has iniciado: ${selectedLesson.title}`,
    });
  };

  const handleBackToLessons = () => {
    setShowLessonContent(false);
    setSelectedLesson(null);
  };

  return (
    <MainLayout role={userRole as 'student' | 'teacher' | 'admin'}>
      <div className="space-y-8">
        {showLessonContent && selectedLesson ? (
          <LessonContent
            lesson={{
              ...selectedLesson,
              video_url: getEmbedUrl(selectedLesson.video_url ?? "")
            }}
            onBack={handleBackToLessons}
          />
        ) : (
          <>
            <LessonsHeader
              streakDays={streakDays}
              completedLessons={completedLessons}
              inProgressLessons={inProgressLessons}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {loading && <LessonsLoading />}

            {!loading && (
              <LessonsProgressCard
                overallProgress={overallProgress}
                completedLessons={completedLessons}
                lessons={lessons}
                handleContinue={() => {
                  const inProgressLessons = lessons.filter(l => l.progress > 0 && l.progress < 100);
                  if (inProgressLessons.length > 0) {
                    const nextLesson = inProgressLessons[0];
                    setSelectedLesson(nextLesson);
                    setIsModalOpen(true);
                  } else if (lessons.length > 0) {
                    const firstIncompleteLesson = lessons.find(l => !l.completed);
                    if (firstIncompleteLesson) {
                      setSelectedLesson(firstIncompleteLesson);
                      setIsModalOpen(true);
                    }
                  }
                }}
              />
            )}

            {showContent && !loading && searchedLessons.length > 0 && (
              <LessonsGrid
                lessons={searchedLessons}
                onLessonClick={handleLessonClick}
              />
            )}

            {showContent && !loading && searchedLessons.length === 0 && (
              <LessonsEmptyState
                setSearchTerm={setSearchTerm}
                setActiveCategory={setActiveCategory}
              />
            )}

            <LessonsModal
              lesson={selectedLesson}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleStartLesson={handleStartLesson}
            />

            <LessonsFAB />

            {/* Toast de bienvenida (puedes mover la lógica aquí si lo necesitas) */}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Lessons;