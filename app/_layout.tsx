import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/providers/AppProviders';
import { tokens } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: tokens.color.bg },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: tokens.color.text,
            fontWeight: '700',
          },
          contentStyle: { backgroundColor: tokens.color.bgMuted },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Mecenate' }} />
      </Stack>
    </AppProviders>
  );
}
