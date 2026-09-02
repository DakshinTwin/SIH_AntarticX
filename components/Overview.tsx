'use client';

import React from 'react';
import { StationState } from '@/lib/types';
import { RiskBadge, TelemetryCard, SimulatedBadge, SectionHeader, StatusIndicator } from './UIComponents';
import {
  Thermometer, Wind, Zap, Fuel, Wifi, WifiOff, AlertTriangle,
  Activity, Radio, Eye, Building2, MapPin, Gauge, Shield, ArrowRight
} from 'lucide-react';

type Page = 'overview' | 'bharati' | 'maitri' | 'combined' | 'what-if';

interface OverviewProps {
  bharati: StationState;
  maitri: StationState;
  onNavigate: (page: Page) => void;
}

function StationSummaryCard({ station, onClick }: { station: StationState; onClick: () => void }) {
  const commOk = station.communication.status === 'ONLINE';

  return (
    <div className="bg-white rounded-xl border border-border-color p-6 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-border-color">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-iceberg" />
              <h3 className="font-heading font-bold text-xl text-primary-text">{station.stationName.toUpperCase()}</h3>
            </div>
            <p className="text-[10px] text-muted-text font-mono tracking-wider mt-0.5">
              {station.stationId === 'bharati' ? 'LARSEMANN HILLS • 69°24′S 76°12′E' : 'SCHIRMACHER OASIS • 70°46′S 11°44′E'}
            </p>
          </div>
          <RiskBadge level={station.risk.level} score={station.risk.overallScore} showScore size="md" />
        </div>

        {/* 6 Key Operational Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {/* Environment */}
          <div className="bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-iceberg" />
              <span className="text-[10px] text-muted-text font-semibold uppercase">WEATHER</span>
            </div>
            <p className="text-base font-mono font-bold text-primary-text">{station.environment.temperature}°C</p>
            <p className="text-[10px] font-mono text-muted-text mt-0.5">{station.environment.windSpeed} km/h • {station.environment.weatherSeverity}</p>
          </div>

          {/* Power Headroom */}
          <div className="bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-warning" />
              <span className="text-[10px] text-muted-text font-semibold uppercase">HEADROOM</span>
            </div>
            <p className="text-base font-mono font-bold text-primary-text">{station.power.capacityHeadroomPercent.toFixed(1)}%</p>
            <p className="text-[10px] font-mono text-muted-text mt-0.5">{station.power.currentDemandKW} kW / {station.power.availableCapacityKW} kW</p>
          </div>

          {/* Fuel */}
          <div className="bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1">
              <Fuel className="w-3.5 h-3.5 text-healthy" />
              <span className="text-[10px] text-muted-text font-semibold uppercase">FUEL RESERVE</span>
            </div>
            <p className="text-base font-mono font-bold text-primary-text">{station.fuel.reservePercent}%</p>
            <p className="text-[10px] font-mono text-muted-text mt-0.5">{station.fuel.estimatedEnduranceDays.toFixed(1)} days endurance</p>
          </div>

          {/* Heating */}
          <div className="bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5 text-glacier" />
              <span className="text-[10px] text-muted-text font-semibold uppercase">HEATING</span>
            </div>
            <p className="text-base font-mono font-bold text-primary-text">{station.heating.demandPercent}%</p>
            <p className="text-[10px] font-mono text-muted-text mt-0.5">Loop: {station.heating.mode}</p>
          </div>

          {/* Water & Life Support */}
          <div className="bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1">
              <Gauge className="w-3.5 h-3.5 text-frost" />
              <span className="text-[10px] text-muted-text font-semibold uppercase">WATER STATUS</span>
            </div>
            <p className="text-base font-mono font-bold text-primary-text">{station.water.status}</p>
            <p className="text-[10px] font-mono text-muted-text mt-0.5">Vuln: {station.water.vulnerabilityPercent}%</p>
          </div>

          {/* Communication & Twin */}
          <div className="bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1">
              {commOk ? <Wifi className="w-3.5 h-3.5 text-healthy" /> : <WifiOff className="w-3.5 h-3.5 text-critical" />}
              <span className="text-[10px] text-muted-text font-semibold uppercase">TELEMETRY</span>
            </div>
            <p className={`text-base font-mono font-bold ${commOk ? 'text-healthy' : 'text-critical'}`}>
              {station.communication.status}
            </p>
            <p className="text-[10px] font-mono text-muted-text mt-0.5">
              {commOk ? 'ACTIVE • SYNCHRONIZED' : 'ACTIVE • OFFLINE EDGE'}
            </p>
          </div>
        </div>

        {/* Active Alerts */}
        {station.alerts.length > 0 ? (
          <div className="mb-4 bg-panel rounded-lg p-3 border border-border-color/60">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              <span className="text-[10px] font-heading font-bold text-primary-text uppercase">
                {station.alerts.length} STATION ALERT{station.alerts.length > 1 ? 'S' : ''}
              </span>
            </div>
            <div className="space-y-1">
              {station.alerts.slice(0, 2).map(a => (
                <p key={a.id} className="text-[11px] text-muted-text font-body truncate">
                  • <span className="font-medium text-primary-text">{a.title}:</span> {a.message}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4 bg-healthy/5 rounded-lg p-2.5 border border-healthy/20">
            <p className="text-[10px] font-mono text-healthy">✓ All systems nominal within normal operating limits.</p>
          </div>
        )}
      </div>

      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-panel hover:bg-iceberg/20 border border-border-color hover:border-frost rounded-lg text-xs font-heading font-semibold text-primary-text transition-all"
      >
        <span>OPEN {station.stationName.toUpperCase()} STATION INTELLIGENCE</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function Overview({ bharati, maitri, onNavigate }: OverviewProps) {
  return (
    <div className="py-6 fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-border-color p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-healthy risk-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-muted-text uppercase">
                NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR) • GOA
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-primary-text tracking-wide">
              ANTARCTIC OPERATIONS OVERVIEW
            </h1>
            <p className="text-xs text-muted-text tracking-wide mt-1">
              Continuous Digital Twin telemetry, dependency monitoring, and operational state intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SimulatedBadge />
          </div>
        </div>
      </div>

      {/* Side-by-Side Station Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StationSummaryCard station={bharati} onClick={() => onNavigate('bharati')} />
        <StationSummaryCard station={maitri} onClick={() => onNavigate('maitri')} />
      </div>

      {/* Cross-Station Consolidated Operational Metrics */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-sm">
        <SectionHeader
          title="CONSOLIDATED ANTARCTIC TELEMETRY"
          subtitle="REAL-TIME POLAR ENERGY, LOGISTICS & ENVIRONMENTAL AGGREGATES"
          accent
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TelemetryCard
            label="TOTAL GENERATION"
            value={bharati.power.totalGenerationKW + maitri.power.totalGenerationKW}
            unit="kW"
            icon={<Zap className="w-3.5 h-3.5 text-warning" />}
            subtitle={`Installed Capacity: ${bharati.power.installedCapacityKW + maitri.power.installedCapacityKW} kW`}
          />
          <TelemetryCard
            label="COMBINED LOAD DEMAND"
            value={bharati.power.currentDemandKW + maitri.power.currentDemandKW}
            unit="kW"
            icon={<Activity className="w-3.5 h-3.5 text-frost" />}
            subtitle={`Bharati: ${bharati.power.currentDemandKW} kW • Maitri: ${maitri.power.currentDemandKW} kW`}
          />
          <TelemetryCard
            label="AGGREGATE FUEL"
            value={Math.round((bharati.fuel.reservePercent + maitri.fuel.reservePercent) / 2)}
            unit="%"
            icon={<Fuel className="w-3.5 h-3.5 text-healthy" />}
            subtitle={`Combined burn: ${(bharati.fuel.consumptionLPerHr + maitri.fuel.consumptionLPerHr).toFixed(1)} L/hr`}
            isSimulatedEstimate
          />
          <TelemetryCard
            label="POLAR COMMS LINK"
            value={`${[bharati, maitri].filter(s => s.communication.status === 'ONLINE').length} / 2`}
            unit="online"
            icon={<Radio className="w-3.5 h-3.5 text-iceberg" />}
            subtitle="Iridium / VSAT carrier link"
          />
          <TelemetryCard
            label="HARSH WEATHER"
            value={Math.min(bharati.environment.temperature, maitri.environment.temperature)}
            unit="°C"
            icon={<Thermometer className="w-3.5 h-3.5 text-glacier" />}
            subtitle={`Peak wind: ${Math.max(bharati.environment.windSpeed, maitri.environment.windSpeed)} km/h`}
          />
        </div>
      </div>
    </div>
  );
}
