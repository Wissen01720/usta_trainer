import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Flame, Trophy, TrendingUp } from "lucide-react";

interface LessonsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  streakDays: number;
  completedLessons: number;
  inProgressLessons: number;
}

const LessonsHeader: React.FC<LessonsHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  streakDays,
  completedLessons,
  inProgressLessons,
}) => (
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
      {/* Buscador */}
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
);

export default LessonsHeader;