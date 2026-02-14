import ScreenHeader from "@/components/screen-header";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Redirect, Stack } from "expo-router";
export default function DiagramLayout() {

    const { session, isLoading } = useAuthContext()

    if (isLoading) {
        <SplashScreenController />
    }

    if (!session) {
        return <Redirect href="/login" />
    }

    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="index" options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitle: () => <ScreenHeader title="PERT/CPM " subtitle="Network diagram of project activities" currentPage="Project Dashboard" editable={false} />,
                headerStyle: {
                    backgroundColor: "#070C27"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: () => null,
                headerBackVisible: false,
                animation: "simple_push"
            }} />
        </Stack>
    )
}