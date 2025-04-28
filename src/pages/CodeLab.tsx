import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/Layout/MainLayout';
import Editor from '../components/CodeEditor/Editor';
import AnimationPreview from '../components/CodeEditor/AnimationPreview';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Play, Save, Copy, Download } from 'lucide-react';

const CodeLab: React.FC = () => {
  const [code, setCode] = useState<string>(`// Bienvenido al IDE de CodeVerse\nconsole.log("¡Hola, mundo!");`);
  const [language, setLanguage] = useState<string>('javascript');
  const [theme, setTheme] = useState<string>('vs-dark');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Cargar código guardado al iniciar
  useEffect(() => {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError(null); // Limpiar errores al cambiar el código
  };

  const handleRunCode = () => {
    if (!code.trim()) {
      setError('El código no puede estar vacío.');
      return;
    }

    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Ejecución completada",
        description: "El código se ha ejecutado en el panel de visualización.",
        variant: "default",
      });
    }, 500);
  };

  const handleSaveCode = () => {
    localStorage.setItem('savedCode', code);
    toast({
      title: "Código guardado",
      description: "Tu progreso ha sido guardado localmente.",
      variant: "default",
    });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeverse-lab.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga completada",
      description: "El código ha sido descargado a tu dispositivo.",
      variant: "default",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado",
      description: "El código ha sido copiado al portapapeles.",
      variant: "default",
    });
  };

  return (
    <MainLayout>
      <motion.div className="space-y-6 p-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">CodeLab IDE</h1>
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="vs-dark">Oscuro</option>
              <option value="vs-light">Claro</option>
            </select>
          </div>
        </div>

        {/* Editor y Vista Previa */}
        <motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Editor
              defaultLanguage={language}
              onCodeChange={handleCodeChange}
              code={code}
              theme={theme}
            />
            <AnimationPreview code={code} language={language} />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex gap-3 mt-4">
            <Button onClick={handleRunCode} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Ejecutando...' : 'Ejecutar'}
            </Button>
            <Button onClick={handleSaveCode}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={handleCopyCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button onClick={handleDownloadCode}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </motion.div>

        {/* Ejemplos de Código */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Ejemplos de Código</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleCodeChange(`// Ejemplo 1\nconsole.log("Hola, mundo!");`)}
              className="bg-gray-800 text-white"
            >
              Ejemplo 1
            </Button>
            <Button
              onClick={() => handleCodeChange(`// Ejemplo 2\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}`)}
              className="bg-gray-800 text-white"
            >
              Ejemplo 2
            </Button>
            <Button
              onClick={() => handleCodeChange(`// Ejemplo 3\nconst saludo = "Hola";\nalert(saludo);`)}
              className="bg-gray-800 text-white"
            >
              Ejemplo 3
            </Button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default CodeLab;