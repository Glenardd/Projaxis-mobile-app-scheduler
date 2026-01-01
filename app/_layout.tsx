import { useAppState } from "@/hooks/useAppState";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import AuthProvider from "@/providers/auth-provider";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppStateStatus, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})

export default function RootLayout() {

  useOnlineManager()
  useAppState(onAppStateChange)

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider >
          <SafeAreaView style={{ flex: 1, backgroundColor: "#070C27" }}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}