/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Tab } from '../../constants';

interface HeroProps {
  onLaunchDemo: () => void;
}

export function Hero({ onLaunchDemo }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-white dark:bg-slate-900 transition-colors">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Pharma Intelligence Portal</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]"
          >
            Track Your <br />
            <span className="text-primary italic">Pharma Sales</span> <br />
            Automatically.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl"
          >
            CMP IT Solutions provides automated data extraction for pharmaceutical companies. 
            Convert bulk sales analysis reports and stockist invoices into structured reports instantly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button 
              onClick={onLaunchDemo}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center gap-2"
            >
              Process Sales Records <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
              View IT Services
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
