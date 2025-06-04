import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { BookOpen, ListChecks } from 'lucide-react';
import { Button } from "../../../ui/button";
import { AnimatePresence, motion } from 'framer-motion';
import { Problem } from './ExercisesAdmin';

interface Props {
  loading: boolean;
  filteredProblems: Problem[];
  searchTerm: string;
  clearSearch: () => void;
  setSelectedProblem: (p: Problem) => void;
}

// Todas las variantes como funciones para evitar errores con custom/index
const cardVariants = {
  hidden: () => ({ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }),
  visible: (index: number) => ({
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, delay: index * 0.1, duration: 0.6 }
  }),
  exit: () => ({ opacity: 0, y: -30, scale: 0.8, transition: { duration: 0.3 } }),
  hover: () => ({ y: -8, scale: 1.02, rotateY: 2, transition: { type: "spring", stiffness: 300, damping: 10 } })
};

const ExercisesList: React.FC<Props> = ({
  loading, filteredProblems, searchTerm, clearSearch, setSelectedProblem
}) => (
  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <BookOpen className="h-5 w-5 text-blue-600" />
        Listado de Problemas
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
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Cargando problemas...</p>
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
            {searchTerm ? 'No se encontraron resultados' : 'No hay problemas registrados'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm
              ? `No hay problemas que coincidan con "${searchTerm}"`
              : 'Comienza agregando tu primer problema de programación'
            }
          </p>
          {searchTerm && (
            <Button onClick={clearSearch} variant="outline">
              Limpiar búsqueda
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
                  <div className="relative h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="h-12 w-12 text-white opacity-90" />
                    </motion.div>
                    <div className="absolute inset-0 bg-black/10" />
                    {problem.test_cases && problem.test_cases.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {problem.test_cases.length} test{problem.test_cases.length !== 1 ? 's' : ''}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-6">
                    <motion.h3
                      className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      {problem.title}
                    </motion.h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow">
                      {problem.description}
                    </p>
                    <div className="space-y-2 mb-4 text-xs">
                      {problem.input_example?.trim() && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                            {problem.input_example.length > 30
                              ? problem.input_example.substring(0, 30) + '...'
                              : problem.input_example
                            }
                          </span>
                        </div>
                      )}
                      {problem.output_example?.trim() && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                          <span className="font-medium text-blue-700 dark:text-blue-300">Output:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-400 font-mono">
                            {problem.output_example.length > 30
                              ? problem.output_example.substring(0, 30) + '...'
                              : problem.output_example
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProblem(problem)}
                        className="w-full group-hover:border-blue-300 group-hover:text-blue-600 dark:group-hover:border-blue-600 dark:group-hover:text-blue-400 transition-all duration-200"
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
);

export default ExercisesList;