'use client';

import React from 'react';
import { StationState } from '@/lib/types';

interface StationSchematicProps {
  station: StationState;
}

const statusColor = (ok: boolean) => ok ? '#10B981' : '#EF4444';
const statusBg = (ok: boolean) => ok ? '#ECFDF5' : '#FEF2F2';

export default function StationSchematic({ station }: StationSchematicProps) {
  const g1Ok = station.power.generator1.status === 'RUNNING';
  const g2Ok = station.power.generator2.status === 'RUNNING';
  const commOk = station.communication.status === 'ONLINE';
  const waterOk = station.water.status === 'NORMAL';
  const fuelOk = station.fuel.fuelRisk === 'LOW' || station.fuel.fuelRisk === 'MODERATE';
  const heatingOk = station.heating.thermalRisk === 'LOW' || station.heating.thermalRisk === 'MODERATE';
  const powerOk = station.power.capacityHeadroomPercent > 15;

  return (
    <div className="bg-panel rounded-lg border border-border-color p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-xs tracking-wide text-primary-text flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-glacier rounded-full" />
          2D STATION PHYSICAL INFRASTRUCTURE SCHEMATIC
        </h3>
        <span className="text-[9px] font-mono text-muted-text">
          Cap: {station.power.installedCapacityKW} kW
        </span>
      </div>

      <svg viewBox="0 0 560 270" className="w-full" style={{ maxHeight: 270 }}>
        {/* Power bus line */}
        <line x1={130} y1={70} x2={430} y2={70} stroke={powerOk ? '#10B981' : '#EF4444'} strokeWidth={2.5} strokeDasharray={powerOk ? '' : '4 4'} />
        <text x={280} y={60} textAnchor="middle" fill="#6B7280" fontSize={8.5} fontFamily="JetBrains Mono" fontWeight="600">
          MAIN 415V BUS • {station.power.totalGenerationKW} kW GENERATION • {station.power.capacityHeadroomPercent.toFixed(1)}% HEADROOM
        </text>

        {/* Generator 1 */}
        <rect x={15} y={35} width={105} height={60} rx={6} fill={statusBg(g1Ok)} stroke={statusColor(g1Ok)} strokeWidth={1.5} />
        <text x={67} y={54} textAnchor="middle" fill={g1Ok ? '#065F46' : '#991B1B'} fontSize={9.5} fontWeight={700} fontFamily="Montserrat">GEN 1 (125 kW)</text>
        <text x={67} y={68} textAnchor="middle" fill={g1Ok ? '#065F46' : '#991B1B'} fontSize={8.5} fontFamily="JetBrains Mono" fontWeight="600">{g1Ok ? 'RUNNING' : 'FAILED'}</text>
        <text x={67} y={82} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">{station.power.generator1.outputKW} kW ({station.power.generator1.load}%)</text>

        {/* Generator 2 */}
        <rect x={440} y={35} width={105} height={60} rx={6} fill={statusBg(g2Ok)} stroke={statusColor(g2Ok)} strokeWidth={1.5} />
        <text x={492} y={54} textAnchor="middle" fill={g2Ok ? '#065F46' : '#991B1B'} fontSize={9.5} fontWeight={700} fontFamily="Montserrat">GEN 2 (125 kW)</text>
        <text x={492} y={68} textAnchor="middle" fill={g2Ok ? '#065F46' : '#991B1B'} fontSize={8.5} fontFamily="JetBrains Mono" fontWeight="600">{g2Ok ? 'RUNNING' : 'FAILED'}</text>
        <text x={492} y={82} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">{station.power.generator2.outputKW} kW ({station.power.generator2.load}%)</text>

        {/* Fuel Storage */}
        <rect x={15} y={120} width={105} height={50} rx={6} fill={statusBg(fuelOk)} stroke={statusColor(fuelOk)} strokeWidth={1.5} />
        <text x={67} y={138} textAnchor="middle" fill={fuelOk ? '#065F46' : '#991B1B'} fontSize={9.5} fontWeight={700} fontFamily="Montserrat">FUEL TANKS</text>
        <text x={67} y={152} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">{station.fuel.reservePercent}% • {station.fuel.consumptionLPerHr.toFixed(1)} L/h</text>
        <text x={67} y={163} textAnchor="middle" fill="#8B5CF6" fontSize={6.5} fontFamily="JetBrains Mono">SIMULATED EST.</text>
        <line x1={67} y1={95} x2={67} y2={120} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3" />

        {/* Heating Loop */}
        <rect x={155} y={120} width={105} height={50} rx={6} fill={statusBg(heatingOk)} stroke={statusColor(heatingOk)} strokeWidth={1.5} />
        <text x={207} y={138} textAnchor="middle" fill={heatingOk ? '#065F46' : '#991B1B'} fontSize={9.5} fontWeight={700} fontFamily="Montserrat">THERMAL LOOP</text>
        <text x={207} y={152} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">Demand: {station.heating.demandPercent}%</text>
        <text x={207} y={163} textAnchor="middle" fill="#6B7280" fontSize={7} fontFamily="JetBrains Mono">Mode: {station.heating.mode}</text>
        <line x1={207} y1={70} x2={207} y2={120} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3" />

        {/* Water Treatment */}
        <rect x={295} y={120} width={105} height={50} rx={6} fill={statusBg(waterOk)} stroke={statusColor(waterOk)} strokeWidth={1.5} />
        <text x={347} y={138} textAnchor="middle" fill={waterOk ? '#065F46' : '#991B1B'} fontSize={9.5} fontWeight={700} fontFamily="Montserrat">WATER LOOP</text>
        <text x={347} y={152} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">{station.water.status}</text>
        <text x={347} y={163} textAnchor="middle" fill="#6B7280" fontSize={7} fontFamily="JetBrains Mono">Vuln: {station.water.vulnerabilityPercent}%</text>
        <line x1={347} y1={70} x2={347} y2={120} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3" />

        {/* Communication Node */}
        <rect x={440} y={120} width={105} height={50} rx={6} fill={statusBg(commOk)} stroke={statusColor(commOk)} strokeWidth={1.5} />
        <text x={492} y={138} textAnchor="middle" fill={commOk ? '#065F46' : '#991B1B'} fontSize={9.5} fontWeight={700} fontFamily="Montserrat">SATCOM</text>
        <text x={492} y={152} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">{station.communication.status}</text>
        <text x={492} y={163} textAnchor="middle" fill="#6B7280" fontSize={7} fontFamily="JetBrains Mono">{commOk ? 'SYNCED' : 'EDGE ACTIVE'}</text>
        <line x1={492} y1={95} x2={492} y2={120} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3" />

        {/* Research & Living Modules */}
        <rect x={155} y={200} width={245} height={50} rx={6} fill="#F0F9FF" stroke="#BCE1F4" strokeWidth={1.5} />
        <text x={277} y={222} textAnchor="middle" fill="#2D3436" fontSize={9.5} fontWeight={700} fontFamily="Montserrat">RESEARCH &amp; HABITATION QUARTERS</text>
        <text x={277} y={238} textAnchor="middle" fill="#6B7280" fontSize={8} fontFamily="JetBrains Mono">Station Load Demand: {station.power.currentDemandKW} kW</text>
        <line x1={207} y1={170} x2={207} y2={200} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3" />
        <line x1={347} y1={170} x2={347} y2={200} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="3" />
      </svg>
    </div>
  );
}
