import { ScenarioInputs, PresetScenario } from './types';

export function getPresetScenario(preset: PresetScenario, baseline: ScenarioInputs): ScenarioInputs {
  switch (preset) {
    case 'NORMAL':
      return { ...baseline };
    case 'SEVERE_BLIZZARD':
      return { ...baseline, temperature: -35, windSpeed: 95, visibility: 12, heatingMode: 'AUTO' };
    case 'EXTREME_COLD':
      return { ...baseline, temperature: -48, windSpeed: 15, visibility: 65, heatingMode: 'AUTO' };
    case 'GENERATOR_2_FAILURE':
      return { ...baseline, generator2Status: 'FAILED', generator2Load: 0 };
    case 'LOW_FUEL':
      return { ...baseline, fuelReserve: 22 };
    case 'COMMUNICATION_OUTAGE':
      return { ...baseline, communicationStatus: 'OFFLINE' };
    case 'COMPOUND_EMERGENCY':
      return { ...baseline, temperature: -42, windSpeed: 85, visibility: 15, generator2Status: 'FAILED', generator2Load: 0, fuelReserve: 38, generatorSpare: 'LOW', heatingSpare: 'LOW', communicationStatus: 'OFFLINE', heatingMode: 'AUTO' };
    default:
      return { ...baseline };
  }
}

export const presetLabels: Record<PresetScenario, string> = {
  NORMAL: 'Normal Operations',
  SEVERE_BLIZZARD: 'Severe Blizzard',
  EXTREME_COLD: 'Extreme Cold Snap',
  GENERATOR_2_FAILURE: 'Generator 2 Failure',
  LOW_FUEL: 'Low Fuel Reserve',
  COMMUNICATION_OUTAGE: 'Communication Outage',
  COMPOUND_EMERGENCY: 'Compound Antarctic Emergency',
};

export const presetIcons: Record<PresetScenario, string> = {
  NORMAL: '✓',
  SEVERE_BLIZZARD: '❄',
  EXTREME_COLD: '◆',
  GENERATOR_2_FAILURE: '⚡',
  LOW_FUEL: '▼',
  COMMUNICATION_OUTAGE: '◎',
  COMPOUND_EMERGENCY: '⚠',
};
