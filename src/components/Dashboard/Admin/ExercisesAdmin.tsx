import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, BookOpen, ListChecks, Search, X, Filter, Code2, Trophy, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Problem {
  id: number;
  title: string;
  description: string;
  input_example: string;
  output_example: string;
  test_cases?: TestCase[];
}

interface TestCase {
  id: number;
  input_data: string;
  expected_output: string;
  problem_id: number;
}

const API_URL = import.meta.env.VITE_REACT_APP_JUDGE_URL || 'https://virtualjudge.onrender.com';

const ExercisesAdmin: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    input_example: '',
    output_example: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/problems`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProblems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [showModal]);

  // Filtrar problemas basado en el término de búsqueda
  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return problems;
    
    const term = searchTerm.toLowerCase();
    return problems.filter(problem =>
      problem.title.toLowerCase().includes(term) ||
      problem.description.toLowerCase().includes(term) ||
      problem.input_example?.toLowerCase().includes(term) ||
      problem.output_example?.toLowerCase().includes(term) ||
      problem.test_cases?.some(tc => 
        tc.input_data.toLowerCase().includes(term) ||
        tc.expected_output.toLowerCase().includes(term)
      )
    );
  }, [problems, searchTerm]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al crear el problema');
        setCreating(false);
        return;
      }
      setShowModal(false);
      setForm({
        title: '',
        description: '',
        input_example: '',
        output_example: ''
      });
    } catch {
      alert('Error al crear el problema');
    }
    setCreating(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearch(false);
  };

  // Animaciones para las cards
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15 
    },
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
        duration: 0.6
      }
    }),
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateY: 2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const searchBarVariants = {
    hidden: {
      opacity: 0,
      width: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      width: "auto",
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <MainLayout role="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="space-y-8 p-6">
          {/* Header mejorado */}
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
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg"
              >
                <Code2 className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestión de Problemas
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {problems.length} problema{problems.length !== 1 ? 's' : ''} disponible{problems.length !== 1 ? 's' : ''}
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
                      placeholder="Buscar problemas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
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
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" /> Agregar Problema
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Problemas</p>
                  <p className="text-2xl font-bold text-blue-600">{problems.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-500 opacity-60" />
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Filtrados</p>
                  <p className="text-2xl font-bold text-purple-600">{filteredProblems.length}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-500 opacity-60" />
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Con Casos de Prueba</p>
                  <p className="text-2xl font-bold text-green-600">
                    {problems.filter(p => p.test_cases && p.test_cases.length > 0).length}
                  </p>
                </div>
                <ListChecks className="h-8 w-8 text-green-500 opacity-60" />
              </div>
            </div>
          </motion.div>

          {/* Resultados de búsqueda */}
          {searchTerm && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700"
            >
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {filteredProblems.length} resultado{filteredProblems.length !== 1 ? 's' : ''} para "{searchTerm}"
              </span>
              <button
                onClick={clearSearch}
                className="ml-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Grid de problemas mejorado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
                            {/* Header con gradiente */}
                            <div className="relative h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
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
                                  {problem.test_cases.length} test{problem.test_cases.length !== 1 ? 's' : ''}
                                </motion.div>
                              )}
                            </div>

                            {/* Contenido */}
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

                              {/* Mini preview de ejemplos */}
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

                              {/* Botón de acción */}
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
          </motion.div>

          {/* Modal para crear problema - Mejorado */}
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
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agregar Problema</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título del problema
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Describe el problema que debe resolverse..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ejemplo de entrada
                      </label>
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono"
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
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
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
                            Crear Problema
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal de detalles - Completamente rediseñado */}
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
                  {/* Header del modal */}
                  <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedProblem.title}</h2>
                          <p className="text-blue-100 text-sm">Detalles del problema</p>
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
                  
                  {/* Contenido del modal */}
                  <div className="p-8 space-y-8">
                    {/* Descripción */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Descripción del Problema
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedProblem.description}
                      </p>
                    </motion.div>

                    {/* Ejemplos en grid */}
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
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
                      >
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Salida Ejemplo
                        </h3>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
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
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Estadísticas del Problema</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">ID</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{selectedProblem.id}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedProblem.test_cases?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Casos de Prueba</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedProblem.description.length}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Caracteres</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedProblem.input_example && selectedProblem.output_example ? '✓' : '✗'}
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
        </div>
      </div>
    </MainLayout>
  );
};

export default ExercisesAdmin;