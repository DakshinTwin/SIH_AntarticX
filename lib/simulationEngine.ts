// =============================================
// DAKSHIN-Twin Simulation Engine
// Deterministic calculation engine for station state
// =============================================

import {
  ScenarioInputs, StationState, EnvironmentState, PowerState, FuelState,
  HeatingState, WaterState, RiskState, RiskBreakdown, RiskLevel,
  WeatherSeverity, InventoryState, CommunicationState, Alert, StationId
} from './types';

// ---- CONSTANTS ----
const GENERATOR_UNIT_KW = 125;
const TOTAL_INSTALLED_CAPACITY_KW = 250;
const TOTAL_FUEL_CAPACITY_L = 45000;

// =============================================
// WEATHER SEVERITY
// =============================================
export function calculateWeatherSeverity(temp: number, wind: number, visibility: number): WeatherSeverity {
  let score = 0;
  if (temp < -45) score += 4;
  else if (temp < -35) score += 3;
  else if (temp < -30) score += 2;
  else if (temp < -20) score += 1;

  if (wind > 100) score += 4;
  else if (wind > 80) score += 3;
  else if (wind > 50) score += 2;
  else if (wind > 30) score += 1;

  if (visibility < 10) score += 3;
  else if (visibility < 30) score += 2;
  else if (visibility < 50) score += 1;

  if (score >= 8) return 'EXTREME';
  if (score >= 5) return 'HIGH';
  if (score >= 3) return 'MEDIUM';
  return 'LOW';
}

// =============================================
// HEATING DEMAND
// =============================================
export function calculateHeatingDemand(temp: number, wind: number, mode: 'AUTO' | 'MANUAL', manualDemand: number): number {
  if (mode === 'MANUAL') return Math.min(100, Math.max(0, manualDemand));

  let demand = 55;
  if (temp < -20) {
    demand += Math.abs(temp + 20) / 5 * 7;
  }
  if (wind > 30) {
    demand += (wind - 30) * 0.15;
  }
  return Math.min(100, Math.max(0, Math.round(demand)));
}

// =============================================
// POWER STATE (INSTALLED, GENERATION, DEMAND, HEADROOM)
// =============================================
export function calculatePowerState(inputs: ScenarioInputs, heatingDemand: number, stationId: StationId = 'bharati'): PowerState {
  const gen1Running = inputs.generator1Status === 'RUNNING';
  const gen2Running = inputs.generator2Status === 'RUNNING';

  const availableCapacityKW = (gen1Running ? GENERATOR_UNIT_KW : 0) + (gen2Running ? GENERATOR_UNIT_KW : 0);

  // Base station electrical demand
  const baseDemandKW = stationId === 'maitri' ? 72 : 65;
  // Heating electrical load contribution
  const heatingDemandKW = (heatingDemand / 100) * 80;
  const totalDemandKW = Math.round(baseDemandKW + heatingDemandKW);

  let gen1Load = 0, gen2Load = 0, gen1Output = 0, gen2Output = 0;

  if (gen1Running && gen2Running) {
    // Both running: load shared symmetrically
    const halfDemand = totalDemandKW / 2;
    gen1Output = Math.round(halfDemand);
    gen2Output = totalDemandKW - gen1Output;
    gen1Load = Math.min(100, Math.round((gen1Output / GENERATOR_UNIT_KW) * 100));
    gen2Load = Math.min(100, Math.round((gen2Output / GENERATOR_UNIT_KW) * 100));
  } else if (gen1Running) {
    // Gen 1 carries total demand up to its 125 kW ceiling
    gen1Output = Math.min(GENERATOR_UNIT_KW, totalDemandKW);
    gen1Load = Math.min(100, Math.round((gen1Output / GENERATOR_UNIT_KW) * 100));
    gen2Output = 0;
    gen2Load = 0;
  } else if (gen2Running) {
    // Gen 2 carries total demand up to its 125 kW ceiling
    gen2Output = Math.min(GENERATOR_UNIT_KW, totalDemandKW);
    gen2Load = Math.min(100, Math.round((gen2Output / GENERATOR_UNIT_KW) * 100));
    gen1Output = 0;
    gen1Load = 0;
  } else {
    // Total generator blackout
    gen1Output = 0;
    gen2Output = 0;
    gen1Load = 0;
    gen2Load = 0;
  }

  const totalGeneration = gen1Output + gen2Output;

  // Capacity Headroom / Power Margin:
  // (Available Generation Capacity - Current Demand) / Available Generation Capacity * 100%
  const headroom = availableCapacityKW > 0
    ? Math.round(((availableCapacityKW - totalDemandKW) / availableCapacityKW) * 1000) / 10
    : -100.0;

  return {
    installedCapacityKW: TOTAL_INSTALLED_CAPACITY_KW,
    availableCapacityKW,
    generator1: { status: inputs.generator1Status, load: gen1Load, outputKW: gen1Output },
    generator2: { status: inputs.generator2Status, load: gen2Load, outputKW: gen2Output },
    totalGenerationKW: totalGeneration,
    currentDemandKW: totalDemandKW,
    capacityHeadroomPercent: headroom,
    powerMarginPercent: headroom,
    hasRedundancy: gen1Running && gen2Running,
  };
}

// =============================================
// FUEL STATE
// =============================================
export function calculateFuelState(fuelReserve: number, power: PowerState): FuelState {
  const gen1Consumption = power.generator1.status === 'RUNNING'
    ? 8 + (power.generator1.load / 100) * 12 : 0;
  const gen2Consumption = power.generator2.status === 'RUNNING'
    ? 8 + (power.generator2.load / 100) * 12 : 0;

  const totalConsumption = Math.round((gen1Consumption + gen2Consumption) * 10) / 10;
  const currentFuelL = (fuelReserve / 100) * TOTAL_FUEL_CAPACITY_L;
  const enduranceHours = totalConsumption > 0 ? currentFuelL / totalConsumption : 9999;
  const enduranceDays = Math.round(enduranceHours / 24 * 10) / 10;

  let fuelRisk: RiskLevel = 'LOW';
  if (fuelReserve < 20 || enduranceDays < 15) fuelRisk = 'CRITICAL';
  else if (fuelReserve < 35 || enduranceDays < 30) fuelRisk = 'HIGH';
  else if (fuelReserve < 50 || enduranceDays < 60) fuelRisk = 'MODERATE';

  return {
    reservePercent: fuelReserve,
    consumptionLPerHr: totalConsumption,
    estimatedEnduranceDays: Math.min(enduranceDays, 999),
    fuelRisk,
  };
}

// =============================================
// WATER VULNERABILITY
// =============================================
export function calculateWaterVulnerability(waterStatus: 'NORMAL' | 'DEGRADED' | 'FAILED', headroomPercent: number, heatingDemand: number): number {
  let vulnerability = 0;
  if (waterStatus === 'FAILED') vulnerability = 90;
  else if (waterStatus === 'DEGRADED') vulnerability = 45;
  else vulnerability = 5;

  if (headroomPercent < 10) vulnerability += 25;
  else if (headroomPercent < 20) vulnerability += 15;
  else if (headroomPercent < 30) vulnerability += 5;

  if (heatingDemand > 85) vulnerability += 10;
  return Math.min(100, vulnerability);
}

// =============================================
// RISK BREAKDOWN & COMPOSITE SCORE (0.0 - 100.0%)
// =============================================
export function calculateRiskBreakdown(
  env: EnvironmentState, power: PowerState, heating: HeatingState,
  fuel: FuelState, waterVulnerability: number, inventory: InventoryState,
  commStatus: 'ONLINE' | 'OFFLINE'
): RiskBreakdown {
  // Weather (0-15)
  let weather = 0;
  if (env.weatherSeverity === 'EXTREME') weather = 15;
  else if (env.weatherSeverity === 'HIGH') weather = 11;
  else if (env.weatherSeverity === 'MEDIUM') weather = 6;
  else weather = 2;

  // Power (0-25)
  let powerRisk = 0;
  if (power.generator1.status === 'FAILED' && power.generator2.status === 'FAILED') {
    powerRisk = 25;
  } else {
    if (power.capacityHeadroomPercent < 0) powerRisk += 20;
    else if (power.capacityHeadroomPercent < 10) powerRisk += 15;
    else if (power.capacityHeadroomPercent < 20) powerRisk += 10;
    else if (power.capacityHeadroomPercent < 35) powerRisk += 5;
    else powerRisk += 1;

    if (!power.hasRedundancy) powerRisk += 5;
  }
  powerRisk = Math.min(25, powerRisk);

  // Heating (0-15)
  let heatingRisk = 0;
  if (heating.demandPercent > 90) heatingRisk = 13;
  else if (heating.demandPercent > 80) heatingRisk = 9;
  else if (heating.demandPercent > 70) heatingRisk = 5;
  else heatingRisk = 1;
  if (power.capacityHeadroomPercent < 15 && heating.demandPercent > 75) heatingRisk = Math.min(15, heatingRisk + 3);

  // Fuel (0-15)
  let fuelRisk = 0;
  if (fuel.fuelRisk === 'CRITICAL') fuelRisk = 15;
  else if (fuel.fuelRisk === 'HIGH') fuelRisk = 11;
  else if (fuel.fuelRisk === 'MODERATE') fuelRisk = 6;
  else fuelRisk = 1;

  // Water (0-10)
  const waterRisk = Math.round(waterVulnerability / 100 * 10);

  // Logistics (0-10)
  let logisticsRisk = 0;
  const spares = [inventory.generatorSpare, inventory.heatingSpare, inventory.pumpWaterSpare];
  logisticsRisk = spares.filter(s => s === 'UNAVAILABLE').length * 3.5 + spares.filter(s => s === 'LOW').length * 1.5;
  if ((power.generator1.status === 'FAILED' || power.generator2.status === 'FAILED') && inventory.generatorSpare === 'UNAVAILABLE') {
    logisticsRisk += 3.5;
  }
  logisticsRisk = Math.min(10, Math.round(logisticsRisk * 10) / 10);

  // Communication (0-10)
  const communication = commStatus === 'OFFLINE' ? 7 : 1;

  return { weather, power: powerRisk, heating: heatingRisk, fuel: fuelRisk, water: waterRisk, logistics: logisticsRisk, communication };
}

export function calculateOverallRisk(breakdown: RiskBreakdown): { score: number; level: RiskLevel } {
  const sum = breakdown.weather + breakdown.power + breakdown.heating + breakdown.fuel + breakdown.water + breakdown.logistics + breakdown.communication;
  const score = Math.min(100.0, Math.max(0.0, Math.round(sum * 10) / 10));
  let level: RiskLevel = 'LOW';
  if (score >= 75.0) level = 'CRITICAL';
  else if (score >= 50.0) level = 'HIGH';
  else if (score >= 25.0) level = 'MODERATE';
  return { score, level };
}

// =============================================
// RISK DRIVERS
// =============================================
export function generateRiskDrivers(breakdown: RiskBreakdown, inputs: ScenarioInputs, power: PowerState, fuel: FuelState): string[] {
  const drivers: string[] = [];
  if (breakdown.weather >= 11) drivers.push('Severe polar blizzard conditions');
  else if (breakdown.weather >= 6) drivers.push('Adverse Antarctic weather conditions');
  if (breakdown.power >= 15) drivers.push('Critical capacity headroom deficit');
  else if (breakdown.power >= 10) drivers.push('Reduced electrical capacity headroom');
  if (!power.hasRedundancy) drivers.push('Single generator operation (no redundancy)');
  if (inputs.generator1Status === 'FAILED') drivers.push('Generator 1 offline/failed');
  if (inputs.generator2Status === 'FAILED') drivers.push('Generator 2 offline/failed');
  if (breakdown.heating >= 9) drivers.push('Elevated heating demand load');
  if (breakdown.fuel >= 11) drivers.push('Depleted fuel reserves (<35%)');
  else if (fuel.consumptionLPerHr > 22) drivers.push('Elevated fuel consumption rate');
  if (breakdown.water >= 5) drivers.push('Water supply system vulnerability');
  if (inputs.generatorSpare === 'UNAVAILABLE') drivers.push('Generator critical spares unavailable');
  if (inputs.heatingSpare === 'LOW') drivers.push('Heating system buffer spare low');
  if (breakdown.communication >= 5) drivers.push('Satellite communication link offline');
  if (drivers.length === 0) drivers.push('All station systems within nominal parameters');
  return drivers;
}

// =============================================
// RECOMMENDATIONS (ADVISORY ONLY)
// =============================================
export function generateRecommendations(breakdown: RiskBreakdown, inputs: ScenarioInputs, power: PowerState, fuel: FuelState): string[] {
  const recs: string[] = [];
  if (inputs.generator1Status === 'FAILED' || inputs.generator2Status === 'FAILED') {
    const failed = inputs.generator1Status === 'FAILED' ? '1' : '2';
    recs.push(`Prioritize Generator ${failed} maintenance intervention and diagnostic check.`);
    if (inputs.generatorSpare === 'UNAVAILABLE') recs.push('Escalate logistics requisition for generator overhaul components.');
  }
  if (power.capacityHeadroomPercent < 15) recs.push('Review non-essential scientific laboratory power loads.');
  if (fuel.fuelRisk === 'CRITICAL' || fuel.fuelRisk === 'HIGH') recs.push('Implement fuel conservation protocol and monitor thermal loop efficiency.');
  if (breakdown.heating >= 9) recs.push('Inspect secondary thermal heat exchangers and trace heating.');
  if (breakdown.water >= 5) recs.push('Verify desalination and freeze-protection line heaters.');
  if (inputs.communicationStatus === 'OFFLINE') {
    recs.push('Buffer telemetry in local priority queue (P1–P4).');
    recs.push('Maintain autonomous edge operations logbook.');
  }
  if (breakdown.weather >= 11) recs.push('Issue outdoor traverse restriction — red weather alert.');
  if (recs.length === 0) {
    recs.push('Continue standard polar wintering routine.');
    recs.push('Maintain scheduled telemetry synchronization intervals.');
  }
  return recs;
}

// =============================================
// GENERATE ALERTS
// =============================================
function generateAlerts(inputs: ScenarioInputs, power: PowerState, fuel: FuelState, weatherSeverity: WeatherSeverity, heatingDemand: number, stationId: StationId): Alert[] {
  const alerts: Alert[] = [];
  const ts = new Date().toISOString();

  if (inputs.generator1Status === 'FAILED') alerts.push({ id: 'gen1-fail', timestamp: ts, severity: 'CRITICAL', title: 'Generator 1 Failure', message: 'Generator 1 offline. Station operating on single generator with no redundancy.', system: 'Power' });
  if (inputs.generator2Status === 'FAILED') alerts.push({ id: 'gen2-fail', timestamp: ts, severity: 'CRITICAL', title: 'Generator 2 Failure', message: 'Generator 2 offline. Station operating on single generator with no redundancy.', system: 'Power' });
  if (power.capacityHeadroomPercent < 10) alerts.push({ id: 'low-headroom', timestamp: ts, severity: 'CRITICAL', title: 'Critical Capacity Headroom', message: `Capacity headroom at ${power.capacityHeadroomPercent.toFixed(1)}%. Non-essential load shedding advised.`, system: 'Power' });
  if (fuel.fuelRisk === 'CRITICAL') alerts.push({ id: 'fuel-critical', timestamp: ts, severity: 'CRITICAL', title: 'Fuel Reserve Critical', message: `Fuel reserve at ${fuel.reservePercent}%. Estimated endurance: ${fuel.estimatedEnduranceDays.toFixed(1)} days.`, system: 'Fuel' });
  if (weatherSeverity === 'EXTREME') alerts.push({ id: 'weather-extreme', timestamp: ts, severity: 'CRITICAL', title: 'Extreme Weather Blizzard', message: `Temperature: ${inputs.temperature}°C, Wind: ${inputs.windSpeed} km/h. Outdoor movement suspended.`, system: 'Environment' });
  if (heatingDemand > 85) alerts.push({ id: 'heating-high', timestamp: ts, severity: 'WARNING', title: 'High Heating Demand', message: `Heating system thermal demand at ${heatingDemand}%.`, system: 'Heating' });
  if (inputs.communicationStatus === 'OFFLINE') alerts.push({ id: 'comm-offline', timestamp: ts, severity: 'WARNING', title: 'Satellite Communication Link Offline', message: 'VSAT/Iridium carrier unavailable. Local edge processing active.', system: 'Communication' });
  if (inputs.waterStatus === 'FAILED') alerts.push({ id: 'water-fail', timestamp: ts, severity: 'CRITICAL', title: 'Water System Failure', message: 'Fresh water distribution / treatment loop fault.', system: 'Water' });
  if (inputs.waterStatus === 'DEGRADED') alerts.push({ id: 'water-deg', timestamp: ts, severity: 'WARNING', title: 'Water System Degraded', message: 'Water filtration running in bypass mode.', system: 'Water' });

  // Station specific baseline alerts
  if (stationId === 'maitri' && inputs.heatingSpare === 'LOW') {
    alerts.push({ id: 'maitri-heat-spare', timestamp: ts, severity: 'WARNING', title: 'Heating Buffer Spare Low', message: 'Maitri central boiler primary spare low; running on secondary heat exchanger.', system: 'Logistics' });
  }

  return alerts;
}

// =============================================
// FULL STATE CALCULATOR
// =============================================
export function calculateFullState(inputs: ScenarioInputs, stationId: StationId): StationState {
  const weatherSeverity = calculateWeatherSeverity(inputs.temperature, inputs.windSpeed, inputs.visibility);
  const heatingDemand = calculateHeatingDemand(inputs.temperature, inputs.windSpeed, inputs.heatingMode, inputs.heatingDemand);
  const power = calculatePowerState(inputs, heatingDemand, stationId);
  const fuel = calculateFuelState(inputs.fuelReserve, power);
  const waterVuln = calculateWaterVulnerability(inputs.waterStatus, power.capacityHeadroomPercent, heatingDemand);

  const env: EnvironmentState = { temperature: inputs.temperature, windSpeed: inputs.windSpeed, visibility: inputs.visibility, weatherSeverity };
  const heating: HeatingState = {
    mode: inputs.heatingMode, demandPercent: heatingDemand,
    thermalRisk: heatingDemand > 90 ? 'CRITICAL' : heatingDemand > 80 ? 'HIGH' : heatingDemand > 70 ? 'MODERATE' : 'LOW',
  };
  const inventory: InventoryState = { generatorSpare: inputs.generatorSpare, heatingSpare: inputs.heatingSpare, pumpWaterSpare: inputs.pumpWaterSpare };
  const comm: CommunicationState = {
    status: inputs.communicationStatus,
    lastSyncTimestamp: new Date().toISOString(),
    pendingSyncEvents: inputs.communicationStatus === 'OFFLINE' ? 12 : 0,
  };

  const riskBreakdown = calculateRiskBreakdown(env, power, heating, fuel, waterVuln, inventory, inputs.communicationStatus);
  const { score, level } = calculateOverallRisk(riskBreakdown);
  const drivers = generateRiskDrivers(riskBreakdown, inputs, power, fuel);
  const recommendations = generateRecommendations(riskBreakdown, inputs, power, fuel);
  const risk: RiskState = { overallScore: score, level, breakdown: riskBreakdown, drivers, recommendations };
  const alerts = generateAlerts(inputs, power, fuel, weatherSeverity, heatingDemand, stationId);

  return {
    stationId, stationName: stationId === 'bharati' ? 'Bharati' : 'Maitri',
    environment: env, power, fuel, heating,
    water: { status: inputs.waterStatus, vulnerabilityPercent: waterVuln },
    inventory, communication: comm, risk, alerts,
    lastUpdated: new Date().toISOString(),
  };
}
