// =============================================
// DAKSHIN-Twin Type Definitions
// =============================================

export type StationId = 'bharati' | 'maitri';
export type GeneratorStatus = 'RUNNING' | 'FAILED';
export type WaterStatus = 'NORMAL' | 'DEGRADED' | 'FAILED';
export type SpareAvailability = 'AVAILABLE' | 'LOW' | 'UNAVAILABLE';
export type CommunicationStatus = 'ONLINE' | 'OFFLINE';
export type HeatingMode = 'AUTO' | 'MANUAL';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type WeatherSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
export type SyncPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type SyncItemStatus = 'PENDING' | 'SYNCING' | 'SYNCED';

export interface GeneratorState {
  status: GeneratorStatus;
  load: number;
  outputKW: number;
}

export interface EnvironmentState {
  temperature: number;
  windSpeed: number;
  visibility: number;
  weatherSeverity: WeatherSeverity;
}

export interface PowerState {
  installedCapacityKW: number;
  availableCapacityKW: number;
  generator1: GeneratorState;
  generator2: GeneratorState;
  totalGenerationKW: number;
  currentDemandKW: number;
  capacityHeadroomPercent: number;
  powerMarginPercent: number; // Backwards compatible alias for capacityHeadroomPercent
  hasRedundancy: boolean;
}

export interface FuelState {
  reservePercent: number;
  consumptionLPerHr: number;
  estimatedEnduranceDays: number;
  fuelRisk: RiskLevel;
}

export interface HeatingState {
  mode: HeatingMode;
  demandPercent: number;
  thermalRisk: RiskLevel;
}

export interface WaterState {
  status: WaterStatus;
  vulnerabilityPercent: number;
}

export interface InventoryState {
  generatorSpare: SpareAvailability;
  heatingSpare: SpareAvailability;
  pumpWaterSpare: SpareAvailability;
}

export interface CommunicationState {
  status: CommunicationStatus;
  lastSyncTimestamp: string;
  pendingSyncEvents: number;
}

export interface RiskBreakdown {
  weather: number;
  power: number;
  heating: number;
  fuel: number;
  water: number;
  logistics: number;
  communication: number;
}

export interface RiskState {
  overallScore: number;
  level: RiskLevel;
  breakdown: RiskBreakdown;
  drivers: string[];
  recommendations: string[];
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  system: string;
}

export interface EventLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SYSTEM';
}

export interface SyncQueueItem {
  id: string;
  priority: SyncPriority;
  label: string;
  description: string;
  status: SyncItemStatus;
  timestamp: string;
}

export interface StationState {
  stationId: StationId;
  stationName: string;
  environment: EnvironmentState;
  power: PowerState;
  fuel: FuelState;
  heating: HeatingState;
  water: WaterState;
  inventory: InventoryState;
  communication: CommunicationState;
  risk: RiskState;
  alerts: Alert[];
  lastUpdated: string;
}

export interface ScenarioInputs {
  temperature: number;
  windSpeed: number;
  visibility: number;
  generator1Status: GeneratorStatus;
  generator1Load: number;
  generator2Status: GeneratorStatus;
  generator2Load: number;
  fuelReserve: number;
  heatingMode: HeatingMode;
  heatingDemand: number;
  waterStatus: WaterStatus;
  generatorSpare: SpareAvailability;
  heatingSpare: SpareAvailability;
  pumpWaterSpare: SpareAvailability;
  communicationStatus: CommunicationStatus;
}

export interface DependencyNode {
  id: string;
  label: string;
  status: RiskLevel;
  value?: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export type PresetScenario = 'NORMAL' | 'SEVERE_BLIZZARD' | 'EXTREME_COLD' | 'GENERATOR_2_FAILURE' | 'LOW_FUEL' | 'COMMUNICATION_OUTAGE' | 'COMPOUND_EMERGENCY';

export interface StationProfile {
  name: string;
  fullName: string;
  location: string;
  coordinates: string;
  elevation: string;
  established: string;
  operationalRole: string;
  environment: string;
  majorSystems: string[];
}
