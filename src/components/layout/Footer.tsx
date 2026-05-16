/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-20 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
           <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CMP IT Solutions</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Helping pharmaceutical companies modernize their data infrastructure with state-of-the-art AI parsing and IT management services.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white">Portal</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/" className="hover:text-primary cursor-pointer">Home</Link></li>
            <li><Link to="/demo" className="hover:text-primary cursor-pointer">Demo</Link></li>
            <li className="hover:text-primary cursor-pointer">Security</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>support@cmp-it.com</li>
            <li>Pharma IT Requirements</li>
            <li>Enterprise AI Consulting</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">
        © 2026 CMP IT Solutions • Intelligent Pharma Systems
      </div>
    </footer>
  );
}
