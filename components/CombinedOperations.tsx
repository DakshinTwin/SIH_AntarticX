'use client';

import React, { useState } from 'react';
import { StationState, StationId } from '@/lib/types';
import { RiskBadge, TelemetryCard, SimulatedBadge, SectionHeader, StatusIndicator } from './UIComponents';
import {
  Shield, AlertTriangle, Wifi, WifiOff, Zap, Fuel, Thermometer, Wind,
  Building2, MapPin, Radio, Activity, CheckCircle, Clock, Server, ArrowRight
} from 'lucide-react';

interface CombinedOperationsProps {
  bharati: StationState;
  maitri: StationState;
}

function StationOpsCard({ station }: { station: StationState }) {
  const commOk = station.communication.status === 'ONLINE';
  const criticalAlerts = station.alerts.filter(a => a.severity === 'CRITICAL');

  return (
    <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-color">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-iceberg" />
            <h3 className="font-heading font-bold text-lg text-primary-text">{station.stationName.toUpperCase()}</h3>
          </div>
          <p className="text-[10px] text-muted-text font-mono tracking-wide mt-0.5">
            {station.stationId === 'bharati' ? 'LARSEMANN HILLS • 69°24′S' : 'SCHIRMACHER OASIS • 70°46′S'}
          </p>
        </div>
        <RiskBadge level={station.risk.level} score={station.risk.overallScore} showScore size="md" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Power Headroom */}
        <div className="bg-panel rounded-lg p-3 border border-border-color/60">
          <p className="text-[10px] text-muted-text font-semibold uppercase mb-0.5">POWER HEADROOM</p>
          <p className="font-mono font-bold text-sm text-primary-text">{station.power.capacityHeadroomPercent.toFixed(1)}%</p>
          <p className="text-[9px] font-mono text-muted-text">
            {station.power.totalGenerationKW} kW gen / {station.power.currentDemandKW} kW load
          </p>
        </div>

        {/* Fuel */}
        <div className="bg-panel rounded-lg p-3 border border-border-color/60">
          <p className="text-[10px] text-muted-text font-semibold uppercase mb-0.5">FUEL ENDURANCE</p>
          <p className="font-mono font-bold text-sm text-primary-text">{station.fuel.estimatedEnduranceDays.toFixed(1)} days</p>
          <p className="text-[9px] font-mono text-muted-text">
            {station.fuel.reservePercent}% reserve ({station.fuel.consumptionLPerHr.toFixed(1)} L/hr)
          </p>
        </div>

        {/* Weather */}
        <div className="bg-panel rounded-lg p-3 border border-border-color/60">
          <p className="text-[10px] text-muted-text font-semibold uppercase mb-0.5">WEATHER METRICS</p>
          <p className="font-mono font-bold text-sm text-primary-text">{station.environment.temperature}°C</p>
          <p className="text-[9px] font-mono text-muted-text">
            {station.environment.windSpeed} km/h • {station.environment.weatherSeverity}
          </p>
        </div>

        {/* Carrier Link */}
        <div className="bg-panel rounded-lg p-3 border border-border-color/60">
          <p className="text-[10px] text-muted-text font-semibold uppercase mb-0.5">CARRIER LINK</p>
          <div className="flex items-center gap-1.5">
            {commOk ? <Wifi className="w-3.5 h-3.5 text-healthy" /> : <WifiOff className="w-3.5 h-3.5 text-critical" />}
            <span className={`font-mono font-bold text-sm ${commOk ? 'text-healthy' : 'text-critical'}`}>
              {station.communication.status}
            </span>
          </div>
          <p className="text-[9px] font-mono text-muted-text mt-0.5">
            {commOk ? 'SYNCED' : `${station.communication.pendingSyncEvents} pending`}
          </p>
        </div>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="bg-critical/5 border border-critical/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-critical" />
            <span className="text-[10px] text-critical font-bold uppercase">
              {criticalAlerts.length} CRITICAL ALERT{criticalAlerts.length > 1 ? 'S' : ''}
            </span>
          </div>
          {criticalAlerts.map(a => (
            <p key={a.id} className="text-[11px] text-muted-text font-body truncate">
              • <span className="font-medium text-primary-text">{a.title}:</span> {a.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CombinedOperations({ bharati, maitri }: CombinedOperationsProps) {
  const [selectedNode, setSelectedNode] = useState<'goa' | 'bharati' | 'maitri' | 'link-b' | 'link-m'>('goa');

  const bOnline = bharati.communication.status === 'ONLINE';
  const mOnline = maitri.communication.status === 'ONLINE';

  return (
    <div className="py-6 fade-in">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-primary-text tracking-wide">
            COMBINED OPERATIONS
          </h1>
          <p className="text-xs text-muted-text tracking-widest uppercase">
            NCPOR / GOA REMOTE COMMAND &amp; ANTARCTIC COMMUNICATIONS NETWORK
          </p>
        </div>
        <SimulatedBadge />
      </div>

      {/* Side-by-Side Station Operational Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StationOpsCard station={bharati} />
        <StationOpsCard station={maitri} />
      </div>

      {/* NCPOR Operations Network — Prominent Centerpiece */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-color">
          <div>
            <h2 className="font-heading font-bold text-base text-primary-text flex items-center gap-2">
              <span className="w-1.5 h-4 bg-frost rounded-full" />
              NCPOR OPERATIONS NETWORK TOPOLOGY
            </h2>
            <p className="text-[11px] text-muted-text mt-0.5">
              Interactive dual-polar station satellite routing, packet buffering, and edge state synchronization
            </p>
          </div>
          <div className="text-[10px] font-mono text-muted-text bg-panel px-2.5 py-1 rounded border border-border-color">
            Click nodes or carriers to inspect telemetry
          </div>
        </div>

        {/* Large SVG Network Diagram */}
        <div className="bg-panel rounded-xl p-6 border border-border-color/80 mb-4 overflow-x-auto">
          <svg viewBox="0 0 800 380" className="w-full min-w-[700px]" style={{ maxHeight: 380 }}>
            <defs>
              <linearGradient id="mainlandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F0F9FF" />
              </linearGradient>
              <linearGradient id="bharatiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor={bharati.risk.level === 'CRITICAL' ? '#FEF2F2' : '#F0FDF4'} />
              </linearGradient>
              <linearGradient id="maitriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor={maitri.risk.level === 'CRITICAL' ? '#FEF2F2' : '#F0FDF4'} />
              </linearGradient>
            </defs>

            {/* Connecting Carrier Lines */}
            {/* Goa to Bharati */}
            <g onClick={() => setSelectedNode('link-b')} className="cursor-pointer">
              <path
                d="M 360 85 C 360 170, 200 170, 200 230"
                fill="none"
                stroke={bOnline ? '#10B981' : '#EF4444'}
                strokeWidth={selectedNode === 'link-b' ? 3.5 : 2.5}
                strokeDasharray={bOnline ? '6 4' : '3 3'}
                className={bOnline ? 'animate-pulse' : ''}
              />
              <rect x="230" y="150" width="110" height="24" rx="4" fill="#FFFFFF" stroke={bOnline ? '#10B981' : '#EF4444'} strokeWidth="1" />
              <text x="285" y="165" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill={bOnline ? '#065F46' : '#991B1B'} fontWeight="600">
                {bOnline ? 'VSAT / 128 kbps' : 'CARRIER OFFLINE'}
              </text>
            </g>

            {/* Goa to Maitri */}
            <g onClick={() => setSelectedNode('link-m')} className="cursor-pointer">
              <path
                d="M 440 85 C 440 170, 600 170, 600 230"
                fill="none"
                stroke={mOnline ? '#10B981' : '#EF4444'}
                strokeWidth={selectedNode === 'link-m' ? 3.5 : 2.5}
                strokeDasharray={mOnline ? '6 4' : '3 3'}
                className={mOnline ? 'animate-pulse' : ''}
              />
              <rect x="460" y="150" width="110" height="24" rx="4" fill="#FFFFFF" stroke={mOnline ? '#10B981' : '#EF4444'} strokeWidth="1" />
              <text x="515" y="165" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill={mOnline ? '#065F46' : '#991B1B'} fontWeight="600">
                {mOnline ? 'IRIDIUM / 64 kbps' : 'CARRIER OFFLINE'}
              </text>
            </g>

            {/* Top: NCPOR Goa Center Node */}
            <g onClick={() => setSelectedNode('goa')} className="cursor-pointer">
              <rect
                x="280" y="15" width="240" height="70" rx="10"
                fill="url(#mainlandGrad)"
                stroke={selectedNode === 'goa' ? '#8B5CF6' : '#BCE1F4'}
                strokeWidth={selectedNode === 'goa' ? 2.5 : 1.5}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
              />
              <text x="400" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Montserrat" fill="#2D3436">
                NCPOR / GOA
              </text>
              <text x="400" y="54" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#6B7280">
                MAINLAND OPERATIONS CENTER
              </text>
              <text x="400" y="70" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono" fill="#10B981" fontWeight="600">
                ● 2 SATELLITE LINKS ACTIVE
              </text>
            </g>

            {/* Bottom Left: Bharati Station Node */}
            <g onClick={() => setSelectedNode('bharati')} className="cursor-pointer">
              <rect
                x="60" y="230" width="280" height="135" rx="10"
                fill="url(#bharatiGrad)"
                stroke={selectedNode === 'bharati' ? '#8B5CF6' : (bOnline ? '#10B981' : '#EF4444')}
                strokeWidth={selectedNode === 'bharati' ? 2.5 : 1.5}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
              />
              <text x="200" y="255" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Montserrat" fill="#2D3436">
                BHARATI STATION
              </text>
              <text x="200" y="272" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#6B7280">
                RISK: {bharati.risk.overallScore.toFixed(1)}% • {bharati.risk.level}
              </text>
              <line x1="80" y1="282" x2="320" y2="282" stroke="#E5E7EB" strokeWidth="1" />
              
              <text x="80" y="300" fontSize="9" fontFamily="JetBrains Mono" fill="#6B7280">
                POWER: {bharati.power.totalGenerationKW} kW / {bharati.power.currentDemandKW} kW ({bharati.power.capacityHeadroomPercent.toFixed(1)}% headroom)
              </text>
              <text x="80" y="318" fontSize="9" fontFamily="JetBrains Mono" fill="#6B7280">
                FUEL: {bharati.fuel.reservePercent}% ({bharati.fuel.estimatedEnduranceDays.toFixed(1)} days endurance)
              </text>
              <text x="80" y="336" fontSize="9" fontFamily="JetBrains Mono" fill="#6B7280">
                WEATHER: {bharati.environment.temperature}°C • {bharati.environment.windSpeed} km/h
              </text>
              <text x="80" y="354" fontSize="9" fontFamily="JetBrains Mono" fill={bOnline ? '#10B981' : '#EF4444'} fontWeight="600">
                LINK: {bOnline ? 'ONLINE • SYNCHRONIZED' : 'OFFLINE • EDGE AUTONOMOUS'}
              </text>
            </g>

            {/* Bottom Right: Maitri Station Node */}
            <g onClick={() => setSelectedNode('maitri')} className="cursor-pointer">
              <rect
                x="460" y="230" width="280" height="135" rx="10"
                fill="url(#maitriGrad)"
                stroke={selectedNode === 'maitri' ? '#8B5CF6' : (mOnline ? '#10B981' : '#EF4444')}
                strokeWidth={selectedNode === 'maitri' ? 2.5 : 1.5}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
              />
              <text x="600" y="255" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Montserrat" fill="#2D3436">
                MAITRI STATION
              </text>
              <text x="600" y="272" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#6B7280">
                RISK: {maitri.risk.overallScore.toFixed(1)}% • {maitri.risk.level}
              </text>
              <line x1="480" y1="282" x2="720" y2="282" stroke="#E5E7EB" strokeWidth="1" />
              
              <text x="480" y="300" fontSize="9" fontFamily="JetBrains Mono" fill="#6B7280">
                POWER: {maitri.power.totalGenerationKW} kW / {maitri.power.currentDemandKW} kW ({maitri.power.capacityHeadroomPercent.toFixed(1)}% headroom)
              </text>
              <text x="480" y="318" fontSize="9" fontFamily="JetBrains Mono" fill="#6B7280">
                FUEL: {maitri.fuel.reservePercent}% ({maitri.fuel.estimatedEnduranceDays.toFixed(1)} days endurance)
              </text>
              <text x="480" y="336" fontSize="9" fontFamily="JetBrains Mono" fill="#6B7280">
                WEATHER: {maitri.environment.temperature}°C • {maitri.environment.windSpeed} km/h
              </text>
              <text x="480" y="354" fontSize="9" fontFamily="JetBrains Mono" fill={mOnline ? '#10B981' : '#EF4444'} fontWeight="600">
                LINK: {mOnline ? 'ONLINE • SYNCHRONIZED' : 'OFFLINE • EDGE AUTONOMOUS'}
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Node Telemetry Inspector */}
        <div className="bg-panel rounded-xl p-4 border border-border-color">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-color">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-frost" />
              <h3 className="font-heading font-bold text-xs uppercase text-primary-text">
                INSPECTING: {
                  selectedNode === 'goa' ? 'NCPOR / GOA MAINLAND OPERATIONS' :
                  selectedNode === 'bharati' ? 'BHARATI STATION DIGITAL TWIN' :
                  selectedNode === 'maitri' ? 'MAITRI STATION DIGITAL TWIN' :
                  selectedNode === 'link-b' ? 'BHARATI SATELLITE CARRIER DIAGNOSTICS' :
                  'MAITRI SATELLITE CARRIER DIAGNOSTICS'
                }
              </h3>
            </div>
            <span className="text-[10px] font-mono text-muted-text">
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>

          {selectedNode === 'goa' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase font-semibold">MAINLAND TELEMETRY HUB</p>
                <p className="font-medium mt-1">NCPOR Headquarter Facility, Vasco da Gama, Goa</p>
                <p className="text-muted-text text-[11px] mt-1">Dual dedicated polar gateway transceivers operational.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase font-semibold">BHARATI CARRIER TELEMETRY</p>
                <p className="font-mono mt-1 font-semibold text-healthy">Carrier: VSAT Locked (C-Band / Ku-Band)</p>
                <p className="text-muted-text text-[11px]">Last sync: {new Date(bharati.communication.lastSyncTimestamp).toLocaleTimeString()}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase font-semibold">MAITRI CARRIER TELEMETRY</p>
                <p className="font-mono mt-1 font-semibold text-healthy">Carrier: Iridium SBD Dual Loop</p>
                <p className="text-muted-text text-[11px]">Last sync: {new Date(maitri.communication.lastSyncTimestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          )}

          {(selectedNode === 'bharati' || selectedNode === 'link-b') && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">COMPOSITE RISK</p>
                <p className="font-mono text-sm font-bold text-primary-text">{bharati.risk.overallScore.toFixed(1)}%</p>
                <RiskBadge level={bharati.risk.level} size="sm" />
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">POWER CAPACITY</p>
                <p className="font-mono text-sm font-bold text-primary-text">{bharati.power.capacityHeadroomPercent.toFixed(1)}% headroom</p>
                <p className="text-[10px] text-muted-text font-mono">{bharati.power.totalGenerationKW} kW generation</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">FUEL ENDURANCE</p>
                <p className="font-mono text-sm font-bold text-primary-text">{bharati.fuel.estimatedEnduranceDays.toFixed(1)} days</p>
                <p className="text-[10px] text-muted-text font-mono">{bharati.fuel.reservePercent}% reserve</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">CARRIER LINK</p>
                <p className={`font-mono text-sm font-bold ${bOnline ? 'text-healthy' : 'text-critical'}`}>
                  {bharati.communication.status}
                </p>
                <p className="text-[10px] text-muted-text font-mono">0 pending packets</p>
              </div>
            </div>
          )}

          {(selectedNode === 'maitri' || selectedNode === 'link-m') && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">COMPOSITE RISK</p>
                <p className="font-mono text-sm font-bold text-primary-text">{maitri.risk.overallScore.toFixed(1)}%</p>
                <RiskBadge level={maitri.risk.level} size="sm" />
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">POWER CAPACITY</p>
                <p className="font-mono text-sm font-bold text-primary-text">{maitri.power.capacityHeadroomPercent.toFixed(1)}% headroom</p>
                <p className="text-[10px] text-muted-text font-mono">{maitri.power.totalGenerationKW} kW generation</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">FUEL ENDURANCE</p>
                <p className="font-mono text-sm font-bold text-primary-text">{maitri.fuel.estimatedEnduranceDays.toFixed(1)} days</p>
                <p className="text-[10px] text-muted-text font-mono">{maitri.fuel.reservePercent}% reserve</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-border-color">
                <p className="text-[10px] text-muted-text uppercase">CARRIER LINK</p>
                <p className={`font-mono text-sm font-bold ${mOnline ? 'text-healthy' : 'text-critical'}`}>
                  {maitri.communication.status}
                </p>
                <p className="text-[10px] text-muted-text font-mono">{maitri.communication.pendingSyncEvents} pending</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
