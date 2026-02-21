import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dog Pack Calculator' }} />
      <Stack.Screen name="results" options={{ title: 'Results' }} />
      <Stack.Screen name="profiles" options={{ title: 'Dog Profiles' }} />
      <Stack.Screen name="tip" options={{ title: 'Support' }} />
      <Stack.Screen name="resources" options={{ title: 'Resources & Safety' }} />
    </Stack>
  );
}
