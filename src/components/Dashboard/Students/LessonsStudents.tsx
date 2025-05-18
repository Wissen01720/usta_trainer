import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Search, BookOpen, Star, ArrowRight, Clock, Play, Award } from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import LessonModal from '../../Lessons/LessonModal';
import { LessonType } from '../../../types/lesson';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

const Lessons: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [userRole] = useState<string>(localStorage.getItem('userRole') || 'student');

  // Estado para lecciones y carga
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);

  // Puedes definir tus categorías o extraerlas de las lecciones
  const categories = ["Fundamentos", "JavaScript", "Python", "C++", "Animaciones"];

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}${API_ENDPOINTS.LESSONS.BASE}`)
      .then(res => res.json())
      .then(data => {
        setLessons(data); // Asegúrate que tu backend devuelva un array de lecciones
        setLoading(false);
        setShowContent(true);
      })
      .catch(() => {
        toast({ title: "Error", description: "No se pudieron cargar las lecciones", variant: "destructive" });
        setLoading(false);
      });
  }, [toast]);

  const [activeCategory, setActiveCategory] = useState("Todos");
  const filteredLessons = activeCategory === "Todos"
    ? lessons
    : lessons.filter(lesson => lesson.category === activeCategory);

  const [searchTerm, setSearchTerm] = useState("");
  const searchedLessons = filteredLessons.filter(
    lesson => lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const overallProgress = lessons.length
    ? Math.round(
        (lessons.reduce((total, lesson) => total + (lesson.progress || 0), 0) / (lessons.length * 100)) * 100
      )
    : 0;

  const completedLessons = lessons.filter(lesson => lesson.completed).length;

  const handleLessonClick = (lesson: LessonType) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleStartLesson = () => {
    if (!selectedLesson) return;
    setIsModalOpen(false);
    if (selectedLesson.progress < 100) {
      const updatedProgress = Math.min(selectedLesson.progress + 20, 100);
      const updatedLesson = { ...selectedLesson, progress: updatedProgress };
      setSelectedLesson(updatedLesson);
      toast({
        title: `Lección ${updatedProgress === 100 ? 'completada' : 'actualizada'}`,
        description: updatedProgress === 100
          ? "¡Felicitaciones! Has completado esta lección."
          : `Tu progreso ha sido actualizado al ${updatedProgress}%`,
      });
    }
  };

  const roleColors = {
    student: {
      primary: 'from-blue-500 to-indigo-600',
      secondary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      accent: 'text-blue-500'
    },
    teacher: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'bg-green-500/10 text-green-400 border-green-500/20',
      accent: 'text-green-500'
    },
    admin: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      accent: 'text-purple-500'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <MainLayout role={userRole as 'student' | 'teacher' | 'admin'}>
      <div className="space-y-6">
        {/* Animated Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            <div>
              <h1 className="text-3xl font-bold">Lecciones</h1>
              <p className="text-muted-foreground">Explora y avanza en tu aprendizaje</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="search"
              placeholder="Buscar lecciones..." 
              className="pl-10 pr-4 py-2 rounded-full bg-background border border-input w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Tabs defaultValue="Todos" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="mb-4 inline-flex overflow-x-auto pb-2 max-w-full">
              <TabsTrigger value="Todos" className="rounded-full">Todos</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="rounded-full">{category}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="text-muted-foreground">Cargando lecciones...</span>
          </div>
        )}

        {/* Progress Overview Card */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="glass-card bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Tu Progreso</CardTitle>
                <CardDescription className="text-slate-300">Continúa donde lo dejaste</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="w-full sm:w-2/3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">Progreso General</span>
                      <span className="text-sm font-medium text-slate-300">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        {completedLessons} {completedLessons === 1 ? 'Lección Completada' : 'Lecciones Completadas'}
                      </Badge>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                        <Award className="h-3 w-3 mr-1" /> 3 Certificaciones
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Star className="h-3 w-3 mr-1" /> 12 Habilidades
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 flex justify-end">
                    <Button 
                      className={`w-full sm:w-auto bg-gradient-to-r ${roleColors[userRole as keyof typeof roleColors].primary}`}
                      onClick={() => {
                        const inProgressLessons = lessons.filter(l => l.progress > 0 && l.progress < 100);
                        if (inProgressLessons.length > 0) {
                          const nextLesson = inProgressLessons[0];
                          setSelectedLesson(nextLesson);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      Continuar Aprendiendo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Lessons Grid */}
        {showContent && !loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {searchedLessons.map(lesson => (
              <motion.div key={lesson.id} variants={itemVariants}>
                <Card 
                  className="h-full hover:shadow-lg transition-shadow overflow-hidden flex flex-col cursor-pointer"
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 h-40 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-indigo-400" />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        lesson.level === "Principiante" ? "bg-green-500/20 text-green-500" :
                        lesson.level === "Intermedio" ? "bg-blue-500/20 text-blue-500" :
                        "bg-purple-500/20 text-purple-500"
                      }>
                        {lesson.level}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lesson.duration}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progreso</span>
                      <span className="text-xs font-medium">{lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-1" />
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className={`w-full ${
                        lesson.completed 
                          ? "bg-amber-500 hover:bg-amber-600" 
                          : lesson.progress > 0 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-gradient-to-r from-indigo-500 to-purple-600"
                      }`}
                    >
                      {lesson.completed ? (
                        <>
                          <Star className="mr-2 h-4 w-4" /> Completado
                        </>
                      ) : lesson.progress > 0 ? (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Continuar
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-2 h-4 w-4" /> Comenzar
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {showContent && !loading && searchedLessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-10 text-center"
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No se encontraron lecciones</h3>
            <p className="text-muted-foreground mb-6">No hay lecciones que coincidan con tus criterios de búsqueda.</p>
            <Button onClick={() => {
              setSearchTerm("");
              setActiveCategory("Todos");
            }}>
              Limpiar filtros
            </Button>
          </motion.div>
        )}

        {/* Lesson Modal */}
        <LessonModal
          lesson={selectedLesson}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStartLesson={handleStartLesson}
        />
      </div>
    </MainLayout>
  );
};

export default Lessons;