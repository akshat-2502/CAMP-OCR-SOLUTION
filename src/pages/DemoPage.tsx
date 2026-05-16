/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { usePharmaExtraction } from '../hooks/usePharmaExtraction';
import { DemoHeader } from '../components/demo/DemoHeader';
import { FileUploader } from '../components/FileUploader';
import { UrlSection } from '../components/demo/UrlSection';
import { ExtractionItem } from '../components/demo/ExtractionItem';
import { DemoMode } from '../constants';

export function DemoPage() {
  const [demoMode, setDemoMode] = React.useState<DemoMode>('upload');
  
  const {
    extractions,
    expandedIds,
    isLoading,
    error,
    toggleAccordion,
    handleFilesSelect,
    handleUrlSubmit,
    setError
  } = usePharmaExtraction();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-xs font-bold uppercase tracking-wider hover:underline">Dismiss</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DemoHeader mode={demoMode} setMode={setDemoMode} />

      <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <AnimatePresence mode="wait">
          {demoMode === 'upload' ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FileUploader onFilesSelect={handleFilesSelect} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div 
              key="url"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <UrlSection onSubmit={handleUrlSubmit} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {extractions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-8"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Extractions</h3>
            {extractions.map((extraction) => (
              <ExtractionItem 
                key={extraction.id}
                extraction={extraction}
                isExpanded={expandedIds.includes(extraction.id)}
                onToggle={() => toggleAccordion(extraction.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
