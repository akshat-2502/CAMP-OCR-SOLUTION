/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { Brain, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const activeTab = location.pathname === '/' ? 'home' : (location.pathname === '/demo' ? 'demo' : (location.pathname === '/admin' ? 'admin' : ''));

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">CMP IT Solutions</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Pharma IT Division</p>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors mr-2"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <Link 
            to="/"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-gray-100 dark:bg-slate-800 text-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Home
          </Link>

          {user?.role === 'admin' && (
            <Link 
              to="/admin"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-gray-100 dark:bg-slate-800 text-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Admin Panel
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/demo"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'demo' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Launch Demo
              </Link>
              <button
                onClick={logout}
                className="ml-2 flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all bg-primary text-white shadow-lg shadow-primary/20`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
