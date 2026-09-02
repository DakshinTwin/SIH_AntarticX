'use client';

import React from 'react';
import { StationState, RiskLevel } from '@/lib/types';

interface DependencyGraphProps {
  station: StationState;
}

const riskColors: Record<RiskLevel, { bg: string; border: string; text: string; dot: string }> = {
  LOW: { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#10B981' },
  MODERATE: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', dot: '#F59E0B' },
  HIGH: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#EF4444' },
  CRITICAL: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#EF4444' },
};

function getNodeRisk(station: StationState, nodeId: string): RiskLevel {
  const b = station.risk.breakdown;
  switch (nodeId) {
    case 'weather': return b.weather >= 11 ? 'HIGH' : b.weather >= 6 ? 'MODERATE' : 'LOW';
    case 'heating': return b.heating >= 9 ? 'HIGH' : b.heating >= 5 ? 'MODERATE' : 'LOW';
    case 'power': return b.power >= 15 ? 'CRITICAL' : b.power >= 10 ? 'HIGH' : b.power >= 5 ? 'MODERATE' : 'LOW';
    case 'fuel': return b.fuel >= 11 ? 'HIGH' : b.fuel >= 6 ? 'MODERATE' : 'LOW';
    case 'water': return b.water >= 5 ? 'HIGH' : b.water >= 3 ? 'MODERATE' : 'LOW';
    case 'logistics': return b.logistics >= 5 ? 'HIGH' : b.logistics >= 3 ? 'MODERATE' : 'LOW';
    case 'comm': return b.communication >= 5 ? 'HIGH' : 'LOW';
    case 'risk': return station.risk.level;
    default: return 'LOW';
  }
}

function NodeBox({ label, value, risk, x, y }: { label: string; value: string; risk: RiskLevel; x: number; y: number }) {
  const c = riskColors[risk];
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-75} y={-22} width={150} height={44} rx={8} fill={c.bg} stroke={c.border} strokeWidth={1.5} filter="drop-shadow(0 1px 2px rgba(0,0,0,0.03))" />
      <circle cx={-60} cy={-5} r={3} fill={c.dot} className={risk === 'CRITICAL' ? 'risk-pulse' : ''} />
      <text x={-48} y={-1} textAnchor="start" fill={c.text} fontSize={10} fontFamily="Montserrat, sans-serif" fontWeight={700}>
        {label}
      </text>
      <text x={0} y={13} textAnchor="middle" fill={c.text} fontSize={9} fontFamily="JetBrains Mono, monospace" opacity={0.9}>
        {value}
      </text>
    </g>
  );
}

function FlowArrow({ x1, y1, x2, y2, risk }: { x1: number; y1: number; x2: number; y2: number; risk: RiskLevel }) {
  const color = riskColors[risk].border;
  const isElevated = risk === 'HIGH' || risk === 'CRITICAL';
  const animClass = isElevated ? 'animate-flow-dash-fast' : 'animate-flow-dash';

  return (
    <g>
      {/* Background solid line */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} opacity={0.25} markerEnd="url(#dep-arrowhead)" />
      {/* Flowing animated dash line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={isElevated ? 2.5 : 2}
        className={animClass}
        opacity={isElevated ? 0.95 : 0.7}
      />
    </g>
  );
}

export default function DependencyGraph({ station }: DependencyGraphProps) {
  const s = station;
  const weatherRisk = getNodeRisk(s, 'weather');
  const heatingRisk = getNodeRisk(s, 'heating');
  const powerRisk = getNodeRisk(s, 'power');
  const fuelRisk = getNodeRisk(s, 'fuel');
  const waterRisk = getNodeRisk(s, 'water');
  const logRisk = getNodeRisk(s, 'logistics');
  const commRisk = getNodeRisk(s, 'comm');
  const stationRisk = getNodeRisk(s, 'risk');

  return (
    <div className="bg-panel rounded-lg border border-border-color p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-xs tracking-wide text-primary-text flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-iceberg rounded-full" />
          CROSS-DOMAIN DEPENDENCY PROPAGATION
        </h3>
        <span className="text-[9px] font-mono text-muted-text flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-frost animate-ping" />
          LIVE PROPAGATION
        </span>
      </div>

      <svg viewBox="0 0 600 340" className="w-full" style={{ maxHeight: 340 }}>
        <defs>
          <marker id="dep-arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#6B7280" />
          </marker>
        </defs>

        {/* Primary chain: Weather → Heating → Power → Fuel → Station Risk */}
        <FlowArrow x1={150} y1={52} x2={150} y2={98} risk={heatingRisk} />
        <FlowArrow x1={150} y1={142} x2={150} y2={188} risk={powerRisk} />
        <FlowArrow x1={150} y1={232} x2={150} y2={278} risk={fuelRisk} />
        <FlowArrow x1={225} y1={300} x2={340} y2={300} risk={stationRisk} />

        {/* Secondary: Power → Water */}
        <FlowArrow x1={225} y1={210} x2={365} y2={145} risk={waterRisk} />
        {/* Water → Risk */}
        <FlowArrow x1={440} y1={162} x2={440} y2={278} risk={stationRisk} />

        {/* Logistics → Risk */}
        <FlowArrow x1={440} y1={82} x2={440} y2={118} risk={logRisk} />

        {/* Comm → Risk */}
        <FlowArrow x1={510} y1={232} x2={480} y2={278} risk={commRisk} />

        {/* Nodes */}
        <NodeBox label="WEATHER" value={`${s.environment.temperature}°C • ${s.environment.windSpeed} km/h`} risk={weatherRisk} x={150} y={30} />
        <NodeBox label="HEATING" value={`Demand: ${s.heating.demandPercent}%`} risk={heatingRisk} x={150} y={120} />
        <NodeBox label="POWER" value={`Headroom: ${s.power.capacityHeadroomPercent.toFixed(1)}%`} risk={powerRisk} x={150} y={210} />
        <NodeBox label="FUEL" value={`Reserve: ${s.fuel.reservePercent}%`} risk={fuelRisk} x={150} y={300} />

        <NodeBox label="LOGISTICS" value={s.inventory.generatorSpare === 'AVAILABLE' ? 'Spares: Nominal' : 'Spares: Constrained'} risk={logRisk} x={440} y={60} />
        <NodeBox label="WATER" value={`Vuln: ${s.water.vulnerabilityPercent}%`} risk={waterRisk} x={440} y={140} />
        <NodeBox label="COMMS" value={s.communication.status} risk={commRisk} x={520} y={210} />

        <NodeBox label="STATION RISK" value={`RISK ${s.risk.overallScore.toFixed(1)}% (${s.risk.level})`} risk={stationRisk} x={420} y={300} />
      </svg>
    </div>
  );
}
