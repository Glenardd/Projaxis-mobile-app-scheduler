import ActivityContainer from "@/components/activity-card";
import LoadingIndicator from "@/components/loadingIndicator";
import { useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod } from "@/utils/cpm";
import { useLocalSearchParams } from "expo-router";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function TaskDone() {

    const { project_id } = useLocalSearchParams<{ project_id: string }>()

    //searched activity
    const { activity: data, isRefetchingByUser, refetchByUser, isLoading } = useSearchActivity(parseInt(project_id))

    // sort data when
    const sortedData = data?.sort((a, b) => a.label.localeCompare(b.label))
    const taskDone = sortedData?.filter((data) => data.isDone === true)
    const cpm = criticalPathMethod(sortedData || [])

    return isLoading ? <LoadingIndicator /> : (
        <>
            <FlatList
                data={taskDone}
                renderItem={({ item }) => (
                    <ActivityContainer
                        item={item}
                        project_id={project_id}
                        isComplete={false}
                        cpm={cpm}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
                }
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{
                    padding: 25,
                    flexGrow: 1
                }}
                ListHeaderComponentStyle={{
                    marginBottom: 25
                }}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#30396cff", fontSize: 15 }}>Empty</Text>
                    </View>
                }
                style={{ width: "100%" }}
            />
        </>
    )
}
