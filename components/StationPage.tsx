'use client';

import React from 'react';
import { StationState, ScenarioInputs } from '@/lib/types';
import { bharatiProfile, maitriProfile } from '@/lib/mockData';
import { RiskBadge, TelemetryCard, StatusIndicator, SectionHeader, SimulatedBadge } from './UIComponents';
import DependencyGraph from './DependencyGraph';
import StationSchematic from './StationSchematic';
import {
  Thermometer, Wind, Eye, Zap, Fuel, Droplets, Package, Wifi, WifiOff,
  AlertTriangle, MapPin, Calendar, Building2, Activity, Cpu, ShieldAlert
} from 'lucide-react';

interface StationPageProps {
  station: StationState;
  inputs: ScenarioInputs;
}

export default function StationPage({ station, inputs }: StationPageProps) {
  const profile = station.stationId === 'bharati' ? bharatiProfile : maitriProfile;
  const isOnline = station.communication.status === 'ONLINE';

  const digitalTwinStatusText = isOnline
    ? 'ACTIVE • SYNCHRONIZED'
    : 'ACTIVE • OFFLINE EDGE';

  return (
    <div className="py-6 fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-iceberg" />
              <h1 className="font-heading font-bold text-2xl text-primary-text tracking-wide">
                {station.stationName.toUpperCase()}
              </h1>
            </div>
            <p className="text-xs text-muted-text tracking-widest mt-0.5">
              INDIAN ANTARCTIC RESEARCH STATION • {profile.location.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge level={station.risk.level} score={station.risk.overallScore} showScore size="lg" />
            <SimulatedBadge />
          </div>
        </div>
      </div>

      {/* Station Profile */}
      <div className="bg-white rounded-xl border border-border-color p-5 mb-6 shadow-sm">
        <SectionHeader title="STATION PROFILE & ARCHITECTURE" accent />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-iceberg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-text uppercase font-semibold">STATION SPECIFICATION</p>
              <p className="font-medium text-xs text-primary-text">{profile.fullName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-iceberg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-text uppercase font-semibold">COORDINATES & ELEVATION</p>
              <p className="font-medium text-xs text-primary-text">{profile.location}</p>
              <p className="text-[10px] font-mono text-muted-text">{profile.coordinates} • {profile.elevation}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-iceberg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-text uppercase font-semibold">COMMISSIONED</p>
              <p className="font-medium text-xs text-primary-text">Year {profile.established}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 md:col-span-2">
            <Activity className="w-4 h-4 text-iceberg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-text uppercase font-semibold">OPERATIONAL ROLE</p>
              <p className="font-medium text-xs text-primary-text">{profile.operationalRole}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Thermometer className="w-4 h-4 text-iceberg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-text uppercase font-semibold">POLAR ENVIRONMENT</p>
              <p className="font-medium text-xs text-primary-text">{profile.environment}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border-color">
          <p className="text-[10px] text-muted-text font-semibold uppercase mb-2">INTEGRATED SUB-SYSTEMS</p>
          <div className="flex flex-wrap gap-2">
            {profile.majorSystems.map((s, i) => (
              <span key={i} className="text-[10px] font-mono bg-panel px-2.5 py-1 rounded-md border border-border-color/80 text-primary-text">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Environment & Power */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Environment */}
        <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
          <SectionHeader title="CURRENT ENVIRONMENT" subtitle="METEOROLOGICAL SENSORS • SIMULATED DATA" accent />
          <div className="grid grid-cols-2 gap-3">
            <TelemetryCard label="TEMPERATURE" value={station.environment.temperature} unit="°C" icon={<Thermometer className="w-3.5 h-3.5 text-iceberg" />} />
            <TelemetryCard label="WIND SPEED" value={station.environment.windSpeed} unit="km/h" icon={<Wind className="w-3.5 h-3.5 text-frost" />} />
            <TelemetryCard label="VISIBILITY" value={station.environment.visibility} unit="%" icon={<Eye className="w-3.5 h-3.5 text-glacier" />} />
            <TelemetryCard
              label="WEATHER SEVERITY"
              value={station.environment.weatherSeverity}
              status={station.environment.weatherSeverity === 'EXTREME' || station.environment.weatherSeverity === 'HIGH' ? 'HIGH' : station.environment.weatherSeverity === 'MEDIUM' ? 'MODERATE' : 'LOW'}
            />
          </div>
        </div>

        {/* Power */}
        <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
          <SectionHeader title="ELECTRICAL GENERATION & HEADROOM" subtitle="2×125 kW DIESEL ALTERNATORS • SIMULATED" accent />
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-panel rounded-lg p-3 border border-border-color/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-text font-semibold uppercase">GENERATOR 1</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${station.power.generator1.status === 'RUNNING' ? 'bg-healthy/20 text-healthy' : 'bg-critical/20 text-critical'}`}>
                  {station.power.generator1.status}
                </span>
              </div>
              <p className="font-mono text-base font-bold text-primary-text">{station.power.generator1.outputKW} kW</p>
              <p className="text-[10px] font-mono text-muted-text">{station.power.generator1.load}% load factor</p>
            </div>
            
            <div className="bg-panel rounded-lg p-3 border border-border-color/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-text font-semibold uppercase">GENERATOR 2</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${station.power.generator2.status === 'RUNNING' ? 'bg-healthy/20 text-healthy' : 'bg-critical/20 text-critical'}`}>
                  {station.power.generator2.status}
                </span>
              </div>
              <p className="font-mono text-base font-bold text-primary-text">{station.power.generator2.outputKW} kW</p>
              <p className="text-[10px] font-mono text-muted-text">{station.power.generator2.load}% load factor</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            <div className="bg-panel rounded p-2 border border-border-color/60">
              <p className="text-[9px] text-muted-text uppercase font-semibold">INSTALLED</p>
              <p className="text-xs font-mono font-bold text-primary-text">{station.power.installedCapacityKW} kW</p>
            </div>
            <div className="bg-panel rounded p-2 border border-border-color/60">
              <p className="text-[9px] text-muted-text uppercase font-semibold">GENERATION</p>
              <p className="text-xs font-mono font-bold text-primary-text">{station.power.totalGenerationKW} kW</p>
            </div>
            <div className="bg-panel rounded p-2 border border-border-color/60">
              <p className="text-[9px] text-muted-text uppercase font-semibold">DEMAND</p>
              <p className="text-xs font-mono font-bold text-primary-text">{station.power.currentDemandKW} kW</p>
            </div>
            <div className="bg-panel rounded p-2 border border-border-color/60">
              <p className="text-[9px] text-muted-text uppercase font-semibold">HEADROOM</p>
              <p className={`text-xs font-mono font-bold ${station.power.capacityHeadroomPercent < 15 ? 'text-critical' : 'text-healthy'}`}>
                {station.power.capacityHeadroomPercent.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-panel rounded border border-border-color/60">
            <span className="text-muted-text text-[11px]">N+1 Generation Redundancy:</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${station.power.hasRedundancy ? 'bg-healthy/15 text-healthy' : 'bg-critical/15 text-critical'}`}>
              {station.power.hasRedundancy ? 'AVAILABLE' : 'UNAVAILABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Fuel, Heating, Water/Spares */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Fuel */}
        <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
          <SectionHeader title="FUEL RESERVES & RUNTIME" accent />
          <TelemetryCard label="RESERVE" value={station.fuel.reservePercent} unit="%" status={station.fuel.fuelRisk} />
          <div className="mt-3 space-y-2 pt-2 border-t border-border-color">
            <div className="flex justify-between text-xs">
              <span className="text-muted-text">Fuel Burn Rate</span>
              <span className="font-mono font-semibold">{station.fuel.consumptionLPerHr.toFixed(1)} L/hr</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-text">Estimated Endurance</span>
              <span className="font-mono font-bold">{station.fuel.estimatedEnduranceDays.toFixed(1)} days</span>
            </div>
            <p className="text-[9px] font-mono text-simulation uppercase text-right tracking-wide">
              SIMULATED ESTIMATE
            </p>
          </div>
        </div>

        {/* Heating */}
        <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
          <SectionHeader title="CENTRAL HEATING LOOP" accent />
          <TelemetryCard label="THERMAL DEMAND" value={station.heating.demandPercent} unit="%" status={station.heating.thermalRisk} />
          <div className="mt-3 space-y-2 pt-2 border-t border-border-color">
            <div className="flex justify-between text-xs">
              <span className="text-muted-text">Control Mode</span>
              <span className="font-mono font-semibold">{station.heating.mode}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-text">Thermal Risk</span>
              <RiskBadge level={station.heating.thermalRisk} />
            </div>
          </div>
        </div>

        {/* Water & Spares */}
        <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
          <SectionHeader title="WATER & CRITICAL SPARES" accent />
          <StatusIndicator label="Water System" status={station.water.status} />
          <div className="flex justify-between text-xs mt-1 mb-3">
            <span className="text-muted-text">Vulnerability Factor</span>
            <span className="font-mono font-semibold">{station.water.vulnerabilityPercent}%</span>
          </div>
          <p className="text-[10px] text-muted-text mb-1 mt-3 uppercase tracking-wide font-semibold">Critical On-Site Spares</p>
          <StatusIndicator label="Generator Spare" status={station.inventory.generatorSpare} />
          <StatusIndicator label="Heating Spare" status={station.inventory.heatingSpare} />
          <StatusIndicator label="Pump/Water Spare" status={station.inventory.pumpWaterSpare} />
        </div>
      </div>

      {/* Communication & Edge State */}
      <div className="bg-white rounded-xl border border-border-color p-5 mb-6 shadow-sm">
        <SectionHeader title="COMMUNICATION & DIGITAL TWIN STATE" accent />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-panel rounded-lg p-4 border border-border-color/60">
            <div className="flex items-center gap-2 mb-2">
              {isOnline ? <Wifi className="w-4 h-4 text-healthy" /> : <WifiOff className="w-4 h-4 text-critical" />}
              <span className="text-xs font-semibold">Satellite Transceiver</span>
            </div>
            <StatusIndicator label="Carrier Link" status={station.communication.status} />
            <p className="text-[10px] font-mono text-muted-text mt-1">
              Last Sync: {new Date(station.communication.lastSyncTimestamp).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="bg-panel rounded-lg p-4 border border-border-color/60">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-simulation" />
              <p className="text-[10px] text-muted-text uppercase font-semibold">DIGITAL TWIN STATUS</p>
            </div>
            <p className="text-sm font-mono font-bold text-primary-text mb-1">
              {digitalTwinStatusText}
            </p>
            <RiskBadge level={station.risk.level} score={station.risk.overallScore} showScore size="sm" />
          </div>

          <div className="bg-panel rounded-lg p-4 border border-border-color/60">
            <p className="text-[10px] text-muted-text uppercase font-semibold mb-1">TELEMETRY RECORD</p>
            <p className="text-sm font-mono">{new Date(station.lastUpdated).toLocaleTimeString()}</p>
            <p className="text-[10px] text-muted-text mt-1">
              Pending offline sync events: <span className="font-mono font-semibold">{station.communication.pendingSyncEvents}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Dependency Graph & Station Schematic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DependencyGraph station={station} />
        <StationSchematic station={station} />
      </div>

      {/* Active Alerts */}
      {station.alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
          <SectionHeader title="ACTIVE STATION ADVISORIES & ALERTS" accent />
          <div className="space-y-2">
            {station.alerts.map(alert => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                alert.severity === 'CRITICAL' ? 'bg-critical/5 border-critical/20' : 'bg-warning/5 border-warning/20'
              }`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.severity === 'CRITICAL' ? 'text-critical' : 'text-warning'}`} />
                <div>
                  <p className="text-xs font-semibold text-primary-text">{alert.title}</p>
                  <p className="text-[11px] text-muted-text">{alert.message}</p>
                  <p className="text-[9px] font-mono text-muted-text mt-1">{alert.system} • {new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
