/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { FEATURES } from '../../constants';

export function Features() {
  return (
    <section className="py-24 bg-[#F8F9FA] dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-primary w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
