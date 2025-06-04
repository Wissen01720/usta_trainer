import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Progress } from "../../../ui/progress";
import { Target, CheckCircle2, Award, Star, Users, Zap, ChevronRight } from "lucide-react";
import { getMotivationalMessage } from "./LessonsUtils";
import type { LessonType } from "../../../../types/lesson";

interface LessonsProgressCardProps {
  overallProgress: number;
  completedLessons: number;
  lessons: LessonType[];
  handleContinue: () => void;
}

const LessonsProgressCard: React.FC<LessonsProgressCardProps> = ({
  overallProgress,
  completedLessons,
  lessons,
  handleContinue
}) => (
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
          {/* Barra de progreso */}
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
          {/* Estadísticas */}
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
          {/* Botón de acción */}
          <div className="flex justify-end">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={handleContinue}
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
);

export default LessonsProgressCard;