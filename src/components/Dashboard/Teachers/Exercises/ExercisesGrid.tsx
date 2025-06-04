import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { BookOpen, ListChecks, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Problem } from "./types";

interface ExercisesGridProps {
  loading: boolean;
  filteredProblems: Problem[];
  searchTerm: string;
  clearSearch: () => void;
  setShowModal: (show: boolean) => void;
  setSelectedProblem: (p: Problem) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: index * 0.1,
      duration: 0.6,
    },
  }),
  exit: { opacity: 0, y: -30, scale: 0.8, transition: { duration: 0.3 } },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 10 },
  },
};

const ExercisesGrid: React.FC<ExercisesGridProps> = ({
  loading,
  filteredProblems,
  searchTerm,
  clearSearch,
  setShowModal,
  setSelectedProblem,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.4 }}
  >
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <BookOpen className="h-5 w-5 text-teal-600" />
          Mis Ejercicios
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">Cargando ejercicios...</p>
          </motion.div>
        ) : filteredProblems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center"
            >
              <BookOpen className="h-12 w-12 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {searchTerm ? "No se encontraron resultados" : "No hay ejercicios creados"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm
                ? `No hay ejercicios que coincidan con "${searchTerm}"`
                : "Comienza creando tu primer ejercicio para tus estudiantes"}
            </p>
            {searchTerm ? (
              <Button onClick={clearSearch} variant="outline">
                Limpiar búsqueda
              </Button>
            ) : (
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-teal-500 to-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" /> Crear primer ejercicio
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  layout
                  className="group relative"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col">
                    {/* Header con gradiente basado en dificultad */}
                    <div
                      className={`relative h-32 ${
                        problem.difficulty === "easy"
                          ? "bg-gradient-to-br from-green-400 to-teal-500"
                          : problem.difficulty === "medium"
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                          : "bg-gradient-to-br from-red-400 to-pink-500"
                      } flex items-center justify-center`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="h-12 w-12 text-white opacity-90" />
                      </motion.div>
                      <div className="absolute inset-0 bg-black/10" />
                      {/* Badge del número de casos de prueba */}
                      {problem.test_cases && problem.test_cases.length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {problem.test_cases.length} test
                          {problem.test_cases.length !== 1 ? "s" : ""}
                        </motion.div>
                      )}
                    </div>
                    {/* Contenido */}
                    <div className="flex-1 flex flex-col p-6">
                      <motion.h3
                        className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        {problem.title}
                      </motion.h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
                        {problem.description}
                      </p>
                      {/* Tags */}
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              +{problem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {/* Mini preview de ejemplos */}
                      <div className="space-y-2 mb-4 text-xs">
                        {problem.input_example?.trim() && (
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Input:
                            </span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                              {problem.input_example.length > 30
                                ? problem.input_example.substring(0, 30) + "..."
                                : problem.input_example}
                            </span>
                          </div>
                        )}
                        {problem.output_example?.trim() && (
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-2">
                            <span className="font-medium text-teal-700 dark:text-teal-300">
                              Output:
                            </span>
                            <span className="ml-2 text-teal-600 dark:text-teal-400 font-mono">
                              {problem.output_example.length > 30
                                ? problem.output_example.substring(0, 30) + "..."
                                : problem.output_example}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Botón de acción */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProblem(problem)}
                          className="w-full group-hover:border-teal-300 group-hover:text-teal-600 dark:group-hover:border-teal-600 dark:group-hover:text-teal-400 transition-all duration-200"
                        >
                          <ListChecks className="h-4 w-4 mr-2" /> Ver Detalles
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default ExercisesGrid;