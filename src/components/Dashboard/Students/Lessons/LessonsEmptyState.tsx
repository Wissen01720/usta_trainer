import React from "react";

interface LessonsEmptyStateProps {
  setSearchTerm: (term: string) => void;
  setActiveCategory: (category: string) => void;
}

const LessonsEmptyState: React.FC<LessonsEmptyStateProps> = ({
  setSearchTerm,
  setActiveCategory,
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <img
      src="/images/empty-state.svg"
      alt="Sin resultados"
      className="w-40 h-40 mb-6"
    />
    <h2 className="text-2xl font-semibold mb-2">¡No encontramos lecciones!</h2>
    <p className="text-gray-600 mb-4 text-center">
      Prueba buscando con otras palabras o selecciona otra categoría.
    </p>
    <div className="flex gap-2">
      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        onClick={() => setSearchTerm("")}
      >
        Limpiar búsqueda
      </button>
      <button
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        onClick={() => setActiveCategory("Todos")}
      >
        Todas las categorías
      </button>
    </div>
  </div>
);

export default LessonsEmptyState;