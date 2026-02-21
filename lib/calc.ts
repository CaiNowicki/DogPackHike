import type { CalculationInput, CalculationResult } from './models';
import { kgToPounds, toFahrenheit, toFeet, toMiles } from './units';

const seniorBySize = {
  toy: 11,
  small: 10,
  medium: 9,
  large: 7,
  giant: 6,
} as const;

const baselineByFitness = {
  low: { min: 8, max: 10 },
  avg: { min: 10, max: 14 },
  high: { min: 12, max: 16 },
} as const;

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculatePackWeight(input: CalculationInput): CalculationResult {
  const warnings: string[] = [];
  const appliedAdjustments: string[] = [];

  const ageTotalYears = input.ageYears + input.ageMonths / 12;
  const isPuppy = ageTotalYears < 1.5;
  const isSenior = ageTotalYears >= seniorBySize[input.sizeClass];

  let minPct = baselineByFitness[input.fitness].min;
  let maxPct = baselineByFitness[input.fitness].max;

  if (isPuppy) {
    minPct = 0;
    maxPct = 5;
    warnings.push('Puppy detected (< 1.5 years): load is capped to 0–5%.');
    appliedAdjustments.push('Life stage: puppy cap set to 0–5%.');
  } else {
    if (input.experience === 'new') {
      minPct -= 2;
      maxPct -= 2;
      appliedAdjustments.push('Experience: new to pack (-2% min, -2% max).');
    }

    if (input.experience === 'trained') {
      maxPct += 1;
      appliedAdjustments.push('Experience: trained (+1% max).');
    }

    if (isSenior) {
      minPct -= 3;
      maxPct -= 3;
      warnings.push('Senior dog adjustment applied (-3% min/max).');
      appliedAdjustments.push('Life stage: senior (-3% min/max).');
    }
  }

  const distanceMiles = toMiles(input.distance, input.units);
  if (distanceMiles > 8) {
    minPct -= 2;
    maxPct -= 2;
    appliedAdjustments.push('Distance > 8 miles (-2% min/max).');
  }
  if (distanceMiles > 12) {
    minPct -= 2;
    maxPct -= 2;
    appliedAdjustments.push('Distance > 12 miles (additional -2% min/max).');
  }

  if (input.terrain === 'mixed') {
    minPct -= 1;
    maxPct -= 1;
    appliedAdjustments.push('Terrain mixed (-1% min/max).');
  } else if (input.terrain === 'rugged') {
    minPct -= 2;
    maxPct -= 2;
    appliedAdjustments.push('Terrain rugged (-2% min/max).');
  }

  if (typeof input.elevationGain === 'number' && Number.isFinite(input.elevationGain)) {
    const elevationFeet = toFeet(input.elevationGain, input.units);
    if (elevationFeet > 1500) {
      minPct -= 1;
      maxPct -= 1;
      appliedAdjustments.push('Elevation > 1500 ft (-1% min/max).');
    }
    if (elevationFeet > 3000) {
      minPct -= 1;
      maxPct -= 1;
      appliedAdjustments.push('Elevation > 3000 ft (additional -1% min/max).');
    }
  }

  if (typeof input.temperature === 'number' && Number.isFinite(input.temperature)) {
    const tempF = toFahrenheit(input.temperature, input.units);
    if (tempF >= 75) {
      minPct -= 2;
      maxPct -= 2;
      warnings.push('Warm temperature (≥ 75°F) reduces safe load range.');
      appliedAdjustments.push('Temperature ≥ 75°F (-2% min/max).');
    }
    if (tempF >= 85) {
      minPct -= 2;
      maxPct -= 2;
      warnings.push('Hot temperature (≥ 85°F) further reduces safe load range.');
      appliedAdjustments.push('Temperature ≥ 85°F (additional -2% min/max).');
    }
  }

  minPct = Math.max(0, minPct);
  maxPct = Math.max(0, maxPct);

  if (maxPct < minPct) {
    maxPct = minPct;
  }

  const hardCapWeight = input.dogWeight * 0.2;
  const minWeight = Math.min(input.dogWeight * (minPct / 100), hardCapWeight);
  const maxWeight = Math.min(input.dogWeight * (maxPct / 100), hardCapWeight);
  const targetWeight = Math.min((minWeight + maxWeight) / 2, hardCapWeight);

  if (maxWeight >= hardCapWeight || maxPct >= 20) {
    warnings.push('Hard cap reached: do not exceed 20% body weight.');
  }

  const waterEquivalent =
    input.units === 'us'
      ? (() => {
          const pounds = targetWeight;
          const gallons = pounds / 8.34;
          const flOz = gallons * 128;
          return {
            label: 'Equivalent if the pack load were entirely water.',
            primary: `${roundTwo(gallons)} gallons`,
            secondary: `${roundTwo(flOz)} fl oz`,
          };
        })()
      : (() => {
          const kilograms = targetWeight;
          const liters = kilograms;
          const milliLiters = liters * 1000;
          return {
            label: 'Equivalent if the pack load were entirely water.',
            primary: `${roundTwo(liters)} liters`,
            secondary: `${roundTwo(milliLiters)} mL`,
          };
        })();

  const bodyWeightForResult = input.units === 'us' ? input.dogWeight : kgToPounds(input.dogWeight);
  if (bodyWeightForResult < 5.5) {
    warnings.push('Very small dogs may not be appropriate pack carriers.');
  }

  return {
    minPct: roundTwo(minPct),
    maxPct: roundTwo(maxPct),
    minWeight: roundTwo(minWeight),
    maxWeight: roundTwo(maxWeight),
    targetWeight: roundTwo(targetWeight),
    hardCapWeight: roundTwo(hardCapWeight),
    warnings,
    appliedAdjustments,
    waterEquivalent,
  };
}
