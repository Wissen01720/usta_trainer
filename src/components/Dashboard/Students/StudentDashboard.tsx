import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { 
  Search, BookOpen, Star, Clock, Award, 
  Target, TrendingUp, Zap, Coffee, Flame, Trophy, 
  CheckCircle2, PlayCircle, Sparkles, Lightbulb,
  ChevronRight, Users, Heart
} from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import LessonModal from '../../Lessons/LessonModal';
import LessonContent from '../../Lessons/LessonsContent';
import { LessonType } from '../../../types/lesson';
import { API_BASE_URL, API_ENDPOINTS } from '../../../api/config';

// Utilidad para transformar URLs de YouTube/Vimeo a formato embed con autoplay
function getEmbedUrl(url: string) {
  if (!url) return "";
  // YouTube normal
  if (url.includes("youtube.com/watch")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  // YouTube short
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  // Vimeo
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  // Si ya es embed o de otro proveedor, la deja igual
  return url;
}

// Mensajes motivacionales según el progreso
const getMotivationalMessage = (progress: number) => {
  if (progress === 0) return "¡Es hora de comenzar esta aventura! 🚀";
  if (progress < 25) return "¡Gran comienzo! Sigue así 💪";
  if (progress < 50) return "¡Vas por buen camino! 🌟";
  if (progress < 75) return "¡Increíble progreso! Ya casi llegas 🔥";
  if (progress < 100) return "¡Casi lo logras! El final está cerca 🏆";
  return "¡Misión cumplida! Eres increíble ✨";
};

// Colores dinámicos según el nivel
const getLevelStyles = (level: string) => {
  switch (level) {
    case "Principiante":
      return {
        badge: "bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-400 border-green-400/30",
        glow: "shadow-green-400/20"
      };
    case "Intermedio":
      return {
        badge: "bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-400 border-blue-400/30",
        glow: "shadow-blue-400/20"
      };
    case "Avanzado":
      return {
        badge: "bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-purple-400 border-purple-400/30",
        glow: "shadow-purple-400/20"
      };
    default:
      return {
        badge: "bg-gray-400/20 text-gray-400 border-gray-400/30",
        glow: "shadow-gray-400/20"
      };
  }
};

const Lessons: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLessonContent, setShowLessonContent] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
  const filteredLessons = Array.isArray(lessons)
    ? (activeCategory === "Todos"
      ? lessons
      : lessons.filter(lesson => lesson.category === activeCategory))
    : [];

  const [searchTerm, setSearchTerm] = useState("");
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
    
    // Mensaje motivacional al iniciar
    toast({
      title: "¡Vamos a aprender! 🎯",
      description: `Has iniciado: ${selectedLesson.title}`,
    });
  };

  const handleBackToLessons = () => {
    setShowLessonContent(false);
    setSelectedLesson(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <MainLayout role={userRole as 'student' | 'teacher' | 'admin'}>
      <div className="space-y-8">
        {/* Si está viendo el contenido de la lección, muestra LessonContent */}
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
            {/* Animated Header con mensaje personalizado */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-pulse" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ¡Hora de Aprender! 
                      </h1>
                      <p className="text-lg text-muted-foreground mt-1">
                        Cada lección te acerca más a tus metas 🎯
                      </p>
                    </div>
                  </div>
                  
                  {/* Estadísticas motivacionales */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      <Flame className="h-4 w-4" />
                      <span className="font-semibold">{streakDays} días consecutivos</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">{completedLessons} lecciones completadas</span>
                    </div>
                    {inProgressLessons > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">{inProgressLessons} en progreso</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Buscador mejorado */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="search"
                    placeholder="¿Qué quieres aprender hoy?" 
                    className="pl-12 pr-6 py-4 rounded-2xl bg-background/80 backdrop-blur-sm border border-input w-full lg:w-80 text-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
                </div>
              </div>
            </motion.div>

            {/* Estado de carga con animación */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col justify-center items-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"
                />
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Coffee className="h-5 w-5" />
                  <span>Preparando tus lecciones...</span>
                </div>
              </motion.div>
            )}

            {/* Progress Overview Card mejorado */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Card className="relative overflow-hidden glass-card bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">Tu Progreso</CardTitle>
                          <CardDescription className="text-slate-300 text-lg">
                            {getMotivationalMessage(overallProgress)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{overallProgress}%</div>
                        <div className="text-sm text-slate-400">completado</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-6">
                      {/* Barra de progreso mejorada */}
                      <div className="space-y-2">
                        <Progress 
                          value={overallProgress} 
                          className="h-4 bg-slate-700/50 rounded-full overflow-hidden"
                        />
                        <div className="flex justify-between text-sm text-slate-400">
                          <span>Progreso General</span>
                          <span>{Math.round((completedLessons / lessons.length) * 100) || 0}% de lecciones completadas</span>
                        </div>
                      </div>
                      
                      {/* Estadísticas con iconos */}
                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {completedLessons} {completedLessons === 1 ? 'Lección Completada' : 'Lecciones Completadas'}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 px-4 py-2 text-sm">
                          <Award className="h-4 w-4 mr-2" />
                          3 Certificaciones
                        </Badge>
                        <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30 px-4 py-2 text-sm">
                          <Star className="h-4 w-4 mr-2" />
                          12 Habilidades
                        </Badge>
                        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          Top 10% Estudiantes
                        </Badge>
                      </div>
                      
                      {/* Botón de acción mejorado */}
                      <div className="flex justify-end">
                        <Button 
                          size="lg"
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                          onClick={() => {
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
                        >
                          <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                          Continuar Aprendiendo
                          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Lessons Grid mejorado */}
            {showContent && !loading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {searchedLessons.map(lesson => {
                    const levelStyles = getLevelStyles(lesson.level);
                    return (
                      <motion.div 
                        key={lesson.id} 
                        variants={itemVariants}
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        onHoverStart={() => setHoveredCard(lesson.id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        layout
                      >
                        <motion.div variants={cardHoverVariants}>
                          <Card 
                            className={`h-full relative overflow-hidden cursor-pointer border-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm transition-all duration-300 ${levelStyles.glow} hover:shadow-2xl group`}
                            onClick={() => handleLessonClick(lesson)}
                          >
                            {/* Efecto de brillo al hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            
                            {/* Header de la tarjeta con gradiente */}
                            <div className="relative bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 h-48 flex items-center justify-center overflow-hidden">
                              <motion.div
                                animate={hoveredCard === lesson.id ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 rounded-full bg-white/10 backdrop-blur-sm"
                              >
                                <BookOpen className="h-16 w-16 text-white" />
                              </motion.div>
                              
                              {/* Indicador de progreso circular */}
                              {lesson.progress > 0 && (
                                <div className="absolute top-4 right-4">
                                  <div className="relative w-12 h-12">
                                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                                      <path
                                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="2"
                                      />
                                      <path
                                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeDasharray={`${lesson.progress}, 100`}
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-xs font-bold text-white">{lesson.progress}%</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Bookmark para lecciones favoritas */}
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: lesson.completed ? 1 : 0, y: lesson.completed ? 0 : -10 }}
                                className="absolute top-4 left-4"
                              >
                                <div className="p-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              </motion.div>
                            </div>
                            
                            <CardHeader className="pb-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge className={levelStyles.badge}>
                                  {lesson.level}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1 bg-slate-800/50 text-slate-300 border-slate-600">
                                  <Clock className="h-3 w-3" /> {lesson.duration}
                                </Badge>
                              </div>
                              <CardTitle className="text-xl text-white group-hover:text-indigo-300 transition-colors">
                                {lesson.title}
                              </CardTitle>
                              <CardDescription className="text-slate-300 leading-relaxed">
                                {lesson.description}
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="pb-4">
                              {lesson.progress > 0 && (
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Progreso</span>
                                    <span className="font-medium text-slate-300">{lesson.progress}%</span>
                                  </div>
                                  <div className="w-full bg-slate-700 rounded-full h-2">
                                    <motion.div 
                                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${lesson.progress}%` }}
                                      transition={{ duration: 1, delay: 0.5 }}
                                    />
                                  </div>
                                  <div className="text-xs text-slate-400 mt-1">
                                    {getMotivationalMessage(lesson.progress)}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            
                            <CardFooter className="mt-auto">
                              <Button 
                                className={`w-full relative overflow-hidden group/btn ${
                                  lesson.completed 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                                    : lesson.progress > 0 
                                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700" 
                                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                } rounded-xl py-3 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl`}
                              >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                <div className="relative flex items-center justify-center gap-2">
                                  {lesson.completed ? (
                                    <>
                                      <Trophy className="h-4 w-4" /> 
                                      Completado
                                      <Heart className="h-4 w-4 ml-1" />
                                    </>
                                  ) : lesson.progress > 0 ? (
                                    <>
                                      <PlayCircle className="h-4 w-4" /> 
                                      Continuar
                                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full ml-2">
                                        {lesson.progress}%
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Lightbulb className="h-4 w-4" /> 
                                      Comenzar
                                      <Sparkles className="h-4 w-4 ml-1" />
                                    </>
                                  )}
                                </div>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State mejorado */}
            {showContent && !loading && searchedLessons.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center justify-center p-16 text-center space-y-6"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="p-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
                >
                  <BookOpen className="h-20 w-20 text-indigo-400" />
                </motion.div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">
                    ¡Ups! No encontramos lecciones 🕵️‍♀️
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md">
                    Parece que no hay lecciones que coincidan con lo que buscas. 
                    ¡Pero no te preocupes, tenemos más contenido esperándote!
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("Todos");
                    }}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Ver todas las lecciones
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 px-8 py-3 rounded-xl transition-all duration-300"
                    onClick={() => setSearchTerm("")}
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Limpiar búsqueda
                  </Button>
                </div>
                
                {/* Sugerencias */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">💡 Sugerencias:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      Intenta con términos más generales
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      Explora diferentes categorías
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-400" />
                      Revisa la ortografía
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      Prueba sinónimos
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lesson Modal */}
            <LessonModal
              lesson={selectedLesson}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onStartLesson={handleStartLesson}
            />

            {/* Floating Action Button para acceso rápido */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                onClick={() => {
                  // Scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Toast de bienvenida */}
            {showContent && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="fixed top-4 right-4 z-40"
              >
                {/* Este toast se mostraría condicionalmente */}
              </motion.div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Lessons;