import React from "react";
import { Search, X, Plus, NotebookPen } from "lucide-react";
import { Button } from "../../../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Problem } from "./types";

interface ExercisesHeaderProps {
  problems: Problem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  onNewExercise: () => void;
  clearSearch: () => void;
  filteredProblems: Problem[];
}

const searchBarVariants = {
  hidden: { opacity: 0, width: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    width: "auto",
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const ExercisesHeader: React.FC<ExercisesHeaderProps> = ({
  problems,
  searchTerm,
  setSearchTerm,
  showSearch,
  setShowSearch,
  onNewExercise,
  clearSearch,
  filteredProblems,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  >
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl shadow-lg"
      >
        <NotebookPen className="h-8 w-8 text-white" />
      </motion.div>
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Mis Ejercicios
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {problems.length} ejercicio{problems.length !== 1 ? "s" : ""} creado{problems.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <AnimatePresence>
        {showSearch && (
          <motion.div
            variants={searchBarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar ejercicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSearch(!showSearch)}
        className="p-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
      >
        <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </motion.button>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          onClick={onNewExercise}
          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Ejercicio
        </Button>
      </motion.div>
    </div>

    {/* Resultados de búsqueda */}
    {searchTerm && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700 w-full mt-4 sm:mt-0"
      >
        <Search className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-700 dark:text-blue-300">
          {filteredProblems.length} resultado{filteredProblems.length !== 1 ? "s" : ""} para "{searchTerm}"
        </span>
        <button
          onClick={clearSearch}
          className="ml-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    )}
  </motion.div>
);

export default ExercisesHeader;