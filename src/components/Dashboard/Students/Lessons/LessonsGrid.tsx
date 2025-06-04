import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  BookOpen, Clock, CheckCircle2, Trophy, PlayCircle,
  Lightbulb, Sparkles, Heart} from "lucide-react";
import { getLevelStyles, getMotivationalMessage } from "./LessonsUtils";
import type { LessonType } from "../../../../types/lesson";

interface LessonsGridProps {
  lessons: LessonType[];
  onLessonClick: (lesson: LessonType) => void;
}

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

const LessonsGrid: React.FC<LessonsGridProps> = ({
  lessons,
  onLessonClick,
}) => {
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence>
        {lessons.map(lesson => {
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
                  onClick={() => onLessonClick(lesson)}
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
  );
};

export default LessonsGrid;