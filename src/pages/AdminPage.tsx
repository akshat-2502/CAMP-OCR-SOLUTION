import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';

export function AdminPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'admin' && token) {
      fetchUsers();
    }
  }, [user, token]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load users');
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/admin/users', { username: newUsername, password: newPassword });
      setSuccess('User created successfully');
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4 pb-20">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm self-start">
          <h2 className="text-xl font-semibold mb-4">Create User</h2>
          {error && <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-2 rounded text-sm mb-4">{success}</div>}
          
          <form onSubmit={createUser} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input 
                className="w-full px-3 py-2 border rounded dark:bg-slate-800 dark:border-gray-700 focus:outline-none" 
                value={newUsername} 
                onChange={e => setNewUsername(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input 
                className="w-full px-3 py-2 border rounded dark:bg-slate-800 dark:border-gray-700 focus:outline-none" 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create App Demo User
            </button>
          </form>
        </div>

        <div className="md:col-span-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden h-fit">
          <h2 className="text-xl font-semibold p-6 border-b dark:border-gray-800">Demo Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-sm">Username</th>
                  <th className="px-6 py-3 font-semibold text-sm">ID</th>
                  <th className="px-6 py-3 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{u._id}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No users found. Create one to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
