import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Clock, Star, ArrowRight, CheckCircle, XCircle, Play } from 'lucide-react';
import { LessonType } from '../../types/lesson';

interface LessonModalProps {
  lesson: LessonType | null;
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: () => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ lesson, isOpen, onClose, onStartLesson }) => {
  if (!lesson) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante":
        return "bg-green-500/20 text-green-500";
      case "Intermedio":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-purple-500/20 text-purple-500";
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", damping: 30, stiffness: 500 }
    },
    exit: { 
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-gray-200 dark:border-gray-800"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Hero section with gradient background */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-40 relative flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className="text-white text-4xl font-bold z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {lesson.title}
              </motion.div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Metadata section */}
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <Badge className={getLevelColor(lesson.level)}>
                  {lesson.level}
                </Badge>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-muted-foreground">
                {lesson.description}
              </p>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm font-medium">{lesson.progress}%</span>
                </div>
                <Progress value={lesson.progress} className="h-2" />
              </div>
              
              {/* Content overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contenido</h3>
                <div className="space-y-2">
                  {[
                    'Introducción a los conceptos clave',
                    'Ejemplos prácticos',
                    'Ejercicios guiados',
                    'Desafíos para resolver',
                    'Proyecto final'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        {index < Math.floor(lesson.progress / 20) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600" />
                        )}
                        <span>{item}</span>
                      </div>
                      {index < Math.floor(lesson.progress / 20) ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Completado
                        </Badge>
                      ) : index === Math.floor(lesson.progress / 20) ? (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          En progreso
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Prerequisites */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Requisitos previos</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Conocimientos básicos de programación</li>
                  <li>Familiaridad con conceptos de {lesson.category}</li>
                  {lesson.level !== "Principiante" && (
                    <li>Completar lecciones de nivel anterior</li>
                  )}
                </ul>
              </div>
              
              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cerrar
                </Button>
                
                {lesson.completed ? (
                  <Button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600">
                    <Star className="mr-2 h-4 w-4" />
                    Ver certificado
                  </Button>
                ) : lesson.progress > 0 ? (
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={onStartLesson}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Continuar
                  </Button>
                ) : (
                  <Button 
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600"
                    onClick={onStartLesson}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Comenzar
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LessonModal;