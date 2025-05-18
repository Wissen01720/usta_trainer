import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Trophy, BookOpen, Users, ChevronRight, Lock, UserPlus } from 'lucide-react';


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Elegante */}
      <nav className="bg-[#2E3A4D] text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="bg-[#A78BFA] p-2 rounded-full group-hover:bg-[#9061F9] transition"
            >
              <Code className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold">CodeMaster</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/challenges" className="hover:text-[#A78BFA] transition flex items-center">
              <span>Desafíos</span>
            </Link>
            <Link to="/learn" className="hover:text-[#A78BFA] transition flex items-center">
              <span>Aprender</span>
            </Link>
            <Link to="/community" className="hover:text-[#A78BFA] transition flex items-center">
              <span>Comunidad</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-[#2E3A4D] transition flex items-center"
            >
              <Lock className="h-4 w-4 mr-2" />
              Ingresar
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md bg-[#A78BFA] hover:bg-[#9061F9] text-white transition flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#2E3A4D] to-[#3E4A5D] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              Domina el arte del código <br />
              <span className="text-[#A78BFA]">con desafíos reales</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl mb-10 max-w-3xl mx-auto opacity-90"
            >
              La plataforma preferida por estudiantes universitarios para mejorar sus habilidades de programación
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col md:flex-row justify-center gap-4"
            >
              <Link
                to="/"
                className="px-8 py-3 bg-[#F472B6] hover:bg-[#E262A6] rounded-lg text-white font-medium shadow-lg transition transform hover:scale-105 flex items-center justify-center"
              >
                Explorar desafíos <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/learn"
                className="px-8 py-3 border-2 border-white hover:bg-white hover:text-[#2E3A4D] rounded-lg font-medium transition flex items-center justify-center"
              >
                Ver tutoriales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-[#2E3A4D] mb-4"
            >
              ¿Por qué elegir CodeMaster?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Diseñado específicamente para las necesidades de los estudiantes universitarios
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="h-8 w-8 text-[#A78BFA]" />}
              title="Desafíos prácticos"
              description="Problemas reales que enfrentarás en tu carrera como desarrollador"
              color="purple"
            />

            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-[#F472B6]" />}
              title="Aprendizaje guiado"
              description="Recursos educativos diseñados por profesores universitarios"
              color="pink"
            />

            <FeatureCard
              icon={<Users className="h-8 w-8 text-[#6C757D]" />}
              title="Comunidad activa"
              description="Conecta con otros estudiantes y resuelve dudas"
              color="gray"
            />
          </div>
        </div>
      </section>

      {/* Challenge Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-[#2E3A4D] mb-4"
            >
              Desafíos de ejemplo
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Echa un vistazo a los tipos de problemas que resolverás
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ChallengeCard
              title="Palíndromos"
              difficulty="Principiante"
              language="Python"
              description="Escribe una función que determine si una palabra es palíndromo"
            />

            <ChallengeCard
              title="Ordenamiento personalizado"
              difficulty="Intermedio"
              language="JavaScript"
              description="Implementa un algoritmo de ordenamiento con criterios específicos"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/challenges"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#2E3A4D] hover:bg-[#1E2A3D] transition"
            >
              Ver todos los desafíos <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <StatCard
              value="10,000+"
              label="Estudiantes activos"
              icon={<Users className="h-8 w-8 text-[#A78BFA]" />}
            />

            <StatCard
              value="500+"
              label="Desafíos disponibles"
              icon={<Code className="h-8 w-8 text-[#F472B6]" />}
            />

            <StatCard
              value="98%"
              label="Satisfacción reportada"
              icon={<Trophy className="h-8 w-8 text-[#6C757D]" />}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E3A4D] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#A78BFA] p-2 rounded-full">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">CodeMaster</span>
              </div>
              <p className="text-gray-300">
                La plataforma de desafíos de programación para estudiantes universitarios.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Desafíos</h3>
              <ul className="space-y-2">
                <li><Link to="/challenges/beginner" className="text-gray-300 hover:text-[#A78BFA] transition">Principiantes</Link></li>
                <li><Link to="/challenges/intermediate" className="text-gray-300 hover:text-[#A78BFA] transition">Intermedios</Link></li>
                <li><Link to="/challenges/advanced" className="text-gray-300 hover:text-[#A78BFA] transition">Avanzados</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><Link to="/learn" className="text-gray-300 hover:text-[#A78BFA] transition">Tutoriales</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-[#A78BFA] transition">Blog</Link></li>
                <li><Link to="/community" className="text-gray-300 hover:text-[#A78BFA] transition">Comunidad</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Cuenta</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-300 hover:text-[#A78BFA] transition">Iniciar sesión</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-[#A78BFA] transition">Registrarse</Link></li>
                <li><Link to="/forgot-password" className="text-gray-300 hover:text-[#A78BFA] transition">Recuperar contraseña</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CodeMaster. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">Privacidad</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">Términos</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componentes reutilizables
type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "purple" | "pink" | "gray";
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color = "purple" }) => {
  const colors: Record<"purple" | "pink" | "gray", { bg: string; text: string }> = {
    purple: {
      bg: "bg-[#A78BFA]/10",
      text: "text-[#A78BFA]",
    },
    pink: {
      bg: "bg-[#F472B6]/10",
      text: "text-[#F472B6]",
    },
    gray: {
      bg: "bg-[#6C757D]/10",
      text: "text-[#6C757D]",
    },
  };

  return (
    <motion.div
      variants={fadeIn}
      className={`p-8 rounded-xl ${colors[color].bg} hover:shadow-md transition`}
      whileHover={{ y: -5 }}
    >
      <div className={`w-12 h-12 rounded-lg ${colors[color].bg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2E3A4D] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

type ChallengeCardProps = {
  title: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  language: string;
  description: string;
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, difficulty, language, description }) => {
  const difficultyColors: Record<"Principiante" | "Intermedio" | "Avanzado", string> = {
    Principiante: "bg-green-100 text-green-800",
    Intermedio: "bg-yellow-100 text-yellow-800",
    Avanzado: "bg-red-100 text-red-800",
  };

  return (
    <motion.div
      variants={fadeIn}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-[#2E3A4D]">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{language}</span>
        <Link to="/login" className="text-sm text-[#A78BFA] hover:underline flex items-center">
          Resolver <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

type StatCardProps = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-md transition"
      whileHover={{ y: -5 }}
    >
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
        {icon}
      </div>
      <div className="text-3xl font-bold text-[#2E3A4D] mb-2">{value}</div>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

export default Home;