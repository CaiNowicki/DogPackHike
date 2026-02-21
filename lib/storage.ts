import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from './keys';
import type { AppState, DogProfile } from './models';

const DEFAULT_APP_STATE: AppState = { selectedDogId: null };

export async function loadProfiles(): Promise<DogProfile[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as DogProfile[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  } catch {
    return [];
  }
}

export async function saveProfiles(profiles: DogProfile[]): Promise<void> {
  const sorted = [...profiles].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(sorted));
}

export async function loadAppState(): Promise<AppState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
  if (!raw) {
    return DEFAULT_APP_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as AppState;
    return {
      selectedDogId: parsed?.selectedDogId ?? null,
    };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
}
