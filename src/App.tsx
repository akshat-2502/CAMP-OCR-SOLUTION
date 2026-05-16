/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppRoutes } from './routes';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePharmaExtraction } from './hooks/usePharmaExtraction';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] text-[#1A1C1E] dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col">
          <Navbar 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
          />

          <main className="flex-1">
            <AppRoutes />
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
