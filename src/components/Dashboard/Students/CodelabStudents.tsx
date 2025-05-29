import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Save, Copy, Download, CheckCircle, XCircle, AlertCircle, ArrowLeft, Sparkles, Code, Terminal, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/Layout/MainLayout';

const API_URL = "https://virtualjudge.onrender.com";

interface Exercise {
  id: number;
  title: string;
  description: string;
  input_example: string;
  output_example: string;
  test_cases?: Array<{
    input_data: string;
    expected_output: string;
  }>;
}

interface SubmissionResult {
  passed: boolean;
  result: string;
  details: Array<{
    input: string;
    expected: string;
    actual: string;
    verdict: string;
  }>;
  message: string;
}

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  theme: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python', color: 'from-blue-500 to-cyan-500' },
  { value: 'javascript', label: 'JavaScript', color: 'from-yellow-500 to-orange-500' },
  { value: 'java', label: 'Java', color: 'from-red-500 to-pink-500' },
  { value: 'c', label: 'C', color: 'from-gray-500 to-slate-500' },
  { value: 'cpp', label: 'C++', color: 'from-purple-500 to-indigo-500' },
];

// Componente Editor de Código con mejor diseño
const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  const [localCode, setLocalCode] = useState(code);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setLocalCode(newCode);
    onChange(newCode);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-95"></div>
      <textarea
        value={localCode}
        onChange={handleChange}
        className="relative z-10 w-full h-full resize-none font-mono text-sm p-6 bg-transparent text-emerald-400 placeholder-slate-500 border-0 outline-none selection:bg-emerald-400/20"
        placeholder="# ¡Escribe tu código aquí y crea algo increíble! ✨"
        spellCheck={false}
        style={{
          tabSize: 2,
          lineHeight: '1.6',
          textShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
        }}
      />
      <div className="absolute top-4 right-4 z-20">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
        </div>
      </div>
    </div>
  );
};

const CodeLab = () => {
  const [code, setCode] = useState('# ¡Bienvenido a CodeLab! 🚀\n# Escribe tu código aquí\n\ndef resolver_problema():\n    # Tu solución aquí\n    pass\n\nresolver_problema()\n');
  const [language, setLanguage] = useState('python');
  const [theme] = useState('vs-dark');
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [showExercisesList, setShowExercisesList] = useState(true);
  const [loading, setLoading] = useState(true);

  // Cargar ejercicios desde la API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/problems/`);
        if (!response.ok) {
          throw new Error('Error al cargar ejercicios');
        }
        const data: Exercise[] = await response.json();
        setExercises(data);
        setFilteredExercises(data);
      } catch (err) {
        console.error('Error loading exercises:', err);
        setError('No se pudieron cargar los ejercicios de la base de datos');
        setExercises([]);
        setFilteredExercises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter(exercise =>
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchTerm, exercises]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleExerciseSelect = async (exercise: Exercise) => {
    try {
      const response = await fetch(`${API_URL}/problems/${exercise.id}`);
      if (!response.ok) {
        throw new Error('Error al cargar detalles del ejercicio');
      }
      const exerciseDetails: Exercise = await response.json();
      
      setCurrentExercise(exerciseDetails);
      setCode(`# ${exerciseDetails.title}\n# ${exerciseDetails.description}\n\n# ¡Tu código aquí! 💪\ndef resolver():\n    # Implementa tu solución\n    pass\n\nresolver()\n`);
      setLanguage('python');
      setOutput('');
      setError(null);
      setSubmissionResult(null);
      setShowExercisesList(false);
    } catch (err) {
      console.error('Error loading exercise details:', err);
      setError('No se pudieron cargar los detalles del ejercicio');
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('El código no puede estar vacío.');
      return;
    }

    if (!currentExercise) {
      setError('Selecciona un ejercicio primero.');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput('');
    setSubmissionResult(null);

    try {
      const response = await fetch(`${API_URL}/submit/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          language: language,
          problem_id: currentExercise.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la evaluación del código');
      }

      const result = await response.json();
      const isAccepted = result.result === "Accepted";
      const details = result.details || [];
      
      setSubmissionResult({
        passed: isAccepted,
        result: result.result,
        details: details,
        message: isAccepted 
          ? '🎉 ¡Excelente! Has resuelto el ejercicio correctamente.' 
          : `📝 Resultado: ${result.result}. Revisa los casos de prueba.`
      });

      if (details.length > 0) {
        const outputText = details.map(
          (detail: SubmissionResult['details'][number], idx: number) =>
            `🧪 Caso ${idx + 1}:\n` +
            `  📥 Entrada: ${detail.input}\n` +
            `  ✅ Esperado: ${detail.expected}\n` +
            `  📤 Obtenido: ${detail.actual}\n` +
            `  🏆 Resultado: ${detail.verdict}\n`
        ).join('\n');
        setOutput(outputText);
      }

    } catch (err) {
      console.error('Submission error:', err);
      setError('Error al evaluar el código. Verifica tu conexión e intenta de nuevo.');
      setOutput('');
    }

    setIsRunning(false);
  };

  const handleSaveCode = () => {
    console.log('Código guardado en memoria:', { code, language });
    setOutput('💾 Código guardado correctamente en la sesión actual.');
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setOutput('📋 Código copiado al portapapeles.');
    }).catch(() => {
      setError('No se pudo copiar el código.');
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="relative mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Cargando CodeLab
            </motion.h2>
            <p className="text-gray-600">Preparando ejercicios increíbles...</p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  if (showExercisesList) {
    return (
      <MainLayout>
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  CodeLab IDE
                </h1>
                <span>
                  <Sparkles className="w-8 h-8 text-yellow-500 animate-bounce" />
                </span>
              </div>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Selecciona un ejercicio y <span className="font-semibold text-purple-600">transforma ideas en código</span> ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="relative w-full sm:w-96">
                  <input
                    type="text"
                    placeholder="Buscar ejercicios mágicos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 h-12 border-2 border-purple-200 focus:border-purple-400 rounded-xl shadow-lg w-full"
                  />
                </div>
                <Button
                  onClick={() => setShowExercisesList(false)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Terminal className="w-5 h-5 mr-2" />
                  Editor Libre
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="cursor-pointer h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group p-6"
                    onClick={() => handleExerciseSelect(exercise)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {exercise.title}
                      </span>
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded px-2 py-1 text-xs font-bold">
                        #{exercise.id}
                      </span>
                    </div>
                    <div className="text-gray-600 line-clamp-3 mb-2">
                      {exercise.description}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
                            <span className="text-xs font-semibold text-gray-600">ENTRADA</span>
                          </div>
                          <div className="bg-gradient-to-r from-fuchsia-100 via-pink-100 to-fuchsia-200 p-3 rounded-lg font-mono text-sm border border-fuchsia-300 shadow-inner text-fuchsia-900 font-semibold">
                            {exercise.input_example}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                            <span className="text-xs font-semibold text-gray-600">SALIDA</span>
                          </div>
                          <div className="bg-gradient-to-r from-cyan-100 via-sky-100 to-cyan-200 p-3 rounded-lg font-mono text-sm border border-cyan-300 shadow-inner text-cyan-900 font-semibold">
                            {exercise.output_example}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">Py</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Python</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="h-12 w-12 text-gray-400">📖</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {exercises.length === 0 ? '🔍 No hay ejercicios disponibles' : '🎯 No se encontraron ejercicios'}
                  </h3>
                  <p className="text-gray-500">
                    {exercises.length === 0
                      ? 'Verifica la conexión con el servidor'
                      : 'Prueba con una búsqueda diferente'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-col">
        {/* Header mejorado */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowExercisesList(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ejercicios
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentExercise ? currentExercise.title : 'Editor Libre'}
                </h1>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40 border-2 border-purple-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${lang.color}`}></div>
                        {lang.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <motion.div 
            className="w-1/2 border-r-4 border-purple-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5" />
                  <h3 className="font-bold">Editor de Código</h3>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={language}
                  theme={theme}
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-purple-300">
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    onClick={handleRunCode} 
                    disabled={isRunning}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-6 py-2 flex-1 sm:flex-none transform hover:scale-105 transition-all duration-200"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? '⚡ Ejecutando...' : '🚀 Ejecutar'}
                  </Button>
                  <Button onClick={handleSaveCode} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleCopyCode} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleDownloadCode} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Panel derecho con descripción y resultados */}
          <motion.div 
            className="w-1/2 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Descripción del ejercicio */}
            <div className="h-1/2 border-b-4 border-green-200">
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
                          <div className="bg-white p-4 rounded-xl font-mono text-sm shadow-lg border-l-4 border-green-500">
                            {currentExercise.input_example}
                          </div>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <h5 className="font-bold mb-2 text-blue-700 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            Ejemplo de Salida:
                          </h5>
                          <div className="bg-white p-4 rounded-xl font-mono text-sm shadow-lg border-l-4 border-blue-500">
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

                      {/* Mostrar casos de prueba adicionales si existen */}
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
                                    <div className="font-mono bg-green-50 p-2 rounded mt-1">
                                      {testCase.input_data}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-blue-600">Salida esperada:</span>
                                    <div className="font-mono bg-blue-50 p-2 rounded mt-1">
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
            </div>

            {/* Panel de resultados */}
            <div className="h-1/2">
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
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CodeLab;