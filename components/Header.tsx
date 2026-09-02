'use client';

import React from 'react';
import { RiskLevel } from '@/lib/types';
import AntarcticaLogo from './AntarcticaLogo';

type Page = 'overview' | 'bharati' | 'maitri' | 'combined' | 'what-if';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  bharatiRisk: RiskLevel;
  maitriRisk: RiskLevel;
  bharatiScore?: number;
  maitriScore?: number;
}

const navItems: { key: Page; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'bharati', label: 'Bharati' },
  { key: 'maitri', label: 'Maitri' },
  { key: 'combined', label: 'Combined Ops' },
  { key: 'what-if', label: 'What-If' },
];

export default function Header({
  currentPage,
  onNavigate,
  bharatiRisk,
  maitriRisk,
  bharatiScore = 11.5,
  maitriScore = 19.8,
}: HeaderProps) {
  const maxScore = Math.max(bharatiScore, maitriScore);
  const globalRisk: RiskLevel =
    maxScore >= 75.0 ? 'CRITICAL' :
    maxScore >= 50.0 ? 'HIGH' :
    maxScore >= 25.0 ? 'MODERATE' : 'LOW';

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ========================================================= */}
        {/* TOP LEFT BRANDING (Like attached reference)               */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 select-none flex-shrink-0">
          {/* Antarctic silhouette logo in iceberg blue */}
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <AntarcticaLogo size={32} color="#648BA8" />
          </div>

          <div className="flex flex-col">
            {/* DAKSHIN-Twin refined two-tone typography */}
            <div className="flex items-baseline gap-0.5 leading-none">
              <span className="font-heading font-bold text-[17px] tracking-tight text-[#1E293B]">
                DAKSHIN
              </span>
              <span className="font-heading font-semibold text-[17px] tracking-tight text-[#648BA8]">
                -Twin
              </span>
            </div>

            {/* Subtitle: ANTARCTIC OPERATIONS INTELLIGENCE */}
            <span className="text-[8.5px] font-mono tracking-[0.18em] text-[#64748B] font-medium uppercase mt-0.5">
              ANTARCTIC OPERATIONS INTELLIGENCE
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER NAVIGATION (Pill highlight as in reference image 2)*/}
        {/* ========================================================= */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map(item => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-[#CBE7F6] text-[#1E293B] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-gray-100/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* RIGHT SIDE STATUS (Minimal, lightweight, subtle)          */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Connected Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-[#475569]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 font-medium">CONNECTED</span>
          </div>

          {/* Global Risk */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-[11px] font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                globalRisk === 'CRITICAL' || globalRisk === 'HIGH'
                  ? 'bg-rose-500'
                  : globalRisk === 'MODERATE'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="text-gray-700">
              RISK <strong className="font-semibold">{maxScore.toFixed(1)}%</strong>
            </span>
          </div>

          {/* Simulated Prototype Badge */}
          <div className="hidden md:flex items-center px-2 py-0.5 rounded bg-purple-50 border border-purple-200/60 text-[10px] font-mono text-purple-700 font-medium">
            SIMULATED PROTOTYPE
          </div>
        </div>
      </div>
    </header>
  );
}
