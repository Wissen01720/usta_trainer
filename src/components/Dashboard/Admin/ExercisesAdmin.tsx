import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, BookOpen, ListChecks } from 'lucide-react';
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

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestión de Problemas</h1>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-1" /> Agregar Problema
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Listado de Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center">Cargando problemas...</div>
            ) : problems.length === 0 ? (
              <div className="text-muted-foreground">No hay problemas registrados.</div>
            ) : (
              <AnimatePresence>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {problems.map(problem => (
                    <motion.div
                      key={problem.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 120, damping: 12 }}
                      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden group"
                    >
                      <div className="flex flex-col h-full">
                        <div className="relative">
                          <div className="w-full h-32 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800">
                            <BookOpen className="h-10 w-10 text-blue-400 opacity-60" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col p-4">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{problem.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">{problem.description}</p>
                          <div className="flex flex-col gap-1 mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              <b>Entrada ejemplo:</b>{" "}
                              {problem.input_example?.trim()
                                ? problem.input_example.split('\n').map((line, idx) => (
                                    <React.Fragment key={idx}>
                                      {line}
                                      <br />
                                    </React.Fragment>
                                  ))
                                : <span className="italic text-gray-400">Sin ejemplo</span>}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              <b>Salida ejemplo:</b>{" "}
                              {problem.output_example?.trim()
                                ? problem.output_example.split('\n').map((line, idx) => (
                                    <React.Fragment key={idx}>
                                      {line}
                                      <br />
                                    </React.Fragment>
                                  ))
                                : <span className="italic text-gray-400">Sin ejemplo</span>}
                            </span>
                          </div>
                          {problem.test_cases && problem.test_cases.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-semibold text-purple-600 dark:text-purple-300">Casos de prueba:</span>
                              <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc ml-4">
                                {problem.test_cases.map(tc => (
                                  <li key={tc.id}>
                                    <b>Entrada:</b> {tc.input_data} <b>→</b> <b>Salida:</b> {tc.expected_output}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex justify-end mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setSelectedProblem(problem)}
                            >
                              <ListChecks className="h-4 w-4 mr-1" /> Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

        {/* Modal para crear problema */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Agregar Problema</h2>
              <div className="space-y-2">
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Título"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.input_example}
                  onChange={e => setForm(f => ({ ...f, input_example: e.target.value }))}
                  placeholder="Ejemplo de entrada"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={form.output_example}
                  onChange={e => setForm(f => ({ ...f, output_example: e.target.value }))}
                  placeholder="Ejemplo de salida"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setShowModal(false)} disabled={creating}>Cancelar</Button>
                <Button size="sm" onClick={handleCreate} disabled={creating}>
                  {creating ? "Creando..." : "Crear"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles - Versión mejorada */}
        {selectedProblem && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{selectedProblem.title}</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">{selectedProblem.description}</p>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Entrada ejemplo:</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                  {selectedProblem.input_example?.trim() ? (
                    <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {selectedProblem.input_example}
                    </pre>
                  ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">No se proporcionó ejemplo de entrada</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salida ejemplo:</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                  {selectedProblem.output_example?.trim() ? (
                    <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {selectedProblem.output_example}
                    </pre>
                  ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">No se proporcionó ejemplo de salida</p>
                  )}
                </div>
              </div>

              {selectedProblem.test_cases && selectedProblem.test_cases.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Casos de prueba:</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                    <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-2">
                      {selectedProblem.test_cases.map(tc => (
                        <li key={tc.id} className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-0 last:pb-0">
                          <p><span className="font-semibold">Entrada:</span> {tc.input_data}</p>
                          <p><span className="font-semibold">Salida esperada:</span> {tc.expected_output}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <Button size="sm" variant="outline" onClick={() => setSelectedProblem(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExercisesAdmin;