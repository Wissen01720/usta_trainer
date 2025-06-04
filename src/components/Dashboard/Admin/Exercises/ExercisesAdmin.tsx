import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '../../../Layout/MainLayout';
import ExercisesHeader from './ExercisesHeader';
import ExercisesStats from './ExercisesStats';
import ExercisesList from './ExercisesList';
import CreateProblemModal from './CreateProblemModal';
import ProblemDetailsModal from './ProblemDetailsModal';

export interface TestCase {
  id: number;
  input_data: string;
  expected_output: string;
  problem_id: number;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  input_example: string;
  output_example: string;
  test_cases?: TestCase[];
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

  return (
    <MainLayout role="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="space-y-8 p-6">
          <ExercisesHeader
            problems={problems}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setShowModal={setShowModal}
            filteredProblems={filteredProblems}
            clearSearch={clearSearch}
          />
          <ExercisesStats problems={problems} filteredProblems={filteredProblems} />
          <ExercisesList
            loading={loading}
            filteredProblems={filteredProblems}
            searchTerm={searchTerm}
            clearSearch={clearSearch}
            setSelectedProblem={setSelectedProblem}
          />
          <CreateProblemModal
            showModal={showModal}
            setShowModal={setShowModal}
            form={form}
            setForm={setForm}
            creating={creating}
            handleCreate={handleCreate}
          />
          <ProblemDetailsModal
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ExercisesAdmin;