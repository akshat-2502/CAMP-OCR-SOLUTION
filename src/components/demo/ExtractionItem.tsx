/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileExtraction } from '../../types';
import { DataTable } from '../DataTable';

interface ExtractionItemProps {
  extraction: FileExtraction;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ExtractionItem: React.FC<ExtractionItemProps> = ({ extraction, isExpanded, onToggle }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {extraction.status === 'loading' ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : extraction.status === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
          <div className="text-left">
            <p className="text-sm font-semibold truncate max-w-sm">{extraction.fileName}</p>
            <p className="text-xs text-gray-500">
              {extraction.status === 'loading' 
                ? (extraction.totalPages ? `Processing page ${extraction.currentPage} / ${extraction.totalPages}` : 'Processing...') 
                : extraction.status === 'error' 
                  ? extraction.error 
                  : `${extraction.items.length} items found`}
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-slate-900/50">
              {extraction.status === 'completed' ? (
                <DataTable data={extraction.items} isLoading={false} />
              ) : extraction.status === 'loading' ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-gray-500">
                    {extraction.totalPages ? `Extracting page ${extraction.currentPage} of ${extraction.totalPages}...` : 'Starting extraction...'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 text-sm space-y-2">
                  <p className="font-semibold">There was an error processing this file.</p>
                  <p>{extraction.error}</p>
                  {extraction.errorDetails && (
                    <pre className="bg-red-100 dark:bg-red-900/20 p-2 rounded text-xs overflow-auto">
                      {extraction.errorDetails}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
