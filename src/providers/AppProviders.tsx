import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setTokenGetter } from '@/api/client';
import { RootStore } from '@/stores/RootStore';
import { StoreContext } from '@/stores/context';
import { useRealtimePosts } from '@/hooks/useRealtimePosts';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { tokens } from '@/theme/tokens';

const RealtimeBridge = ({ token }: { token: string | null }) => {
  useRealtimePosts(token);
  return null;
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const store = useMemo(() => new RootStore(), []);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      }),
    [],
  );
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setTokenGetter(() => store.auth.token);
    store.auth.init().finally(() => setAuthReady(true));
  }, [store]);

  if (!authReady) {
    return (
      <View style={[styles.loading, { backgroundColor: tokens.color.bg }]}>
        <ActivityIndicator color={tokens.color.textMuted} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StoreContext.Provider value={store}>
          <RealtimeBridge token={store.auth.token} />
          <ThemeProvider>{children}</ThemeProvider>
        </StoreContext.Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
