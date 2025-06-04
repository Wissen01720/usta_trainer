import React from "react";
import { Button } from "../../../ui/button";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateExerciseModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form: {
    title: string;
    description: string;
    input_example: string;
    output_example: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    newTag: string;
  };
  setForm: React.Dispatch<React.SetStateAction<CreateExerciseModalProps["form"]>>;
  creating: boolean;
  handleCreate: () => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  showModal,
  setShowModal,
  form,
  setForm,
  creating,
  handleCreate,
  addTag,
  removeTag,
}) => (
  <AnimatePresence>
    {showModal && (
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
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Ejercicio</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título del ejercicio
              </label>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Suma de dos números"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe el ejercicio que deben resolver los estudiantes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dificultad
              </label>
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, difficulty: "easy" }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.difficulty === "easy"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Fácil
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, difficulty: "medium" }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.difficulty === "medium"
                      ? "bg-yellow-500 text-white shadow-md"
                      : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Intermedio
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, difficulty: "hard" }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.difficulty === "hard"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Difícil
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Etiquetas (opcional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={form.newTag}
                  onChange={e => setForm(f => ({ ...f, newTag: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && addTag()}
                  placeholder="Añadir etiqueta..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  Añadir
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ejemplo de entrada
              </label>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 font-mono"
                value={form.input_example}
                onChange={e => setForm(f => ({ ...f, input_example: e.target.value }))}
                placeholder="5 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ejemplo de salida
              </label>
              <input
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 font-mono"
                value={form.output_example}
                onChange={e => setForm(f => ({ ...f, output_example: e.target.value }))}
                placeholder="8"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="px-6"
              >
                Cancelar
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-6"
              >
                {creating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Ejercicio
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CreateExerciseModal;