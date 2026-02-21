import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const SOURCES = [
  {
    label: 'Backpacker: How to Safely Fit & Load a Dog Hiking Backpack',
    url: 'https://www.backpacker.com/skills/how-to-safely-fit-load-dog-hiking-backpack/',
  },
  {
    label: 'Ruffwear: Choosing the Right Dog Pack',
    url: 'https://ruffwear.com/pages/choosing-the-right-dog-pack',
  },
  {
    label: 'REI Expert Advice: Hiking with Dogs',
    url: 'https://www.rei.com/learn/expert-advice/hiking-dogs.html',
  },
];

export default function ResourcesScreen() {
  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>How calculations are performed</Text>
        <Text style={styles.body}>• Starts with a baseline pack percentage by fitness: low 8–10%, average 10–14%, high 12–16%.</Text>
        <Text style={styles.body}>• Experience adjusts that range: new dogs reduce min/max by 2%; trained dogs increase max by 1%.</Text>
        <Text style={styles.body}>• Life-stage adjustments apply next: puppies (under 1.5 years) are capped to 0–5%; seniors reduce min/max by 3% based on size-class thresholds.</Text>
        <Text style={styles.body}>• Hike demands then reduce load: long distance, harder terrain, elevation gain, and warm/hot temperature each lower the recommended percentages.</Text>
        <Text style={styles.body}>• Final values are clamped so range never drops below 0%, max never falls below min, and hard cap remains 20% of body weight.</Text>
        <Text style={styles.body}>• Water equivalence is shown to contextualize load if it were entirely water.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Pack fit checklist</Text>
        <Text style={styles.body}>• Measure your dog and choose a pack size that matches manufacturer sizing guidance.</Text>
        <Text style={styles.body}>• Adjust straps so the harness is snug but not restrictive; you should be able to slide fingers under straps.</Text>
        <Text style={styles.body}>• Keep weight balanced side-to-side and positioned so it does not shift or rub while walking.</Text>
        <Text style={styles.body}>• Check for rubbing points at shoulders, chest, and behind front legs after short trial walks.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Training your dog to carry a pack</Text>
        <Text style={styles.body}>• Start with an empty pack indoors or on short easy walks so your dog learns the feel of the harness.</Text>
        <Text style={styles.body}>• Add weight gradually over multiple outings, keeping sessions short and positive.</Text>
        <Text style={styles.body}>• Maintain good gait and enthusiasm before increasing either distance or load.</Text>
        <Text style={styles.body}>• Use frequent water breaks and remove weight immediately if your dog shows discomfort.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Signs your dog may be over-tired</Text>
        <Text style={styles.body}>• Slowing down significantly, lagging behind, refusing to continue, or repeatedly lying down.</Text>
        <Text style={styles.body}>• Excessive panting, drooling, heat stress behavior, or delayed recovery during rest breaks.</Text>
        <Text style={styles.body}>• Gait changes (limping/stiffness), paw sensitivity, stumbling, or frequent stops to shake/scratch.</Text>
        <Text style={styles.body}>• If signs appear, stop, cool down, hydrate, reduce or remove load, and end the hike if needed.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Sources</Text>
        {SOURCES.map((source) => (
          <Pressable key={source.url} onPress={() => openUrl(source.url)} style={styles.linkButton}>
            <Text style={styles.linkText}>{source.label}</Text>
            <Text style={styles.urlText}>{source.url}</Text>
          </Pressable>
        ))}
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8 },
  heading: { fontSize: 16, fontWeight: '700', color: '#111827' },
  body: { color: '#4b5563', lineHeight: 20 },
  linkButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 10,
    gap: 2,
  },
  linkText: { fontWeight: '600', color: '#111827' },
  urlText: { color: '#2563eb', fontSize: 12 },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
});
