/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void;
  isLoading: boolean;
}

export function FileUploader({ onFilesSelect, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => (f as File).type === 'application/pdf') as File[];
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      onFilesSelect(files);
    } else {
      alert('Please upload PDF files.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => (f as File).type === 'application/pdf') as File[];
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      onFilesSelect(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors duration-200 ease-in-out ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-800'
        } ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          multiple
        />
        
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Click or drag Pharma Sales PDFs</p>
            <p className="text-sm text-gray-500">Supports bulk upload of sales records, invoices, and analysis reports</p>
          </div>
        </label>

        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-2">
              {selectedFiles.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] text-gray-900 dark:text-gray-100">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
