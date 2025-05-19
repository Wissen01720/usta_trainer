import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Search } from 'lucide-react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface UsersAdminProps {
  refresh?: number;
}

const UsersAdmin: React.FC<UsersAdminProps> = ({ refresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/v1/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) {
          console.error('Status:', res.status, 'Respuesta:', text);
          throw new Error('Error fetching users');
        }
        try {
          return JSON.parse(text);
        } catch {
          console.error('Respuesta no es JSON:', text);
          throw new Error('Respuesta no es JSON');
        }
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudo cargar la lista de usuarios.');
        setLoading(false);
        console.error('Error al cargar usuarios:', err);
      });
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refresh]);

  // Filtro de usuarios por nombre, apellido o correo
  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  // Paginación: solo mostrar los primeros 10
  const usersToShow = filteredUsers.slice((page - 1) * 10, page * 10);
  const totalPages = Math.ceil(filteredUsers.length / 10);

  const handleEdit = (user: User) => setEditingUser(user);

  const handleSave = () => {
    if (!editingUser) return;
    fetch(`${API_URL}/api/v1/users/${editingUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
      body: JSON.stringify({
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error updating user');
        fetchUsers();
        setEditingUser(null);
      })
      .catch(() => alert('Error al guardar los cambios'));
  };

  const handleDelete = (userId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    fetch(`${API_URL}/api/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error deleting user');
        fetchUsers();
      })
      .catch(() => alert('Error al eliminar el usuario'));
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
        <Button className="ml-4" size="sm" onClick={fetchUsers}>Reintentar</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold">Gestión de Usuarios</CardTitle>
          <Button size="sm" variant="outline" onClick={fetchUsers}>Recargar</Button>
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ color: "#222" }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {usersToShow.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            No hay usuarios que coincidan con la búsqueda.
          </div>
        )}
        {usersToShow.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full bg-white dark:bg-gray-900">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Correo</th>
                  <th className="py-2 px-4 text-left">Rol</th>
                  <th className="py-2 px-4 text-left">Estado</th>
                  <th className="py-2 px-4 text-left">Registrado</th>
                  <th className="py-2 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usersToShow.map(user => (
                  <tr key={user.id} className="border-t text-black dark:text-white">
                    <td className="py-2 px-4 font-medium">{user.first_name} {user.last_name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      <Badge variant="outline" className={
                        user.role === 'student' ? 'bg-blue-200 text-blue-900 dark:bg-blue-300 dark:text-blue-900' :
                        user.role === 'teacher' ? 'bg-green-200 text-green-900 dark:bg-green-300 dark:text-green-900' :
                        'bg-purple-200 text-purple-900 dark:bg-purple-300 dark:text-purple-900'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-2 px-4">{user.status}</td>
                    <td className="py-2 px-4">{user.created_at?.split('T')[0]}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button>
            <span className="text-sm">{page} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</Button>
          </div>
        )}
        {/* Modal de edición */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Editar Usuario</h2>
              <div className="space-y-2">
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={editingUser.first_name}
                  onChange={e => setEditingUser({ ...editingUser, first_name: e.target.value })}
                  placeholder="Nombre"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={editingUser.last_name}
                  onChange={e => setEditingUser({ ...editingUser, last_name: e.target.value })}
                  placeholder="Apellido"
                />
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="Email"
                />
                <select
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={editingUser.role}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  className="w-full border rounded px-2 py-1 bg-gray-100 text-black dark:bg-gray-200 dark:text-gray-900"
                  value={editingUser.status}
                  onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                  placeholder="Estado"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
                <Button size="sm" onClick={handleSave}>Guardar</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersAdmin;