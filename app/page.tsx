'use client';

import React, { useState, useMemo } from 'react';
import { calculateFullState } from '@/lib/simulationEngine';
import { bharatiBaselineInputs, maitriBaselineInputs } from '@/lib/mockData';
import Header from '@/components/Header';
import Overview from '@/components/Overview';
import StationPage from '@/components/StationPage';
import CombinedOperations from '@/components/CombinedOperations';
import WhatIfSimulator from '@/components/WhatIfSimulator';

type Page = 'overview' | 'bharati' | 'maitri' | 'combined' | 'what-if';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');

  // Compute live state from separate baseline inputs
  const bharatiLive = useMemo(() => calculateFullState(bharatiBaselineInputs, 'bharati'), []);
  const maitriLive = useMemo(() => calculateFullState(maitriBaselineInputs, 'maitri'), []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        bharatiRisk={bharatiLive.risk.level}
        maitriRisk={maitriLive.risk.level}
        bharatiScore={bharatiLive.risk.overallScore}
        maitriScore={maitriLive.risk.overallScore}
      />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 pb-8">
        {currentPage === 'overview' && (
          <Overview bharati={bharatiLive} maitri={maitriLive} onNavigate={setCurrentPage} />
        )}
        {currentPage === 'bharati' && (
          <StationPage station={bharatiLive} inputs={bharatiBaselineInputs} />
        )}
        {currentPage === 'maitri' && (
          <StationPage station={maitriLive} inputs={maitriBaselineInputs} />
        )}
        {currentPage === 'combined' && (
          <CombinedOperations bharati={bharatiLive} maitri={maitriLive} />
        )}
        {currentPage === 'what-if' && (
          <WhatIfSimulator bharatiLive={bharatiLive} maitriLive={maitriLive} />
        )}
      </main>
      <footer className="border-t border-border-color py-3 text-center bg-white/50 backdrop-blur-sm">
        <p className="text-xs text-muted-text font-mono">
          DAKSHIN-Twin • Antarctic Station Operations Intelligence • SIH 2026 #26060 • SIMULATED PROTOTYPE
        </p>
      </footer>
    </div>
  );
}
