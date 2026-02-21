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

import { calculatePackWeight } from '@/lib/calc';
import type { DogProfile, Experience, Fitness, SizeClass, Terrain, Units } from '@/lib/models';
import { loadAppState, loadProfiles } from '@/lib/storage';

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

export default function CalculatorScreen() {
  const [profiles, setProfiles] = useState<DogProfile[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [units, setUnits] = useState<Units>('us');
  const [dogWeight, setDogWeight] = useState('45');
  const [ageYears, setAgeYears] = useState('4');
  const [ageMonths, setAgeMonths] = useState('0');
  const [sizeClass, setSizeClass] = useState<SizeClass>('medium');
  const [fitness, setFitness] = useState<Fitness>('avg');
  const [experience, setExperience] = useState<Experience>('some');

  const [distance, setDistance] = useState('6');
  const [terrain, setTerrain] = useState<Terrain>('easy');
  const [elevationGain, setElevationGain] = useState('');
  const [temperature, setTemperature] = useState('');

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedDogId) ?? null,
    [profiles, selectedDogId],
  );

  const refresh = useCallback(async () => {
    const [nextProfiles, appState] = await Promise.all([loadProfiles(), loadAppState()]);
    setProfiles(nextProfiles);
    setSelectedDogId(appState.selectedDogId);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedProfile) {
      setUnits(selectedProfile.units);
    }
  }, [selectedProfile]);

  const calculate = () => {
    const activeUnits = selectedProfile?.units ?? units;
    const parsedDistance = Number(distance);
    const parsedElevation = elevationGain.trim() ? Number(elevationGain) : undefined;
    const parsedTemperature = temperature.trim() ? Number(temperature) : undefined;

    const weight = selectedProfile?.dogWeight ?? Number(dogWeight);
    const years = selectedProfile?.ageYears ?? Number(ageYears);
    const months = selectedProfile?.ageMonths ?? Number(ageMonths);
    const selectedSize = selectedProfile?.sizeClass ?? sizeClass;
    const selectedFitness = selectedProfile?.fitness ?? fitness;
    const selectedExperience = selectedProfile?.experience ?? experience;

    if (![weight, years, months, parsedDistance].every((value) => Number.isFinite(value))) {
      Alert.alert('Invalid input', 'Please enter valid numbers before calculating.');
      return;
    }

    if (weight <= 0 || parsedDistance <= 0 || years < 0 || months < 0 || months > 11) {
      Alert.alert('Invalid input', 'Please check values for weight, distance, and age fields.');
      return;
    }

    if (
      (parsedElevation !== undefined && !Number.isFinite(parsedElevation)) ||
      (parsedTemperature !== undefined && !Number.isFinite(parsedTemperature))
    ) {
      Alert.alert('Invalid input', 'Elevation and temperature must be valid numbers when provided.');
      return;
    }

    const result = calculatePackWeight({
      units: activeUnits,
      dogWeight: weight,
      ageYears: years,
      ageMonths: months,
      sizeClass: selectedSize,
      fitness: selectedFitness,
      experience: selectedExperience,
      distance: parsedDistance,
      terrain,
      elevationGain: parsedElevation,
      temperature: parsedTemperature,
    });

    router.push({
      pathname: '/results',
      params: {
        payload: JSON.stringify({
          result,
          input: {
            units: activeUnits,
            dogWeight: weight,
            distance: parsedDistance,
          },
        }),
      },
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dog</Text>
        {selectedProfile ? (
          <View style={styles.profileSummary}>
            <Text style={styles.profileSummaryText}>
              Using profile: {selectedProfile.name} — {selectedProfile.dogWeight} {selectedProfile.units === 'us' ? 'lb' : 'kg'}, age{' '}
              {selectedProfile.ageYears}y {selectedProfile.ageMonths}m
            </Text>
          </View>
        ) : (
          <Text style={styles.muted}>No profile selected. Enter dog details below.</Text>
        )}
        <Link href="/profiles" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Manage / Select Profile</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View pointerEvents={selectedProfile ? 'none' : 'auto'} style={selectedProfile ? styles.disabled : undefined}>
          <Segmented
            value={selectedProfile?.units ?? units}
            onChange={setUnits}
            options={[
              { label: 'US', value: 'us' },
              { label: 'Metric', value: 'metric' },
            ]}
          />
        </View>
      </View>

      {!selectedProfile && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dog Details</Text>
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
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hike Inputs</Text>
        <TextInput
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
          placeholder={`Distance (${(selectedProfile?.units ?? units) === 'us' ? 'miles' : 'km'})`}
        />

        <Text style={styles.label}>Terrain</Text>
        <Segmented
          value={terrain}
          onChange={setTerrain}
          options={[
            { label: 'Easy', value: 'easy' },
            { label: 'Mixed', value: 'mixed' },
            { label: 'Rugged', value: 'rugged' },
          ]}
        />

        <TextInput
          style={styles.input}
          value={elevationGain}
          onChangeText={setElevationGain}
          keyboardType="decimal-pad"
          placeholder={`Elevation gain (${(selectedProfile?.units ?? units) === 'us' ? 'ft' : 'm'}) optional`}
        />
        <TextInput
          style={styles.input}
          value={temperature}
          onChangeText={setTemperature}
          keyboardType="decimal-pad"
          placeholder={`Temperature (${(selectedProfile?.units ?? units) === 'us' ? '°F' : '°C'}) optional`}
        />
      </View>

      <Pressable style={styles.primaryButton} onPress={calculate}>
        <Text style={styles.primaryButtonText}>Calculate</Text>
      </Pressable>

      <Link href="/resources" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Resources and Safety</Text>
        </Pressable>
      </Link>

      <Link href="/tip" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Support / Tip the developer</Text>
        </Pressable>
      </Link>

      <Text style={styles.disclaimer}>
        This calculator provides planning estimates only and is not veterinary advice.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f3f4f6' },
  container: { padding: 16, gap: 12, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  label: { marginTop: 6, fontSize: 13, color: '#374151', fontWeight: '600' },
  muted: { color: '#6b7280' },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  segment: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryButtonText: { color: '#111827', fontWeight: '600' },
  disclaimer: { textAlign: 'center', color: '#6b7280', fontSize: 12, marginTop: 8 },
  profileSummary: { backgroundColor: '#eff6ff', borderRadius: 10, padding: 10 },
  profileSummaryText: { color: '#1d4ed8', fontWeight: '600' },
  disabled: { opacity: 0.6 },
});
