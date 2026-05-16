/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import axios from 'axios';
import { extractDataFromPDF, extractDataFromText } from '../services/geminiService';
import { processPdfInBatches } from '../services/pdfProcessor';
import { FileExtraction } from '../types';

export function usePharmaExtraction() {
  const [extractions, setExtractions] = useState<FileExtraction[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const processFile = async (file: File, id: string) => {
      try {
        // Step 1: Extract all page texts
        let allPages: string[] = [];
        await processPdfInBatches(
            file,
            () => {},
            async (pageNumber, text) => {
                allPages.push(text);
                setExtractions(prev => prev.map(ext => 
                    ext.id === id ? { ...ext, totalPages: allPages.length, currentPage: pageNumber } : ext
                ));
            }
        );
        

        // Step 2 & 3: Process Pages
        let currentRetailer: string = 'Unknown';
        let currentCity: string = 'Unknown';
        let previousColumns: string[] | undefined = undefined;
        
        for (let i = 0; i < allPages.length; i++) {
            let pageText = allPages[i];
            
            let result: any;
            let retries = 10;
            let delayMs = 2000;
            while (retries > 0) {
                try {
                    result = await extractDataFromText(pageText, previousColumns);
                    break;
                } catch (error: any) {
                    const isRetryableError = !String(error?.message || '').includes('400') && !String(error?.message || '').includes('401');
                    if (isRetryableError && retries > 1) {
                        console.warn(`Retryable error on page ${i + 1}. Retrying... in ${delayMs / 1000}s (${retries} attempts left). Error details: ${error?.message || error}`);
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                        retries--;
                        delayMs += 2000;
                    } else {
                        throw error;
                    }
                }
            }
            
            if (!result) continue; // Should not happen, but satisfies type checker

            // Capture columns from the first successful page to pass to subsequent pages
            if (!previousColumns && result._columns && result._columns.length > 0) {
                previousColumns = result._columns;
            }
            
            const resultItems = Array.isArray(result) ? result : Array.isArray(result?.items) ? result.items : [];
            
            const itemsWithContext = resultItems.map(item => {
                if (item.name && item.name.trim() !== '') {
                    currentRetailer = item.name.trim();
                }
                if (item.city && item.city.trim() !== '') {
                    currentCity = item.city.trim();
                }
                
                return {
                    ...item,
                    name: item.name && item.name.trim() !== '' ? item.name.trim() : currentRetailer,
                    city: item.city && item.city.trim() !== '' ? item.city.trim() : currentCity
                };
            });
            
            setExtractions(prev => prev.map(ext => 
                ext.id === id ? { ...ext, items: [...ext.items, ...itemsWithContext], currentPage: i + 1 } : ext
            ));
        }
        
        setExtractions(prev => prev.map(ext => 
          ext.id === id ? { ...ext, status: 'completed' } : ext
        ));
      } catch (err: any) {
        console.error(err);
        setExtractions(prev => prev.map(ext => 
          ext.id === id ? { ...ext, status: 'error', error: 'Failed to extract', errorDetails: err.message } : ext
        ));
      }
  };

  const handleFilesSelect = async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newExtractions: FileExtraction[] = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        items: [],
        status: 'loading'
      }));

      setExtractions(prev => [...newExtractions, ...prev]);

      // Process files one by one to avoid overwhelming API limits
      for (const file of files) {
          const extraction = newExtractions.find(ext => ext.fileName === file.name)!;
          await processFile(file, extraction.id);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during file selection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    const fileName = url.split('/').pop() || 'remote_file.pdf';
    const id = Math.random().toString(36).substr(2, 9);

    setExtractions(prev => [
      { id, fileName, items: [], status: 'loading' },
      ...prev,
    ]);

    try {
      const response = await axios.get(`/api/fetch-pdf?url=${encodeURIComponent(url)}`);
      
      let result;
      let retries = 10;
      let delayMs = 2000;
      while (retries > 0) {
        try {
          result = await extractDataFromPDF(response.data.base64, fileName);
          break;
        } catch (error: any) {
          const isRetryableError = !String(error?.message || '').includes('400') && !String(error?.message || '').includes('401');
          if (isRetryableError && retries > 1) {
            console.warn(`Retryable error on remote PDF. Retrying... in ${delayMs / 1000}s (${retries} attempts left). Error details: ${error?.message || error}`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            retries--;
            delayMs += 2000;
          } else {
            throw error;
          }
        }
      }

      if (!result) throw new Error('Failed to extract data');
      
      const resultItems = Array.isArray(result) ? result : Array.isArray(result?.items) ? result.items : [];
      
      setExtractions(prev => prev.map(ext => 
        ext.id === id ? { ...ext, items: resultItems, status: 'completed' } : ext
      ));
      setExpandedIds(prev => [...prev, id]);
    } catch (err: any) {
      console.error(err);
      setExtractions(prev => prev.map(ext => 
        ext.id === id ? { ...ext, status: 'error', error: 'Failed to fetch PDF', errorDetails: err.message } : ext
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    extractions,
    expandedIds,
    isLoading,
    error,
    toggleAccordion,
    handleFilesSelect,
    handleUrlSubmit,
    setError
  };
}
