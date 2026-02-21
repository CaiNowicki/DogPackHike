import type { Units } from './models';

const LB_PER_KG = 2.2046226218;
const MI_PER_KM = 0.621371;
const FT_PER_M = 3.28084;

export function toMiles(distance: number, units: Units): number {
  return units === 'us' ? distance : distance * MI_PER_KM;
}

export function toFeet(elevation: number, units: Units): number {
  return units === 'us' ? elevation : elevation * FT_PER_M;
}

export function toFahrenheit(temperature: number, units: Units): number {
  return units === 'us' ? temperature : (temperature * 9) / 5 + 32;
}

export function poundsToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function kgToPounds(kg: number): number {
  return kg * LB_PER_KG;
}

export function formatWeight(value: number, units: Units): string {
  const suffix = units === 'us' ? 'lb' : 'kg';
  return `${value.toFixed(2)} ${suffix}`;
}
