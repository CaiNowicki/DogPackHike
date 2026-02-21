import { router } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

export default function TipScreen() {
  const share = async () => {
    await Share.share({
      message:
        'Dog Pack Calculator helps estimate safe pack weights for dogs during hikes. The app is currently free and works fully offline.',
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Dog Pack Calculator is free</Text>
        <Text style={styles.body}>
          This app is currently free to use. Optional paid features may be added in the future, but there are no payments or purchases in the app today.
        </Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={share}>
        <Text style={styles.primaryButtonText}>Share the app</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.push('/resources')}>
        <Text style={styles.secondaryButtonText}>Resources and Safety</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f3f4f6' },
  container: { padding: 16, gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  body: { color: '#374151', lineHeight: 20 },
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
    backgroundColor: '#fff',
  },
  secondaryButtonText: { color: '#111827', fontWeight: '600' },
});
