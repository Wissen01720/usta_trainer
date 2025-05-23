import React, { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import UsersAdmin from "./UsersAdmin";
import { Button } from "../../ui/button";
import { Settings, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

const SETTINGS_KEY = 'usta_trainer_settings';

const AdminDashboard: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'student',
    status: 'active'
  });
  const [refreshUsers, setRefreshUsers] = useState(0);

  // Estado para el modal de configuración del sistema
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'USTA Trainer',
    allowRegistration: true,
    theme: 'dark'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
      // Aplica el tema guardado
      document.documentElement.classList.toggle('dark', JSON.parse(saved).theme === 'dark');
    }
  }, []);

  // Cambia el tema en tiempo real
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const handleCreate = async () => {
    if (!form.password || form.password !== form.confirm_password) {
      alert('Las contraseñas no coinciden o están vacías.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          role: form.role,
          status: form.status
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.detail || 'Error al crear el usuario');
        setCreating(false);
        return;
      }
      setShowCreate(false);
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'student',
        status: 'active'
      });
      setRefreshUsers(r => r + 1);
    } catch {
      alert('Error al crear el usuario');
    }
    setCreating(false);
  };

  // Guardar configuración del sistema en localStorage y aplicar cambios
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Aplica el tema inmediatamente
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    setTimeout(() => {
      setSavingSettings(false);
      setShowSettings(false);
    }, 500);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{settings.platformName || 'Admin Dashboard'}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-1" /> System Settings
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <UserPlus className="h-4 w-4 mr-1" /> Add User
            </Button>
          </div>
        </div>

        {/* Solo gestión de usuarios */}
        <UsersAdmin refresh={refreshUsers} />
      </div>

      {/* Modal para crear usuario */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Crear Usuario</h2>
            <div className="space-y-2">
              <input
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                placeholder="Nombre"
              />
              <input
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                placeholder="Apellido"
              />
              <input
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email"
                type="email"
              />
              <input
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Contraseña"
                type="password"
              />
              <input
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.confirm_password}
                onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))}
                placeholder="Confirmar Contraseña"
                type="password"
              />
              <select
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <input
                className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                placeholder="Estado"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setShowCreate(false)} disabled={creating}>Cancelar</Button>
              <Button size="sm" onClick={handleCreate} disabled={creating}>
                {creating ? "Creando..." : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración del sistema */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Configuración del Sistema</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Nombre de la Plataforma
                </label>
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={settings.platformName}
                  onChange={e => setSettings(s => ({ ...s, platformName: e.target.value }))}
                  placeholder="Nombre de la plataforma"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={e => setSettings(s => ({ ...s, allowRegistration: e.target.checked }))}
                  />
                  Permitir registro de nuevos usuarios
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Tema
                </label>
                <select
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={settings.theme}
                  onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))}
                >
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setShowSettings(false)} disabled={savingSettings}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveSettings} disabled={savingSettings}>
                {savingSettings ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminDashboard;