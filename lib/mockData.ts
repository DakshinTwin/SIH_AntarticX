import { ScenarioInputs, StationProfile } from './types';

export const bharatiBaselineInputs: ScenarioInputs = {
  temperature: -25,
  windSpeed: 20,
  visibility: 82,
  generator1Status: 'RUNNING',
  generator1Load: 46,
  generator2Status: 'RUNNING',
  generator2Load: 46,
  fuelReserve: 82,
  heatingMode: 'AUTO',
  heatingDemand: 62,
  waterStatus: 'NORMAL',
  generatorSpare: 'AVAILABLE',
  heatingSpare: 'AVAILABLE',
  pumpWaterSpare: 'AVAILABLE',
  communicationStatus: 'ONLINE',
};

export const maitriBaselineInputs: ScenarioInputs = {
  temperature: -16,
  windSpeed: 48,
  visibility: 58,
  generator1Status: 'RUNNING',
  generator1Load: 58,
  generator2Status: 'RUNNING',
  generator2Load: 52,
  fuelReserve: 58,
  heatingMode: 'AUTO',
  heatingDemand: 68,
  waterStatus: 'NORMAL',
  generatorSpare: 'AVAILABLE',
  heatingSpare: 'LOW',
  pumpWaterSpare: 'AVAILABLE',
  communicationStatus: 'ONLINE',
};

export const bharatiProfile: StationProfile = {
  name: 'Bharati',
  fullName: 'Indian Antarctic Research Station — Bharati',
  location: 'Larsemann Hills, East Antarctica',
  coordinates: '69°24′S 76°12′E',
  elevation: '35 m above sea level',
  established: '2012',
  operationalRole: 'Year-round advanced research and logistics hub (modern modular containerized design)',
  environment: 'Coastal continental Antarctic — severe blizzards, extended polar night, katabatic winds',
  majorSystems: [
    'Diesel Power Generation (2×125 kW synchronised)',
    'Automated Central HVAC & Heating Loop',
    'Reverse Osmosis Desalination & Waste Water Treatment',
    'Dual-redundant VSAT & Iridium Satellite Comms',
    'Integrated Physical Oceanography & Atmospheric Labs',
    'Regulated Living Quarters (134 container units)'
  ],
};

export const maitriProfile: StationProfile = {
  name: 'Maitri',
  fullName: 'Indian Antarctic Research Station — Maitri',
  location: 'Schirmacher Oasis, East Antarctica',
  coordinates: '70°46′S 11°44′E',
  elevation: '117 m above sea level',
  established: '1989',
  operationalRole: 'Year-round multidisciplinary polar observatory & geosciences research base',
  environment: 'Ice-free rocky oasis terrain — high katabatic wind shear, sub-zero lake ecology (Lake Priyadarshini)',
  majorSystems: [
    'Diesel Power Generation (2×125 kW primary + secondary)',
    'Centralized Glycol Thermal Distribution System',
    'Lake Priyadarshini Fresh Water Pumping System',
    'Satellite Communication Terminal (Iridium / Inmarsat)',
    'Earth Science & Geomagnetism Laboratories',
    'Main Living Complex & Summer Huts'
  ],
};
