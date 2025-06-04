import React from "react";

const LessonsLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
    <p className="text-lg text-gray-600">Cargando lecciones...</p>
  </div>
);

export default LessonsLoading;