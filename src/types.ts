/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParsedItem {
  date?: string;
  invoiceNumber?: string;
  name?: string;
  productName?: string;
  batchNumber?: string;
  expiry?: string;
  qty?: number | string;
  rate?: number | string;
  city?: string;
  amount?: number | string;
  [key: string]: any;
}

export interface ExtractionResult {
  items: ParsedItem[];
  _columns?: string[];
}

export interface FileExtraction {
  id: string;
  fileName: string;
  items: ParsedItem[];
  status: 'loading' | 'completed' | 'error';
  error?: string;
  errorDetails?: string;
  currentPage?: number;
  totalPages?: number;
}
