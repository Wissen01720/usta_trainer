import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Code2 } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Problem } from './ExercisesAdmin';

interface Props {
  problems: Problem[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  setShowModal: (v: boolean) => void;
  filteredProblems: Problem[];
  clearSearch: () => void;
}

const searchBarVariants = {
  hidden: { opacity: 0, width: 0, scale: 0.8 },
  visible: {
    opacity: 1, width: "auto", scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

const ExercisesHeader: React.FC<Props> = ({
  problems, searchTerm, setSearchTerm, showSearch, setShowSearch, setShowModal,
}) => (
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
);

export default ExercisesHeader;