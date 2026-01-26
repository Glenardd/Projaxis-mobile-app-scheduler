import ScreenHeader from "@/components/screen-header";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Redirect, Stack } from "expo-router";

export default function TaskLayout() {

    const { session, isLoading } = useAuthContext()

    if (isLoading) {
        <SplashScreenController />
    }

    if (!session) {
        return <Redirect href="/login" />
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    contentStyle: { backgroundColor: "#070C27" },
                    headerTitle: () => <ScreenHeader title="Activity Input" subtitle="Configure projects with PERT estimates" currentPage="Project Dashboard" editable={false} />,
                    headerStyle: {
                        backgroundColor: "#070C27"
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackVisible:false,
                    animation:"simple_push"
                }}
            />
            <Stack.Screen
                name="form"
                options={{
                    headerShown: true,
                    contentStyle: { backgroundColor: "#070C27" },
                    headerTitle: () => <ScreenHeader title="Add Activity" subtitle="Add new activity to the current project" currentPage="Activity input" editable={false} />,
                    headerStyle: {
                        backgroundColor: "#070C27"
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackVisible:false,
                    animation:"simple_push"
                }}
            />
        </Stack>
    )
}