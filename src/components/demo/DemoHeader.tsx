/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { DemoMode } from '../../constants';

interface DemoHeaderProps {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
}

export function DemoHeader({ mode, setMode }: DemoHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Tracker Demo</h2>
        <p className="text-gray-500 dark:text-gray-400">Bulk upload your pharma sales reports or paste links</p>
      </div>
      
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setMode('upload')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'upload' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-400'}`}
        >
          <Upload className="w-4 h-4" /> Bulk Pharma PDFs
        </button>
        <button 
          onClick={() => setMode('url')}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'url' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-400'}`}
        >
          <LinkIcon className="w-4 h-4" /> PDF from URL
        </button>
      </div>
    </div>
  );
}
