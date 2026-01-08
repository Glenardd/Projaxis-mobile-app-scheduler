import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Redirect, Stack } from "expo-router";
import ProjectHeader from "./[project_id]";

export default function DashboardLayout() {

    const { session, isLoading } = useAuthContext()

    if (isLoading) {
        <SplashScreenController />
      }
    
      if (!session) {
        return <Redirect href="/login" />
      }

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitle: () => <ProjectHeader />,
                headerStyle: {
                    backgroundColor: "#070C27"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: () => null,
                headerBackVisible: false,
                contentStyle: { backgroundColor: "#070C27" }
            }} />
        </Stack>
    )
}