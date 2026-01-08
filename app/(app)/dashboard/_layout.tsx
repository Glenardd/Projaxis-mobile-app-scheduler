import { Stack } from "expo-router";
import ProjectHeader from "./[project_id]";

export default function DashboardLayout() {

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