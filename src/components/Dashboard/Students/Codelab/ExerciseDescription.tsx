import { motion } from 'framer-motion';
import { CheckCircle, Code, FileText, Sparkles } from 'lucide-react';
import { Exercise } from './types';

interface Props {
  currentExercise: Exercise | null;
}

const ExerciseDescription = ({ currentExercise }: Props) => (
  <div className="h-full flex flex-col">
    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5" />
        <h3 className="font-bold">Descripción del Problema</h3>
      </div>
    </div>
    <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-green-50 to-emerald-50">
      {currentExercise ? (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">{currentExercise.title}</h4>
            <p className="text-gray-700 leading-relaxed">{currentExercise.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <h5 className="font-bold mb-2 text-green-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                Ejemplo de Entrada:
              </h5>
              <div className="bg-gray-600 p-4 rounded-xl font-mono text-sm shadow-lg border-l-4 border-green-500">
                {currentExercise.input_example}
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <h5 className="font-bold mb-2 text-blue-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Ejemplo de Salida:
              </h5>
              <div className="bg-gray-600 p-4 rounded-xl font-mono text-sm shadow-lg border-l-4 border-blue-500">
                {currentExercise.output_example}
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-blue-600" />
              ¡Desarrolla tu solución con confianza! Tu código será evaluado automáticamente.
            </p>
          </motion.div>
          {currentExercise.test_cases && currentExercise.test_cases.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h5 className="font-bold text-purple-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                Casos de Prueba Adicionales:
              </h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {currentExercise.test_cases.slice(0, 3).map((testCase, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-3 rounded-lg shadow-md border-l-4 border-purple-500"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-green-600">Entrada:</span>
                        <div className="font-mono bg-slate-500 p-2 rounded mt-1">
                          {testCase.input_data}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-blue-600">Salida esperada:</span>
                        <div className="font-mono bg-neutral-700 p-2 rounded mt-1">
                          {testCase.expected_output}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center">
            <Code className="h-10 w-10 text-purple-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-700 mb-3">🎯 Editor Libre</h4>
          <p className="text-gray-600 mb-6">
            ¡Experimenta y crea código increíble sin restricciones!
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Múltiples lenguajes de programación</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Ejecución en tiempo real</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Descarga y comparte tu código</span>
            </div>
          </div>
          <motion.div 
            className="mt-8 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border border-green-200"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-green-800 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span>¡Selecciona un ejercicio o empieza a programar directamente!</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  </div>
);

export default ExerciseDescription;