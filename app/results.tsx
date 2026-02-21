import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { CalculationResult, Units } from '@/lib/models';
import { formatWeight } from '@/lib/units';

interface ResultsPayload {
  result: CalculationResult;
  input: {
    units: Units;
    dogWeight: number;
    distance: number;
  };
}

export default function ResultsScreen() {
  const [showHow, setShowHow] = useState(false);
  const params = useLocalSearchParams<{ payload?: string }>();

  const payload = useMemo(() => {
    try {
      return params.payload ? (JSON.parse(params.payload) as ResultsPayload) : null;
    } catch {
      return null;
    }
  }, [params.payload]);

  if (!payload) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No calculation results found.</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>Back to Calculator</Text>
        </Pressable>
      </View>
    );
  }

  const { result, input } = payload;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Target Pack Weight</Text>
        <Text style={styles.target}>{formatWeight(result.targetWeight, input.units)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Safe Range</Text>
        <Text style={styles.value}>
          {formatWeight(result.minWeight, input.units)} – {formatWeight(result.maxWeight, input.units)}
        </Text>
        <Text style={styles.muted}>
          {result.minPct.toFixed(2)}% – {result.maxPct.toFixed(2)}%
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Hard Cap (20%)</Text>
        <Text style={styles.value}>{formatWeight(result.hardCapWeight, input.units)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Water-only equivalence</Text>
        <Text style={styles.muted}>{result.waterEquivalent.label}</Text>
        <Text style={styles.value}>{result.waterEquivalent.primary}</Text>
        <Text style={styles.muted}>{result.waterEquivalent.secondary}</Text>
      </View>

      {result.warnings.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>Warnings</Text>
          {result.warnings.map((warning) => (
            <Text key={warning} style={styles.warningItem}>
              • {warning}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <Pressable style={styles.secondaryButton} onPress={() => setShowHow((current) => !current)}>
          <Text style={styles.secondaryButtonText}>How this was calculated</Text>
        </Pressable>
        {showHow &&
          result.appliedAdjustments.map((item) => (
            <Text key={item} style={styles.muted}>
              • {item}
            </Text>
          ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Checklist</Text>
        <Text style={styles.muted}>• Check paw condition and gait before and after the hike.</Text>
        <Text style={styles.muted}>• Start light and increase load gradually over several outings.</Text>
        <Text style={styles.muted}>• Adjust load down immediately in heat or rough conditions.</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.back()}>
        <Text style={styles.primaryButtonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f3f4f6' },
  container: { padding: 16, gap: 12, paddingBottom: 28 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 6 },
  heading: { fontSize: 18, fontWeight: '700', color: '#111827' },
  target: { fontSize: 38, fontWeight: '800', color: '#1d4ed8' },
  label: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  value: { fontSize: 20, fontWeight: '700', color: '#111827' },
  muted: { color: '#6b7280' },
  warningItem: { color: '#b45309', fontWeight: '600' },
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
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { fontWeight: '600', color: '#111827' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 10 },
  error: { color: '#991b1b' },
});
