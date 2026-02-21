export type Units = 'us' | 'metric';

export type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant';
export type Fitness = 'low' | 'avg' | 'high';
export type Experience = 'new' | 'some' | 'trained';
export type Terrain = 'easy' | 'mixed' | 'rugged';

export interface DogProfile {
  id: string;
  name: string;
  units: Units;
  dogWeight: number;
  ageYears: number;
  ageMonths: number;
  sizeClass: SizeClass;
  fitness: Fitness;
  experience: Experience;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  selectedDogId: string | null;
}

export interface CalculationInput {
  units: Units;
  dogWeight: number;
  ageYears: number;
  ageMonths: number;
  sizeClass: SizeClass;
  fitness: Fitness;
  experience: Experience;
  distance: number;
  terrain: Terrain;
  elevationGain?: number;
  temperature?: number;
}

export interface CalculationResult {
  minPct: number;
  maxPct: number;
  minWeight: number;
  maxWeight: number;
  targetWeight: number;
  hardCapWeight: number;
  warnings: string[];
  appliedAdjustments: string[];
  waterEquivalent: {
    label: string;
    primary: string;
    secondary: string;
  };
}
