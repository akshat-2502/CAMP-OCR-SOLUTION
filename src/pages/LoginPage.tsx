import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function LoginPage({ isAdminLogin = false }: { isAdminLogin?: boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    if (user.role === 'admin') {
       return <Navigate to="/admin" />;
    }
    return <Navigate to="/demo" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isAdminLogin ? '/api/auth/admin/login' : '/api/auth/login';
      const response = await axios.post(endpoint, { username, password });
      login(response.data.token, response.data.user);
      
      const from = (location.state as any)?.from?.pathname || (isAdminLogin ? '/admin' : '/demo');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-full pt-20 px-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isAdminLogin ? 'Admin Login' : 'Sign in to Demo'}
        </h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              value={username} onChange={e => setUsername(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
            {isAdminLogin ? 'Sign In as Admin' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {isAdminLogin ? (
            <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Return to Demo Login
            </button>
          ) : (
            <button onClick={() => navigate('/admin/login')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Access Admin Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
