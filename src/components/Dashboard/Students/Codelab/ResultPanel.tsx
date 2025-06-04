import { motion } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { SubmissionResult } from './types';

interface Props {
  error: string | null;
  output: string;
  submissionResult: SubmissionResult | null;
}

const ResultPanel = ({ error, output, submissionResult }: Props) => (
  <div className="h-full flex flex-col">
    <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="flex items-center gap-3">
        <Terminal className="w-5 h-5" />
        <h3 className="font-bold">Resultados y Salida</h3>
        {submissionResult && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {submissionResult.passed ? (
              <CheckCircle className="w-5 h-5 text-green-300" />
            ) : (
              <XCircle className="w-5 h-5 text-red-300" />
            )}
          </motion.div>
        )}
      </div>
    </div>
    <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-orange-50 to-red-50">
      {error && (
        <motion.div 
          className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-start gap-3 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="h-5 w-5 mt-0.5 text-red-500" />
          <div>
            <h4 className="font-bold">❌ Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {submissionResult && (
        <motion.div 
          className={`mb-4 p-4 rounded-xl shadow-lg border-l-4 ${
            submissionResult.passed 
              ? 'bg-green-100 border-green-500 text-green-700' 
              : 'bg-yellow-100 border-yellow-500 text-yellow-700'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            {submissionResult.passed ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-lg">{submissionResult.message}</h4>
              {submissionResult.result && (
                <p className="text-sm mt-1">
                  <span className="font-semibold">Estado:</span> {submissionResult.result}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {output && (
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
            <Terminal className="w-4" />
            Salida del Programa:
          </h4>
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-3 rounded-lg overflow-auto max-h-64 border">
            {output}
          </pre>
        </motion.div>
      )}

      {!output && !error && !submissionResult && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-200 to-red-200 flex items-center justify-center">
            <Terminal className="h-8 w-8 text-orange-600" />
          </div>
          <h4 className="text-lg font-bold text-gray-700 mb-2">✨ Listo para ejecutar</h4>
          <p className="text-gray-600 mb-4">
            Haz clic en "🚀 Ejecutar" para ver los resultados de tu código
          </p>
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(249, 115, 22, 0.4)",
                  "0 0 0 10px rgba(249, 115, 22, 0)",
                  "0 0 0 0 rgba(249, 115, 22, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium"
            >
              ¡Tu código aquí! 💫
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  </div>
);

export default ResultPanel;