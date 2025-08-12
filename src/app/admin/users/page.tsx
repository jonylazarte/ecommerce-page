'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth');
      return;
    }

    fetchUsers();
  }, [user, token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'USER' | 'ADMIN') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chinese-black-900 chinese-bg flex items-center justify-center">
        <div className="text-chinese-red-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chinese-black-900 chinese-bg">
      {/* Header */}
      <div className="bg-chinese-black-800 border-b border-chinese-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white chinese-text">Gestionar Usuarios</h1>
            <Link href="/admin" className="text-chinese-red-400 hover:text-chinese-red-300 transition-colors">
              ← Volver al panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Users Table */}
        <div className="bg-chinese-black-800 rounded-lg border border-chinese-red-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-chinese-black-700 border-b border-chinese-red-500/30">
                  <th className="text-left py-4 px-6 text-chinese-red-300">ID</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Nombre</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Email</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Rol</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Fecha de Registro</th>
                  <th className="text-left py-4 px-6 text-chinese-red-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id} className="border-b border-chinese-red-500/20 hover:bg-chinese-black-700">
                    <td className="py-4 px-6 text-white font-mono">#{userItem.id}</td>
                    <td className="py-4 px-6 text-white font-medium">{userItem.name}</td>
                    <td className="py-4 px-6 text-chinese-red-300">{userItem.email}</td>
                    <td className="py-4 px-6">
                      <select
                        value={userItem.role}
                        onChange={(e) => updateUserRole(userItem.id, e.target.value as 'USER' | 'ADMIN')}
                        className={`px-2 py-1 rounded-full text-xs border-none focus:outline-none ${
                          userItem.role === 'ADMIN' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-chinese-red-300">
                      {new Date(userItem.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-4 px-6">
                      {userItem.id !== user?.id && (
                        <button
                          onClick={() => deleteUser(userItem.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

