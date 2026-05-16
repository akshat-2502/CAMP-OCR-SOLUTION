/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface UrlSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlSection({ onSubmit, isLoading }: UrlSectionProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onSubmit(url);
      setUrl('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="p-4 bg-primary/10 rounded-full text-primary">
          <Globe className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Extract from Hosted PDF</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Paste a link to a pharma report or sales analysis document to begin AI parsing.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="url" 
          required
          placeholder="https://example.com/report.pdf"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-primary transition-colors font-mono text-sm text-gray-900 dark:text-white"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="px-6 py-4 bg-primary text-white rounded-2xl font-bold disabled:opacity-50"
        >
          Parse
        </button>
      </form>
    </div>
  );
}
