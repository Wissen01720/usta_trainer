import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

const ForgotPasswordForm: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Realiza la petición real a la API para cambiar la contraseña
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!usernameOrEmail || !newPassword || !confirm) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (newPassword !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsLoading(true);

    try {
        const res = await fetch(`${API_URL}/api/v1/users/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username_or_email: usernameOrEmail,
            new_password: newPassword
        })
        });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.detail || 'No se pudo cambiar la contraseña. Intenta de nuevo.');
        setIsLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('No se pudo cambiar la contraseña. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2E3A4D] via-[#3E4A5D] to-[#1E2A3D]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-gradient-to-r from-[#A78BFA] to-[#F472B6] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Restablecer Contraseña</h2>
            <p className="text-white/90 mt-1">Ingresa tu usuario/correo y tu nueva contraseña</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg text-center">
                Contraseña cambiada correctamente. Redirigiendo...
              </div>
            )}
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-white/80 mb-1">
                Usuario o Correo
              </label>
              <div className="relative">
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="Tu usuario o correo"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-white/80 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-white/80 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
                  placeholder="Confirma tu contraseña"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A78BFA] transition-all ${
                isLoading ? 'bg-[#A78BFA]/70 cursor-not-allowed' : 'bg-[#A78BFA] hover:bg-[#9061F9] hover:shadow-lg'
              }`}
            >
              {isLoading ? 'Guardando...' : (
                <>
                  Cambiar Contraseña
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;