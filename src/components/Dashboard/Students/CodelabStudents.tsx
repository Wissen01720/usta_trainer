import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../../Layout/MainLayout';
import Editor from '../../CodeEditor/Editor';
import { useToast } from '../../../hooks/use-toast';
import { Button } from '../../ui/button';
import { Play, Save, Copy, Download, CheckCircle, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || "https://virtualjudge.onrender.com";

interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  language: string;
  language_id: number;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'rust', label: 'Rust' },
];

const DEFAULT_EXERCISE: Exercise = {
  id: 'default',
  title: 'Editor Vacío',
  description: 'Escribe tu código aquí o selecciona un ejercicio',
  starterCode: '// Escribe tu código aquí\n// Puedes cambiar el lenguaje arriba',
  language: 'javascript',
  language_id: 63,
};

const CodeLab: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_EXERCISE.starterCode);
  const [language, setLanguage] = useState<string>(DEFAULT_EXERCISE.language);
  const [theme, setTheme] = useState<string>('vs-dark');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise>(DEFAULT_EXERCISE);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [gradeResult, setGradeResult] = useState<{
    passed: boolean;
    message: string;
    details?: {
      passedTestCases: number;
      testCases: number;
    };
  } | null>(null);
  const [output, setOutput] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${API_URL}/exercises`);
        if (!res.ok) throw new Error("No se pudieron cargar los ejercicios");
        const data = await res.json();
        setExercises([DEFAULT_EXERCISE, ...data]);
      } catch {
        console.error('Error cargando ejercicios');
        setExercises([DEFAULT_EXERCISE]);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem('savedCode');
    const savedLanguage = localStorage.getItem('savedLanguage');
    if (savedCode) setCode(savedCode);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError(null);
    setGradeResult(null);
    setOutput('');
    localStorage.setItem('savedCode', newCode);
  };

  const handleRunCode = async () => {
    setOutput('');
    setError(null);
    if (!code.trim()) {
      setError('El código no puede estar vacío.');
      return;
    }
    setIsRunning(true);

    const languageId = currentExercise?.language_id || DEFAULT_EXERCISE.language_id;
    if (!languageId) {
      setError('Lenguaje no soportado.');
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: '',
        }),
      });
      const result = await response.json();
      if (result.stderr) {
        setOutput(result.stderr);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
      } else {
        setOutput(result.stdout || '');
      }
      toast({
        title: "Ejecución completada",
        description: "El código se ejecutó correctamente.",
        variant: "default",
      });
    } catch {
      setError('Error al ejecutar el código.');
      setOutput('');
    }
    setIsRunning(false);
  };

  const handleSaveCode = () => {
    localStorage.setItem('savedCode', code);
    localStorage.setItem('savedLanguage', language);
    toast({
      title: "Progreso guardado",
      description: "Tu código y lenguaje han sido guardados.",
      variant: "default",
    });
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCode(exercise.starterCode);
    setLanguage(exercise.language);
    setGradeResult(null);
    setError(null);
    setOutput('');
  };

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6 p-4 h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">CodeLab IDE</h1>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value);
                localStorage.setItem('savedLanguage', value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lenguaje" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded text-sm h-10"
            >
              <option value="vs-dark">Tema Oscuro</option>
              <option value="vs-light">Tema Claro</option>
              <option value="hc-black">Alto Contraste</option>
            </select>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor y Preview */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* Editor */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {currentExercise?.title || 'Editor'}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCode(currentExercise?.starterCode || '')}
                    disabled={!currentExercise || currentExercise.id === 'default'}
                  >
                    Resetear
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
                <Editor
                  languageId={currentExercise?.language_id || DEFAULT_EXERCISE.language_id}
                  onCodeChange={handleCodeChange}
                  code={code}
                  theme={theme}
                  height="100%"
                />
              </div>
              {error && (
                <div className="mt-2 text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  {error}
                </div>
              )}
              {gradeResult && (
                <div className={`mt-2 p-3 rounded-lg ${
                  gradeResult.passed 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      gradeResult.passed ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{gradeResult.message}</p>
                      {gradeResult.details && (
                        <p className="text-sm mt-1">
                          Pruebas pasadas: {gradeResult.details.passedTestCases}/{gradeResult.details.testCases}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  onClick={handleRunCode} 
                  disabled={isRunning}
                  className="flex-1 sm:flex-none"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                </Button>
                <Button 
                  onClick={handleSaveCode}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
            {/* Preview */}
            <div className="flex flex-col h-full">
              <h3 className="font-medium mb-2">Resultado</h3>
              <div className="flex-1 min-h-0 border rounded-lg overflow-hidden p-4 bg-black text-white font-mono text-sm">
                {output
                  ? <pre>{output}</pre>
                  : <span className="text-muted-foreground">Ejecuta tu código para ver el resultado aquí.</span>
                }
              </div>
            </div>
          </div>
          {/* Ejercicios */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Ejercicios</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar código
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(code);
                  toast({ title: "Código copiado", description: "El código se copió al portapapeles." });
                }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar código
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-60">
              {exercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentExercise?.id === exercise.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleSelectExercise(exercise)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      currentExercise?.id === exercise.id
                        ? 'bg-blue-100 dark:bg-blue-800'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{exercise.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {exercise.description}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                        {SUPPORTED_LANGUAGES.find(l => l.value === exercise.language)?.label || exercise.language}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default CodeLab;