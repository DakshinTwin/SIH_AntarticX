'use client';

import React from 'react';
import { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  LOW: { bg: 'bg-healthy/10', text: 'text-healthy', border: 'border-healthy/30', dot: 'bg-healthy' },
  MODERATE: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  HIGH: { bg: 'bg-critical/10', text: 'text-critical', border: 'border-critical/30', dot: 'bg-critical' },
  CRITICAL: { bg: 'bg-critical/10', text: 'text-critical', border: 'border-critical/30', dot: 'bg-critical' },
};

export function RiskBadge({ level, score, size = 'sm', showScore = false }: RiskBadgeProps) {
  const c = riskConfig[level];
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-mono font-medium ${c.bg} ${c.text} ${c.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${level === 'CRITICAL' ? 'risk-pulse' : ''}`} />
      {showScore && score !== undefined ? (
        <span>RISK {score.toFixed(1)}% <span className="opacity-80">({level})</span></span>
      ) : (
        <span>{level} RISK</span>
      )}
    </span>
  );
}

interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: RiskLevel;
  icon?: React.ReactNode;
  subtitle?: string;
  isSimulatedEstimate?: boolean;
}

export function TelemetryCard({ label, value, unit, status, icon, subtitle, isSimulatedEstimate }: TelemetryCardProps) {
  return (
    <div className="bg-panel rounded-lg border border-border-color p-4">
      <div className="flex items-start justify-between mb-1">
        <span className="text-[11px] text-muted-text uppercase tracking-wide font-medium">{label}</span>
        {icon && <span className="text-muted-text">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-mono font-semibold text-primary-text">{value}</span>
        {unit && <span className="text-xs font-mono text-muted-text">{unit}</span>}
      </div>
      {status && <div className="mt-1.5"><RiskBadge level={status} /></div>}
      {subtitle && <p className="text-[10px] text-muted-text mt-1">{subtitle}</p>}
      {isSimulatedEstimate && (
        <p className="text-[9px] font-mono text-simulation mt-1 uppercase tracking-wide">SIMULATED ESTIMATE</p>
      )}
    </div>
  );
}

interface StatusIndicatorProps {
  label: string;
  status: 'RUNNING' | 'FAILED' | 'ONLINE' | 'OFFLINE' | 'NORMAL' | 'DEGRADED' | 'AVAILABLE' | 'LOW' | 'UNAVAILABLE' | string;
}

const statusColors: Record<string, string> = {
  RUNNING: 'bg-healthy text-white',
  ONLINE: 'bg-healthy text-white',
  NORMAL: 'bg-healthy text-white',
  AVAILABLE: 'bg-healthy text-white',
  DEGRADED: 'bg-warning text-white',
  LOW: 'bg-warning text-white',
  FAILED: 'bg-critical text-white',
  OFFLINE: 'bg-critical text-white',
  UNAVAILABLE: 'bg-critical text-white',
};

export function StatusIndicator({ label, status }: StatusIndicatorProps) {
  const color = statusColors[status] || 'bg-muted-text text-white';
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-text">{label}</span>
      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${color}`}>{status}</span>
    </div>
  );
}

export function SectionHeader({ title, subtitle, accent = false }: { title: string; subtitle?: string; accent?: boolean }) {
  return (
    <div className={`mb-4 pb-2 border-b ${accent ? 'border-iceberg' : 'border-border-color'}`}>
      <h2 className={`font-heading font-bold text-sm tracking-wide ${accent ? 'text-primary-text' : 'text-primary-text'}`}>
        {accent && <span className="inline-block w-1 h-4 bg-iceberg rounded-full mr-2 align-middle" />}
        {title}
      </h2>
      {subtitle && <p className="text-[10px] text-muted-text mt-0.5 tracking-wide">{subtitle}</p>}
    </div>
  );
}

export function SimulatedBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-simulation/10 border border-simulation/20">
      <span className="text-[9px] font-mono text-simulation font-medium tracking-wide">SIMULATED PROTOTYPE DATA</span>
    </div>
  );
}
