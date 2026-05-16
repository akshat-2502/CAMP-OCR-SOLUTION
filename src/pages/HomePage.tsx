/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/layout/Hero';
import { Features } from '../components/layout/Features';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      <Hero onLaunchDemo={() => navigate('/demo')} />
      <Features />
    </div>
  );
}
