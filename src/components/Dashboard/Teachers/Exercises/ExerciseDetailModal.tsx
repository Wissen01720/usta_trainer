import React from "react";
import { Button } from "../../../ui/button";
import { BookOpen, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Problem } from "./types";

interface ExerciseDetailModalProps {
  selectedProblem: Problem | null;
  setSelectedProblem: (p: Problem | null) => void;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  selectedProblem,
  setSelectedProblem,
}) => (
  <AnimatePresence>
    {selectedProblem && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-blue-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedProblem.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[selectedProblem.difficulty]} backdrop-blur-sm`}>
                      {selectedProblem.difficulty === "easy"
                        ? "Fácil"
                        : selectedProblem.difficulty === "medium"
                        ? "Intermedio"
                        : "Difícil"}
                    </span>
                    {selectedProblem.tags && selectedProblem.tags.length > 0 && (
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                        {selectedProblem.tags[0]}
                        {selectedProblem.tags.length > 1 && ` +${selectedProblem.tags.length - 1}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProblem(null)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Descripción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Descripción del Ejercicio
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedProblem.description}
              </p>
            </motion.div>

            {/* Ejemplos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Entrada ejemplo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800"
              >
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Entrada Ejemplo
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700">
                  {selectedProblem.input_example?.trim() ? (
                    <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
                      {selectedProblem.input_example}
                    </pre>
                  ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      No se proporcionó ejemplo de entrada
                    </p>
                  )}
                </div>
              </motion.div>
              {/* Salida ejemplo */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-800"
              >
                <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Salida Ejemplo
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                  {selectedProblem.output_example?.trim() ? (
                    <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
                      {selectedProblem.output_example}
                    </pre>
                  ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      No se proporcionó ejemplo de salida
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Etiquetas */}
            {selectedProblem.tags && selectedProblem.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
              >
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProblem.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Casos de prueba */}
            {selectedProblem.test_cases && selectedProblem.test_cases.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
              >
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Casos de Prueba
                  <span className="ml-2 px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full font-medium">
                    {selectedProblem.test_cases.length}
                  </span>
                </h3>
                <div className="space-y-4">
                  {selectedProblem.test_cases.map((tc, index) => (
                    <motion.div
                      key={tc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Caso #{index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Entrada:</p>
                          <pre className="text-sm font-mono bg-green-50 dark:bg-green-900/30 p-2 rounded-lg text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {tc.input_data}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Salida Esperada:</p>
                          <pre className="text-sm font-mono bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-gray-800 dark:text-gray-200 overflow-x-auto">
                            {tc.expected_output}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer con estadísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Estadísticas del Ejercicio</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">ID</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{selectedProblem.id}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedProblem.test_cases?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Casos de Prueba</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedProblem.description.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Caracteres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedProblem.input_example && selectedProblem.output_example ? "✓" : "✗"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ejemplos</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer del modal */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-b-2xl border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-end">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProblem(null)}
                  className="px-8 py-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ExerciseDetailModal;