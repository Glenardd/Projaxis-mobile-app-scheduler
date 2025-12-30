import AuthProvider from "@/providers/auth-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#070C27" }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  )
}