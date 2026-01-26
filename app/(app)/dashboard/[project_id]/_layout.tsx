import ScreenHeader from "@/components/screen-header";
import { useProjectById } from "@/services/projects.service";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function InfoLayout() {

    const { project_id } = useLocalSearchParams<{ project_id: string }>();

    const { searchProject } = useProjectById(parseInt(project_id))

    //for logging
    useEffect(() => {
        if (searchProject) {
            console.log("project loaded in dashboard/[project_id] :", searchProject)
        }
    }, [searchProject])

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitle: () => <ScreenHeader title={searchProject?.project_name!!} subtitle="Project dashboard" currentPage="Project Library" editable={true}/>,
                headerStyle: {
                    backgroundColor: "#070C27"
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerLeft: () => null,
                headerBackVisible: false,
                contentStyle: { backgroundColor: "#070C27" },
                animation: "none"
            }} />
        </Stack>
    )
}