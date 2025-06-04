import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '../../../Layout/MainLayout';
import ExercisesHeader from './ExercisesHeader';
import ExercisesStats from './ExercisesStats';
import ExercisesGrid from './ExercisesGrid';
import CreateExerciseModal from './CreateExerciseModal';
import ExerciseDetailModal from './ExerciseDetailModal';
import type { Problem, ProblemForm } from './types';

const API_URL = import.meta.env.VITE_REACT_APP_JUDGE_URL || 'https://virtualjudge.onrender.com';

const initialForm: ProblemForm = {
  title: '',
  description: '',
  input_example: '',
  output_example: '',
  difficulty: 'medium',
  tags: [],
  newTag: ''
};

const ExercisesTeacher: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [form, setForm] = useState<ProblemForm>({ ...initialForm });

  useEffect(() => {
    setLoading(true);
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

  // Filtrar problemas basado en el término de búsqueda y filtros
  const filteredProblems = useMemo(() => {
    let filtered = problems;
    if (activeFilter !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === activeFilter);
    }
    if (!searchTerm.trim()) return filtered;
    const term = searchTerm.toLowerCase();
    return filtered.filter(problem =>
      problem.title.toLowerCase().includes(term) ||
      problem.description.toLowerCase().includes(term) ||
      (problem.input_example && problem.input_example.toLowerCase().includes(term)) ||
      (problem.output_example && problem.output_example.toLowerCase().includes(term)) ||
      (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(term))) ||
      (problem.test_cases && problem.test_cases.some(tc =>
        tc.input_data.toLowerCase().includes(term) ||
        tc.expected_output.toLowerCase().includes(term)
      ))
    );
  }, [problems, searchTerm, activeFilter]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          input_example: form.input_example,
          output_example: form.output_example,
          difficulty: form.difficulty,
          tags: form.tags
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al crear el problema');
        setCreating(false);
        return;
      }
      setShowModal(false);
      setForm({ ...initialForm });
    } catch {
      alert('Error al crear el problema');
    }
    setCreating(false);
  };

  const addTag = () => {
    setForm((f: ProblemForm) => {
      if (f.newTag.trim() && !f.tags.includes(f.newTag.trim())) {
        return { ...f, tags: [...f.tags, f.newTag.trim()], newTag: '' };
      }
      return f;
    });
  };

  const removeTag = (tagToRemove: string) => {
    setForm((f: ProblemForm) => ({
      ...f,
      tags: f.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearch(false);
  };

  return (
    <MainLayout role="teacher">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="space-y-8 p-6">
          <ExercisesHeader
            problems={problems}
            filteredProblems={filteredProblems}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onNewExercise={() => setShowModal(true)}
            clearSearch={clearSearch}
          />

          <ExercisesStats problems={problems} />

          <ExercisesGrid
            loading={loading}
            filteredProblems={filteredProblems}
            searchTerm={searchTerm}
            clearSearch={clearSearch}
            setShowModal={setShowModal}
            setSelectedProblem={setSelectedProblem}
          />

          <CreateExerciseModal
            showModal={showModal}
            setShowModal={setShowModal}
            form={form}
            setForm={setForm}
            creating={creating}
            handleCreate={handleCreate}
            addTag={addTag}
            removeTag={removeTag}
          />

          <ExerciseDetailModal
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ExercisesTeacher;