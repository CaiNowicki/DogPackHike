import { Link, router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { DogProfile, Experience, Fitness, SizeClass, Units } from '@/lib/models';
import { loadAppState, loadProfiles, saveAppState, saveProfiles } from '@/lib/storage';

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.segment, value === option.value && styles.segmentActive]}
        >
          <Text style={[styles.segmentLabel, value === option.value && styles.segmentLabelActive]}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ProfilesScreen() {
  const [profiles, setProfiles] = useState<DogProfile[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [units, setUnits] = useState<Units>('us');
  const [dogWeight, setDogWeight] = useState('45');
  const [ageYears, setAgeYears] = useState('4');
  const [ageMonths, setAgeMonths] = useState('0');
  const [sizeClass, setSizeClass] = useState<SizeClass>('medium');
  const [fitness, setFitness] = useState<Fitness>('avg');
  const [experience, setExperience] = useState<Experience>('some');

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedDogId) ?? null,
    [profiles, selectedDogId],
  );

  const refresh = useCallback(async () => {
    const [savedProfiles, appState] = await Promise.all([loadProfiles(), loadAppState()]);
    setProfiles(savedProfiles);
    setSelectedDogId(appState.selectedDogId);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProfile = async () => {
    const parsedWeight = Number(dogWeight);
    const parsedYears = Number(ageYears);
    const parsedMonths = Number(ageMonths);

    if (!name.trim()) {
      Alert.alert('Validation', 'Please provide a profile name.');
      return;
    }

    if (![parsedWeight, parsedYears, parsedMonths].every((value) => Number.isFinite(value))) {
      Alert.alert('Validation', 'Please enter valid numbers for weight and age.');
      return;
    }

    if (parsedWeight <= 0 || parsedYears < 0 || parsedMonths < 0 || parsedMonths > 11) {
      Alert.alert('Validation', 'Please use positive values and keep months between 0 and 11.');
      return;
    }

    const now = new Date().toISOString();
    const profile: DogProfile = {
      id: makeId(),
      name: name.trim(),
      units,
      dogWeight: parsedWeight,
      ageYears: parsedYears,
      ageMonths: parsedMonths,
      sizeClass,
      fitness,
      experience,
      createdAt: now,
      updatedAt: now,
    };

    const next = [profile, ...profiles].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    await saveProfiles(next);
    setProfiles(next);
    setName('');
    Alert.alert('Saved', 'Profile created successfully.');
  };

  const selectProfile = async (id: string) => {
    const nextState = { selectedDogId: id };
    await saveAppState(nextState);
    setSelectedDogId(id);
  };

  const clearSelection = async () => {
    await saveAppState({ selectedDogId: null });
    setSelectedDogId(null);
  };

  const deleteProfile = async (id: string) => {
    const nextProfiles = profiles.filter((profile) => profile.id !== id);
    await saveProfiles(nextProfiles);

    if (selectedDogId === id) {
      await saveAppState({ selectedDogId: null });
      setSelectedDogId(null);
    }

    setProfiles(nextProfiles);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Selected Profile</Text>
        {selectedProfile ? (
          <Text style={styles.muted}>
            {selectedProfile.name} — {selectedProfile.dogWeight} {selectedProfile.units === 'us' ? 'lb' : 'kg'} — {selectedProfile.ageYears}y {selectedProfile.ageMonths}m
          </Text>
        ) : (
          <Text style={styles.muted}>No profile selected.</Text>
        )}
        <Pressable style={styles.secondaryButton} onPress={clearSelection}>
          <Text style={styles.secondaryButtonText}>Clear Selection</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Create Profile</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Dog name" />
        <Segmented
          value={units}
          onChange={setUnits}
          options={[
            { label: 'US', value: 'us' },
            { label: 'Metric', value: 'metric' },
          ]}
        />
        <TextInput
          style={styles.input}
          value={dogWeight}
          onChangeText={setDogWeight}
          keyboardType="decimal-pad"
          placeholder={`Weight (${units === 'us' ? 'lb' : 'kg'})`}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            value={ageYears}
            onChangeText={setAgeYears}
            keyboardType="number-pad"
            placeholder="Age years"
          />
          <TextInput
            style={[styles.input, styles.half]}
            value={ageMonths}
            onChangeText={setAgeMonths}
            keyboardType="number-pad"
            placeholder="Age months"
          />
        </View>

        <Text style={styles.label}>Size Class</Text>
        <Segmented
          value={sizeClass}
          onChange={setSizeClass}
          options={[
            { label: 'Toy', value: 'toy' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Giant', value: 'giant' },
          ]}
        />

        <Text style={styles.label}>Fitness</Text>
        <Segmented
          value={fitness}
          onChange={setFitness}
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Average', value: 'avg' },
            { label: 'High', value: 'high' },
          ]}
        />

        <Text style={styles.label}>Experience</Text>
        <Segmented
          value={experience}
          onChange={setExperience}
          options={[
            { label: 'New', value: 'new' },
            { label: 'Some', value: 'some' },
            { label: 'Trained', value: 'trained' },
          ]}
        />

        <Pressable style={styles.primaryButton} onPress={createProfile}>
          <Text style={styles.primaryButtonText}>Save Profile</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Saved Profiles</Text>
        {profiles.length === 0 && <Text style={styles.muted}>No profiles yet.</Text>}
        {profiles.map((profile) => (
          <View key={profile.id} style={styles.profileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileTitle}>{profile.name}</Text>
              <Text style={styles.muted}>
                {profile.dogWeight} {profile.units === 'us' ? 'lb' : 'kg'} • {profile.ageYears}y {profile.ageMonths}m
              </Text>
            </View>
            <Pressable style={styles.inlineButton} onPress={() => selectProfile(profile.id)}>
              <Text style={styles.inlineButtonText}>Select</Text>
            </Pressable>
            <Pressable style={styles.inlineDanger} onPress={() => deleteProfile(profile.id)}>
              <Text style={styles.inlineDangerText}>Delete</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/')}>
        <Text style={styles.primaryButtonText}>Back to Calculator</Text>
      </Pressable>

      <Link href="/tip" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Support / Tip the developer</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f3f4f6' },
  container: { padding: 16, gap: 12, paddingBottom: 28 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  label: { marginTop: 4, fontWeight: '600', color: '#374151' },
  muted: { color: '#6b7280' },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  segment: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  segmentActive: { backgroundColor: '#fff' },
  segmentLabel: { color: '#4b5563', fontWeight: '600' },
  segmentLabelActive: { color: '#111827' },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: { fontWeight: '600', color: '#111827' },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
  },
  profileTitle: { fontWeight: '700', color: '#111827' },
  inlineButton: {
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inlineButtonText: { color: '#1d4ed8', fontWeight: '700' },
  inlineDanger: {
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inlineDangerText: { color: '#b91c1c', fontWeight: '700' },
});
