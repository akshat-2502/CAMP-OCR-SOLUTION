/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileSpreadsheet, Zap, Shield, Server, Box, Globe } from 'lucide-react';

export const FEATURES = [
  { 
    icon: React.createElement(FileSpreadsheet, { className: "w-6 h-6" }), 
    title: "Bulk Sales OCR", 
    desc: "Convert handwritten or complex pharmaceutical sales PDFs into clean, organized Excel databases." 
  },
  { 
    icon: React.createElement(Zap, { className: "w-6 h-6" }), 
    title: "Smart Batching", 
    desc: "Upload multiple PDF files at once. Our AI processes them in parallel to build comprehensive reports." 
  },
  { 
    icon: React.createElement(Shield, { className: "w-6 h-6" }), 
    title: "Pharma Compliance", 
    desc: "Built for data integrity. Securely process stockist data and inventory lists for official auditing." 
  },
  { 
    icon: React.createElement(Server, { className: "w-6 h-6" }), 
    title: "IT Infrastructure", 
    desc: "CMP IT Solutions provides end-to-end cloud and software solutions for pharmaceutical enterprises." 
  },
  { 
    icon: React.createElement(Box, { className: "w-6 h-6" }), 
    title: "Structured Reports", 
    desc: "Generate professional sales summaries and pharmaceutical documents from raw PDF data automatically." 
  },
  { 
    icon: React.createElement(Globe, { className: "w-6 h-6" }), 
    title: "URL Integration", 
    desc: "Paste any hosted PDF link and extract its content without even downloading the file." 
  }
];

export type Tab = 'home' | 'demo';
export type DemoMode = 'upload' | 'url';
