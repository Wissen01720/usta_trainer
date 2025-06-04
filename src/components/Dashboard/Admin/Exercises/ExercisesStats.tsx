import React from 'react';
import { Trophy, Filter, ListChecks } from 'lucide-react';
import { Problem } from './ExercisesAdmin';

interface Props {
  problems: Problem[];
  filteredProblems: Problem[];
}

const ExercisesStats: React.FC<Props> = ({ problems, filteredProblems }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
  </div>
);

export default ExercisesStats;