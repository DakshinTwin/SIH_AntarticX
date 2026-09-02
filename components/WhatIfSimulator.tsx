'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  StationState, ScenarioInputs, StationId, PresetScenario,
  GeneratorStatus, WaterStatus, SpareAvailability, CommunicationStatus,
  HeatingMode, RiskLevel, SyncQueueItem, SyncPriority, SyncItemStatus,
  EventLogEntry
} from '@/lib/types';
import { calculateFullState } from '@/lib/simulationEngine';
import { bharatiBaselineInputs, maitriBaselineInputs } from '@/lib/mockData';
import { getPresetScenario, presetLabels } from '@/lib/scenarios';
import { RiskBadge, SimulatedBadge, SectionHeader, StatusIndicator } from './UIComponents';
import DependencyGraph from './DependencyGraph';
import StationSchematic from './StationSchematic';
import {
  Sliders, Thermometer, Wind, Eye, Zap, Fuel, Droplets, Package,
  Wifi, WifiOff, AlertTriangle, ArrowRight, RotateCcw, Play,
  Shield, Info, Clock, Radio, ChevronDown, ChevronUp, Flame, Loader2, Sparkles, Cpu
} from 'lucide-react';

interface WhatIfSimulatorProps {
  bharatiLive: StationState;
  maitriLive: StationState;
}

const presetKeys: PresetScenario[] = [
  'NORMAL', 'SEVERE_BLIZZARD', 'EXTREME_COLD', 'GENERATOR_2_FAILURE',
  'LOW_FUEL', 'COMMUNICATION_OUTAGE', 'COMPOUND_EMERGENCY'
];

// ============================================
// SLIDER COMPONENT
// ============================================
function SliderControl({
  label, value, min, max, step, unit, onChange, icon, isOverride
}: {
  label: string; value: number; min: number; max: number; step?: number; unit: string;
  onChange: (v: number) => void; icon?: React.ReactNode; isOverride?: boolean;
}) {
  return (
    <div className="mb-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[10px] text-muted-text uppercase font-semibold tracking-wide">{label}</span>
          {isOverride && (
            <span className="text-[8px] font-mono text-simulation bg-simulation/10 px-1.5 py-0.2 rounded">
              OVERRIDE
            </span>
          )}
        </div>
        <span className="text-xs font-mono font-bold text-primary-text">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step || 1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-border-color rounded-full appearance-none cursor-pointer accent-frost"
      />
      <div className="flex justify-between text-[9px] text-muted-text font-mono mt-0.5">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ============================================
// TOGGLE COMPONENT
// ============================================
function ToggleControl<T extends string>({
  label, value, options, onChange, isOverride
}: {
  label: string; value: T; options: { value: T; label: string; color?: string }[];
  onChange: (v: T) => void; isOverride?: boolean;
}) {
  return (
    <div className="mb-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] text-muted-text uppercase font-semibold tracking-wide">{label}</p>
        {isOverride && (
          <span className="text-[8px] font-mono text-simulation bg-simulation/10 px-1.5 py-0.2 rounded">
            MANUAL
          </span>
        )}
      </div>
      <div className="flex gap-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-1.5 text-[10px] font-mono rounded-md border transition-all ${
              value === opt.value
                ? opt.color === 'red' ? 'bg-critical/15 border-critical/50 text-critical font-bold'
                : opt.color === 'yellow' ? 'bg-warning/15 border-warning/50 text-warning font-bold'
                : 'bg-frost/25 border-frost text-primary-text font-bold shadow-sm'
                : 'bg-white border-border-color text-muted-text hover:border-frost/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPARISON ROW
// ============================================
function CompareRow({
  label, liveVal, projVal, unit
}: {
  label: string; liveVal: string | number; projVal: string | number; unit?: string;
}) {
  const changed = String(liveVal) !== String(projVal);
  return (
    <div className={`grid grid-cols-3 py-2 px-2.5 text-xs border-b border-border-color/60 transition-colors ${changed ? 'bg-simulation/5' : ''}`}>
      <span className="text-muted-text font-medium">{label}</span>
      <span className="font-mono text-center text-primary-text">{liveVal}{unit || ''}</span>
      <span className={`font-mono text-center font-semibold ${changed ? 'text-simulation' : 'text-primary-text'}`}>
        {projVal}{unit || ''}
        {changed && <span className="ml-1 text-[9px] text-simulation">●</span>}
      </span>
    </div>
  );
}

// ============================================
// MAIN SIMULATOR COMPONENT
// ============================================
export default function WhatIfSimulator({ bharatiLive, maitriLive }: WhatIfSimulatorProps) {
  // Station selector: Bharati or Maitri only (NO 'both')
  const [selectedStation, setSelectedStation] = useState<StationId>('bharati');
  
  // Simulation control mode: AUTO vs MANUAL
  const [controlMode, setControlMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [showControls, setShowControls] = useState(true);

  // Baseline getter
  const getBaseline = useCallback((sid: StationId) =>
    sid === 'bharati' ? bharatiBaselineInputs : maitriBaselineInputs, []);

  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInputs>({ ...bharatiBaselineInputs });
  const [activePreset, setActivePreset] = useState<PresetScenario | null>('NORMAL');

  // Event log
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([
    { id: '0', timestamp: new Date().toISOString(), message: 'What-If deterministic simulation engine initialized', type: 'SYSTEM' },
  ]);

  // Sync queue & Reconnection state
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const addEvent = useCallback((message: string, type: EventLogEntry['type'] = 'INFO') => {
    setEventLog(prev => [{
      id: String(Date.now()) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      message,
      type,
    }, ...prev].slice(0, 50));
  }, []);

  // Calculate live and projected states
  const projectedState = useMemo(() => calculateFullState(scenarioInputs, selectedStation), [scenarioInputs, selectedStation]);
  const liveState = selectedStation === 'bharati' ? bharatiLive : maitriLive;

  // Populate offline sync queue when disconnected
  useEffect(() => {
    if (scenarioInputs.communicationStatus === 'OFFLINE') {
      const items: SyncQueueItem[] = [];
      const ts = new Date().toISOString();
      if (projectedState.alerts.some(a => a.severity === 'CRITICAL') || scenarioInputs.generator1Status === 'FAILED' || scenarioInputs.generator2Status === 'FAILED') {
        items.push({ id: 'p1-1', priority: 'P1', label: 'CRITICAL — Safety & Power Telemetry', description: 'Generator failure states & critical risk transitions', status: 'PENDING', timestamp: ts });
      }
      items.push({ id: 'p2-1', priority: 'P2', label: 'HIGH — State Transitions', description: 'Thermal loop & load balance deviations', status: 'PENDING', timestamp: ts });
      items.push({ id: 'p3-1', priority: 'P3', label: 'NORMAL — Aggregated Telemetry', description: 'Subsystem sensor averages & fuel burn log', status: 'PENDING', timestamp: ts });
      items.push({ id: 'p4-1', priority: 'P4', label: 'BULK — Meteorological Archives', description: 'Sub-minute polar wind and barometric logs', status: 'PENDING', timestamp: ts });
      setSyncQueue(items);
    } else if (!isSyncing && !isRestoring) {
      setSyncQueue([]);
    }
  }, [scenarioInputs.communicationStatus, projectedState.alerts, scenarioInputs.generator1Status, scenarioInputs.generator2Status, isSyncing, isRestoring]);

  // Input updater
  const updateInput = useCallback(<K extends keyof ScenarioInputs>(key: K, value: ScenarioInputs[K]) => {
    setActivePreset(null);
    setScenarioInputs(prev => ({ ...prev, [key]: value }));

    if (key === 'generator1Status' || key === 'generator2Status') {
      const gen = key === 'generator1Status' ? '1' : '2';
      addEvent(`Generator ${gen} switched to ${value === 'FAILED' ? 'FAILED' : 'RUNNING'}`, value === 'FAILED' ? 'CRITICAL' : 'INFO');
    }
    if (key === 'temperature') {
      addEvent(`Ambient temperature modified to ${value}°C — recalculating heating & fuel demand`, 'INFO');
    }
    if (key === 'communicationStatus') {
      addEvent(value === 'OFFLINE' ? 'Carrier lost — local edge twin active' : 'Carrier restored', value === 'OFFLINE' ? 'WARNING' : 'SYSTEM');
    }
  }, [addEvent]);

  // Preset applicator
  const applyPreset = useCallback((preset: PresetScenario) => {
    const baseline = getBaseline(selectedStation);
    const newInputs = getPresetScenario(preset, baseline);
    setScenarioInputs(newInputs);
    setActivePreset(preset);
    addEvent(`Applied preset: ${presetLabels[preset]}`, 'SYSTEM');
  }, [selectedStation, getBaseline, addEvent]);

  // Reset scenario
  const resetScenario = useCallback(() => {
    const baseline = getBaseline(selectedStation);
    setScenarioInputs({ ...baseline });
    setActivePreset('NORMAL');
    setSyncQueue([]);
    setIsRestoring(false);
    setIsSyncing(false);
    addEvent(`Simulation reset to baseline ${selectedStation.toUpperCase()}`, 'SYSTEM');
  }, [selectedStation, getBaseline, addEvent]);

  // Switch station (Bharati vs Maitri)
  const switchStation = useCallback((sid: StationId) => {
    setSelectedStation(sid);
    setScenarioInputs({ ...getBaseline(sid) });
    setActivePreset('NORMAL');
    setSyncQueue([]);
    setIsRestoring(false);
    setIsSyncing(false);
    addEvent(`Switched active station simulation to ${sid.toUpperCase()}`, 'SYSTEM');
  }, [getBaseline, addEvent]);

  // Reconnection with 3-second delay + priority sync
  const restoreConnection = useCallback(async () => {
    if (isRestoring || isSyncing) return;

    setIsRestoring(true);
    addEvent('Reconnection handshake initiated with mainland NCPOR Goa gateway...', 'SYSTEM');

    // 3 Second delay with loading state
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsRestoring(false);
    setIsSyncing(true);
    updateInput('communicationStatus', 'ONLINE');
    addEvent('Carrier locked. Beginning priority-driven delta synchronization (P1 → P4)...', 'SYSTEM');

    // Sequential P1 -> P4 delta sync
    for (let i = 0; i < syncQueue.length; i++) {
      setSyncQueue(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: 'SYNCING' as SyncItemStatus } : item
      ));
      addEvent(`Syncing ${syncQueue[i].priority}: ${syncQueue[i].label}`, 'INFO');
      await new Promise(r => setTimeout(r, 700));

      setSyncQueue(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: 'SYNCED' as SyncItemStatus } : item
      ));
      await new Promise(r => setTimeout(r, 400));
    }

    addEvent('✓ All priority packets synchronized. Mainland NCPOR state refreshed.', 'SYSTEM');
    setIsSyncing(false);
  }, [isRestoring, isSyncing, syncQueue, updateInput, addEvent]);

  const isOffline = scenarioInputs.communicationStatus === 'OFFLINE';

  const digitalTwinStatusText = isRestoring
    ? 'RECONNECTING • SATELLITE HANDSHAKE'
    : isSyncing
    ? 'SYNCING • PRIORITY QUEUE'
    : isOffline
    ? 'ACTIVE • OFFLINE EDGE'
    : 'ACTIVE • SYNCHRONIZED';

  return (
    <div className="py-6 fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-simulation animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-muted-text uppercase">
              PREDICTIVE DIGITAL TWIN SCENARIO LABORATORY
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-primary-text tracking-wide">
            WHAT-IF SCENARIO SIMULATOR
          </h1>
          <p className="text-xs text-muted-text tracking-wide">
            Cross-domain dependency propagation • Deterministic physics engine • Offline edge continuity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-simulation/10 border border-simulation/30 shadow-sm">
            <Sliders className="w-3.5 h-3.5 text-simulation" />
            <span className="text-xs font-mono text-simulation font-bold">SIMULATION MODE</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-healthy/10 border border-healthy/30 shadow-sm">
            <span className="text-[10px] font-mono text-healthy font-bold">LIVE STATE UNCHANGED</span>
          </div>
        </div>
      </div>

      {/* Station Selector & Auto/Manual Mode Bar */}
      <div className="bg-white rounded-xl border border-border-color p-4 mb-5 shadow-sm flex items-center justify-between flex-wrap gap-3">
        {/* Station Selector: BHARATI and MAITRI only */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-heading font-bold text-muted-text uppercase mr-1">STATION:</span>
          {(['bharati', 'maitri'] as const).map(sid => (
            <button
              key={sid}
              onClick={() => switchStation(sid)}
              className={`px-4 py-2 text-xs font-heading font-bold rounded-lg border transition-all ${
                selectedStation === sid
                  ? 'bg-frost/25 border-frost text-primary-text shadow-sm'
                  : 'bg-panel border-border-color text-muted-text hover:border-frost/50'
              }`}
            >
              {sid.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Auto / Manual Mode Toggle */}
        <div className="flex items-center gap-2 bg-panel p-1 rounded-lg border border-border-color">
          <span className="text-[10px] font-heading font-bold text-muted-text uppercase px-2">MODE:</span>
          <button
            onClick={() => { setControlMode('AUTO'); addEvent('Switched to AUTO MODE — derived variables calculate automatically', 'SYSTEM'); }}
            className={`px-3 py-1.5 text-xs font-mono rounded-md font-bold transition-all ${
              controlMode === 'AUTO'
                ? 'bg-white text-primary-text shadow-sm border border-border-color'
                : 'text-muted-text hover:text-primary-text'
            }`}
          >
            ⚡ AUTO MODE (DEPENDENCY DERIVED)
          </button>
          <button
            onClick={() => { setControlMode('MANUAL'); addEvent('Switched to MANUAL MODE — direct override controls enabled', 'SYSTEM'); }}
            className={`px-3 py-1.5 text-xs font-mono rounded-md font-bold transition-all ${
              controlMode === 'MANUAL'
                ? 'bg-simulation/20 text-simulation shadow-sm border border-simulation/30'
                : 'text-muted-text hover:text-primary-text'
            }`}
          >
            ⚙️ MANUAL MODE (DIRECT OVERRIDE)
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetScenario}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold rounded-lg border border-border-color bg-panel hover:bg-white text-muted-text hover:text-primary-text transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESET SCENARIO
        </button>
      </div>

      {/* Offline Alert Banner & 3-Second Reconnection Controller */}
      {(isOffline || isRestoring || isSyncing) && (
        <div className="bg-critical/5 border border-critical/20 rounded-xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isRestoring ? (
                <Loader2 className="w-6 h-6 text-warning animate-spin" />
              ) : isSyncing ? (
                <Radio className="w-6 h-6 text-simulation animate-pulse" />
              ) : (
                <WifiOff className="w-6 h-6 text-critical" />
              )}
              <div>
                <p className="text-sm font-heading font-bold text-critical flex items-center gap-2">
                  {isRestoring ? 'RESTORING CONNECTION...' : isSyncing ? 'DELTA SYNCHRONIZATION IN PROGRESS' : 'COMMUNICATION LOST — EDGE PROCESSING ACTIVE'}
                  <span className="text-[10px] font-mono bg-critical/10 text-critical px-2 py-0.5 rounded font-normal">
                    {digitalTwinStatusText}
                  </span>
                </p>
                <p className="text-xs text-muted-text mt-0.5">
                  {isRestoring
                    ? 'Transceiver acquiring carrier lock with NCPOR Goa mainland gateway (3 second delay)...'
                    : isSyncing
                    ? 'Streaming prioritized buffered telemetry (P1 → P4) to mainland repository...'
                    : 'Local station Digital Twin running autonomously on edge hardware. Telemetry buffered in priority queue.'}
                </p>
              </div>
            </div>

            <button
              onClick={restoreConnection}
              disabled={isRestoring || isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold rounded-lg bg-healthy text-white hover:bg-healthy/90 transition-all disabled:opacity-60 shadow-sm"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>RESTORING CONNECTION...</span>
                </>
              ) : isSyncing ? (
                <>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>SYNCING PACKETS...</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>RESTORE CONNECTION</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Preset Scenario Selector */}
      <div className="bg-white rounded-xl border border-border-color p-4 mb-5 shadow-sm">
        <p className="text-[10px] text-muted-text uppercase font-semibold tracking-wider mb-2.5">
          STANDARD POLAR SCENARIO PRESETS
        </p>
        <div className="flex flex-wrap gap-2">
          {presetKeys.map(p => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`px-3.5 py-2 text-xs font-mono rounded-lg border transition-all ${
                activePreset === p
                  ? p === 'COMPOUND_EMERGENCY'
                    ? 'bg-critical/15 border-critical/50 text-critical font-bold shadow-sm'
                    : 'bg-simulation/15 border-simulation/40 text-simulation font-bold shadow-sm'
                  : 'bg-panel border-border-color text-muted-text hover:border-simulation/30 hover:text-primary-text'
              }`}
            >
              {presetLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Controls (4 cols) & Right Results (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ==================================================== */}
        {/* LEFT COLUMN: SCENARIO CONTROLS                       */}
        {/* ==================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-color">
              <div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-wide text-primary-text">
                  SCENARIO CONTROLS ({controlMode} MODE)
                </h3>
                <p className="text-[10px] text-muted-text">
                  {controlMode === 'AUTO' ? 'Derived variables update automatically' : 'Direct manual override enabled'}
                </p>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                controlMode === 'AUTO' ? 'bg-healthy/15 text-healthy' : 'bg-simulation/15 text-simulation'
              }`}>
                {controlMode}
              </span>
            </div>

            <div className="space-y-2">
              {/* Weather Controls (Always exposed) */}
              <p className="text-[10px] text-frost font-heading font-bold uppercase tracking-wider mt-2 mb-1.5 border-b border-iceberg/30 pb-1">
                WEATHER PARAMETERS
              </p>
              <SliderControl
                label="Ambient Temperature"
                value={scenarioInputs.temperature}
                min={-50} max={-10} unit="°C"
                onChange={v => updateInput('temperature', v)}
                icon={<Thermometer className="w-3.5 h-3.5 text-iceberg" />}
              />
              <SliderControl
                label="Wind Speed (Katabatic)"
                value={scenarioInputs.windSpeed}
                min={0} max={120} unit=" km/h"
                onChange={v => updateInput('windSpeed', v)}
                icon={<Wind className="w-3.5 h-3.5 text-frost" />}
              />
              <SliderControl
                label="Surface Visibility"
                value={scenarioInputs.visibility}
                min={0} max={100} unit="%"
                onChange={v => updateInput('visibility', v)}
                icon={<Eye className="w-3.5 h-3.5 text-glacier" />}
              />

              {/* Generator Controls (Always exposed) */}
              <p className="text-[10px] text-frost font-heading font-bold uppercase tracking-wider mt-4 mb-1.5 border-b border-iceberg/30 pb-1">
                GENERATION UNITS (2×125 kW)
              </p>
              <ToggleControl
                label="Generator 1 Status"
                value={scenarioInputs.generator1Status}
                options={[
                  { value: 'RUNNING' as GeneratorStatus, label: 'RUNNING' },
                  { value: 'FAILED' as GeneratorStatus, label: 'FAILED', color: 'red' }
                ]}
                onChange={v => updateInput('generator1Status', v)}
              />
              <ToggleControl
                label="Generator 2 Status"
                value={scenarioInputs.generator2Status}
                options={[
                  { value: 'RUNNING' as GeneratorStatus, label: 'RUNNING' },
                  { value: 'FAILED' as GeneratorStatus, label: 'FAILED', color: 'red' }
                ]}
                onChange={v => updateInput('generator2Status', v)}
              />

              {/* Fuel Controls (Always exposed) */}
              <p className="text-[10px] text-frost font-heading font-bold uppercase tracking-wider mt-4 mb-1.5 border-b border-iceberg/30 pb-1">
                FUEL RESERVES
              </p>
              <SliderControl
                label="Fuel Reserve Tank"
                value={scenarioInputs.fuelReserve}
                min={0} max={100} unit="%"
                onChange={v => updateInput('fuelReserve', v)}
                icon={<Fuel className="w-3.5 h-3.5 text-warning" />}
              />

              {/* ============================================== */}
              {/* DETAILED CONTROLS — MANUAL MODE ONLY           */}
              {/* ============================================== */}
              {controlMode === 'MANUAL' && (
                <div className="mt-4 pt-3 border-t-2 border-dashed border-simulation/30 space-y-3 bg-simulation/5 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-simulation" />
                    <span className="text-[10px] font-heading font-bold text-simulation uppercase">
                      MANUAL OVERRIDES
                    </span>
                  </div>

                  {/* Heating override */}
                  <ToggleControl
                    label="Thermal Mode"
                    value={scenarioInputs.heatingMode}
                    options={[
                      { value: 'AUTO' as HeatingMode, label: 'AUTO (DERIVED)' },
                      { value: 'MANUAL' as HeatingMode, label: 'MANUAL OVERRIDE' }
                    ]}
                    onChange={v => updateInput('heatingMode', v)}
                    isOverride
                  />
                  {scenarioInputs.heatingMode === 'MANUAL' && (
                    <SliderControl
                      label="Direct Heating Demand"
                      value={scenarioInputs.heatingDemand}
                      min={0} max={100} unit="%"
                      onChange={v => updateInput('heatingDemand', v)}
                      icon={<Flame className="w-3.5 h-3.5 text-warning" />}
                      isOverride
                    />
                  )}

                  {/* Water override */}
                  <ToggleControl
                    label="Water System Status"
                    value={scenarioInputs.waterStatus}
                    options={[
                      { value: 'NORMAL' as WaterStatus, label: 'NORMAL' },
                      { value: 'DEGRADED' as WaterStatus, label: 'DEGRADED', color: 'yellow' },
                      { value: 'FAILED' as WaterStatus, label: 'FAILED', color: 'red' }
                    ]}
                    onChange={v => updateInput('waterStatus', v)}
                    isOverride
                  />

                  {/* Logistics Spares */}
                  <ToggleControl
                    label="Generator Spares Inventory"
                    value={scenarioInputs.generatorSpare}
                    options={[
                      { value: 'AVAILABLE' as SpareAvailability, label: 'AVAIL' },
                      { value: 'LOW' as SpareAvailability, label: 'LOW', color: 'yellow' },
                      { value: 'UNAVAILABLE' as SpareAvailability, label: 'NONE', color: 'red' }
                    ]}
                    onChange={v => updateInput('generatorSpare', v)}
                    isOverride
                  />
                  <ToggleControl
                    label="Heating Spare Inventory"
                    value={scenarioInputs.heatingSpare}
                    options={[
                      { value: 'AVAILABLE' as SpareAvailability, label: 'AVAIL' },
                      { value: 'LOW' as SpareAvailability, label: 'LOW', color: 'yellow' },
                      { value: 'UNAVAILABLE' as SpareAvailability, label: 'NONE', color: 'red' }
                    ]}
                    onChange={v => updateInput('heatingSpare', v)}
                    isOverride
                  />
                  <ToggleControl
                    label="Water Pump Spare"
                    value={scenarioInputs.pumpWaterSpare}
                    options={[
                      { value: 'AVAILABLE' as SpareAvailability, label: 'AVAIL' },
                      { value: 'LOW' as SpareAvailability, label: 'LOW', color: 'yellow' },
                      { value: 'UNAVAILABLE' as SpareAvailability, label: 'NONE', color: 'red' }
                    ]}
                    onChange={v => updateInput('pumpWaterSpare', v)}
                    isOverride
                  />

                  {/* Communication */}
                  <ToggleControl
                    label="Satellite Link State"
                    value={scenarioInputs.communicationStatus}
                    options={[
                      { value: 'ONLINE' as CommunicationStatus, label: 'CONNECTED' },
                      { value: 'OFFLINE' as CommunicationStatus, label: 'OFFLINE', color: 'red' }
                    ]}
                    onChange={v => updateInput('communicationStatus', v)}
                    isOverride
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timeline Event Log */}
          <div className="bg-white rounded-xl border border-border-color p-4 shadow-sm">
            <h3 className="font-heading font-bold text-xs tracking-wide mb-2.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-glacier" />
              SIMULATION PROPAGATION LOG
            </h3>
            <div className="max-h-56 overflow-y-auto scrollbar-thin space-y-1.5 pr-1">
              {eventLog.map(e => (
                <div
                  key={e.id}
                  className={`flex items-start gap-2 py-1.5 px-2 rounded text-[10px] ${
                    e.type === 'CRITICAL' ? 'bg-critical/10 text-critical font-medium' :
                    e.type === 'WARNING' ? 'bg-warning/10 text-warning' :
                    e.type === 'SYSTEM' ? 'bg-simulation/10 text-simulation font-medium' :
                    'bg-panel text-primary-text'
                  }`}
                >
                  <span className="font-mono text-muted-text whitespace-nowrap text-[9px]">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="leading-snug">{e.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: REORDERED PANELS                       */}
        {/* 1. PROJECTED RISK ANALYSIS (FIRST)                   */}
        {/* 2. LIVE VS PROJECTED COMPARISON (SECOND)             */}
        {/* 3. DEPENDENCY GRAPH + SCHEMATIC                      */}
        {/* 4. OFFLINE SYNC QUEUE                                */}
        {/* ==================================================== */}
        <div className="lg:col-span-8 space-y-5">
          {/* PANEL 1: PROJECTED RISK ANALYSIS (Moved to top) */}
          <div className="bg-white rounded-xl border border-border-color p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-color">
              <h3 className="font-heading font-bold text-sm tracking-wide text-primary-text flex items-center gap-2">
                <Shield className="w-4 h-4 text-simulation" />
                PROJECTED RISK ANALYSIS &amp; ADVISORY
              </h3>
              <SimulatedBadge />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              {/* Big Percentage Risk Score */}
              <div className="text-center bg-panel rounded-xl p-5 border border-border-color/60 flex flex-col justify-center items-center">
                <p className="text-[10px] text-muted-text uppercase font-semibold mb-1">PROJECTED STATION RISK</p>
                <p className={`text-4xl font-mono font-bold my-1 ${
                  projectedState.risk.level === 'CRITICAL' ? 'text-critical risk-pulse' :
                  projectedState.risk.level === 'HIGH' ? 'text-critical' :
                  projectedState.risk.level === 'MODERATE' ? 'text-warning' : 'text-healthy'
                }`}>
                  {projectedState.risk.overallScore.toFixed(1)}%
                </p>
                <div className="mt-1">
                  <RiskBadge level={projectedState.risk.level} size="md" />
                </div>
                <p className="text-[10px] font-mono text-muted-text mt-2">
                  Live: {liveState.risk.overallScore.toFixed(1)}% ({liveState.risk.level})
                </p>
              </div>

              {/* Breakdown Bar Gauges */}
              <div className="bg-panel rounded-xl p-4 border border-border-color/60">
                <p className="text-[10px] text-muted-text uppercase font-semibold mb-2">DOMAIN RISK BREAKDOWN</p>
                {Object.entries(projectedState.risk.breakdown).map(([key, val]) => {
                  const maxW = key === 'power' ? 25 : key === 'weather' || key === 'heating' || key === 'fuel' ? 15 : 10;
                  const pct = (val / maxW) * 100;
                  return (
                    <div key={key} className="mb-2">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-muted-text uppercase font-mono">{key}</span>
                        <span className="font-mono font-semibold">{val.toFixed(1)} / {maxW}</span>
                      </div>
                      <div className="h-1.5 bg-border-color rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct > 70 ? 'bg-critical' : pct > 40 ? 'bg-warning' : 'bg-healthy'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Critical Risk Drivers */}
              <div className="bg-panel rounded-xl p-4 border border-border-color/60 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-muted-text uppercase font-semibold mb-2">CRITICAL RISK DRIVERS</p>
                  <div className="space-y-1.5">
                    {projectedState.risk.drivers.map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 flex-shrink-0" />
                        <span className="text-[11px] text-primary-text leading-tight">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-border-color/60 text-[9px] font-mono text-muted-text">
                  Twin State: <span className="font-semibold text-primary-text">{digitalTwinStatusText}</span>
                </div>
              </div>
            </div>

            {/* Advisory Recommendations */}
            <div className="bg-panel rounded-xl p-4 border border-border-color/60">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-muted-text font-semibold uppercase">DECISION SUPPORT &amp; ADVISORY</p>
                <span className="text-[9px] font-mono text-simulation px-2 py-0.5 bg-simulation/10 rounded border border-simulation/20 font-bold">
                  ADVISORY ONLY — NO REMOTE ACTUATION
                </span>
              </div>
              <div className="space-y-1.5">
                {projectedState.risk.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-frost font-bold">→</span>
                    <span className="text-primary-text">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL 2: LIVE VS PROJECTED COMPARISON (Second in order) */}
          <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-color">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-simulation" />
                LIVE BASELINE vs. PROJECTED SCENARIO TELEMETRY
              </h3>
              <span className="text-[9px] font-mono text-muted-text">
                Highlighted rows indicate scenario divergence
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 px-2.5 text-[10px] font-heading font-bold text-muted-text border-b-2 border-border-color uppercase">
              <span>PARAMETER</span>
              <span className="text-center">LIVE BASELINE</span>
              <span className="text-center text-simulation">PROJECTED STATE</span>
            </div>

            <div className="divide-y divide-border-color/40">
              <CompareRow label="Ambient Temperature" liveVal={liveState.environment.temperature} projVal={projectedState.environment.temperature} unit="°C" />
              <CompareRow label="Wind Speed" liveVal={liveState.environment.windSpeed} projVal={projectedState.environment.windSpeed} unit=" km/h" />
              <CompareRow label="Weather Severity" liveVal={liveState.environment.weatherSeverity} projVal={projectedState.environment.weatherSeverity} />
              <CompareRow label="Heating Demand" liveVal={liveState.heating.demandPercent} projVal={projectedState.heating.demandPercent} unit="%" />
              <CompareRow label="Gen 1 Status" liveVal={liveState.power.generator1.status} projVal={projectedState.power.generator1.status} />
              <CompareRow label="Gen 1 Output" liveVal={liveState.power.generator1.outputKW} projVal={projectedState.power.generator1.outputKW} unit=" kW" />
              <CompareRow label="Gen 2 Status" liveVal={liveState.power.generator2.status} projVal={projectedState.power.generator2.status} />
              <CompareRow label="Gen 2 Output" liveVal={liveState.power.generator2.outputKW} projVal={projectedState.power.generator2.outputKW} unit=" kW" />
              <CompareRow label="Installed Capacity" liveVal={liveState.power.installedCapacityKW} projVal={projectedState.power.installedCapacityKW} unit=" kW" />
              <CompareRow label="Available Generation" liveVal={liveState.power.totalGenerationKW} projVal={projectedState.power.totalGenerationKW} unit=" kW" />
              <CompareRow label="Station Demand" liveVal={liveState.power.currentDemandKW} projVal={projectedState.power.currentDemandKW} unit=" kW" />
              <CompareRow label="Capacity Headroom" liveVal={liveState.power.capacityHeadroomPercent.toFixed(1)} projVal={projectedState.power.capacityHeadroomPercent.toFixed(1)} unit="%" />
              <CompareRow label="Redundancy" liveVal={liveState.power.hasRedundancy ? 'AVAILABLE' : 'UNAVAILABLE'} projVal={projectedState.power.hasRedundancy ? 'AVAILABLE' : 'UNAVAILABLE'} />
              <CompareRow label="Fuel Reserve" liveVal={liveState.fuel.reservePercent} projVal={projectedState.fuel.reservePercent} unit="%" />
              <CompareRow label="Fuel Consumption" liveVal={liveState.fuel.consumptionLPerHr.toFixed(1)} projVal={projectedState.fuel.consumptionLPerHr.toFixed(1)} unit=" L/hr" />
              <CompareRow label="Fuel Endurance (SIMULATED EST.)" liveVal={liveState.fuel.estimatedEnduranceDays.toFixed(1)} projVal={projectedState.fuel.estimatedEnduranceDays.toFixed(1)} unit=" days" />
              <CompareRow label="Water Status" liveVal={liveState.water.status} projVal={projectedState.water.status} />
              <CompareRow label="Water Vulnerability" liveVal={liveState.water.vulnerabilityPercent} projVal={projectedState.water.vulnerabilityPercent} unit="%" />
              <CompareRow label="Communication Link" liveVal={liveState.communication.status} projVal={projectedState.communication.status} />
            </div>

            {/* Highlighted Risk Row */}
            <div className="grid grid-cols-3 py-2.5 px-2.5 text-xs mt-2 bg-panel rounded-lg font-bold border border-border-color">
              <span className="text-primary-text">COMPOSITE RISK PERCENTAGE</span>
              <span className="text-center font-mono">{liveState.risk.overallScore.toFixed(1)}% ({liveState.risk.level})</span>
              <span className="text-center font-mono text-simulation font-bold">
                {projectedState.risk.overallScore.toFixed(1)}% ({projectedState.risk.level})
              </span>
            </div>
          </div>

          {/* PANEL 3: DEPENDENCY GRAPH & 2D SCHEMATIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DependencyGraph station={projectedState} />
            <StationSchematic station={projectedState} />
          </div>

          {/* PANEL 4: OFFLINE SYNC QUEUE */}
          {(isOffline || isRestoring || isSyncing || syncQueue.length > 0) && (
            <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-color">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-glacier" />
                  OFFLINE PRIORITY BUFFER QUEUE (P1 → P4)
                </h3>
                <span className="text-[10px] font-mono text-muted-text">
                  {isSyncing ? 'ACTIVE DELTA SYNC' : isRestoring ? 'ACQUIRING LINK' : 'OFFLINE BUFFERING'}
                </span>
              </div>

              <div className="space-y-2">
                {syncQueue.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      item.status === 'SYNCED' ? 'bg-healthy/10 border-healthy/30' :
                      item.status === 'SYNCING' ? 'bg-simulation/10 border-simulation/30' :
                      'bg-panel border-border-color'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.priority === 'P1' ? 'bg-critical/15 text-critical' :
                        item.priority === 'P2' ? 'bg-warning/15 text-warning' :
                        item.priority === 'P3' ? 'bg-frost/25 text-primary-text' :
                        'bg-panel text-muted-text'
                      }`}>
                        {item.priority}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-primary-text">{item.label}</p>
                        <p className="text-[10px] text-muted-text">{item.description}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold ${
                      item.status === 'SYNCED' ? 'text-healthy' :
                      item.status === 'SYNCING' ? 'text-simulation flex items-center gap-1' :
                      'text-muted-text'
                    }`}>
                      {item.status === 'SYNCING' && <Loader2 className="w-3 h-3 animate-spin" />}
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {syncQueue.every(s => s.status === 'SYNCED') && syncQueue.length > 0 && (
                <div className="mt-3 p-3 bg-healthy/10 border border-healthy/30 rounded-lg text-center">
                  <p className="text-xs font-mono text-healthy font-bold">
                    ✓ ALL CRITICAL EVENTS SYNCHRONIZED — NCPOR / GOA MAINLAND REPOSITORY UPDATED
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
