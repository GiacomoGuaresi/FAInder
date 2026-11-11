import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/error-boundary';
import { CategoryProvider } from '@/contexts/CategoryContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// L'app ha un solo tema, chiaro: non segue il tema di sistema
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <CategoryProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </CategoryProvider>
    </ErrorBoundary>
  );
}
