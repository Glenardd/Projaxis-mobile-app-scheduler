import ScreenHeader from "@/components/screen-header";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Redirect, Stack } from "expo-router";
export default function ActivityEditLayout() {

    const { session, isLoading } = useAuthContext()

    if (isLoading) {
        <SplashScreenController />
    }

    if (!session) {
        return <Redirect href="/login" />
    }

    return (
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
            <Stack.Screen name="pert-calculate-update" options={{
                headerShown: true,
                contentStyle: { backgroundColor: "#070C27" },
                headerTitle: () => <ScreenHeader title="Edit Activity" subtitle="Edit Activity" currentPage="Activity Input" editable={false} />,
                headerStyle: {
                    backgroundColor: "#070C27"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackVisible: false,
            }} />
            <Stack.Screen name="duration-update" options={{
                headerShown: true,
                contentStyle: { backgroundColor: "#070C27" },
                headerTitle: () => <ScreenHeader title="Edit Activity" subtitle="Edit Activity" currentPage="Activity Input" editable={false} />,
                headerStyle: {
                    backgroundColor: "#070C27"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackVisible: false,
            }} />
        </Stack>
    )
}