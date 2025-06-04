import React from "react";
import { Trophy, Lightbulb, GraduationCap, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { Problem } from "./types";

interface ExercisesStatsProps {
  problems: Problem[];
}

const ExercisesStats: React.FC<ExercisesStatsProps> = ({ problems }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="grid grid-cols-1 sm:grid-cols-4 gap-4"
  >
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Ejercicios</p>
          <p className="text-2xl font-bold text-teal-600">{problems.length}</p>
        </div>
        <Trophy className="h-8 w-8 text-teal-500 opacity-60" />
      </div>
    </div>
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fáciles</p>
          <p className="text-2xl font-bold text-green-600">
            {problems.filter((p) => p.difficulty === "easy").length}
          </p>
        </div>
        <Lightbulb className="h-8 w-8 text-green-500 opacity-60" />
      </div>
    </div>
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Intermedios</p>
          <p className="text-2xl font-bold text-yellow-600">
            {problems.filter((p) => p.difficulty === "medium").length}
          </p>
        </div>
        <GraduationCap className="h-8 w-8 text-yellow-500 opacity-60" />
      </div>
    </div>
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Difíciles</p>
          <p className="text-2xl font-bold text-red-600">
            {problems.filter((p) => p.difficulty === "hard").length}
          </p>
        </div>
        <Bookmark className="h-8 w-8 text-red-500 opacity-60" />
      </div>
    </div>
  </motion.div>
);

export default ExercisesStats;